/**
 * Pembangkit skema schema.org (JSON-LD) untuk Konsultan Lingker.
 *
 * Setiap builder mengembalikan satu node JSON-LD mentah (tanpa `@context`);
 * injeksi `@context` dilakukan sentral di `src/components/seo/JsonLd.astro`
 * (JSON-LD tanpa `@context` tidak valid dan diabaikan Google).
 *
 * Parameter `base` adalah origin absolut tanpa garis miring
 * (mis. "https://konsultanlingker.co.id"); di route ambil dari
 * `Astro.site?.href ?? Astro.url.origin`.
 *
 * Pemakaian di BaseLayout (setiap halaman):
 * - organizationSchema + webSiteSchema -> node sitewide (#organization, #website)
 * - webPageSchema                      -> WebPage halaman berjalan (...#webpage)
 * - breadcrumbSchema                   -> BreadcrumbList dari canonical
 *
 * Route menambahkan tipe utama halaman (Service) plus node pendukung
 * (FAQPage, ItemList, CollectionPage) lewat prop `jsonLd`. Node saling
 * terhubung lewat referensi @id: ...#webpage, ...#service, ...#faq,
 * ...#itemlist, #organization, #website.
 */
import { site } from '../config/site.ts';

const root = (base: string) => base.replace(/\/+$/, '');
const abs = (base: string, path: string) => new URL(path, root(base) + '/').href;
const iso = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z');

/** Organisasi/badan usaha — dirujuk provider Service dan publisher WebSite. */
export function organizationSchema(base: string) {
  const b = root(base);
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${b}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: `${b}/`,
    description: site.description,
    logo: abs(base, '/logo-konsultan-lingker.svg'),
    image: abs(base, '/images/og-default.webp'),
    email: site.email,
    telephone: site.phoneDisplay,
    about: site.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.province,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    // Recommended LocalBusiness fields to satisfy Google validator
    openingHours: 'Mo-Fr 08:00-17:00',
    priceRange: '$$',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    currenciesAccepted: 'IDR',
    areaServed: ['ID'],
  };
}

export const whatsappLink = (phone: string, text: string = '') => {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
};

/** WebSite — node sitewide, dirujuk setiap WebPage via isPartOf. */
export function webSiteSchema(base: string) {
  const b = root(base);
  return {
    '@type': 'WebSite',
    '@id': `${b}/#website`,
    url: `${b}/`,
    name: site.name,
    inLanguage: 'id-ID',
    publisher: { '@id': `${b}/#organization` },
  };
}

/**
 * Service — halaman `/layanan/<slug>/`. @id memakai sufiks `#service`
 * agar dirujuk WebPage.mainEntity. `serviceArea` frontmatter dipetakan
 * ke areaServed.
 */
export function serviceSchema(opts: {
  base: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  serviceType?: string;
  serviceArea?: string[];
}) {
  const b = root(opts.base);
  const url = `${b}/layanan/${opts.slug}/`;
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: opts.title,
    description: opts.description,
    url,
    ...(opts.image ? { image: [abs(opts.base, opts.image)] } : {}),
    serviceType: opts.serviceType ?? opts.title,
    provider: { '@id': `${b}/#organization` },
    ...(opts.serviceArea ? { areaServed: opts.serviceArea } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
  };
}

/**
 * WebPage — dirakit BaseLayout untuk SEMUA halaman (satu node per URL).
 * @id memakai sufiks `#webpage`; `mainEntity` dirujuk ke tipe utama
 * halaman bila diberikan.
 */
export function webPageSchema(opts: {
  base: string;
  url: string;
  title: string;
  description: string;
  datePublished?: Date;
  dateModified?: Date;
  mainEntityId?: string;
}) {
  const b = root(opts.base);
  return {
    '@type': 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.title,
    description: opts.description,
    inLanguage: 'id-ID',
    isPartOf: { '@id': `${b}/#website` },
    about: { '@id': `${b}/#organization` },
    ...(opts.datePublished ? { datePublished: iso(opts.datePublished) } : {}),
    ...(opts.dateModified ? { dateModified: iso(opts.dateModified) } : {}),
    ...(opts.mainEntityId ? { mainEntity: { '@id': opts.mainEntityId } } : {}),
  };
}

/** Ambil item blok `faq` pertama dari daftar blok konten (bila ada). */
export function faqFromBlocks(blocks: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(blocks)) return [];
  const faq = (
    blocks as { component?: string; items?: { question?: unknown; answer?: unknown }[] }[]
  ).find((block) => block?.component === 'faq');
  if (!Array.isArray(faq?.items)) return [];
  return faq.items
    .filter(
      (item): item is { question: string; answer: string } =>
        typeof item?.question === 'string' &&
        item.question.length > 0 &&
        typeof item?.answer === 'string' &&
        item.answer.length > 0,
    )
    .map((item) => ({ question: item.question, answer: item.answer }));
}

/** FAQPage — dari blok `faq` pada halaman layanan/faq/statik. */
export function faqPageSchema(opts: {
  base: string;
  path: string;
  items: { question: string; answer: string }[];
}) {
  const url = `${root(opts.base)}${opts.path}`;
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    inLanguage: 'id-ID',
    mainEntity: opts.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/**
 * CollectionPage — halaman indeks `/layanan/`, `/artikel/`, `/panduan/`.
 * ItemList dirakit terpisah lewat itemListSchema lalu dirujuk di sini
 * lewat mainEntity.
 */
export function collectionPageSchema(opts: {
  base: string;
  path: string;
  title: string;
  description: string;
  hasItems?: boolean;
}) {
  const url = `${root(opts.base)}${opts.path}`;
  return {
    '@type': 'CollectionPage',
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: 'id-ID',
    isPartOf: { '@id': `${root(opts.base)}/#website` },
    ...(opts.hasItems ? { mainEntity: { '@id': `${url}#itemlist` } } : {}),
  };
}

/** ItemList — daftar entri halaman indeks (node top-level). */
export function itemListSchema(opts: {
  base: string;
  path: string;
  name?: string;
  items: { name: string; url: string }[];
}) {
  const url = `${root(opts.base)}${opts.path}`;
  return {
    '@type': 'ItemList',
    '@id': `${url}#itemlist`,
    ...(opts.name ? { name: opts.name } : {}),
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * BreadcrumbList — dirakit BaseLayout dari canonical; butir terakhir
 * memakai judul halaman bila tersedia (Beranda > kategori > judul).
 */
export function breadcrumbSchema(opts: {
  base: string;
  pathname: string;
  title?: string;
  homeLabel: string;
  labels?: Record<string, string>;
}) {
  const b = root(opts.base);
  const segments = opts.pathname.split('/').filter(Boolean);
  const elements = segments.map((segment, i) => {
    const isLast = i === segments.length - 1;
    const fallback =
      opts.labels?.[segment] ??
      segment.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    return {
      '@type': 'ListItem',
      position: i + 2,
      name: isLast && opts.title ? opts.title : fallback,
      item: `${b}/${segments.slice(0, i + 1).join('/')}/`,
    };
  });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: opts.homeLabel, item: `${b}/` },
      ...elements,
    ],
  };
}
