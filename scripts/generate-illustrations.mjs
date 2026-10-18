#!/usr/bin/env node
// Generator aset visual Konsultan Lingker.
// - 26 ilustrasi SVG ke public/images/illustrations/ (9 halaman + 7 layanan + 8 sublayanan + umum)
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

  // === Ilustrasi layanan (satu SVG unik per halaman layanan) ===
  'perizinan-lingkungan.svg': wrap(`
  <rect x="140" y="100" width="220" height="280" rx="16" fill="#ffffff" stroke="#d4d4d7" stroke-width="3"/>
  <rect x="190" y="70" width="240" height="300" rx="16" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
  ${docLines(230, 120, 160, 7)}
  <g transform="translate(415 200)">
    <circle r="38" fill="none" stroke="#047857" stroke-width="6"/>
    <circle r="17" fill="#10b981" opacity="0.55"/>
    <path d="M-13 1 L -4 11 L 13 -11" fill="none" stroke="#022c22" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g transform="translate(420 330)">
    <circle r="30" fill="#fbbf24"/>
    <path d="M-11 0 L -3 9 L 13 -9" fill="none" stroke="#022c22" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  ${leaf(120, 130, 0.7, '#10b981', -15)}`),

  'amdal.svg': wrap(`
  <rect x="130" y="110" width="210" height="270" rx="16" fill="#ffffff" stroke="#d4d4d7" stroke-width="3"/>
  <rect x="180" y="80" width="220" height="290" rx="16" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
  <rect x="205" y="108" width="120" height="14" rx="7" fill="#022c22"/>
  ${docLines(230, 112, 150, 4)}
  <rect x="210" y="210" width="42" height="52" rx="6" fill="#a7f3d0"/>
  <rect x="232" y="152" width="42" height="74" rx="6" fill="#10b981" opacity="0.8"/>
  <rect x="284" y="130" width="42" height="62" rx="6" fill="#fbbf24" opacity="0.75"/>
  <g transform="translate(150 300)">
    <circle r="30" fill="#fbbf24"/>
    <path d="M-11 0 L -3 9 L 13 -9" fill="none" stroke="#022c22" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g transform="translate(445 190)">
    <circle r="36" fill="none" stroke="#047857" stroke-width="6"/>
    <circle r="15" fill="#10b981" opacity="0.55"/>
    <path d="M-12 1 L -4 10 L 12 -10" fill="none" stroke="#022c22" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <rect x="360" y="270" width="120" height="110" rx="14" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
  ${docLines(302, 296, 100, 4)}
  ${shieldCheck(410, 330, 0.85)}
  ${leaf(120, 130, 0.7, '#10b981', -15)}`),

  'ukl-upl.svg': wrap(`
  <rect x="170" y="80" width="240" height="300" rx="16" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
  <rect x="196" y="106" width="120" height="14" rx="7" fill="#022c22"/>
  ${docLines(200, 110, 160, 3)}
  <g transform="translate(198 176)">
    <rect width="24" height="24" rx="6" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
    <path d="M5 12 L 11 18 L 20 5" fill="none" stroke="#047857" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="36" y="3" width="130" height="8" rx="4" fill="#d4d4d8"/>
    <rect x="36" y="17" width="90" height="7" rx="3.5" fill="#e4e4e7"/>
  </g>
  <g transform="translate(198 236)">
    <rect width="24" height="24" rx="6" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
    <path d="M5 12 L 11 18 L 20 5" fill="none" stroke="#047857" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="36" y="3" width="130" height="8" rx="4" fill="#d4d4d8"/>
    <rect x="36" y="17" width="110" height="7" rx="3.5" fill="#e4e4e7"/>
  </g>
  <rect x="198" y="288" width="164" height="52" rx="10" fill="#a7f3d0" opacity="0.7"/>
  ${droplet(226, 314, 0.8, '#047857')}
  <rect x="244" y="304" width="100" height="7" rx="3.5" fill="#047857" opacity="0.8"/>
  <rect x="244" y="318" width="76" height="7" rx="3.5" fill="#047857" opacity="0.5"/>
  <g transform="translate(430 130)">
    <circle r="30" fill="#fbbf24"/>
    <path d="M-11 0 L -3 9 L 13 -9" fill="none" stroke="#022c22" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  ${leaf(430, 330, 0.9, '#10b981', 12)}`),

  'persetujuan-teknis-air-limbah.svg': wrap(`
  <rect x="170" y="80" width="240" height="300" rx="16" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
  <rect x="196" y="106" width="140" height="14" rx="7" fill="#022c22"/>
  ${docLines(200, 110, 160, 3)}
  <g transform="translate(196 176)">
    <rect width="150" height="56" rx="10" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
    <rect x="18" y="16" width="60" height="12" rx="6" fill="#047857" opacity="0.85"/>
    <rect x="18" y="34" width="90" height="8" rx="4" fill="#a7f3d0"/>
    ${droplet(126, 28, 0.55, '#047857')}
  </g>
  <g transform="translate(196 246)">
    <rect width="150" height="56" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
    <rect x="18" y="16" width="52" height="12" rx="6" fill="#d97706" opacity="0.85"/>
    <rect x="18" y="34" width="84" height="8" rx="4" fill="#fcd34d"/>
    <path d="M126 12 L 126 44 M 116 34 L 126 44 L 136 34" fill="none" stroke="#d97706" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <rect x="198" y="322" width="164" height="34" rx="8" fill="#a7f3d0" opacity="0.7"/>
  <rect x="212" y="335" width="90" height="8" rx="4" fill="#047857" opacity="0.8"/>
  <g transform="translate(432 132)">
    <circle r="30" fill="#fbbf24"/>
    <path d="M-11 0 L -3 9 L 13 -9" fill="none" stroke="#022c22" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  ${droplet(440, 250, 1.1, '#10b981')}
  ${droplet(392, 306, 0.7, '#047857')}`),

  'uji-air-limbah.svg': wrap(`
  <rect x="150" y="80" width="250" height="300" rx="16" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
  <rect x="176" y="106" width="120" height="14" rx="7" fill="#022c22"/>
  ${docLines(180, 110, 160, 3)}
  <g transform="translate(176 176)">
    <rect width="190" height="88" rx="12" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
    ${flask(210, 226, 0.62)}
    <rect x="238" y="206" width="60" height="9" rx="4.5" fill="#047857" opacity="0.85"/>
    <rect x="238" y="224" width="72" height="7" rx="3.5" fill="#a7f3d0"/>
    <rect x="238" y="238" width="52" height="8" rx="4" fill="#a7f3d0"/>
  </g>
  <g transform="translate(176 254)">
    <rect width="150" height="46" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
    ${droplet(206, 277, 0.5, '#d97706')}
    <rect x="222" y="272" width="96" height="10" rx="5" fill="#d97706" opacity="0.85"/>
    <path d="M322 262 L 322 298 M 313 289 L 322 298 L 331 289" fill="none" stroke="#d97706" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <rect x="176" y="326" width="164" height="30" rx="8" fill="#a7f3d0" opacity="0.7"/>
  <rect x="190" y="343" width="86" height="8" rx="4" fill="#047857" opacity="0.8"/>
  <g transform="translate(436 140)">
    <circle r="30" fill="#fbbf24"/>
    <path d="M-11 0 L -3 9 L 13 -9" fill="none" stroke="#022c22" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  ${droplet(446, 262, 1.15, '#10b981')}
  ${droplet(398, 318, 0.65, '#047857')}`),

  'uji-kualitas-air.svg': wrap(`
  <circle cx="400" cy="180" r="120" fill="#ecfdf5"/>
  <path d="M110 340 Q 150 310 190 340 T 270 340 T 350 340 T 430 340 T 430 380 L 110 340 Z" fill="#a7f3d0" opacity="0.6"/>
  <g transform="translate(236 148)">
    <rect x="24" y="0" width="34" height="120" rx="17" fill="#ffffff" stroke="#047857" stroke-width="4"/>
    <path d="M6 44 Q 6 58 21 62 L 41 62 Q 56 58 56 44 L 56 44 L 41 44 L 41 24 L 21 21 L 21 44 Z" fill="#10b981" opacity="0.9"/>
    <rect x="30" y="26" width="22" height="86" rx="15" fill="#34d399" opacity="0.75"/>
    <circle cx="53" cy="30" r="7" fill="#a7f3d0"/>
    <circle cx="43" cy="66" r="4" fill="#ffffff" opacity="0.85"/>
    <circle cx="44" cy="88" r="6" fill="#ffffff" opacity="0.85"/>
  </g>
  <g transform="translate(360 180)">
    <rect width="220" height="150" rx="14" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
    <rect x="22" y="24" width="86" height="13" rx="6.5" fill="#022c22"/>
    ${docLines(26, 30, 74, 3)}
    <g transform="translate(22 74)">
      <rect width="20" height="20" rx="5" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
      <path d="M4 10 L 9 15 L 16 4" fill="none" stroke="#047857" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="30" y="2" width="106" height="8" rx="4" fill="#d4d4d8"/>
      <rect x="30" y="14" width="58" height="7" rx="3.5" fill="#e4e4e7"/>
    </g>
    <g transform="translate(22 104)">
      <rect width="20" height="20" rx="5" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
      <path d="M4 10 L 9 15 L 16 4" fill="none" stroke="#047857" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="30" y="2" width="100" height="7" rx="3.5" fill="#d4d4d8"/>
      <rect x="30" y="14" width="64" height="7" rx="3.5" fill="#e4e4e7"/>
    </g>
  </g>
  <g transform="translate(404 118)">
    <circle r="28" fill="#fbbf24"/>
    <path d="M-11 0 L -3 9 L 13 -9" fill="none" stroke="#022c22" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  ${droplet(150, 130, 0.8, '#10b981')}
  ${droplet(190, 200, 0.55, '#047857')}`),

  'uji-udara-ambien.svg': wrap(`
  <circle cx="168" cy="128" r="34" fill="#fbbf24" opacity="0.85"/>
  <path d="M300 128 a26 26 0 0 1 0 -0.01 Z M286 146 a30 30 0 0 1 44 -22 a24 24 0 0 1 46 8 a22 22 0 0 1 -6 43 L 292 175 a20 20 0 0 1 -6 -29 Z" fill="#ffffff" opacity="0.95"/>
  <path d="M330 108 q14 -20 34 -12 q6 2 8 6" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
  <path d="M366 84 q18 -14 36 -6" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
  <path d="M240 132 q12 -16 30 -10" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
  <rect x="196" y="216" width="70" height="130" rx="12" fill="#ffffff" stroke="#047857" stroke-width="3"/>
  <rect x="208" y="128" width="46" height="30" rx="8" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
  <circle cx="231" cy="141" r="13" fill="none" stroke="#047857" stroke-width="4"/>
  <path d="M231 141 L 231 132 M 231 141 L 240 146 M 231 141 L 223 148" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
  <rect x="214" y="184" width="38" height="26" rx="6" fill="#ecfdf5" stroke="#047857" stroke-width="2.5"/>
  <path d="M222 204 h22 M222 196 h22 M224 188 h8" stroke="#047857" stroke-width="3" stroke-linecap="round"/>
  <g transform="translate(310 190)">
    <rect width="210" height="140" rx="14" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
    <rect x="22" y="22" width="96" height="13" rx="6.5" fill="#022c22"/>
    ${docLines(26, 28, 70, 3)}
    <g transform="translate(22 68)">
      <rect width="20" height="20" rx="5" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
      <path d="M4 10 L 9 15 L 16 4" fill="none" stroke="#047857" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="30" y="2" width="100" height="8" rx="4" fill="#d4d4d8"/>
      <rect x="30" y="14" width="58" height="7" rx="3.5" fill="#e4e4e7"/>
    </g>
    <g transform="translate(22 98)">
      <rect width="20" height="20" rx="5" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
      <path d="M4 10 L 9 15 L 16 4" fill="none" stroke="#047857" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="30" y="2" width="110" height="8" rx="4" fill="#d4d4d8"/>
      <rect x="30" y="14" width="50" height="7" rx="3.5" fill="#e4e4e7"/>
    </g>
  </g>
  <path d="M330 250 q16 -14 32 0 q16 14 32 0" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round" opacity="0.75"/>
  <path d="M350 272 q14 -12 28 0 q14 12 28 0" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" opacity="0.55"/>
  ${leaf(168, 330, 0.85, '#10b981', -12)}`),

  'uji-emisi-cerobong.svg': wrap(`
  <rect x="96" y="286" width="150" height="94" rx="10" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
  <rect x="150" y="256" width="42" height="40" rx="6" fill="#f4f4f5"/>
  <rect x="158" y="110" width="26" height="150" rx="6" fill="#ffffff" stroke="#047857" stroke-width="3"/>
  <rect x="150" y="96" width="54" height="16" rx="6" fill="#047857"/>
  <path d="M167 96 q10 -26 24 -34 q12 -7 20 -4" fill="none" stroke="#d4d4d8" stroke-width="10" stroke-linecap="round" opacity="0.7"/>
  <path d="M197 62 q16 -14 32 -8" fill="none" stroke="#d4d4d8" stroke-width="8" stroke-linecap="round" opacity="0.5"/>
  <path d="M226 92 q10 -14 24 -10" fill="none" stroke="#d4d4d8" stroke-width="7" stroke-linecap="round" opacity="0.55"/>
  <g transform="translate(124 176)">
    <rect width="52" height="34" rx="8" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
    <circle cx="26" cy="17" r="11" fill="none" stroke="#047857" stroke-width="4"/>
    <path d="M26 17 L 26 8 M 26 17 L 33 21 M 26 17 L 19 22" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
  </g>
  <path d="M172 176 L 176 186 M 172 216 L 172 204" stroke="#047857" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
  <g transform="translate(286 128)">
    <rect width="222" height="146" rx="14" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
    <rect x="22" y="22" width="92" height="13" rx="6.5" fill="#022c22"/>
    ${docLines(26, 28, 72, 3)}
    <g transform="translate(22 70)">
      <rect width="20" height="20" rx="5" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
      <path d="M4 10 L 9 15 L 16 4" fill="none" stroke="#047857" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="30" y="2" width="108" height="8" rx="4" fill="#d4d4d8"/>
      <rect x="30" y="14" width="54" height="7" rx="3.5" fill="#e4e4e7"/>
    </g>
    <g transform="translate(22 100)">
      <rect width="20" height="20" rx="5" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
      <path d="M10 5 L 10 11 L 14 13" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="30" y="2" width="96" height="8" rx="4" fill="#d4d4d8"/>
      <rect x="30" y="14" width="46" height="7" rx="3.5" fill="#e4e4e7"/>
    </g>
  </g>
  <g transform="translate(486 106)">
    <circle r="28" fill="#fbbf24"/>
    <path d="M-11 0 L -3 9 L 13 -9" fill="none" stroke="#022c22" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  ${leaf(120, 160, 0.7, '#10b981', -8)}`),

  'uji-kebisingan-getaran.svg': wrap(`
  <circle cx="168" cy="132" r="100" fill="#ecfdf5"/>
  <g transform="translate(128 108)">
    <circle cx="44" cy="36" r="30" fill="#ffffff" stroke="#047857" stroke-width="4"/>
    <circle cx="44" cy="36" r="14" fill="#022c22"/>
    <circle cx="44" cy="36" r="7" fill="#fbbf24"/>
    <rect x="30" y="66" width="36" height="110" rx="12" fill="#ffffff" stroke="#047857" stroke-width="3"/>
    <rect x="138" y="6" width="14" height="66" rx="7" fill="#047857"/>
    <path d="M70 18 q14 8 14 30 q0 22 -14 30" fill="none" stroke="#047857" stroke-width="5" stroke-linecap="round"/>
    <path d="M170 18 q16 14 0 42" fill="none" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
    <path d="M172 30 q22 12 0 40" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
  </g>
  <path d="M96 262 q14 -18 28 0 q14 18 28 0 q14 -18 28 0 q14 18 28 0" fill="none" stroke="#047857" stroke-width="5" stroke-linecap="round"/>
  <path d="M120 284 q10 -12 20 0 q10 12 20 0 q10 -18 20 0" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" opacity="0.65"/>
  <g transform="translate(300 120)">
    <rect width="222" height="150" rx="14" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
    <rect x="22" y="22" width="96" height="13" rx="6.5" fill="#022c22"/>
    ${docLines(26, 28, 72, 3)}
    <g transform="translate(22 70)">
      <rect width="20" height="20" rx="5" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
      <path d="M4 10 L 9 15 L 16 4" fill="none" stroke="#047857" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="30" y="2" width="106" height="8" rx="4" fill="#d4d4d8"/>
      <rect x="30" y="14" width="58" height="7" rx="3.5" fill="#e4e4e7"/>
    </g>
    <g transform="translate(22 100)">
      <rect width="20" height="20" rx="5" fill="#ecfdf5" stroke="#047857" stroke-width="3"/>
      <path d="M4 10 L 9 15 L 16 4" fill="none" stroke="#047857" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="30" y="2" width="88" height="8" rx="4" fill="#d4d4d8"/>
      <rect x="30" y="14" width="62" height="7" rx="3.5" fill="#e4e4e7"/>
    </g>
  </g>
  <g transform="translate(474 100)">
    <circle r="28" fill="#fbbf24"/>
    <path d="M-11 0 L -3 9 L 13 -9" fill="none" stroke="#022c22" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  ${leaf(296, 312, 0.85, '#10b981', 10)}`),

  'laboratorium-lingkungan.svg': wrap(`
  <circle cx="290" cy="215" r="118" fill="#ecfdf5"/>
  ${flask(250, 205, 1.05)}
  <rect x="330" y="130" width="58" height="92" rx="10" fill="#ffffff" stroke="#047857" stroke-width="4"/>
  <rect x="340" y="150" width="40" height="44" rx="5" fill="#a7f3d0"/>
  <rect x="330" y="112" width="60" height="12" rx="5" fill="#022c22"/>
  ${flask(380, 280, 0.7)}
  ${droplet(430, 150, 1.1, '#fbbf24')}
  ${leaf(140, 130, 0.7, '#10b981', -12)}`),

  'pemantauan-air-limbah.svg': wrap(`
  <rect x="130" y="120" width="330" height="230" rx="18" fill="#ffffff" stroke="#d4d4d8" stroke-width="3"/>
  <polyline points="180,280 240,242 300,258 360,204 415,192" fill="none" stroke="#047857" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="240" cy="242" r="8" fill="#047857"/>
  <circle cx="415" cy="204" r="8" fill="#fbbf24"/>
  ${droplet(205, 150, 1.15, '#10b981')}
  <rect x="330" y="130" width="26" height="60" rx="12" fill="#ffffff" stroke="#047857" stroke-width="4"/>
  ${leaf(128, 300, 0.65, '#10b981', -10)}`),

  'riksa-uji-k3.svg': wrap(`
  <circle cx="300" cy="210" r="118" fill="#ecfdf5"/>
  <g transform="translate(262 205)">
    <path d="M-50 20 a 50 50 0 0 1 100 0 l 9 14 h -118 Z" fill="#fbbf24" stroke="#18181b" stroke-width="4"/>
    <rect x="-56" y="28" width="118" height="10" rx="5" fill="#022c22"/>
    <circle cx="0" cy="-44" r="7" fill="#022c22"/>
  </g>
  ${shieldCheck(405, 280, 1.05)}
  <g stroke="#047857" stroke-width="5" stroke-linecap="round">
    <line x1="165" y1="290" x2="185" y2="288"/>
    <line x1="160" y1="320" x2="205" y2="300"/>
  </g>
  ${leaf(140, 130, 0.7, '#10b981', -14)}`),

  'biomonitoring.svg': wrap(`
  <circle cx="300" cy="210" r="120" fill="#ecfdf5"/>
  <g transform="translate(250 205)">
    <circle cx="0" cy="-30" r="24" fill="#022c22"/>
    <path d="M-38 66 a 38 38 0 0 1 76 0 Z" fill="#047857"/>
  </g>
  ${droplet(395, 165, 1.15, '#10b981')}
  ${droplet(435, 215, 0.75, '#fbbf24')}
  <rect x="360" y="270" width="26" height="64" rx="12" fill="#ffffff" stroke="#047857" stroke-width="4"/>
  ${leaf(140, 300, 0.7, '#10b981', -14)}`),

  'greenship.svg': wrap(`
  <circle cx="300" cy="215" r="118" fill="#ecfdf5"/>
  <rect x="215" y="150" width="150" height="180" rx="8" fill="#ffffff" stroke="#047857" stroke-width="4"/>
  <rect x="196" y="122" width="66" height="14" rx="4" fill="#022c22"/>
  <rect x="196" y="180" width="34" height="30" rx="4" fill="#a7f3d0"/>
  <rect x="242" y="180" width="34" height="30" rx="4" fill="#a7f3d0"/>
  <rect x="292" y="180" width="34" height="30" rx="4" fill="#a7f3d0"/>
  <rect x="196" y="240" width="34" height="30" rx="4" fill="#a7f3d0"/>
  <rect x="242" y="180" width="34" height="150" rx="4" fill="#10b981"/>
  ${leaf(415, 165, 1.05, '#10b981', 8)}
  <circle cx="425" cy="292" r="26" fill="#fbbf24"/>
  ${leaf(140, 145, 0.7, '#10b981', -10)}`),

  'rohs-soc.svg': wrap(`
  <circle cx="300" cy="215" r="118" fill="#ecfdf5"/>
  <rect x="240" y="160" width="120" height="120" rx="14" fill="#022c22"/>
  <rect x="262" y="188" width="64" height="64" rx="8" fill="#047857"/>
  <path d="M282 220 L 298 236 L 322 206" fill="none" stroke="#ecfdf5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <g stroke="#047857" stroke-width="6" stroke-linecap="round">
    <line x1="205" y1="185" x2="240" y2="185"/>
    <line x1="205" y1="215" x2="240" y2="215"/>
    <line x1="205" y1="245" x2="240" y2="245"/>
    <line x1="360" y1="185" x2="395" y2="185"/>
    <line x1="360" y1="215" x2="395" y2="215"/>
    <line x1="360" y1="245" x2="395" y2="245"/>
  </g>
  <g stroke="#047857" stroke-width="6" stroke-linecap="round">
    <line x1="270" y1="130" x2="270" y2="160"/>
    <line x1="300" y1="130" x2="300" y2="160"/>
    <line x1="330" y1="130" x2="330" y2="160"/>
    <line x1="270" y1="310" x2="270" y2="280"/>
    <line x1="330" y1="310" x2="330" y2="280"/>
  </g>
  <g transform="translate(420 300)">
    <circle r="30" fill="#fbbf24"/>
    <path d="M-12 0 L -3 10 L 14 -10" fill="none" stroke="#022c22" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  ${leaf(140, 300, 0.7, '#10b981', -14)}`),
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
