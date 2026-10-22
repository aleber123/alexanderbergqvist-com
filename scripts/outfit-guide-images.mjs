/**
 * Responsive WebP variants for the Today's Outfit weather guide.
 *
 *   node scripts/outfit-guide-images.mjs
 *
 * Reads the master JPEGs in public/todays-outfit/guide/ and writes
 * <name>-<width>.webp next to them. The site has no astro:assets
 * pipeline for public/ files, so the variants are generated once and
 * committed; src/components/outfit-guide/GuideImage.astro picks up
 * whatever variants exist at build time and falls back to the JPEG.
 * Re-run after replacing a photo.
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dir = fileURLToPath(new URL('../public/todays-outfit/guide/', import.meta.url));
const WIDTHS = { portrait: [480, 768, 1024], wide: [828, 1280, 1916] };

for (const f of readdirSync(dir).filter((f) => /^[a-z0-9-]+\.jpe?g$/.test(f))) {
  const name = f.replace(/\.jpe?g$/, '');
  const src = join(dir, f);
  const { width, height } = await sharp(src).metadata();
  const set = width > height ? WIDTHS.wide : WIDTHS.portrait;
  for (const w of set.filter((w) => w <= width)) {
    const out = join(dir, `${name}-${w}.webp`);
    await sharp(src).resize({ width: w }).webp({ quality: 74, effort: 6 }).toFile(out);
  }
  console.log(`${name}: ${width}x${height} → ${set.filter((w) => w <= width).join(', ')}`);
}
