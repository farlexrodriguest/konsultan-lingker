#!/usr/bin/env node
// Generator aset visual Konsultan Lingker.
// - 11 ilustrasi SVG ke public/images/illustrations/
// - logo (terang + inverse), favicon, og-default.svg + og-default.webp
// Palet brand: emerald (utama), amber (aksen), zinc (netral).
// Jalankan: node scripts/generate-illustrations.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const illoDir = path.join(root, 'public/images/illustrations');
const imagesDir = path.join(root, 'public/images');

const C = {
  deep: '#022c22',    // emerald-950
  primary: '#047857', // emerald-700
  mid: '#10b981',     // emerald-500
  soft: '#a7f3d0',    // emerald-200
  pale: '#ecfdf5',    // emerald-50
  amber: '#fbbf24',   // amber-400
  ink: '#18181b',     // zinc-900
  line: '#d4d4d8',
  paper: '#fafaf9',
  white: '#ffffff',
};

const wrap = (body, bg = C.paper) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450" role="img">
${bg ? `  <rect width="600" height="450" rx="28" fill="${bg}"/>` : ''}
${body}
</svg>
`;

const leaf = (x, y, s, fill, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
  <path d="M0 -34 C 22 -18 26 10 0 34 C -26 10 -22 -18 0 -34 Z" fill="${fill}"/>
  <line x1="0" y1="-20" x2="0" y2="30" stroke="#022c22" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round"/>
</g>`;

const droplet = (x, y, s, fill) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M0 -26 C 14 -8 22 4 22 12 A 22 22 0 1 1 -22 12 C -22 4 -14 -8 0 -26 Z" fill="${fill}"/>
</g>`;

const flask = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-10 -34 h20 M-6 -34 v20 l-16 34 a8 8 0 0 0 7 12 h38 a8 8 0 0 0 7 -12 l-16 -34 v-34" fill="none" stroke="#18181b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M-13 -6 L -24 14 a 8 8 0 0 0 7 12 h 34 a 8 8 0 0 0 7 -12 L 13 -6 Z" fill="#10b981" opacity="0.85"/>
  <circle cx="-2" cy="16" r="3.5" fill="#ffffff"/>
  <circle cx="8" cy="20" r="3" fill="#ffffff" opacity="0.8"/>
</g>`;

const shieldCheck = (x, y, s = 1, fill = '#047857') => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M0 -34 L28 -22 V 4 C 28 22 14 32 0 38 C -14 32 -28 4 -28 -22 Z" fill="${fill}"/>
  <path d="M-11 2 L -3 11 L 13 -8" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</g>`;

const docLines = (x, y, w, rows, color = '#d4d4d8') => {
  let out = '';
  for (let i = 0; i < rows; i += 1) {
    out += `<rect x="${x}" y="${y + i * 16}" width="${w - (i % 3) * 22}" height="7" rx="3.5" fill="${color}"/>`;
  }
  return out;
};

const badge = (x, y) => `<g transform="translate(${x} ${y})">
  <rect width="118" height="34" rx="17" fill="#022c22"/>
  <circle cx="17" cy="17" r="4.5" fill="#fbbf24"/>
  <rect x="30" y="13.5" width="52" height="7" rx="3.5" fill="#ffffff" opacity="0.85"/>
</g>`;

const illustrations = {
  // Hero beranda: latar transparan agar menyatu dengan panel emerald gelap
  'home-hero.svg': wrap(`${badge(60, 66)}
  <circle cx="300" cy="228" r="150" fill="none" stroke="#10b981" stroke-width="3" opacity="0.45"/>
  <circle cx="300" cy="228" r="112" fill="#022c22" stroke="#10b981" stroke-width="3"/>
  <g transform="translate(300 188)">
    <path d="M0 -30 C 20 -15 24 12 0 32 C -24 10 -22 -12 0 -30 Z" fill="#ecfdf5"/>
    <line x1="0" y1="-16" x2="0" y2="26" stroke="#34d399" stroke-width="3.5" stroke-linecap="round"/>
  </g>
  <g transform="translate(245 295)">
    <path d="M0 -26 C 14 -8 22 4 22 12 A 22 22 0 1 1 -22 12 C -22 4 -14 -8 0 -26 Z" fill="#fbbf24"/>
  </g>
  <g transform="translate(360 255)">
    <path d="M-16 -30 h32 M-11 -30 v22 l-19 36 a 9 9 0 0 0 8 13 h42 a 9 9 0 0 0 8 -13 l-19 -36 v-22" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-15 -4 L -26 16 a 9 9 0 0 0 8 13 h 46 a 9 9 0 0 0 8 -13 L 15 -6 Z" fill="#10b981" opacity="0.9"/>
  </g>
  <g transform="translate(470 120)">
    <circle r="30" fill="#fbbf24"/>
    <path d="M-8 -14 c 10 -10 22 -8 18 6 l -5 16 Z" fill="#022c22"/>
  </g>
  <g transform="translate(115 296)">
    <rect width="58" height="74" rx="10" fill="#10b981"/>
    <rect x="10" y="12" width="40" height="6" rx="3" fill="#ffffff" opacity="0.85"/>
    <rect x="0" y="24" width="60" height="8" fill="#ffffff" opacity="0.4"/>
    <rect x="10" y="56" width="40" height="6" rx="3" fill="#ffffff" opacity="0.7"/>
  </g>
  <g stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.55">
    <line x1="70" y1="336" x2="150" y2="336"/>
    <line x1="70" y1="356" x2="130" y2="356"/>
    <line x1="190" y1="356" x2="192" y2="356"/>
  </g>`, null),

  'tentang-kami.svg': wrap(`
  <circle cx="300" cy="205" r="120" fill="#ecfdf5"/>
  <g transform="translate(230 175)"><circle cx="0" cy="0" r="26" fill="#022c22"/><path d="M-34 60 a 34 34 0 0 1 68 0 Z" fill="#047857"/></g>
  <g transform="translate(320 150)"><circle cx="0" cy="0" r="30" fill="#fbbf24"/><path d="M-38 66 a 38 38 0 0 1 76 0 Z" fill="#022c22"/></g>
  <g transform="translate(395 205)"><circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#047857" stroke-width="4"/><path d="M-28 52 a 28 28 0 0 1 56 0 Z" fill="#a7f3d0"/></g>
  <rect x="210" y="292" width="180" height="8" rx="4" fill="#d4d4d8"/>
  <rect x="240" y="318" width="150" height="7" rx="3.5" fill="#e4e4e7"/>
  <rect x="240" y="332" width="130" height="7" rx="3.5" fill="#e4e4e7"/>
  ${leaf(470, 110, 0.8, '#10b981', 18)}
  ${leaf(125, 120, 0.6, '#fbbf24', -20)}`),

  'legalitas-dan-akreditasi.svg': wrap(`
  <rect x="150" y="90" width="240" height="300" rx="16" fill="#ffffff" stroke="#d4d4d7" stroke-width="3"/>
  ${docLines(190, 130, 160, 7)}
  ${shieldCheck(425, 205, 1.4)}
  <g transform="translate(255 345)">
    <circle r="30" fill="#fbbf24"/>
    <path d="M-12 0 L -3 10 L 14 -10" fill="none" stroke="#022c22" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <path d="M270 375 l 12 -8 l 14 12 l -6 34" fill="none" stroke="#a1a1aa" stroke-width="6" stroke-linecap="round"/>
  ${leaf(130, 130, 0.7, '#10b981', -15)}`),

  'layanan.svg': wrap(`
  <circle cx="300" cy="215" r="130" fill="#ecfdf5"/>
  ${flask(215, 185, 0.9)}
  ${droplet(375, 172, 1.3, '#10b981')}
  ${shieldCheck(240, 300, 0.9)}
  <g transform="translate(375 300)">
    <circle r="30" fill="#ffffff" stroke="#18181b" stroke-width="4"/>
    <line x1="0" y1="0" x2="16" y2="-16" stroke="#18181b" stroke-width="4" stroke-linecap="round"/>
    <circle r="4" fill="#fbbf24"/>
  </g>
  ${leaf(140, 125, 0.8, '#10b981', -10)}`),

  'panduan.svg': wrap(`
  <rect x="150" y="90" width="300" height="270" rx="20" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
  ${[0, 1, 2].map((i) => `
  <g transform="translate(185 ${150 + i * 62})">
    <rect x="0" y="-16" width="34" height="34" rx="10" fill="#047857"/>
    <text x="17" y="10" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff">${i + 1}</text>
    <rect x="52" y="-2" width="150" height="8" rx="4" fill="#d4d4d8"/>
    <rect x="52" y="8" width="110" height="8" rx="4" fill="#e4e4e7"/>
  </g>`).join('')}
  ${leaf(480, 130, 0.8, '#10b981', 12)}`),

  'artikel.svg': wrap(`
  <rect x="150" y="80" width="300" height="270" rx="20" fill="#ffffff" stroke="#e4e4e7" stroke-width="3"/>
  <rect x="190" y="120" width="190" height="42" rx="10" fill="#ecfdf5"/>
  ${docLines(190, 220, 200, 4)}
  <g transform="translate(410 265) rotate(45)">
    <rect x="-11" y="-62" width="22" height="82" rx="5" fill="#fbbf24"/>
    <path d="M-11 20 h22 l-11 20 Z" fill="#18181b"/>
  </g>
  ${leaf(470, 120, 0.7, '#10b981', 15)}`),

  'faq.svg': wrap(`
  <circle cx="240" cy="200" r="80" fill="#022c22"/>
  <text x="240" y="238" text-anchor="middle" font-family="Arial, sans-serif" font-size="96" font-weight="bold" fill="#ffffff">?</text>
  <g transform="translate(350 255)">
    <path d="M-60 -40 h120 a 16 16 0 0 1 16 16 v60 a 16 16 0 0 1 -16 16 h-84 l-30 26 v-102 a 16 16 0 0 1 16 -16 Z" fill="#ffffff" stroke="#d4d4d7" stroke-width="3"/>
    ${docLines(-30, 0, 110, 3, '#a1a1aa')}
  </g>
  <circle cx="470" cy="110" r="26" fill="#fbbf24"/>
  <circle cx="120" cy="330" r="14" fill="#10b981" opacity="0.55"/>`),

  'hubungi-kami.svg': wrap(`
  <circle cx="300" cy="215" r="120" fill="#ecfdf5"/>
  <rect x="180" y="160" width="220" height="140" rx="16" fill="#ffffff" stroke="#047857" stroke-width="4"/>
  <path d="M190 180 L 300 260 L 410 180" fill="none" stroke="#047857" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="452" cy="150" r="34" fill="#fbbf24"/>
  <path d="M440 142 a 12 12 0 0 1 22 6 c 0 10 -12 12 -12 20 M448 196 v 2" stroke="#022c22" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${leaf(140, 300, 0.8, '#10b981', -12)}`),

  'not-found.svg': wrap(`
  <circle cx="300" cy="210" r="110" fill="none" stroke="#d4d4d8" stroke-width="3" stroke-dasharray="10 12"/>
  <circle cx="285" cy="195" r="70" fill="#ffffff" stroke="#047857" stroke-width="8"/>
  <line x1="350" y1="262" x2="410" y2="322" stroke="#047857" stroke-width="14" stroke-linecap="round"/>
  <text x="285" y="228" text-anchor="middle" font-family="sans-serif" font-size="72" font-weight="bold" fill="#047857">?</text>
  ${leaf(140, 130, 0.7, '#10b981', -18)}
  ${leaf(480, 330, 0.6, '#fbbf24', 14)}`),

  // Default ilustrasi artikel/panduan dan layanan
  'artikel-panduan.svg': wrap(`
  <rect x="140" y="110" width="310" height="250" rx="18" fill="#ffffff" stroke="#d4d4d7" stroke-width="3"/>
  <path d="M150 100 h130 a30 30 0 0 1 30 30 v200 h-160 Z" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
  ${docLines(200, 150, 150, 5)}
  ${leaf(450, 300, 0.9, '#10b981', 12)}
  <circle cx="130" cy="330" r="20" fill="#fbbf24"/>`),

  'layanan-umum.svg': wrap(`
  <circle cx="300" cy="215" r="118" fill="#ecfdf5"/>
  ${flask(255, 205, 1)}
  ${droplet(375, 180, 1, '#10b981')}
  ${shieldCheck(375, 285, 0.8)}
  ${leaf(170, 130, 0.7, '#10b981', -12)}`),
};

const logoLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 60" width="300" height="60" role="img" aria-label="Konsultan Lingker">
  <g transform="translate(30 30)">
    <circle r="26" fill="#047857"/>
    <path d="M0 -15 C 10 -7 12 6 0 17 C -12 7 -10 -7 0 -15 Z" fill="#ffffff"/>
    <line x1="0" y1="-8" x2="0" y2="13" stroke="#022c22" stroke-width="2.4" stroke-linecap="round"/>
  </g>
  <text x="68" y="28" font-family="'Sora Variable','Sora',ui-sans-serif,system-ui,sans-serif" font-size="19" font-weight="700" fill="#022c22">Konsultan</text>
  <text x="68" y="49" font-family="'Sora Variable','Sora',ui-sans-serif,system-ui,sans-serif" font-size="22" font-weight="700" fill="#047857">Lingker<tspan fill="#fbbf24">.</tspan></text>
</svg>
`;

const logoInverse = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 60" width="300" height="60" role="img" aria-label="Konsultan Lingker">
  <g transform="translate(30 30)">
    <circle r="26" fill="#a7f3d0"/>
    <path d="M0 -15 C 10 -7 12 10 0 17 C -12 10 -10 -7 0 -15 Z" fill="#022c22"/>
    <line x1="0" y1="-8" x2="0" y2="13" stroke="#10b981" stroke-width="2.4" stroke-linecap="round"/>
  </g>
  <text x="68" y="30" font-family="'Sora Variable','Sora',ui-sans-serif,system-ui,sans-serif" font-size="19" font-weight="700" fill="#ffffff">Konsultan</text>
  <text x="68" y="51" font-family="'Sora Variable','Sora',ui-sans-serif,system-ui,sans-serif" font-size="21" font-weight="700" fill="#a7f3d0">Lingker<tspan fill="#fbbf24">.</tspan></text>
</svg>
`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#022c22"/>
  <g transform="translate(32 33)">
    <path d="M0 -19 C 13 -10 15 12 0 22 C -14 12 -13 -8 0 -19 Z" fill="#10b981"/>
    <line x1="0" y1="-10" x2="0" y2="17" stroke="#022c22" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>
`;

const ogDefault = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#022c22"/>
      <stop offset="1" stop-color="#064e3b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1060" cy="70" r="230" fill="#10b981" opacity="0.14"/>
  <circle cx="110" cy="590" r="170" fill="#fbbf24" opacity="0.10"/>
  <g transform="translate(140 300)">
    <circle r="66" fill="#047857"/>
    <path d="M0 -34 C 24 -18 28 16 0 40 C -28 16 -24 -18 0 -34 Z" fill="#ffffff"/>
    <line x1="0" y1="-20" x2="0" y2="30" stroke="#10b981" stroke-width="5" stroke-linecap="round"/>
  </g>
  <text x="250" y="300" font-family="'Sora Variable','Sora',sans-serif" font-size="62" font-weight="700" fill="#ffffff">Konsultan Lingker</text>
  <text x="250" y="352" font-family="sans-serif" font-size="29" fill="#a7f3d0">Konsultansi lingkungan, laboratorium, dan lingkungan kerja</text>
  <rect x="112" y="360" width="120" height="10" rx="5" fill="#fbbf24"/>
  <text x="110" y="470" font-family="sans-serif" font-size="30" fill="#a7f3d0">Perizinan lingkungan · Laboratorium · Riksa uji K3</text>
</svg>
`;

await mkdir(illoDir, { recursive: true });
await mkdir(imagesDir, { recursive: true });

for (const [name, svg] of Object.entries(illustrations)) {
  await writeFile(path.join(illoDir, name), svg, 'utf8');
}
await writeFile(path.join(imagesDir, 'logo-konsultan-lingker.svg'), logoLight, 'utf8');
await writeFile(path.join(imagesDir, 'logo-konsultan-lingker-inverse.svg'), logoInverse, 'utf8');
await writeFile(path.join(root, 'public/favicon.svg'), favicon, 'utf8');
await writeFile(path.join(imagesDir, 'og-default.svg'), ogDefault, 'utf8');

// OG default wajib raster untuk crawler sosial (check-seo-output menuntut og-default.webp).
await sharp(path.join(imagesDir, 'og-default.svg'))
  .resize(1200, 630, { fit: 'contain', background: '#022c22' })
  .webp({ quality: 82 })
  .toFile(path.join(imagesDir, 'og-default.webp'));

console.log(`Illustrations: ${Object.keys(illustrations).length} SVG + logo, favicon, og-default (webp).`);
