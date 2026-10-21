/**
 * Content model for the English "What to wear" weather guide
 * (/en/todays-outfit/what-to-wear/…).
 *
 * The temperature bands mirror the Today's Outfit app's own engine
 * (dressday repo, lib/engine/weather_bands.dart → TempBand / bandFor):
 * feels-like °C, rounded, upper bounds exclusive. The app splits the
 * coldest end into "arctic" (< −10) and "freezing" (−10 … −1); the guide
 * folds both into one "below freezing" page and covers the extreme end
 * in that page's copy, because a separate −10 page would be thin.
 */

export type BandKey = 'freezing' | 'cold' | 'chilly' | 'cool' | 'mild' | 'warm' | 'hot';

/** One outfit, slot by slot. Every slot is always filled with text —
 *  "None needed" is a real answer and is said in words, never implied
 *  by colour or an empty cell. */
export interface Formula {
  base: string;
  top: string;
  bottom: string;
  shoes: string;
  outer: string;
  accessories: string;
}

export interface QA {
  q: string;
  a: string;
}

export interface Situations {
  commute: string;
  office: string;
  evening: string;
}

export interface Fabric {
  name: string;
  why: string;
}

/** Fields every guide page shares. */
export interface GuidePage {
  /** Stable key, also the App Store `ct` suffix (keep short). */
  key: string;
  /** URL segment below /en/todays-outfit/what-to-wear/. */
  slug: string;
  /** <title> — keyword first, ≤ ~60 chars. */
  title: string;
  metaDescription: string;
  h1: string;
  /** Small all-caps line above the H1. */
  eyebrow: string;
  /** Featured-snippet style answer: 40–60 words, plain text. */
  answer: string;
  /** Short name for breadcrumbs and cross-links. */
  crumb: string;
  /** Image key in public/todays-outfit/guide/<image>.jpg */
  image: ImageKey;
  imageAlt: string;
  faq: QA[];
}

export type ImageKey =
  | 'freezing' | 'cold' | 'chilly' | 'cool' | 'mild' | 'warm' | 'hot' | 'rain'
  | 'hero-wide' | 'hero-wide-2';

export interface Band extends GuidePage {
  band: BandKey;
  /** Display name, e.g. "Cold". */
  name: string;
  /** Inclusive integer °C range as the app rounds it; null = open. */
  minC: number | null;
  maxC: number | null;
  /** Inclusive integer °F range that maps onto the same band. */
  minF: number | null;
  maxF: number | null;
  /** What Today's Outfit itself does in this band (from the engine). */
  appRule: string;
  intro: string[];
  formula: Formula;
  women: Formula;
  men: Formula;
  situations: Situations;
  fabrics: Fabric[];
  avoid: string[];
  tips: string[];
}

export interface Point extends GuidePage {
  band: BandKey;
  /** The temperature the page is about, in its primary unit. */
  value: number;
  unit: 'F' | 'C';
  /** A nearly identical temperature in the other unit that this page
   *  also answers (60 °F ≈ 15 °C), so there is one page per real
   *  temperature instead of two competing near-duplicates. */
  twin?: { value: number; unit: 'F' | 'C' };
  /** How the temperature actually feels over a day. */
  feel: string;
  formula: Formula;
  women: Formula;
  men: Formula;
  situations: Situations;
  tips: string[];
}

export interface TopicRow {
  label: string;
  outfit: string;
  note?: string;
}

/** Rain / wind / snow and the occasion pages. */
export interface Topic extends GuidePage {
  kind: 'weather' | 'occasion';
  intro: string[];
  /** Name of the per-temperature table. */
  tableTitle: string;
  rows: TopicRow[];
  formula: Formula;
  women: Formula;
  men: Formula;
  fabrics: Fabric[];
  avoid: string[];
  tips: string[];
  /** What the app does for this topic (verified against the code). */
  appRule: string;
}
