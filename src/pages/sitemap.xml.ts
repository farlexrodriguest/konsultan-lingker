import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL(import.meta.env.SITE_URL ?? 'http://konsultan-lingker.lan')).toString().replace(/\/$/, '');
  const [articles, guides, services, pages] = await Promise.all([
    getCollection('articles'),
    getCollection('guides'),
    getCollection('services'),
    getCollection('pages'),
  ]);
  const sitemapPages = ['home', 'tentang-kami', 'layanan', 'panduan', 'artikel', 'faq', 'hubungi-kami', 'legalitas-dan-akreditasi'];
  const urls = [
    ...pages.filter((page) => !page.data.draft && !page.data.noindex && sitemapPages.includes(page.data.slug)).map((page) => ({
      loc: page.data.canonical
        ? new URL(page.data.canonical, base).toString()
        : page.data.slug === 'home'
          ? `${base}/`
          : `${base}/${page.data.slug}/`,
      lastmod: page.data.updatedDate,
    })),
    ...articles.filter((item) => !item.data.draft).map((item) => ({
      loc: `${base}/artikel/${item.data.slug}/`,
      lastmod: item.data.updatedDate ?? item.data.pubDate,
    })),
    ...guides.filter((item) => !item.data.draft).map((item) => ({
      loc: `${base}/panduan/${item.data.slug}/`,
      lastmod: item.data.updatedDate ?? item.data.pubDate,
    })),
    ...services.filter((item) => !item.data.draft).map((item) => ({
      loc: `${base}/layanan/${item.data.slug}/`,
      lastmod: item.data.updatedDate ?? item.data.pubDate,
    })),
  ];
  const body = urls.map(({ loc, lastmod }) =>
    `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod.toISOString().replace(/\.\d{3}Z$/, 'Z')}</lastmod>` : ''}</url>`
  ).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
