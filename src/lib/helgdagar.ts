/**
 * Swedish public holidays, klämdagar, "bridge" vacation tips and
 * paydays — all computed, no data files, so /verktyg/roda-dagar-<år>/
 * and /verktyg/lonedag-<år>/ work for any year.
 *
 * Sources for the rules:
 *   - Lag (1989:253) om allmänna helgdagar: nyårsdagen, trettondedag jul,
 *     långfredagen, påskdagen, annandag påsk, första maj, Kristi
 *     himmelsfärdsdag, pingstdagen, nationaldagen, midsommardagen (lördag
 *     20–26 juni), alla helgons dag (lördag 31 okt–6 nov), juldagen,
 *     annandag jul. (All Sundays are also helgdagar.)
 *   - Midsommarafton, julafton och nyårsafton are NOT allmänna helgdagar
 *     but are treated as holidays in most collective agreements and are
 *     not banking days in Sweden.
 *
 * Pure UTC arithmetic via ./datum — safe both at build time and in the
 * browser.
 */
import { addDays, isoWeekday, toUTC, type YMD } from './datum';

export type HelgdagTyp = 'helgdag' | 'afton';

export interface Helgdag {
  date: YMD;
  name: string;
  /** 'helgdag' = allmän helgdag by law; 'afton' = de facto day off. */
  typ: HelgdagTyp;
}

/** Easter Sunday, Gregorian calendar (anonymous Gregorian / Meeus–
 *  Jones–Butcher computus). */
export function easterSunday(y: number): YMD {
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { y, m: month, d: day };
}

/** First date on/after `from` with the given ISO weekday (1 = Mon). */
function firstWeekdayFrom(from: YMD, weekday: number): YMD {
  return addDays(from, (weekday - isoWeekday(from) + 7) % 7);
}

/** All Swedish holidays (allmänna helgdagar except ordinary Sundays)
 *  plus the three de facto helgdagsaftnar, sorted by date. */
export function helgdagar(y: number): Helgdag[] {
  const easter = easterSunday(y);
  const midsommardagen = firstWeekdayFrom({ y, m: 6, d: 20 }, 6);
  const allaHelgon = firstWeekdayFrom({ y, m: 10, d: 31 }, 6);
  const list: Helgdag[] = [
    { date: { y, m: 1, d: 1 }, name: 'Nyårsdagen', typ: 'helgdag' },
    { date: { y, m: 1, d: 6 }, name: 'Trettondedag jul', typ: 'helgdag' },
    { date: addDays(easter, -2), name: 'Långfredagen', typ: 'helgdag' },
    { date: easter, name: 'Påskdagen', typ: 'helgdag' },
    { date: addDays(easter, 1), name: 'Annandag påsk', typ: 'helgdag' },
    { date: { y, m: 5, d: 1 }, name: 'Första maj', typ: 'helgdag' },
    { date: addDays(easter, 39), name: 'Kristi himmelsfärdsdag', typ: 'helgdag' },
    { date: addDays(easter, 49), name: 'Pingstdagen', typ: 'helgdag' },
    { date: { y, m: 6, d: 6 }, name: 'Sveriges nationaldag', typ: 'helgdag' },
    { date: addDays(midsommardagen, -1), name: 'Midsommarafton', typ: 'afton' },
    { date: midsommardagen, name: 'Midsommardagen', typ: 'helgdag' },
    { date: allaHelgon, name: 'Alla helgons dag', typ: 'helgdag' },
    { date: { y, m: 12, d: 24 }, name: 'Julafton', typ: 'afton' },
    { date: { y, m: 12, d: 25 }, name: 'Juldagen', typ: 'helgdag' },
    { date: { y, m: 12, d: 26 }, name: 'Annandag jul', typ: 'helgdag' },
    { date: { y, m: 12, d: 31 }, name: 'Nyårsafton', typ: 'afton' },
  ];
  return list.sort((a, b) => toUTC(a.date) - toUTC(b.date));
}

const cache = new Map<number, Map<number, Helgdag>>();
function byDate(y: number): Map<number, Helgdag> {
  let m = cache.get(y);
  if (!m) {
    m = new Map(helgdagar(y).map((h) => [toUTC(h.date), h]));
    cache.set(y, m);
  }
  return m;
}

/** The holiday (or helgdagsafton) on this date, if any. */
export function helgdagPa(date: YMD): Helgdag | undefined {
  return byDate(date.y).get(toUTC(date));
}

/** Saturday or Sunday. */
export function arHelg(date: YMD): boolean {
  return isoWeekday(date) >= 6;
}

/** A normal Mon–Fri working day: not a weekend, not a holiday and not
 *  midsommar-/jul-/nyårsafton. Also the definition of a Swedish
 *  banking day. */
export function arArbetsdag(date: YMD): boolean {
  return !arHelg(date) && !helgdagPa(date);
}

/** Klämdagar: a single working day squeezed between two days off where
 *  at least one of them is a holiday (a weekday can't sit between two
 *  weekend days, so every hit involves a holiday or afton). */
export function klamdagar(y: number): { date: YMD; mellan: string }[] {
  const out: { date: YMD; mellan: string }[] = [];
  for (let d: YMD = { y, m: 1, d: 1 }; d.y === y; d = addDays(d, 1)) {
    if (!arArbetsdag(d)) continue;
    const prev = addDays(d, -1);
    const next = addDays(d, 1);
    if (arArbetsdag(prev) || arArbetsdag(next)) continue;
    const names = [helgdagPa(prev)?.name, helgdagPa(next)?.name].filter(Boolean) as string[];
    const mellan =
      helgdagPa(prev) && helgdagPa(next)
        ? `mellan ${names[0].toLowerCase()} och ${names[1].toLowerCase()}`
        : helgdagPa(prev)
          ? `efter ${names[0].toLowerCase()}, före helgen`
          : `mellan helgen och ${names[0].toLowerCase()}`;
    out.push({ date: d, mellan });
  }
  return out;
}

/** Number of working days (Mon–Fri excluding holidays and the three
 *  aftnar) per month, 1-indexed array of 12. */
export function arbetsdagarPerManad(y: number): number[] {
  const out = new Array(12).fill(0);
  for (let d: YMD = { y, m: 1, d: 1 }; d.y === y; d = addDays(d, 1)) {
    if (arArbetsdag(d)) out[d.m - 1]++;
  }
  return out;
}

export interface LedighetsTips {
  /** Holiday names the stretch contains, e.g. ['Långfredagen', …]. */
  helgdagar: string[];
  /** Vacation days to take (working days inside the stretch). */
  semesterdagar: YMD[];
  /** First and last day off in the stretch. */
  fran: YMD;
  till: YMD;
  /** Calendar days off in a row, weekends and holidays included. */
  lediga: number;
}

/**
 * "Ta X semesterdagar och få Y dagar ledigt": for each stretch of days
 * off containing a holiday, try bridging to neighbouring days off with at
 * most `maxSemester` vacation days. Per holiday group we keep the
 * option(s) with the best ratio and the longest stretch.
 *
 * Only stretches whose vacation days fall in year `y` are returned.
 */
export function ledighetsTips(y: number, maxSemester = 5): LedighetsTips[] {
  // Scan a window slightly wider than the year so New Year / Christmas
  // stretches that cross the year boundary are complete.
  const start: YMD = { y: y - 1, m: 12, d: 20 };
  const end: YMD = { y: y + 1, m: 1, d: 12 };
  type Block = { from: YMD; to: YMD; holidays: string[] };
  const blocks: Block[] = [];
  const workdaysBetween: number[] = []; // gap after block i
  let cur: Block | null = null;
  let gap = 0;
  for (let d = start; toUTC(d) <= toUTC(end); d = addDays(d, 1)) {
    if (arArbetsdag(d)) {
      if (cur) {
        blocks.push(cur);
        cur = null;
        gap = 0;
      }
      gap++;
    } else {
      if (!cur) {
        if (blocks.length > 0) workdaysBetween[blocks.length - 1] = gap;
        cur = { from: d, to: d, holidays: [] };
      }
      cur.to = d;
      const h = helgdagPa(d);
      if (h) cur.holidays.push(h.name);
    }
  }
  if (cur) blocks.push(cur);

  const candidates: LedighetsTips[] = [];
  for (let i = 0; i < blocks.length; i++) {
    let vac = 0;
    for (let j = i; j < blocks.length; j++) {
      if (j > i) vac += workdaysBetween[j - 1] ?? Infinity;
      if (vac > maxSemester) break;
      if (vac === 0) continue;
      const span = blocks.slice(i, j + 1);
      const holidays = span.flatMap((b) => b.holidays);
      if (holidays.length === 0) continue;
      const semesterdagar: YMD[] = [];
      for (let d = blocks[i].to; toUTC(d) < toUTC(blocks[j].from); d = addDays(d, 1)) {
        if (arArbetsdag(d)) semesterdagar.push(d);
      }
      if (semesterdagar.some((d) => d.y !== y)) continue;
      const lediga =
        Math.round((toUTC(blocks[j].to) - toUTC(blocks[i].from)) / 86_400_000) + 1;
      // An ordinary vacation week gives 9 days off for 5 (ratio 1.8).
      // Only keep stretches where the holiday actually adds something.
      if (lediga / semesterdagar.length <= 1.8) continue;
      candidates.push({ helgdagar: holidays, semesterdagar, fran: blocks[i].from, till: blocks[j].to, lediga });
    }
  }

  // Group by the first "main" holiday so e.g. all Easter options compete.
  const groupKey = (t: LedighetsTips) => t.helgdagar[0];
  const groups = new Map<string, LedighetsTips[]>();
  for (const c of candidates) {
    const k = groupKey(c);
    groups.set(k, [...(groups.get(k) ?? []), c]);
  }
  const picked: LedighetsTips[] = [];
  const seen = new Set<string>();
  const key = (t: LedighetsTips) => `${toUTC(t.fran)}-${toUTC(t.till)}`;
  for (const list of groups.values()) {
    const ratio = (t: LedighetsTips) => t.lediga / t.semesterdagar.length;
    const best = [...list].sort(
      (a, b) => ratio(b) - ratio(a) || b.lediga - a.lediga,
    )[0];
    const longest = [...list].sort(
      (a, b) => b.lediga - a.lediga || a.semesterdagar.length - b.semesterdagar.length,
    )[0];
    for (const t of [best, longest]) {
      if (!seen.has(key(t))) {
        seen.add(key(t));
        picked.push(t);
      }
    }
  }
  return picked.sort((a, b) => toUTC(a.semesterdagar[0]) - toUTC(b.semesterdagar[0]));
}

/** Payday for nominal day `dag` of month `m` (1–12): moved back to the
 *  closest preceding banking day if it falls on a weekend, a holiday or
 *  midsommar-/jul-/nyårsafton. Day 29–31 in a shorter month means the
 *  last day of that month. */
export function lonedag(y: number, m: number, dag = 25): YMD {
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  let d: YMD = { y, m, d: Math.min(dag, last) };
  while (!arArbetsdag(d)) d = addDays(d, -1);
  return d;
}
