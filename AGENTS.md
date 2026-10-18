# AGENTS.md

Panduan wajib untuk agen/AI yang bekerja di repo ini.

## Ringkasan proyek

- Situs statis **Astro 7** untuk **Konsultan Lingker** — konsultansi & pengujian lingkungan (bahasa Indonesia).
- Bidang: perizinan lingkungan (AMDAL, UKL–UPL, SPPL, persetujuan teknis), laboratorium lingkungan, pemantauan air limbah, riksa uji K3 lingkungan kerja, biomonitoring, Greenship, RoHS/SoC.
- Konten berada di `src/content/` (Markdown + schema Zod), hasil build di `dist/` (gitignored).
- Arsitektur **Frontmatter & Blocks**: semua data di frontmatter; layout/komponen adalah theme tanpa teks literal.
- PRD: `docs/PRD-MIGRASI-WEBSITE.md` — wajib dibaca sebelum menambah layanan/klaim.

## Perintah

- `npm run build` — gerbang validasi berlapis: integritas frontmatter + validasi tanggal + typecheck (`astro sync` + `tsc --noEmit`) + `astro build` + pemeriksaan tautan internal, SEO output, `alt` gambar, isi artikel/panduan terbit, dan kualitas konten terpublikasi. **Wajib lulus sebelum tugas dianggap selesai.**
- `npm run dev` — server pengembangan.
- `npm run preview` — pratinjau hasil build.
- `npm run hooks:install` — memasang git hook pre-commit.
- `npm run images:illustration -- <svg>` — konversi satu SVG ke raster.
- Gunakan **npm** (ada `package-lock.json`); jangan ganti ke pnpm/yarn.

Catatan type-check: `tsc --noEmit` hanya memeriksa berkas `.ts`, bukan frontmatter/`<script>` pada `.astro`. Periksa props komponen secara manual dan andalkan validasi build untuk menangkap kesalahan data.

## ATURAN INTI: pisahkan "theme" dari "data"

- **Theme** = layout, komponen, blok, styling. Hanya struktur dan markup; menerima data lewat `Astro.props`. **Tidak boleh memuat data atau teks literal apa pun.**
- **Data** = semua teks yang terlihat pengguna maupun terbaca mesin (judul, deskripsi, heading, label tombol, navigasi, footer, meta SEO, `alt` gambar). Semua berasal dari frontmatter atau `src/config/`.
- **Label UI bersama** ada di `src/config/ui.ts`. Teks spesifik satu halaman tetap di frontmatter `src/content/pages/*.md`.
- Konsekuensi: nilai "fallback"/default di dalam theme dianggap pelanggaran. Mengganti teks = mengubah frontmatter, bukan komponen.

## Struktur

| Lokasi | Peran |
| --- | --- |
| `src/layouts/BaseLayout.astro` | theme head/meta + JSON-LD graph (Organization, WebSite, WebPage, BreadcrumbList) |
| `src/layouts/ArticleLayout.astro` | theme halaman artikel (`/artikel/`) |
| `src/layouts/GuideLayout.astro` | theme halaman panduan |
| `src/layouts/ServiceLayout.astro` | theme halaman layanan |
| `src/components/blocks.ts` | registry blok: `component` → komponen |
| `src/components/blocks/BlockRenderer.astro` | dispatcher blok |
| `src/components/shared/*` | theme blok konten (menerima props) |
| `src/content/pages/*.md` | data halaman statis |
| `src/content/articles/*.md` | data artikel (koleksi `articles`) |
| `src/content/guides/*.md` | data panduan (koleksi `guides`) |
| `src/content/services/*.md` | data layanan |
| `src/content.config.ts` | schema frontmatter (sumber kebenaran bentuk data) |
| `src/config/site.ts` | identitas situs (nama, kontak, alamat) |
| `src/config/ui.ts` | label UI bersama (navigasi, footer, tombol, label blok) |
| `scripts/check-*.mjs` | gerbang validasi build |
| `scripts/update-content-dates.mjs` | hook pre-commit: menulis `updatedDate` unik untuk semua konten yang berubah |
| `scripts/generate-illustrations.mjs` | generator aset SVG brand + og-default.webp |
| `scripts/generate-ulid.mjs` | generator ULID Crockford untuk konten baru |

## Rute publik

```text
/                        beranda
/tentang-kami/
/legalitas-dan-akreditasi/
/layanan/  +  /layanan/<slug>/
/panduan/  +  /panduan/<slug>/
/artikel/  +  /artikel/<slug>/
/faq/
/hubungi-kami/
```

URL memakai istilah Indonesia sesuai `docs/PRD-MIGRASI-WEBSITE.md`. Jangan mengubah slug yang sudah terpublikasi.

## Menambah / mengubah halaman

1. Tambah atau ubah entri frontmatter di `src/content/pages/` sesuai schema di `src/content.config.ts`.
2. Tulis halaman `.astro` seminimal mungkin: ambil data dengan `getEntry('pages', '<slug>')`, render lewat `BlockRenderer`.
3. Jangan menaruh teks di file halaman — pindahkan ke frontmatter.
4. Jalankan `npm run build` dan pastikan semua validasi lulus.

## Standar konten wajib (ringkas)

1. Berkas `.md` dibuka `---` dan ditutup **tepat satu kali**; dilarang ada `---` lain di dalam frontmatter (delimiter nyasar membuang `blocks`).
2. Body Markdown **tidak dirender** — seluruh isi wajib ada di frontmatter (`blocks` atau field lain).
3. `blocks` tidak boleh kosong pada konten terbit; setiap heading/title blok wajib muncul di HTML hasil build.
4. `id` integer positif unik per koleksi; `ulid` 26 karakter Crockford base32 (`/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/`) **unik lintas koleksi**. Generate dengan `node scripts/generate-ulid.mjs <jumlah>` dan pastikan belum dipakai repo lain.
5. `pubDate`/`updatedDate` format `YYYY-MM-DDTHH:mm:ssZ` (tanpa ms, hindari `T00:00:00Z`), **unik global lintas koleksi**, `updatedDate` > `pubDate`.
6. `relatedType` + `relatedId` ditulis berpasangan; target wajib ada dan bukan draft.
7. `draft: false` untuk terbit; `imageAlt` wajib bila `image` diisi.
8. Dilarang placeholder pada konten terbit (kata "TODO", "placeholder", frasa generik seperti "nomor WhatsApp" di dalam teks konten) — ditegakkan oleh `scripts/check-published-content.mjs`.

## Aset gambar

- Satu gambar untuk satu halaman/konten; duplikasi path antar konten ditolak.
- Ilustrasi SVG dibuat via `scripts/generate-illustrations.mjs` (palet: emerald/amber/zinc — jangan memakai palet brand repo lain).
- Gambar sosial (`socialImage`) wajib WebP di `public/images/social/` — di-generate `prebuild` oleh `scripts/generate-social-images.mjs` dari SVG ilustrasi terkait.
- Selalu sediakan `alt` bermakna; `alt=""` hanya untuk gambar dekoratif.

## Standar build (gerbang berlapis)

`npm run build` menjalankan: frontmatter integrity → content dates → typecheck (`astro sync` + `tsc --noEmit`) → `astro build` → internal links → SEO output → image alt → article/guide output → published content. **Jangan mengklaim lulus sebelum menjalankannya.**

Catatan type-check: `tsc` hanya memeriksa `.ts`. Kesalahan tipe di `.astro` ditangkap oleh `astro build` dan pemeriksa output — periksa manual juga.

## Kebijakan konten

- Konten mengikuti PRD (`docs/PRD-MIGRASI-WEBSITE.md`): jangan membuat klaim layanan/akreditasi/parameter tanpa verifikasi penanggung jawab.
- Jangan menyalin identitas, kontak, testimoni, atau aset situs referensi.
- Perbarui `updatedDate` hanya saat konten substansial berubah; jangan mengubah `pubDate` untuk membuat konten tampak baru.
- Data identitas (nama badan usaha, kontak, alamat, domain) saat ini masih placeholder menunggu konfirmasi — lihat `src/config/site.ts`.
- Hook `.githooks/pre-commit` → `scripts/update-content-dates.mjs` menuliskan `updatedDate` unik otomatis; jalankan `npm run hooks:install` sekali setelah clone.
