/**
 * Chinese New Year (Gregorian date, China time) 1940–2030.
 *
 * Generated from ICU's Chinese calendar (Intl 'en-u-ca-chinese', month 1
 * day 1) and then corrected for the two years in range where ICU's
 * astronomical new moon lands within minutes of midnight Beijing time
 * and it picks the wrong day: 1954 (3 Feb, not 4) and 2027 (6 Feb, not
 * 7) — both per the official Chinese calendar. Keep this as a static
 * table so a Node/ICU upgrade can't silently shift a date.
 */
export const KINESISKT_NYAR: Record<number, string> = {
  1940: '02-08', 1941: '01-27', 1942: '02-15', 1943: '02-05', 1944: '01-25',
  1945: '02-13', 1946: '02-02', 1947: '01-22', 1948: '02-10', 1949: '01-29',
  1950: '02-17', 1951: '02-06', 1952: '01-27', 1953: '02-14', 1954: '02-03',
  1955: '01-24', 1956: '02-12', 1957: '01-31', 1958: '02-18', 1959: '02-08',
  1960: '01-28', 1961: '02-15', 1962: '02-05', 1963: '01-25', 1964: '02-13',
  1965: '02-02', 1966: '01-21', 1967: '02-09', 1968: '01-30', 1969: '02-17',
  1970: '02-06', 1971: '01-27', 1972: '02-15', 1973: '02-03', 1974: '01-23',
  1975: '02-11', 1976: '01-31', 1977: '02-18', 1978: '02-07', 1979: '01-28',
  1980: '02-16', 1981: '02-05', 1982: '01-25', 1983: '02-13', 1984: '02-02',
  1985: '02-20', 1986: '02-09', 1987: '01-29', 1988: '02-17', 1989: '02-06',
  1990: '01-27', 1991: '02-15', 1992: '02-04', 1993: '01-23', 1994: '02-10',
  1995: '01-31', 1996: '02-19', 1997: '02-07', 1998: '01-28', 1999: '02-16',
  2000: '02-05', 2001: '01-24', 2002: '02-12', 2003: '02-01', 2004: '01-22',
  2005: '02-09', 2006: '01-29', 2007: '02-18', 2008: '02-07', 2009: '01-26',
  2010: '02-14', 2011: '02-03', 2012: '01-23', 2013: '02-10', 2014: '01-31',
  2015: '02-19', 2016: '02-08', 2017: '01-28', 2018: '02-16', 2019: '02-05',
  2020: '01-25', 2021: '02-12', 2022: '02-01', 2023: '01-22', 2024: '02-10',
  2025: '01-29', 2026: '02-17', 2027: '02-06', 2028: '01-26', 2029: '02-13',
  2030: '02-03',
};

export interface ChineseAnimal {
  sv: string;
  /** Definite genitive, for "Hästens år". */
  gen: string;
  cn: string;
  emoji: string;
  /** The animal's fixed element in the traditional table. */
  element: string;
  traits: string;
}

/** Index 0 = Råttan; 2020 was a Rat year. */
export const ANIMALS: ChineseAnimal[] = [
  { sv: 'Råtta', gen: 'Råttans', cn: '鼠', emoji: '🐀', element: 'Vatten', traits: 'Smart, anpassningsbar, snabbtänkt' },
  { sv: 'Oxe', gen: 'Oxens', cn: '牛', emoji: '🐂', element: 'Jord', traits: 'Pålitlig, tålmodig, hårt arbetande' },
  { sv: 'Tiger', gen: 'Tigerns', cn: '虎', emoji: '🐅', element: 'Trä', traits: 'Modig, självsäker, karismatisk' },
  { sv: 'Kanin', gen: 'Kaninens', cn: '兔', emoji: '🐇', element: 'Trä', traits: 'Vänlig, elegant, försiktig' },
  { sv: 'Drake', gen: 'Drakens', cn: '龙', emoji: '🐉', element: 'Jord', traits: 'Energisk, beslutsam, lycklig' },
  { sv: 'Orm', gen: 'Ormens', cn: '蛇', emoji: '🐍', element: 'Eld', traits: 'Vis, mystisk, introspektiv' },
  { sv: 'Häst', gen: 'Hästens', cn: '马', emoji: '🐎', element: 'Eld', traits: 'Aktiv, fri, social' },
  { sv: 'Get', gen: 'Getens', cn: '羊', emoji: '🐐', element: 'Jord', traits: 'Kreativ, empatisk, fredsälskande' },
  { sv: 'Apa', gen: 'Apans', cn: '猴', emoji: '🐒', element: 'Metall', traits: 'Listig, lekfull, uppfinningsrik' },
  { sv: 'Tupp', gen: 'Tuppens', cn: '鸡', emoji: '🐓', element: 'Metall', traits: 'Observant, hårt arbetande, modig' },
  { sv: 'Hund', gen: 'Hundens', cn: '狗', emoji: '🐕', element: 'Jord', traits: 'Lojal, ärlig, ansvarsfull' },
  { sv: 'Gris', gen: 'Grisens', cn: '猪', emoji: '🐖', element: 'Vatten', traits: 'Generös, omsorgsfull, ärlig' },
];

export const animalForYear = (year: number) => ANIMALS[(((year - 2020) % 12) + 12) % 12];

/** The year's element follows the last digit: 0–1 Metall, 2–3 Vatten,
 *  4–5 Trä, 6–7 Eld, 8–9 Jord (2026 = Eld-Häst, 2024 = Trä-Drake). */
export const yearElement = (year: number) =>
  ['Metall', 'Metall', 'Vatten', 'Vatten', 'Trä', 'Trä', 'Eld', 'Eld', 'Jord', 'Jord'][year % 10];

const MONTHS = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
/** '02-17' → '17 februari'. */
export const svDate = (mmdd: string) => {
  const [m, d] = mmdd.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
};
