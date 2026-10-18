import type { CollectionEntry } from 'astro:content';
export type RelatedType = 'service' | 'page' | 'article' | 'guide';
export function articlesForParent(
  articles: CollectionEntry<'articles'>[],
  type: RelatedType,
  id: number,
  limit = 3,
  excludeId?: number,
): CollectionEntry<'articles'>[] {
  return articles
    .filter((a) => !a.data.draft && a.data.contentType !== 'local-seo' && a.data.relatedType === type && a.data.relatedId === id && a.data.id !== excludeId)
    .sort((a, b) => (b.data.updatedDate ?? b.data.pubDate).valueOf() - (a.data.updatedDate ?? a.data.pubDate).valueOf())
    .slice(0, limit);
}
