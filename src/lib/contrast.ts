/**
 * Pick a readable foreground for an arbitrary background colour.
 *
 * Why: the app strip's "Hämta" pill rendered `text-white` on the raw app
 * accent, which measured 2.0:1 for Snusfri (#2ECC71), 2.1:1 for VAB-koll
 * (#FF9800) and 3.0:1 for Plantera (#43A047) and Rita (#F06292). Four of
 * twelve apps shipped an unreadable primary CTA, in light mode, today.
 *
 * The pill itself now uses --ink so it no longer depends on the accent
 * at all. This helper is the belt-and-braces: anywhere an app accent
 * still has to carry text, it picks the side that actually passes,
 * so adding a thirteenth app with a pale accent cannot reintroduce it.
 *
 * Threshold 0.179 is the standard crossover for #000-vs-#fff; we use the
 * warm ink and warm paper instead so it matches the rest of the palette.
 */
const INK = '#17150F';
const PAPER = '#FFFCF8';

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of a `#rgb` or `#rrggbb` colour. */
export function luminance(hex: string): number {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6 || !/^[0-9a-f]{6}$/i.test(h)) return 0;
  const r = channel(parseInt(h.slice(0, 2), 16));
  const g = channel(parseInt(h.slice(2, 4), 16));
  const b = channel(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Readable text colour to sit on `bg`. */
export function onAccent(bg: string | undefined): string {
  if (!bg) return INK;
  return luminance(bg) > 0.179 ? INK : PAPER;
}
