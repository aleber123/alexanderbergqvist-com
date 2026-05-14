import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://alexanderbergqvist.com';

export default defineConfig({
  site: SITE,
  // Path-based i18n: Swedish keeps the root (/, /fodelsedagar/, …) so
  // existing rankings don't break. New locales live under /en/, /de/,
  // /no/, /da/, /es/ and are limited to the universal apps + home.
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv', 'en', 'de', 'no', 'da', 'es', 'fr', 'fi', 'is'],
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
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
});
