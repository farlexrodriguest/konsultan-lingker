import { appendFile, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'src/content/articles');
const apiKey = process.env.AI_API_KEY;
const baseUrl = process.env.AI_BASE_URL?.trim().replace(/\/+$/, '');
const model = process.env.AI_MODEL;
const reviewModel = process.env.AI_REVIEW_MODEL || 'auto';
const requested = process.env.TARGET_ARTICLE?.trim();
const outputPath = process.env.GITHUB_OUTPUT;
const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (!apiKey) throw new Error('Secret AI_API_KEY belum dikonfigurasi.');
if (!baseUrl) throw new Error('Variable AI_BASE_URL belum dikonfigurasi (gunakan base URL API yang kompatibel dengan OpenAI Responses API, biasanya diakhiri /v1).');
if (!model) throw new Error('Variable AI_MODEL belum dikonfigurasi.');
if (reviewModel !== 'auto' && reviewModel === model) throw new Error('AI_REVIEW_MODEL harus berbeda dari AI_MODEL atau gunakan auto jika penyedia mendukung pemilihan model otomatis.');
if (requested && (!requested.startsWith('src/content/articles/') || !requested.endsWith('.md') || requested.includes('..'))) throw new Error('TARGET_ARTICLE harus berupa path artikel Markdown yang valid.');

const read = (p) => readFile(path.join(root, p), 'utf8');
const [policy, guide, agents, schema, prompt] = await Promise.all([
  read('docs/content-update-policy.md'), read('docs/content-update-workflow.md'),
  read('AGENTS.md'), read('src/content.config.ts'), read('prompts/content-update.md'),
]);
const files = (await readdir(dir)).filter((n) => n.endsWith('.md')).sort();
const all = await Promise.all(files.map(async (name) => {
  const content = await readFile(path.join(dir, name), 'utf8');
  const fm = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fm) throw new Error(`Frontmatter tidak ditemukan: ${name}`);
  const field = (key) => fm[1].match(new RegExp('^' + key + ':\\s*(.+)$', 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '';
  return { path: `src/content/articles/${name}`, content, title: field('title'), id: field('id'), slug: field('slug'), pubDate: field('pubDate'), updatedDate: field('updatedDate'), draft: field('draft') === 'true' };
}));
const eligible = all.filter((a) => !a.draft);
if (!eligible.length) throw new Error('Tidak ada artikel non-draft.');

async function ask(input, useSearch = true, selectedModel = model) {
  const body = { model: selectedModel, input, max_output_tokens: 12000 };
  if (useSearch) body.tools = [{ type: 'web_search_preview' }];
  const endpoint = baseUrl.endsWith('/responses') ? baseUrl : `${baseUrl}/responses`;
  const res = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`AI API gagal (${res.status}): ${data.error?.message ?? 'respons tidak valid'}`);
  const text = (data.output ?? []).flatMap((item) => item.content ?? []).filter((item) => item.type === 'output_text').map((item) => item.text).join('\n').trim();
  if (!text) throw new Error('Model tidak mengembalikan teks.');
  try { return JSON.parse(text); } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Output model bukan JSON valid.');
  }
}
const out = async (k, v) => { if (outputPath) await appendFile(outputPath, `${k}=${String(v).replace(/[\r\n]/g, ' ')}\n`); };
const getFm = (content) => {
  const m = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) throw new Error('Frontmatter YAML tidak valid.');
  return { raw: m[1], get: (k) => m[1].match(new RegExp('^' + k + ':\\s*(.+)$', 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '' };
};
let target, rationale = 'Dipilih berdasarkan prioritas editorial.';
if (requested) {
  target = eligible.find((a) => a.path === requested);
  if (!target) throw new Error('Target tidak ditemukan atau merupakan draft.');
} else {
  const choice = await ask(`Pilih satu artikel non-draft yang paling layak diaudit. Jangan memilih hanya karena tanggal lama. Gunakan path persis dari inventaris dan kembalikan JSON {"path":"...","rationale":"..."}.\nInventaris: ${JSON.stringify(eligible.map(({ path, title, id, slug, updatedDate }) => ({ path, title, id, slug, updatedDate })))}\nKebijakan: ${policy}`, false);
  target = eligible.find((a) => a.path === choice.path);
  if (!target) throw new Error('Model memilih path yang tidak ada dalam inventaris.');
  rationale = String(choice.rationale ?? rationale);
}
const context = all.filter((a) => a.path !== target.path).map(({ path, title, content }) => ({ path, title, excerpt: content.slice(0, 1200) }));
const result = await ask(`Audit dan bila perlu perbarui hanya artikel target. Output JSON persis: {"status":"changed"|"no_change","content":"isi artikel Markdown lengkap jika changed, string kosong jika no_change","report":"temuan, perubahan, sumber yang benar-benar diperiksa, risiko review manusia"}. Jangan mengubah id, ulid, slug, pubDate, type, relatedType, relatedId, draft. Jika berubah substantif, ubah updatedDate ke ISO 8601 dengan offset +07:00. Jangan mengubah file lain.\nPath: ${target.path}\nAlasan target: ${rationale}\nInstruksi operasional: ${prompt}\nAGENTS.md: ${agents}\nKebijakan: ${policy}\nPanduan workflow: ${guide}\nSchema: ${schema}\nKonteks artikel lain: ${JSON.stringify(context)}\nISI ARTIKEL TARGET: \n${target.content}`);
let report = String(result.report ?? '').trim();
if (!['changed', 'no_change'].includes(result.status)) throw new Error('Status output model tidak valid.');
if (result.status === 'no_change') {
  await out('changed', 'false');
  const summary = `# AI Content Update — Tidak ada perubahan\n\n- Target: ${target.path}\n- Alasan: ${rationale}\n- Laporan: ${report || 'Tidak ada perubahan substantif yang layak.'}\n`;
  if (summaryPath) await appendFile(summaryPath, summary);
  console.log(summary);
  process.exit(0);
}
if (typeof result.content !== 'string' || !result.content.trim()) throw new Error('Isi artikel hasil model kosong.');
const before = getFm(target.content), after = getFm(result.content);
for (const key of ['id', 'ulid', 'slug', 'pubDate', 'type', 'relatedType', 'relatedId', 'draft']) if (before.get(key) !== after.get(key)) throw new Error(`Perubahan diblokir: field ${key} berubah.`);
if (!result.content.startsWith('---\n') || !result.content.endsWith('\n')) throw new Error('Format artikel hasil model tidak valid.');
if (result.content === target.content) throw new Error('Model menyatakan changed tetapi tidak ada diff.');
if (before.get('updatedDate') === after.get('updatedDate')) throw new Error('Isi berubah tetapi updatedDate tidak berubah.');
const reviewPrompt = await read('prompts/content-review.md');
let reviewedContent = result.content;
let review = await ask(`Bertindak sebagai reviewer independen. Periksa secara kritis usulan editor; jangan menganggap laporan editor benar tanpa bukti. Gunakan web search dan utamakan sumber primer resmi untuk klaim hukum/teknis. Periksa akurasi, sumber yang dapat ditelusuri, konsistensi, kegunaan pembaca, SEO, klaim menyesatkan, dan kepatuhan kebijakan. Output JSON: {"verdict":"pass"|"revise"|"reject","findings":["temuan konkret"],"sources_checked":[{"title":"judul sumber","url":"URL sumber yang benar-benar dibuka","supports":"klaim yang didukung"}],"summary":"alasan singkat"}. sources_checked harus mencatat sumber yang benar-benar dibuka melalui web search. pass hanya jika tidak ada masalah material yang belum ditangani dan sumber yang diperlukan telah diperiksa. Jika klaim hukum penting tidak dapat diverifikasi, pilih revise atau reject.\nInstruksi reviewer: ${reviewPrompt}\nTarget: ${target.path}\nArtikel asli:\n${target.content}\nUsulan editor:\n${reviewedContent}\nLaporan editor:\n${report}`, true, reviewModel);
if (!['pass', 'revise', 'reject'].includes(review.verdict) || !Array.isArray(review.findings) || !Array.isArray(review.sources_checked)) throw new Error('Output reviewer AI tidak valid atau tidak mencantumkan sumber yang diperiksa.');
if (review.verdict === 'pass' && !review.sources_checked.some((source) => source && typeof source.title === 'string' && (source.url?.startsWith('https://') || source.url?.startsWith('http://')) && typeof source.supports === 'string')) throw new Error('Reviewer tidak mencantumkan sumber valid yang diperiksa; artikel ditahan.');
if (review.verdict === 'revise') {
  const revision = await ask(`Revisi artikel berdasarkan review independen. Tangani semua temuan material, jangan membuat klaim tanpa sumber, dan pertahankan field frontmatter yang dilindungi. Output JSON: {"content":"artikel Markdown lengkap","report":"ringkasan revisi"}.\nTemuan reviewer: ${JSON.stringify(review.findings)}\nArtikel asli: ${target.content}\nUsulan sebelumnya: ${reviewedContent}\nLaporan sebelumnya: ${report}\nInstruksi editor: ${prompt}\nKebijakan: ${policy}`);
  if (typeof revision.content !== 'string' || !revision.content.trim()) throw new Error('AI revisi tidak mengembalikan artikel.');
  report = String(revision.report ?? report).trim();
  const revisedFm = getFm(revision.content);
  for (const key of ['id', 'ulid', 'slug', 'pubDate', 'type', 'relatedType', 'relatedId', 'draft']) if (before.get(key) !== revisedFm.get(key)) throw new Error(`Revisi diblokir: field ${key} berubah.`);
  if (before.get('updatedDate') === revisedFm.get('updatedDate') || !revision.content.startsWith('---\n') || !revision.content.endsWith('\n')) throw new Error('Format atau updatedDate hasil revisi tidak valid.');
  if (revision.content === target.content) throw new Error('Revisi tidak menghasilkan perubahan.');
  reviewedContent = revision.content;
  const firstFindings = review.findings;
  review = await ask(`Lakukan review independen kedua setelah revisi. Gunakan web search dan sumber primer resmi. Output JSON: {"verdict":"pass"|"revise"|"reject","findings":["temuan konkret"],"sources_checked":[{"title":"judul sumber","url":"URL sumber yang benar-benar dibuka","supports":"klaim yang didukung"}],"summary":"alasan singkat"}. Cantumkan sumber yang benar-benar dibuka. Hanya pass jika tidak ada masalah material tersisa dan sumber yang diperlukan telah diperiksa.\nInstruksi reviewer: ${reviewPrompt}\nTarget: ${target.path}\nArtikel asli:\n${target.content}\nArtikel revisi:\n${reviewedContent}\nTemuan review pertama:\n${JSON.stringify(firstFindings)}`, true, reviewModel);
  if (!['pass', 'revise', 'reject'].includes(review.verdict) || !Array.isArray(review.findings) || !Array.isArray(review.sources_checked)) throw new Error('Output reviewer kedua tidak valid atau tidak mencantumkan sumber.');
  if (review.verdict === 'pass' && !review.sources_checked.some((source) => source && typeof source.title === 'string' && (source.url?.startsWith('https://') || source.url?.startsWith('http://')) && typeof source.supports === 'string')) throw new Error('Reviewer kedua tidak mencantumkan sumber valid yang diperiksa; artikel ditahan.');
}
if (review.verdict !== 'pass') {
  const summary = `# AI Content Update — Ditahan oleh review independen\n\n- Target: ${target.path}\n- Verdict: ${review.verdict}\n- Ringkasan reviewer: ${String(review.summary ?? '')}\n- Temuan: ${JSON.stringify(review.findings)}\n- Tidak ada perubahan artikel yang diajukan sebagai PR.\n`;
  if (summaryPath) await appendFile(summaryPath, summary);
  console.error(summary);
  throw new Error(`Review independen tidak meloloskan artikel (verdict: ${review.verdict}); tidak ada PR dibuat.`);
}
await writeFile(path.join(root, target.path), reviewedContent, 'utf8');
await out('changed', 'true');
await out('target_path', target.path);
const summary = `# AI Content Update — Lolos review AI independen\n\n- Target: ${target.path}\n- Alasan: ${rationale}\n- Laporan editor: ${report || 'Tidak ada laporan tambahan.'}\n- Verdict reviewer independen: pass\n- Ringkasan reviewer: ${String(review.summary ?? '')}\n- Temuan reviewer: ${JSON.stringify(review.findings)}\n- Sumber reviewer: ${JSON.stringify(review.sources_checked)}\n- Identitas/URL dipertahankan; hanya satu artikel diubah.\n- Pemeriksaan frontmatter dasar dan review AI lulus; build dijalankan pada langkah berikutnya.\n- Review manusia tetap wajib sebelum merge.\n`;
if (summaryPath) await appendFile(summaryPath, summary);
console.log(summary);
