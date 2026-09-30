/**
 * Which app does a page "belong to"?
 *
 * Used by BaseLayout to emit the Smart App Banner
 * (`<meta name="apple-itunes-app">`) and the sticky mobile CTA exactly
 * once per page, centrally, instead of every page remembering to pass
 * `appStoreId`. Before this, the recipes, several tools and /f/ had no
 * banner at all simply because nobody had wired the prop through.
 *
 * Rules, in order:
 *   /<lang>/<app>/...                → <app>   (lang prefix stripped)
 *   /<app>/...                       → <app>   (incl. /surdeg/recept/…)
 *   /verktyg/<calc>/                 → mapped below (OB, timlön,
 *                                      semesterersättning, röda dagar,
 *                                      lönedag, turnusschema → Tidrapportera;
 *                                      VAB → VAB-koll)
 *   /f/                              → fodelsedagar (share page)
 *   /namnsdag/**, /vecka/            → fodelsedagar
 *   everything else                  → none
 */

/** Every app slug with a landing page at /<slug>/. Kept in sync with
 *  src/content/apps/*.json (checked at runtime in BaseLayout: an
 *  unknown slug simply resolves to no app). */
export const APP_SLUGS = [
  'andas',
  'fodelsedagar',
  'plantera',
  'pomatic',
  'renovera',
  'rita',
  'snusfri-resa',
  'somnkoll',
  'stark',
  'surdeg',
  'tidrapport',
  'vab-koll',
] as const;

export const LANG_PREFIXES = new Set([
  'en', 'de', 'no', 'da', 'es', 'fr', 'fi', 'is', 'it', 'el', 'nl', 'pl', 'pt',
]);

/** /verktyg/<slug>/ → owning app. The hub /verktyg/ itself spans
 *  several apps and deliberately maps to none. */
const VERKTYG_APP: Record<string, string> = {
  'ob-tillagg': 'tidrapport',
  'timlon-efter-skatt': 'tidrapport',
  semesterersattning: 'tidrapport',
  'vab-ersattning': 'vab-koll',
  // Holidays → OB/storhelg pay, paydays and rotation schedules are all
  // Tidrapportera jobs.
  turnusschema: 'tidrapport',
};

/** Year-suffixed tool pages: /verktyg/roda-dagar-2026/, /verktyg/lonedag-2027/ … */
const VERKTYG_APP_PREFIX: [RegExp, string][] = [
  [/^roda-dagar-\d{4}$/, 'tidrapport'],
  [/^lonedag-\d{4}$/, 'tidrapport'],
];

const OTHER_APP: Record<string, string> = {
  f: 'fodelsedagar',
  // Name days + week number: Födelsedagar has name-day reminders and a
  // week-number widget, so these date pages funnel there.
  namnsdag: 'fodelsedagar',
  vecka: 'fodelsedagar',
};

export interface AppSection {
  /** App slug, e.g. 'tidrapport'. */
  app: string;
  /** Locale prefix of the page, or 'sv' for the root locale. */
  lang: string;
}

export function appSectionForPath(pathname: string): AppSection | null {
  const segs = pathname.split('/').filter(Boolean);
  let lang = 'sv';
  if (segs.length > 0 && LANG_PREFIXES.has(segs[0])) {
    lang = segs.shift()!;
  }
  const [first, second] = segs;
  if (!first) return null;
  if ((APP_SLUGS as readonly string[]).includes(first)) return { app: first, lang };
  if (first === 'verktyg' && second) {
    if (VERKTYG_APP[second]) return { app: VERKTYG_APP[second], lang };
    const hit = VERKTYG_APP_PREFIX.find(([re]) => re.test(second));
    if (hit) return { app: hit[1], lang };
  }
  if (OTHER_APP[first]) return { app: OTHER_APP[first], lang };
  return null;
}

/** Numeric App Store id from an apps.apple.com URL. */
export function appStoreIdFromUrl(url: string | undefined): string | undefined {
  return url?.match(/\/id(\d+)/)?.[1];
}
