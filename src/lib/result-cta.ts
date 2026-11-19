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
  'Få påminnelse om födelsedagar – ladda ner Födelsedagar.';

/* Intent-matched pitches for the /fodelsedagar/ tools (GSC audit
   2026-11: the generic pitch above ignored what the visitor came for).
   Honest about pricing: free to download, Premium in-app. The app shows
   age and the western zodiac sign per person — NOT the Chinese one, so
   that page's pitch doesn't claim it. */
export const PITCH_STJARNTECKEN =
  'Appen visar stjärntecken och ålder för alla du känner – och påminner innan de fyller år. Gratis att ladda ner.';
export const PITCH_KINESISKT =
  'Samla hela familjens födelsedagar i appen – den visar hur gamla alla blir och påminner innan de fyller år. Gratis att ladda ner.';
export const PITCH_SAMMA_FODELSEDAG =
  'Samla födelsedagarna för alla du känner i appen – den påminner dig i god tid så att du hinner gratta. Gratis att ladda ner.';
