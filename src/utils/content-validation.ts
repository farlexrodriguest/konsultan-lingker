import { getCollection, type CollectionEntry } from 'astro:content';

export async function validateContentRelations(): Promise<void> {
  const [articles, guides, pages, services] = await Promise.all([
    getCollection('articles'),
    getCollection('guides'),
    getCollection('pages'),
    getCollection('services'),
  ]);

  assertUnique(articles, 'article');
  assertUnique(guides, 'guide');
  assertUnique(pages, 'page');
  assertUnique(services, 'service');

  assertUniqueUlids([...articles, ...guides, ...pages, ...services]);

  const targets = { article: articles, guide: guides, page: pages, service: services };

  const checkedCollections: Array<CollectionEntry<'articles'> | CollectionEntry<'guides'>> = [
    ...articles,
    ...guides,
  ];

  for (const item of checkedCollections) {
    const label = item.collection.charAt(0).toUpperCase() + item.collection.slice(1);
    const blockIds = new Set<string>();

    for (const block of item.data.blocks) {
      if ('id' in block && block.id) {
        if (blockIds.has(block.id)) {
          throw new Error(`${label} "${item.data.slug}" has duplicate block ID "${block.id}".`);
        }
        blockIds.add(block.id);
      }

      if (
        block.component === 'table' &&
        block.rows.some((row) => row.length !== block.head.length)
      ) {
        throw new Error(
          `${label} "${item.data.slug}" table "${block.id ?? block.heading ?? 'unnamed'}" has rows that do not match its ${block.head.length} headers.`,
        );
      }

      if (
        block.component === 'comparison-table' &&
        block.rows.some((row) => row.length !== block.headers.length)
      ) {
        throw new Error(
          `${label} "${item.data.slug}" comparison table "${block.id}" has rows that do not match its ${block.headers.length} headers.`,
        );
      }
    }

    const { relatedType, relatedId, relatedArticles = [] } = item.data;
    if ((relatedType === undefined) !== (relatedId === undefined)) {
      throw new Error(`${label} "${item.data.slug}" must set both relatedType and relatedId, or neither.`);
    }
    if (relatedType && relatedId !== undefined) {
      const target = targets[relatedType].find((entry) => entry.data.id === relatedId && !entry.data.draft);
      if (!target) {
        throw new Error(`${label} "${item.data.slug}" references missing or draft ${relatedType} ID ${relatedId}.`);
      }
    }
    const relatedArticleIds = new Set<number>();
    for (const relatedIdValue of relatedArticles) {
      if (relatedArticleIds.has(relatedIdValue)) {
        throw new Error(`${label} "${item.data.slug}" lists related article ID ${relatedIdValue} more than once.`);
      }
      relatedArticleIds.add(relatedIdValue);

      const target = [...articles, ...guides].find((entry) => entry.data.id === relatedIdValue && !entry.data.draft);
      if (!target) {
        throw new Error(`${label} "${item.data.slug}" references missing, draft, or unpublished related article ID ${relatedIdValue}.`);
      }
      if (target.data.id === item.data.id) {
        throw new Error(`${label} "${item.data.slug}" cannot reference itself in relatedArticles.`);
      }
    }
  }
}

function assertUniqueUlids<T extends { data: { ulid: string; slug: string } }>(items: T[]): void {
  const seen = new Map<string, string>();
  for (const item of items) {
    const previous = seen.get(item.data.ulid);
    if (previous) {
      throw new Error(`Duplicate ULID "${item.data.ulid}" used by "${previous}" and "${item.data.slug}".`);
    }
    seen.set(item.data.ulid, item.data.slug);
  }
}

function assertUnique<T extends { data: { id: number; slug: string } }>(items: T[], type: string): void {
  const ids = new Set<number>();
  const slugs = new Set<string>();
  for (const item of items) {
    if (ids.has(item.data.id)) throw new Error(`Duplicate ${type} ID: ${item.data.id}.`);
    if (slugs.has(item.data.slug)) throw new Error(`Duplicate ${type} slug: "${item.data.slug}".`);
    ids.add(item.data.id);
    slugs.add(item.data.slug);
  }
}
