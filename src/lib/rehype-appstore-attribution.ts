/**
 * Rehype plugin: stamp App Store attribution onto in-body MDX links.
 *
 * There are ~152 raw `apps.apple.com` links written directly in
 * src/content/**.mdx. They bypassed AppStoreBadge entirely, so every
 * one of them landed in App Store Connect as untagged traffic.
 *
 * Runs at build time over the hast tree — zero client bytes, works
 * with JS disabled, and applies automatically to every future article
 * without anyone remembering to tag by hand.
 *
 * `ct` is `body_<slug>`, so ASC separates prose links from the hero
 * strip (`hero_<slug>`) and the bottom badge (`footer_…`).
 */
import type { Root, Element } from 'hast';
import { tagAppStoreUrl } from './appstore';

/** Derive the article slug from the source file path.
 *  .../src/content/articles/sv/fodelsedagar/basta-appen.mdx
 *    → basta-appen */
function slugFromPath(path: string | undefined): string {
  if (!path) return 'unknown';
  const base = path.split(/[\\/]/).pop() ?? '';
  return base.replace(/\.(mdx?|markdown)$/i, '') || 'unknown';
}

function visit(node: Root | Element, fn: (el: Element) => void): void {
  for (const child of (node as Root).children ?? []) {
    if ((child as Element).type === 'element') {
      fn(child as Element);
      visit(child as Element, fn);
    }
  }
}

export function rehypeAppStoreAttribution() {
  return (tree: Root, file: { path?: string; history?: string[] }) => {
    const slug = slugFromPath(file.path ?? file.history?.[0]);
    const campaign = slug;

    visit(tree, (el) => {
      if (el.tagName !== 'a') return;
      const href = el.properties?.href;
      if (typeof href !== 'string' || !href.includes('apps.apple.com')) return;

      // tagAppStoreUrl leaves any param the author already set alone,
      // so a hand-tagged link in an old article keeps its own `ct`.
      const tagged = tagAppStoreUrl(href, `/${campaign}/`, {
        campaign,
        position: 'body',
      });
      if (tagged) el.properties!.href = tagged;
      el.properties!['data-cta-position'] = 'body';
    });
  };
}
