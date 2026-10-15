/**
 * Sitemap helpers used by astro.config.mjs:
 *
 *  - lastmodFor(url): the date the page's CONTENT last changed — the
 *    article's frontmatter date or the last git commit that touched the
 *    page's source files, whichever is newer. Never the build time: a
 *    lastmod that changes on every deploy teaches Google to ignore it.
 *    If neither is known (e.g. a shallow clone), lastmod is omitted.
 *  - sectionOf(url): which per-section sitemap a URL belongs in, so
 *    Search Console reports indexing per section (apps / articles /
 *    namnsdag / tools / pages).
 *  - verifySitemap(): build-time guard (run after @astrojs/sitemap) that
 *    fails the build if a sitemap URL is missing, noindexed or has a
 *    canonical that points elsewhere.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(root, 'src');
const LANGS = new Set(['en', 'de', 'no', 'da', 'es', 'fr', 'fi', 'is', 'it', 'el', 'nl', 'pl', 'pt']);

/* ── git dates ─────────────────────────────────────────────────────── */
const gitCache = new Map();
function gitDate(files) {
  const rel = files.filter((f) => existsSync(f)).map((f) => relative(root, f));
  if (rel.length === 0) return undefined;
  const key = rel.sort().join('|');
  if (gitCache.has(key)) return gitCache.get(key);
  let d;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...rel], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    d = out ? new Date(out) : undefined;
  } catch {
    d = undefined;
  }
  gitCache.set(key, d);
  return d;
}

/* ── article frontmatter ───────────────────────────────────────────── */
function frontmatterDate(file) {
  const fm = readFileSync(file, 'utf8').split(/^---\s*$/m)[1] ?? '';
  const pick = (k) => fm.match(new RegExp(`^${k}:\\s*["']?([0-9]{4}-[0-9]{2}-[0-9]{2})`, 'm'))?.[1];
  const v = pick('updatedAt') ?? pick('publishedAt');
  return v ? new Date(`${v}T00:00:00Z`) : undefined;
}

/* ── route → source files ──────────────────────────────────────────── */
function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const pagesDir = join(SRC, 'pages');
const routes = walk(pagesDir)
  .filter((f) => /\.(astro|md|mdx)$/.test(f))
  .map((file) => {
    let r = relative(pagesDir, file).replace(/\.(astro|mdx?)$/, '').replace(/(^|\/)index$/, '');
    const dyn = (r.match(/\[/g) ?? []).length;
    const pattern = r
      .split('/')
      .filter(Boolean)
      .map((seg) => seg.replace(/[.*+?^${}()|\\]/g, '\\$&').replace(/\[[^\]]+\]/g, '[^/]+'))
      .join('/');
    const re = new RegExp(`^/${pattern}${pattern ? '/' : ''}$`);
    return { file, re, dyn };
  })
  .sort((a, b) => a.dyn - b.dyn);

/** Data files a templated route is built from (besides the template). */
const DATA_DEPS = [
  [/^\/namnsdag\//, ['src/data/namnsdagar.ts', 'src/data/namnsdag-populara.ts', 'src/lib/namnsdag.ts']],
  [/^\/surdeg\/recept\//, ['src/data/recipes.json']],
  [/^\/fodelsedagar\/grattis\//, ['src/data/grattis.ts']],
  [/^\/snusfri-resa\/sluta-snusa\//, ['src/data/slutasnusa.ts']],
  [/^\/verktyg\//, ['src/data/verktyg.ts']],
];

function sourcesFor(path) {
  const seg = path.split('/').filter(Boolean);
  const lang = LANGS.has(seg[0]) ? seg[0] : undefined;
  const rest = lang ? seg.slice(1) : seg;
  // Articles
  if (rest.length === 2) {
    const mdx = join(SRC, 'content/articles', rest[0], `${rest[1]}.mdx`);
    if (existsSync(mdx)) return { files: [mdx], article: mdx };
  }
  const files = [];
  // App landing pages
  if (rest.length === 1 && existsSync(join(SRC, 'content/apps', `${rest[0]}.json`))) {
    files.push(join(SRC, 'content/apps', `${rest[0]}.json`));
  }
  if (lang) files.push(join(SRC, 'i18n', `${lang}.json`));
  const route = routes.find((r) => r.re.test(path));
  if (route) files.push(route.file);
  for (const [re, deps] of DATA_DEPS) if (re.test(path)) files.push(...deps.map((d) => join(root, d)));
  return { files };
}

export function lastmodFor(url) {
  const path = new URL(url).pathname;
  const { files, article } = sourcesFor(path);
  const dates = [gitDate(files), article && frontmatterDate(article)].filter(Boolean);
  if (dates.length === 0) return undefined;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

/* ── sections ──────────────────────────────────────────────────────── */
const APP_IDS = new Set(readdirSync(join(SRC, 'content/apps')).map((f) => f.replace(/\.json$/, '')));
export function sectionOf(url) {
  const seg = new URL(url).pathname.split('/').filter(Boolean);
  const rest = LANGS.has(seg[0]) ? seg.slice(1) : seg;
  if (rest[0] === 'namnsdag') return 'namnsdag';
  if (rest.length === 2 && existsSync(join(SRC, 'content/articles', rest[0], `${rest[1]}.mdx`))) return 'articles';
  if (rest.length === 1 && APP_IDS.has(rest[0])) return 'apps';
  if (rest[0] === 'appar' && rest.length === 1) return 'apps';
  if (rest[0] === 'verktyg' || (rest.length >= 2 && APP_IDS.has(rest[0]))) return 'tools';
  return 'pages';
}

/* ── build-time verification ───────────────────────────────────────── */
export function verifySitemapIntegration() {
  return {
    name: 'verify-sitemap',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const xmls = readdirSync(out).filter((f) => /^sitemap-.*\.xml$/.test(f) && f !== 'sitemap-index.xml');
        const problems = [];
        let n = 0;
        for (const f of xmls) {
          for (const [, loc] of readFileSync(join(out, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
            n++;
            const p = new URL(loc).pathname;
            const html = join(out, p, 'index.html');
            if (!existsSync(html)) { problems.push(`missing: ${loc}`); continue; }
            const h = readFileSync(html, 'utf8');
            if (/<meta name="robots" content="noindex/.test(h)) problems.push(`noindex: ${loc}`);
            const canon = h.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
            if (canon !== loc) problems.push(`canonical ${canon} ≠ ${loc}`);
          }
        }
        if (problems.length) {
          throw new Error(`Sitemap contains ${problems.length} non-indexable URL(s):\n  ${problems.slice(0, 20).join('\n  ')}`);
        }
        logger.info(`sitemap verified: ${n} URLs in ${xmls.length} files, all 200 + indexable + self-canonical`);
      },
    },
  };
}
