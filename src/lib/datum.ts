/**
 * Calendar helpers shared by /namnsdag/ and /vecka/ — used both at build
 * time (fallback HTML) and in the small client scripts that swap in the
 * visitor's actual date. Everything is plain UTC arithmetic on a
 * {y, m, d} triple; "today" is always taken in Europe/Stockholm so a
 * visitor in another time zone still sees the Swedish date.
 */

export interface YMD {
  y: number;
  /** 1–12 */
  m: number;
  d: number;
}

export const MANADER = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
] as const;

/** Monday-first, Swedish. Index with isoWeekday(...) - 1. */
export const VECKODAGAR = [
  'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag',
] as const;

/** Today's date in Sweden, regardless of the visitor's own time zone. */
export function stockholmToday(now: Date = new Date()): YMD {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get('year'), m: get('month'), d: get('day') };
}

const DAY_MS = 86_400_000;

export function toUTC({ y, m, d }: YMD): number {
  return Date.UTC(y, m - 1, d);
}

export function fromUTC(ms: number): YMD {
  const dt = new Date(ms);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

export function addDays(date: YMD, n: number): YMD {
  return fromUTC(toUTC(date) + n * DAY_MS);
}

export function daysBetween(a: YMD, b: YMD): number {
  return Math.round((toUTC(b) - toUTC(a)) / DAY_MS);
}

/** 1 = Monday … 7 = Sunday */
export function isoWeekday(date: YMD): number {
  const wd = new Date(toUTC(date)).getUTCDay();
  return wd === 0 ? 7 : wd;
}

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/** 'MM-DD' key used by the name-day table. */
export function mdKey({ m, d }: { m: number; d: number }): string {
  return `${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** ISO 8601 week: weeks start on Monday, week 1 is the week that
 *  contains the year's first Thursday (equivalently: 4 January). The
 *  week-year can differ from the calendar year around New Year. */
export function isoWeek(date: YMD): { year: number; week: number } {
  const thursday = addDays(date, 4 - isoWeekday(date));
  const jan1 = { y: thursday.y, m: 1, d: 1 };
  return { year: thursday.y, week: Math.floor(daysBetween(jan1, thursday) / 7) + 1 };
}

/** Monday of ISO week 1 of the given week-year. */
export function isoWeek1Monday(year: number): YMD {
  const jan4 = { y: year, m: 1, d: 4 };
  return addDays(jan4, 1 - isoWeekday(jan4));
}

/** 52 or 53. A year has 53 ISO weeks when it starts on a Thursday, or
 *  is a leap year starting on a Wednesday. */
export function isoWeeksInYear(year: number): number {
  return isoWeek({ y: year, m: 12, d: 28 }).week;
}

/** "9 december" */
export function formatDayMonth({ m, d }: { m: number; d: number }): string {
  return `${d} ${MANADER[m - 1]}`;
}

/** "onsdag 9 december 2026" */
export function formatLong(date: YMD): string {
  return `${VECKODAGAR[isoWeekday(date) - 1]} ${date.d} ${MANADER[date.m - 1]} ${date.y}`;
}
