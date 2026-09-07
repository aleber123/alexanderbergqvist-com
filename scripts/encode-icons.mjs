/**
 * Re-encode public/apps/ to webp.
 *
 * public/apps/ was 2.2 MB to display twelve 48-pixel squares and one
 * illustration. surdeg.png alone was 117 KB rendered at 48px, and
 * fodelsedagar-mascot.png was 1.75 MB at 853x1101 — on the highest-
 * revenue app's page.
 *
 * sharp was already in node_modules and completely unused.
 *
 * Icons are referenced as plain string paths in src/content/apps/*.json,
 * so they cannot go through <Image> without a schema migration that
 * isn't worth it. Re-encoding in place, keeping the same basenames with
 * a .webp extension, gets the payload win with a one-line JSON rewrite.
 *
 * Run: node scripts/encode-icons.mjs
 */
import sharp from 'sharp';
import { readdir, stat, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIR = 'public/apps';
// 128 is 2x the largest rendered size (64px in the localized app cards).
const ICON_WIDTH = 128;
// The mascot renders large on /fodelsedagar/; keep real resolution.
const MASCOT_WIDTH = 900;

const files = (await readdir(DIR)).filter((f) => f.endsWith('.png'));
let before = 0;
let after = 0;

for (const file of files) {
  const src = path.join(DIR, file);
  const out = src.replace(/\.png$/, '.webp');
  const isMascot = file.includes('mascot');

  before += (await stat(src)).size;
  await sharp(src)
    .resize({ width: isMascot ? MASCOT_WIDTH : ICON_WIDTH, withoutEnlargement: true })
    .webp({ quality: isMascot ? 78 : 80 })
    .toFile(out);
  after += (await stat(out)).size;
  console.log(`${file} -> ${path.basename(out)}`);
}

// Point the content collection at the new files.
const APPS = 'src/content/apps';
for (const f of (await readdir(APPS)).filter((n) => n.endsWith('.json'))) {
  const p = path.join(APPS, f);
  const s = await readFile(p, 'utf8');
  const s2 = s.replace(/("icon":\s*"\/apps\/[^"]+)\.png"/g, '$1.webp"');
  if (s2 !== s) await writeFile(p, s2);
}

const kb = (n) => Math.round(n / 1024);
console.log(`\n${kb(before)} KB -> ${kb(after)} KB (${Math.round((1 - after / before) * 100)}% mindre)`);
