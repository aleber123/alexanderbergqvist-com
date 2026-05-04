import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://alexanderbergqvist.com';

export default defineConfig({
  site: SITE,
  integrations: [
    mdx(),
    sitemap({
      // Tell Google + Bing about the Swedish locale + freshness.
      i18n: { defaultLocale: 'sv', locales: { sv: 'sv-SE' } },
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
