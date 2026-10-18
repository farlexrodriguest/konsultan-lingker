import { execFileSync } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const collections = ['articles', 'guides', 'pages', 'services'];
const gitNames = (args) => execFileSync('git', args, {
  cwd: root,
  encoding: 'utf8',
}).split('\n').map((file) => file.trim()).filter(Boolean);

async function markdownFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(entryPath));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(entryPath);
  }
  return files;
}

// Kumpulkan semua pubDate/updatedDate yang sudah dipakai supaya timestamp baru
// tidak pernah menabrak milik berkas lain — mencegah duplikat yang ditolak
// scripts/check-content-dates.mjs.
async function collectUsedTimestamps() {
  const used = new Set();
  for (const collection of collections) {
    for (const file of await markdownFiles(path.join(root, 'src/content', collection))) {
      let source;
      try {
        source = await readFile(file, 'utf8');
      } catch {
        continue;
      }
      const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!frontmatterMatch) continue;
      for (const match of frontmatterMatch[1].matchAll(/^(?:pubDate|updatedDate):\s*["']?([^"'\r\n]+)["']?\s*$/gm)) {
        used.add(match[1].trim());
      }
    }
  }
  return used;
}

const stagedPaths = gitNames(['diff', '--cached', '--name-only', '--diff-filter=ACMR']);
const changedContent = stagedPaths.filter(
  (file) => file.startsWith('src/content/') && file.endsWith('.md'),
);

if (changedContent.length === 0) {
  console.log('Content dates: no staged content changes; nothing to update.');
  process.exit(0);
}

// Halaman indeks yang menampilkan koleksi tertentu diperbarui bersama konten
// yang berubah supaya tanggal "terakhir diperbarui" pada listing tetap akurat.
const listingPages = {
  'src/content/articles/': ['src/content/pages/artikel.md', 'src/content/pages/home.md'],
  'src/content/guides/': ['src/content/pages/panduan.md', 'src/content/pages/home.md'],
  'src/content/services/': ['src/content/pages/layanan.md', 'src/content/pages/home.md'],
};

const filesToUpdate = new Set(changedContent);
for (const file of changedContent) {
  for (const [prefix, listings] of Object.entries(listingPages)) {
    if (file.startsWith(prefix)) {
      for (const listing of listings) filesToUpdate.add(listing);
    }
  }
}
const unstagedTargets = gitNames(['diff', '--name-only', '--', ...filesToUpdate]);
if (unstagedTargets.length > 0) {
  throw new Error(
    'Content date automation stopped to avoid staging unrelated unstaged edits. Stage or discard these changes first:\n' +
    unstagedTargets.map((file) => `- ${file}`).join('\n'),
  );
}

// Satu detik berbeda per berkas, dimulai dari waktu sekarang, dan melewati
// nilai yang sudah dipakai berkas lain.
const usedTimestamps = await collectUsedTimestamps();
const base = Date.now();
let offset = 0;
const nextTimestamp = () => {
  for (;;) {
    const candidate = new Date(base + offset * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
    offset += 1;
    if (!usedTimestamps.has(candidate)) {
      usedTimestamps.add(candidate);
      return candidate;
    }
  }
};

const missingFiles = [];

for (const relativePath of filesToUpdate) {
  let source;
  try {
    source = await readFile(path.join(root, relativePath), 'utf8');
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      missingFiles.push(relativePath);
      continue;
    }
    throw error;
  }

  const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    throw new Error(`Missing YAML frontmatter in ${relativePath}`);
  }

  const frontmatter = frontmatterMatch[1];
  const pubDateMatch = frontmatter.match(/^pubDate:\s*["']?([^"'\r\n]+)["']?\s*$/m);
  if (!pubDateMatch) {
    throw new Error(`Missing pubDate in ${relativePath}`);
  }

  const pubDate = new Date(pubDateMatch[1].trim());
  if (Number.isNaN(pubDate.valueOf())) {
    throw new Error(`Invalid pubDate in ${relativePath}: ${pubDateMatch[1]}`);
  }

  const timestamp = nextTimestamp();
  if (pubDate.valueOf() > Date.parse(timestamp)) {
    throw new Error(`pubDate is in the future; cannot set updatedDate earlier than pubDate: ${relativePath}`);
  }

  const updatedFrontmatter = /^updatedDate:\s*.*$/m.test(frontmatter)
    ? frontmatter.replace(/^updatedDate:\s*.*$/m, `updatedDate: "${timestamp}"`)
    : frontmatter.replace(/^(pubDate:\s*.*)$/m, `$1\nupdatedDate: "${timestamp}"`);
  const updatedSource = source.replace(frontmatterMatch[0], `---\n${updatedFrontmatter}\n---`);

  if (updatedSource !== source) {
    await writeFile(path.join(root, relativePath), updatedSource);
  }
}

if (missingFiles.length > 0) {
  throw new Error(`Required content file(s) not found: ${missingFiles.join(', ')}`);
}

execFileSync('git', ['add', '--', ...filesToUpdate], { cwd: root, stdio: 'inherit' });
console.log(`Content dates updated with unique timestamps for ${filesToUpdate.size} content file(s); all changes staged.`);
