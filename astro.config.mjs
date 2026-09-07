import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { rehypeAppStoreAttribution } from './src/lib/rehype-appstore-attribution';

const SITE = 'https://alexanderbergqvist.com';
// Build-cache bust 2026-06-26: force Astro to re-sync the content layer so
// newly added article pages are emitted on Vercel (cached store was serving
// stale getStaticPaths output — sitemap had the URL but the page 404'd).

export default defineConfig({
  site: SITE,
  // Hybrid: everything is static by default. Only routes marked
  // `export const prerender = false;` run server-side — currently just
  // the /admin/seo-reports admin + its API endpoint, which need
  // service-account auth to hit Search Console + GA4.
  output: 'static',
  adapter: vercel(),
  // Path-based i18n: Swedish keeps the root (/, /fodelsedagar/, …) so
  // existing rankings don't break. New locales live under /en/, /de/,
  // /no/, /da/, /es/ and are limited to the universal apps + home.
  i18n: {
    defaultLocale: 'sv',
    locales: [
      'sv', 'en', 'de', 'no', 'da', 'es', 'fr', 'fi', 'is',
      'it', 'el', 'nl', 'pl', 'pt',
    ],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      // Tell Google + Bing about all locales so localized pages get
      // crawled and linked together via hreflang.
      i18n: {
        defaultLocale: 'sv',
        locales: {
          sv: 'sv-SE',
          en: 'en-US',
          de: 'de-DE',
          no: 'nb-NO',
          da: 'da-DK',
          es: 'es-ES',
          fr: 'fr-FR',
          fi: 'fi-FI',
          is: 'is-IS',
          it: 'it-IT',
          el: 'el-GR',
          nl: 'nl-NL',
          pl: 'pl-PL',
          pt: 'pt-PT',
        },
      },
      changefreq: 'weekly',
      priority: 0.7,
      // Boost priority for landing + tools (most important pages to crawl).
      serialize: (item) => {
        if (item.url === SITE + '/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (
          item.url.includes('/kalkylator') ||
          item.url.includes('/rakna')
        ) {
          item.priority = 0.9;
        }
        return item;
      },
    }),
  ],
  // Tags the ~152 raw apps.apple.com links written inline in MDX bodies
  // with pt/ct, so ASC stops reporting only the bottom-of-page badge.
  markdown: { rehypePlugins: [rehypeAppStoreAttribution] },
  // NOTE on the display font: Astro 5.18's experimental.fonts only
  // accepts remote providers (its fontFamilySchema has no `variants`
  // key), so local woff2 files can't go through it yet. The faces are
  // therefore imported in BaseLayout.astro with `?url`, which makes Vite
  // hash them into /_astro/ — the only path Vercel serves `immutable`
  // (verified in .vercel/output/config.json; unhashed public/ assets get
  // max-age=0, must-revalidate). Same caching outcome, no experimental
  // flag, and no build-time fetch to gstatic that a cold Vercel cache
  // could fail on.
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
});
