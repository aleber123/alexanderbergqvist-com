/**
 * Swedish income tax on salary, income year 2026, for someone under 66
 * at the start of the year — the same model Skatteverket uses to build
 * the monthly skattetabeller (kolumn 1).
 *
 * Source: Skatteverket, "Teknisk beskrivning SKV 433, utgåva 36"
 * (2025-12-10) for inkomstår 2026 — sections 6 (grundavdrag), 7.2
 * (statlig skatt), 7.4/7.5.1 (allmän pensionsavgift + reduction),
 * 7.5.2 (jobbskatteavdrag), 7.5.4 (skattereduktion för förvärvsinkomst)
 * and 7.6 (public service-avgift).
 *
 * Checked against Skatteverket's published "Allmänna tabeller månad,
 * tabell 33, 2026", kolumn 1: 10 000–70 000 kr/mån all land within 1 kr.
 * Update every year when the new teknisk beskrivning is out.
 */

export const PBB = 59200; // prisbasbelopp 2026
export const IBB = 83400; // inkomstbasbelopp 2026
export const SKIKTGRANS = 643000; // statlig inkomstskatt 2026
export const BEGRAVNINGSAVGIFT = 0.00292; // 2026, all of Sweden except Stockholm & Tranås
const PUBLIC_SERVICE_MAX = 1184; // 1 % × 1,42 IBB

const floor100 = (n: number) => Math.floor(n / 100) * 100;

/** Grundavdrag (under 66), rounded up to whole hundreds, ≤ income. */
export function grundavdrag(ffi: number): number {
  let ga: number;
  if (ffi <= 0.99 * PBB) ga = 0.423 * PBB;
  else if (ffi <= 2.72 * PBB) ga = 0.423 * PBB + 0.2 * (ffi - 0.99 * PBB);
  else if (ffi <= 3.11 * PBB) ga = 0.77 * PBB;
  else if (ffi <= 7.88 * PBB) ga = 0.77 * PBB - 0.1 * (ffi - 3.11 * PBB);
  else ga = 0.293 * PBB;
  return Math.min(Math.ceil(ga / 100) * 100, Math.max(0, ffi));
}

/** Jobbskatteavdrag 2026 (under 66). `ki` = kommunal skattesats as a
 *  fraction, excluding begravnings- and kyrkoavgift. */
export function jobbskatteavdrag(arbetsinkomst: number, ga: number, ki: number): number {
  const ai = floor100(arbetsinkomst);
  let base: number;
  if (ai <= 0.91 * PBB) base = ai;
  else if (ai <= 3.24 * PBB) base = 0.91 * PBB + 0.3874 * (ai - 0.91 * PBB);
  else if (ai <= 8.08 * PBB) base = 1.813 * PBB + 0.251 * (ai - 3.24 * PBB);
  else base = 3.027 * PBB;
  return Math.max(0, Math.floor((base - ga) * ki));
}

export interface Skatt {
  ffi: number;
  grundavdrag: number;
  beskattningsbar: number;
  kommunal: number;
  avgifter: number; // begravning + kyrka
  statlig: number;
  jobbskatteavdrag: number;
  forvarvsreduktion: number;
  publicService: number;
  /** Total annual tax actually paid. */
  total: number;
}

/**
 * Annual tax on an annual salary.
 * @param kommunalskatt kommun + region, fraction (e.g. 0.32)
 * @param kyrkoavgift  fraction, 0 if not a member
 */
export function arsskatt(arsinkomst: number, kommunalskatt: number, kyrkoavgift = 0): Skatt {
  const ffi = floor100(Math.max(0, arsinkomst));
  const ga = grundavdrag(ffi);
  const bfi = Math.max(0, ffi - ga);
  const kommunal = Math.floor(bfi * kommunalskatt);
  const avgifter = Math.floor(bfi * (BEGRAVNINGSAVGIFT + kyrkoavgift));
  const statlig = bfi - SKIKTGRANS >= 200 ? Math.floor(0.2 * (bfi - SKIKTGRANS)) : 0;

  // Allmän pensionsavgift (7 %, capped at 8,07 IBB) is fully offset by
  // its own skattereduktion except at the very lowest incomes.
  const pa =
    ffi >= 0.423 * IBB ? Math.min(Math.round((0.07 * ffi) / 100) * 100, Math.round((0.07 * 8.07 * IBB) / 100) * 100) : 0;
  const paReduktion = Math.min(pa, kommunal + statlig);

  // Jobbskatteavdrag and förvärvsinkomst-reduktion only reduce kommunal skatt.
  const jsa = Math.min(jobbskatteavdrag(ffi, ga, kommunalskatt), kommunal);
  const fir = bfi <= 40000 ? 0 : bfi > 240000 ? 1500 : Math.floor((bfi - 40000) * 0.0075);
  const reduktion = Math.min(jsa + fir, Math.max(0, kommunal - paReduktion));
  const jsaUsed = Math.min(jsa, reduktion);
  const firUsed = reduktion - jsaUsed;
  const publicService = Math.min(Math.floor(bfi * 0.01), PUBLIC_SERVICE_MAX);

  const total = kommunal + avgifter + statlig + pa - paReduktion - reduktion + publicService;
  return {
    ffi,
    grundavdrag: ga,
    beskattningsbar: bfi,
    kommunal,
    avgifter,
    statlig,
    jobbskatteavdrag: jsaUsed,
    forvarvsreduktion: firUsed,
    publicService,
    total: Math.max(0, total),
  };
}
