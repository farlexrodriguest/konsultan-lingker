export const site = {
  // [DATA-SIMULASI] Seluruh nilai di bawah adalah data simulasi untuk pengecekan
  // tampilan sebelum go-live — BUKAN data resmi. Ganti dengan data terverifikasi
  // Konsultan Lingker (lihat docs/PRD-MIGRASI-WEBSITE.md Bagian 1 & 12).
  name: 'Konsultan Lingker',
  legalName: 'PT Lingkar Enviro Nusantara',
  tagline: 'Konsultansi lingkungan, laboratorium, dan pengujian lingkungan kerja',
  description: 'Konsultansi perizinan lingkungan, pengujian laboratorium lingkungan, dan riksa uji K3 lingkungan kerja untuk industri dan fasilitas Anda.',
  whatsapp: '6281170002000',
  whatsappDisplay: '0811-7000-2000',
  phone: '+622155501234',
  phoneDisplay: '(021) 5550-1234',
  email: 'halo@konsultanlingker.co.id',
  domain: 'https://konsultanlingker.co.id',
  address: {
    street: 'Jl. Kenanga Raya No. 88',
    village: 'Grogol Utara',
    city: 'Kebayoran Lama, Jakarta Selatan',
    province: 'DKI Jakarta',
    postalCode: '12210',
    country: 'Indonesia',
    // Kode negara ISO 3166-1 alpha-2 untuk JSON-LD (schema.org), bukan teks UI.
    countryCode: 'ID',
    full: 'Jl. Kenanga Raya No. 88, Grogol Utara, Kebayoran Lama, Jakarta Selatan, DKI Jakarta 12210',
  },
} as const;
