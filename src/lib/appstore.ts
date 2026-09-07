/**
 * Single source of truth for App Store attribution tagging.
 *
 * Why this exists: `withAttribution()` used to live inside
 * AppStoreBadge.astro, so ONLY the bottom-of-page badge got tagged.
 * The highest-position CTA on every article ([app]/[slug].astro's app
 * strip, directly under the H1) linked to `app.data.appStoreUrl` raw,
 * and 152 in-body `apps.apple.com` links in src/content/ were raw too.
 *
 * Net effect: App Store Connect → App Analytics → Sources → Web
 * Referrers was reporting the *worst-placed* CTA on each page and
 * nothing else. Every read of "which page converts" was drawn from
 * that one placement. This module fixes it in one place; the rehype
 * plugin in astro.config.mjs applies the same function to MDX bodies.
 */

/** Constant label for the whole web property. Apple groups installs by
 *  `pt`, so keeping it constant makes "web" visible as one channel.
 *  Max 40 chars per Apple. */
export const PROVIDER_TOKEN = 'alexbergqvist-com';

/** Where on the page the link sat. Prefixed onto `ct` so ASC reports
 *  position-level, not just page-level — with only ~345 clicks/90d
 *  there is no A/B test available, so knowing which existing placement
 *  already works is the only path to improvement. */
export type CtaPosition = 'hero' | 'inline' | 'body' | 'footer';

/** Sluggify a pathname into a campaign tag Apple accepts:
 *    /fodelsedagar/aldersrakna/ → fodelsedagar_aldersrakna
 *    /                          → home
 *  Apple's ct is at most 40 chars; truncate from the END so the
 *  most-specific segment survives. */
export function pathToCampaign(pathname: string): string {
  const cleaned = pathname.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9-]+/g, '_');
  if (!cleaned) return 'home';
  return cleaned.length > 40 ? cleaned.slice(-40) : cleaned;
}

/** Build a `ct` value with the position prefix, respecting Apple's
 *  40-char cap. The prefix is kept and the campaign is truncated,
 *  because knowing the position matters more than the last few
 *  characters of a long slug. */
export function campaignWithPosition(campaign: string, position?: CtaPosition): string {
  if (!position) return campaign.slice(0, 40);
  const prefix = `${position}_`;
  return (prefix + campaign).slice(0, 40);
}

export interface TagOptions {
  /** Overrides the pathname-derived campaign. */
  campaign?: string;
  /** Prefixed onto `ct`. Omit for an untagged position. */
  position?: CtaPosition;
}

/**
 * Add `pt`/`ct`/`mt` to an App Store URL. Non-App-Store URLs and
 * unparseable strings pass through untouched, and any param the caller
 * already set is left alone — so this is safe to apply blindly,
 * including over MDX bodies that may already carry hand-written tags.
 */
export function tagAppStoreUrl(
  rawUrl: string | undefined,
  pathname: string,
  opts: TagOptions = {},
): string | undefined {
  if (!rawUrl) return rawUrl;
  try {
    const u = new URL(rawUrl);
    if (!u.hostname.includes('apps.apple.com')) return rawUrl;
    if (!u.searchParams.has('pt')) u.searchParams.set('pt', PROVIDER_TOKEN);
    if (!u.searchParams.has('ct')) {
      const base = opts.campaign ?? pathToCampaign(pathname);
      u.searchParams.set('ct', campaignWithPosition(base, opts.position));
    }
    // Apple's legacy "this is an app" marker. Some attribution tools
    // still look for it; cheap to include.
    if (!u.searchParams.has('mt')) u.searchParams.set('mt', '8');
    return u.toString();
  } catch {
    return rawUrl;
  }
}
