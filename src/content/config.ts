import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * App metadata — single source of truth for every app's landing page.
 * Stored as JSON files in src/content/apps/. The slug becomes the URL:
 *   src/content/apps/snusfri-resa.json -> /snusfri-resa/
 */
const apps = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    /** Search-intent title override. When set, used as the page title
     *  instead of just `name`. Use for keyword-rich SERP click-bait,
     *  e.g. "Födelsedagsapp för iPhone – glöm aldrig födelsedagar". */
    seoTitle: z.string().optional(),
    tagline: z.string(),
    description: z.string(),
    icon: z.string(), // path under /public, e.g. "/apps/snusfri-resa.png"
    accent: z.string(), // hex color used on landing/CTAs
    accentDark: z.string().optional(),
    appStoreUrl: z.string().url().optional(),
    playStoreUrl: z.string().url().optional(),
    bundleId: z.string(),
    category: z.string(),
    keywords: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    status: z.enum(['live', 'soon', 'beta']).default('live'),
    order: z.number().default(99),
  }),
});

/**
 * SEO articles — long-form content per app.
 *   src/content/articles/snusfri-resa/abstinens.mdx -> /snusfri-resa/abstinens/
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    app: z.string(), // matches an app slug
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    keywords: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    // Optional FAQ block — rendered + emitted as FAQPage JSON-LD.
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .optional(),
  }),
});

export const collections = { apps, articles };
