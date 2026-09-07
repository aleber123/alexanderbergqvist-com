/**
 * Resolve an article's og:image to a file that actually exists.
 *
 * The bug this fixes: [app]/[slug].astro built `/og/${app}-${slug}.png`
 * with no existence check. There are 43 files in public/og/ and 163
 * articles, so 130 articles advertised an og:image that 404s — every
 * translated article included, since their slugs differ from the
 * Swedish originals. Facebook, WhatsApp and iMessage all render that
 * as a broken grey box, on the exact links people share by hand.
 *
 * Resolution order: exact per-article image → per-app image → site
 * default. Most of the 130 land on a real branded per-app image
 * immediately, because those already exist for 9 of the apps.
 *
 * Reads the directory once at build time (SSG), so this costs one
 * readdir for the whole build and zero runtime bytes. If the directory
 * is unreachable — a route running server-side on Vercel, where
 * public/ is not deployed to the function — every lookup falls back to
 * the default rather than throwing.
 */
import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_OG = '/og/default.png';

let cache: Set<string> | null = null;

function ogFiles(): Set<string> {
  if (cache) return cache;
  try {
    const dir = path.join(process.cwd(), 'public', 'og');
    cache = new Set(fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)));
  } catch {
    cache = new Set();
  }
  return cache;
}

/**
 * @param app  Article's app id, e.g. `fodelsedagar`
 * @param slug Article slug (last segment of the content id)
 */
export function resolveOgImage(app: string, slug: string): string {
  const files = ogFiles();
  // No files means we could not read the directory — don't claim a
  // per-app image exists when we have no way to know.
  if (files.size === 0) return DEFAULT_OG;

  for (const candidate of [`${app}-${slug}.png`, `${app}.png`]) {
    if (files.has(candidate)) return `/og/${candidate}`;
  }
  return DEFAULT_OG;
}
