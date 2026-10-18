import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const utcDate = z.coerce.date();

const sharedIdentity = {
  id: z.number().int().positive(),
  ulid: z.string().regex(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/, 'ULID tidak valid'),
  title: z.string().min(1),
  description: z.string().min(1),
  draft: z.boolean().default(false),
  image: z.string().optional(),
  socialImage: z.string().optional(),
  contentType: z.string().optional(),
  serviceArea: z.array(z.string()).optional(),
};

const contentBlocks = z.discriminatedUnion('component', [
  z.object({
    component: z.literal('card'),
    id: z.string().min(1).optional(),
    heading: z.string().min(1),
    icon: z.string().optional(),
    class: z.record(z.string(), z.string()).optional(),
    body: z.array(z.discriminatedUnion('type', [
      z.object({ type: z.literal('p'), text: z.string().min(1), class: z.string().optional() }),
      z.object({ type: z.literal('list'), ordered: z.boolean().default(false), items: z.array(z.string().min(1)).min(1), class: z.string().optional(), itemClass: z.string().optional() }),
      z.object({ type: z.literal('image'), src: z.string().min(1), alt: z.string().min(1), caption: z.string().optional(), class: z.string().optional(), imgClass: z.string().optional(), captionClass: z.string().optional() }),
    ])).default([]),
  }),
  z.object({
    component: z.literal('faq'),
    id: z.string().min(1).optional(),
    heading: z.string().min(1),
    icon: z.string().optional(),
    class: z.record(z.string(), z.string()).optional(),
    items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(1),
  }),
  z.object({
    component: z.literal('cta'),
    id: z.string().min(1).optional(),
    heading: z.string().min(1).optional(),
    icon: z.string().optional(),
    message: z.string().min(1),
    button: z.string().min(1).optional(),
    class: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    component: z.literal('table'),
    id: z.string().min(1).optional(),
    heading: z.string().min(1).optional(),
    icon: z.string().optional(),
    head: z.array(z.string().min(1)).min(1),
    rows: z.array(z.array(z.string().min(1))).min(1),
    class: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    component: z.literal('note'),
    id: z.string().min(1).optional(),
    variant: z.enum(['info', 'success', 'warning', 'danger']).default('info'),
    title: z.string().min(1).optional(),
    text: z.string().min(1),
    icon: z.string().optional(),
    class: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    component: z.literal('steps'),
    id: z.string().min(1).optional(),
    heading: z.string().min(1),
    icon: z.string().optional(),
    items: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })).min(1),
    class: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    component: z.literal('stats'),
    id: z.string().min(1).optional(),
    heading: z.string().min(1).optional(),
    icon: z.string().optional(),
    items: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).min(1),
    class: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    component: z.literal('glossary'),
    id: z.string().min(1).optional(),
    heading: z.string().min(1),
    icon: z.string().optional(),
    items: z.array(z.object({ term: z.string().min(1), definition: z.string().min(1) })).min(1),
    class: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    component: z.literal('quote'),
    id: z.string().min(1).optional(),
    text: z.string().min(1),
    source: z.string().min(1).optional(),
    class: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    component: z.literal('section'),
    id: z.string().min(1).optional(),
    heading: z.string().min(1),
    content: z.array(z.discriminatedUnion('type', [
      z.object({ type: z.literal('p'), text: z.string().min(1) }),
      z.object({ type: z.literal('list'), ordered: z.boolean().default(false), items: z.array(z.string().min(1)).min(1) }),
    ])).default([]),
    class: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    component: z.literal('process-timeline'),
    id: z.string().min(1),
    title: z.string().min(1),
    steps: z.array(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    })).min(1),
  }),
  z.object({
    component: z.literal('checklist-card'),
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    items: z.array(z.object({
      label: z.string().min(1),
      detail: z.string().optional(),
      required: z.boolean().optional(),
    })).min(1),
    note: z.string().optional(),
  }),
  z.object({
    component: z.literal('comparison-table'),
    id: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().optional(),
    headers: z.array(z.string().min(1)).min(1),
    rows: z.array(z.array(z.string().min(1)).min(1)).min(1),
    note: z.string().optional(),
  }),
  z.object({
    component: z.literal('document-list'),
    id: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().optional(),
    items: z.array(z.object({
      name: z.string().min(1),
      purpose: z.string().optional(),
      mandatory: z.boolean().optional(),
    })).min(1),
  }),
  z.object({
    component: z.literal('image-panel'),
    id: z.string().min(1),
    src: z.string().min(1),
    alt: z.string().min(1),
    caption: z.string().optional(),
  }),
  z.object({
    component: z.literal('feature-card-grid'),
    id: z.string().min(1),
    title: z.string().min(1),
    columns: z.union([z.literal(2), z.literal(3)]).default(3),
    items: z.array(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      points: z.array(z.string().min(1)).optional(),
    })).min(1),
  }),
  z.object({
    component: z.literal('stats-grid'),
    id: z.string().min(1),
    items: z.array(z.object({
      value: z.string().min(1),
      label: z.string().min(1),
    })).min(1),
  }),
  z.object({
    component: z.literal('source-links'),
    id: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().optional(),
    items: z.array(z.object({
      label: z.string().min(1),
      url: z.url(),
      description: z.string().optional(),
    })).min(1),
  }),
  z.object({
    component: z.literal('page-header'),
    id: z.string().min(1).optional(),
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    intro: z.string().min(1),
    image: z.string().min(1),
    imageAlt: z.string().min(1),
  }),
  z.object({
    component: z.literal('home-hero'),
    id: z.string().min(1).optional(),
    eyebrow: z.string().min(1),
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    description: z.string().min(1),
    primaryCta: z.string().min(1),
    primaryHref: z.string().min(1),
    secondaryCta: z.string().min(1),
    secondaryHref: z.string().min(1),
    note: z.string().min(1),
    image: z.string().min(1),
    imageAlt: z.string().min(1),
    supportEyebrow: z.string().min(1),
    supportItems: z.array(z.object({ number: z.string().min(1), title: z.string().min(1), text: z.string().min(1) })).min(1),
  }),
  z.object({
    component: z.literal('service-list'),
    id: z.string().min(1).optional(),
    eyebrow: z.string().optional(),
    heading: z.string().optional(),
    description: z.string().optional(),
    variant: z.enum(['home', 'listing']).default('listing'),
    columns: z.union([z.literal(2), z.literal(3)]).default(3),
    showBenefits: z.boolean().default(false),
    category: z.string().optional(),
  }),
  z.object({
    component: z.literal('home-process'),
    id: z.string().min(1).default('proses'),
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    description: z.string().min(1),
    stepPrefix: z.string().min(1),
    steps: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })).min(1),
  }),
  z.object({
    component: z.literal('article-list'),
    id: z.string().min(1).optional(),
    heading: z.string().min(1),
    description: z.string().optional(),
    source: z.enum(['article', 'guide']).default('article'),
    mode: z.enum(['latest', 'listing']).default('listing'),
    limit: z.number().int().nonnegative().default(0),
    offset: z.number().int().nonnegative().default(0),
  }),
  z.object({
    component: z.literal('home-cta'),
    id: z.string().min(1).default('konsultasi'),
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    description: z.string().min(1),
    ctaLabel: z.string().min(1),
    ctaHref: z.string().min(1).default('/layanan/'),
  }),
  z.object({
    component: z.literal('not-found'),
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    message: z.string().min(1),
    image: z.string().min(1),
    homeCta: z.string().min(1),
    servicesCta: z.string().min(1),
    articlesCta: z.string().min(1),
  }),
  z.object({
    component: z.literal('contact-panel'),
    id: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().min(1),
    hoursTitle: z.string().min(1),
    hours: z.array(z.string().min(1)).min(1),
    formTitle: z.string().min(1),
    serviceOptions: z.array(z.string().min(1)).min(1),
  }),
]);

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    ...sharedIdentity,
    type: z.literal('article'),
    schemaType: z.enum(['Article', 'BlogPosting', 'TechArticle', 'NewsArticle']).default('BlogPosting'),
    slug: z.string().min(1),
    pubDate: utcDate,
    updatedDate: utcDate,
    author: z.union([
      z.string(),
      z.object({
        name: z.string().min(1),
        url: z.url().optional()
      })
    ]).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    relatedType: z.enum(['service', 'page', 'article', 'guide']).optional(),
    relatedId: z.number().int().positive().optional(),
    relatedArticles: z.array(z.number().int().positive()).default([]),
    blocks: z.array(contentBlocks).default([]),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    ...sharedIdentity,
    type: z.literal('guide'),
    schemaType: z.enum(['Article', 'BlogPosting', 'TechArticle', 'HowTo']).default('TechArticle'),
    slug: z.string().min(1),
    pubDate: utcDate,
    updatedDate: utcDate,
    author: z.union([
      z.string(),
      z.object({
        name: z.string().min(1),
        url: z.url().optional()
      })
    ]).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    relatedType: z.enum(['service', 'page', 'article', 'guide']).optional(),
    relatedId: z.number().int().positive().optional(),
    relatedArticles: z.array(z.number().int().positive()).default([]),
    blocks: z.array(contentBlocks).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    ...sharedIdentity,
    type: z.literal('page'),
    slug: z.string().min(1),
    pubDate: utcDate,
    updatedDate: utcDate,
    navLabel: z.string().optional(),
    seoTitle: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    canonical: z.string().optional(),
    noindex: z.boolean().default(false),
    blocks: z.array(contentBlocks).default([]),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    ...sharedIdentity,
    type: z.literal('service'),
    slug: z.string().min(1),
    pubDate: utcDate,
    updatedDate: utcDate,
    serviceCategory: z.enum(['perizinan', 'laboratorium', 'k3-lingkungan-kerja', 'spesialis']).default('laboratorium'),
    order: z.number().int().default(100),
    status: z.enum(['active', 'inactive']).default('active'),
    eyebrow: z.string().default('Layanan'),
    imageAlt: z.string().default('Ilustrasi layanan lingkungan'),
    blocks: z.array(contentBlocks).default([]),
  }),
});

export const collections = { articles, guides, pages, services };
