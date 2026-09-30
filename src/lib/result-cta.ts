/**
 * Client helpers for <ResultCta />. Import from a page's <script>:
 *
 *   import { showResultCta, hideResultCta } from '../lib/result-cta';
 *   showResultCta(`Du får ca ${kr(total)} i OB …`);
 *
 * Text is set with textContent (never innerHTML), so result strings
 * built from user input are safe.
 */
function box(id = 'default'): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-result-cta="${id}"]`);
}

export function showResultCta(text?: string, id?: string): void {
  const el = box(id);
  if (!el) return;
  if (text) {
    const t = el.querySelector('[data-result-cta-text]');
    if (t) t.textContent = text;
  }
  el.hidden = false;
}

export function hideResultCta(id?: string): void {
  const el = box(id);
  if (el) el.hidden = true;
}

/** "Din nästa födelsedag är om 43 dagar – en lördag." for a birth
 *  month (0-based) and day. Shared by the /fodelsedagar/ tools. */
export function nextBirthdaySentence(month: number, day: number): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(now.getFullYear(), month, day);
  if (next < today) next = new Date(now.getFullYear() + 1, month, day);
  const days = Math.round((next.getTime() - today.getTime()) / 86400000);
  if (days === 0) return 'Du fyller år idag – grattis!';
  const weekday = next.toLocaleDateString('sv-SE', { weekday: 'long' });
  return `Din nästa födelsedag är om ${days} ${days === 1 ? 'dag' : 'dagar'} – en ${weekday}.`;
}

export const FODELSEDAGAR_PITCH =
  'Glöm aldrig en födelsedag – Födelsedagar påminner dig i tid (gratis).';
