/**
 * Swedish number parsing/formatting for the /verktyg/ calculators.
 *
 * Inputs are `type="text" inputmode="decimal"` rather than
 * `type="number"`: number inputs reject "1 234,50" in most browsers
 * (value comes back as ""), which is exactly how Swedes type money.
 */

/** Parse "35 000", "35000,50", "35.000,50", "12 %", "180 kr" → number.
 *  Returns NaN for empty/garbage so callers can tell "0" from "nothing". */
export function parseSv(raw: string): number {
  let s = raw
    .trim()
    .replace(/[\s  ]/g, '')
    .replace(/kr|sek|%|:-/gi, '')
    .replace(/−/g, '-');
  if (!s) return NaN;
  if (s.includes(',') && s.includes('.')) {
    // "35.000,50" — dots are thousand separators.
    s = s.replace(/\./g, '').replace(',', '.');
  } else {
    s = s.replace(',', '.');
  }
  if (!/^-?\d*\.?\d+$|^-?\d+\.$/.test(s)) return NaN;
  return Number(s);
}

/** Non-negative value from an input, falling back to `fallback` when
 *  the field is empty or unparseable. */
export function readInput(el: HTMLInputElement, fallback = 0): number {
  const n = parseSv(el.value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Marks a field invalid (aria-invalid + visible text, never colour
 *  alone) when it holds something that isn't a number. */
export function flagInvalid(el: HTMLInputElement): boolean {
  const bad = el.value.trim() !== '' && !Number.isFinite(parseSv(el.value));
  el.setAttribute('aria-invalid', bad ? 'true' : 'false');
  const msg = document.getElementById(`${el.id}-fel`);
  if (msg) msg.hidden = !bad;
  return bad;
}

const krFmt = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
});
const krFmt2 = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const numFmt = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 2 });

/** "35 000 kr" */
export const kr = (n: number) => krFmt.format(Math.round(n));
/** "212,12 kr" — for per-hour amounts where öre matter. */
export const kr2 = (n: number) => krFmt2.format(n);
/** "12,5" */
export const num = (n: number) => numFmt.format(n);
