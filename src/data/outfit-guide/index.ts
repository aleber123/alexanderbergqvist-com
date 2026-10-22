import type { Band, BandKey, Point, Topic } from './types';
import { BANDS, BAND_BY_KEY } from './bands';
import { POINTS } from './points';
import { TOPICS } from './topics';

export * from './types';
export { BANDS, BAND_BY_KEY, POINTS, TOPICS };

/** Guide root. English only for now — see the hreflang note in the
 *  page template: no alternates are claimed until real translations
 *  exist. */
export const GUIDE_BASE = '/en/todays-outfit/what-to-wear/';
export const APP_LANDING = '/en/todays-outfit/';

/** Country-neutral App Store link: Apple routes the visitor to their own
 *  storefront, which matters for a guide that targets US, UK, AU and EU
 *  searches at the same time. tagAppStoreUrl() adds pt/ct/mt. */
export const GUIDE_APP_STORE_URL = 'https://apps.apple.com/app/todays-outfit/id6818838930';
export const GUIDE_APP_ID = '6818838930';

/** App Store `ct` base for a guide page. Positions are prefixed by
 *  campaignWithPosition() (e.g. `hero_towtw_60f`), so keep this short:
 *  the longest position prefix is "sticky_" (7) → ≤ 33 chars here. */
export function guideCampaign(key: string): string {
  return `towtw_${key}`;
}

export const guideUrl = (slug?: string) => (slug ? `${GUIDE_BASE}${slug}/` : GUIDE_BASE);

export type AnyGuidePage =
  | { type: 'band'; page: Band }
  | { type: 'point'; page: Point }
  | { type: 'topic'; page: Topic };

export const ALL_PAGES: AnyGuidePage[] = [
  ...BANDS.map((page) => ({ type: 'band' as const, page })),
  ...POINTS.map((page) => ({ type: 'point' as const, page })),
  ...TOPICS.map((page) => ({ type: 'topic' as const, page })),
];

/** Same rule as the app's bandFor(): round, upper bounds exclusive. */
export function bandForC(c: number): BandKey {
  const t = Math.round(c);
  if (t < 0) return 'freezing';
  if (t < 6) return 'cold';
  if (t < 12) return 'chilly';
  if (t < 17) return 'cool';
  if (t < 22) return 'mild';
  if (t < 26) return 'warm';
  return 'hot';
}

export const fToC = (f: number) => ((f - 32) * 5) / 9;
export const cToF = (c: number) => (c * 9) / 5 + 32;

/** "12–16 °C · 53–61 °F" style labels. NBSP between number and unit. */
export function rangeC(b: Band): string {
  if (b.minC === null) return `Below 0 °C`;
  if (b.maxC === null) return `${b.minC} °C+`;
  return `${b.minC}–${b.maxC} °C`;
}
export function rangeF(b: Band): string {
  if (b.minF === null) return `Below 32 °F`;
  if (b.maxF === null) return `${b.minF} °F+`;
  return `${b.minF}–${b.maxF} °F`;
}

/** Points that belong to a band, coldest first. */
export function pointsInBand(band: BandKey): Point[] {
  return POINTS.filter((p) => p.band === band).sort((a, b) => cOf(a) - cOf(b));
}

/** Point temperature in °C (for sorting). */
export function cOf(p: Point): number {
  return p.unit === 'C' ? p.value : fToC(p.value);
}

/** All points coldest → hottest. */
export const POINTS_SORTED = [...POINTS].sort((a, b) => cOf(a) - cOf(b));

/** Non-breaking space between a number and its unit. */
export function nb(text: string): string {
  return text.replace(/(\d) (°[CF]|m\/s|km\/h|mph|mm)/g, '$1 $2');
}

export function bandOf(key: BandKey): Band {
  return BAND_BY_KEY[key];
}
