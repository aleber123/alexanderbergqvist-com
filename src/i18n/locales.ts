/**
 * Single source of truth for which non-Swedish locales the site
 * supports. Swedish stays at the root (`/`, `/fodelsedagar/`, …) so
 * existing rankings don't break — every other locale is path-prefixed
 * (`/en/`, `/de/`, `/no/`, `/da/`, `/es/`).
 *
 * The list of "universal apps" is the subset that makes sense outside
 * Sweden. Country-specific utilities (VAB-koll, Tidrapportera,
 * Snusfri-resa, …) stay sv-only.
 */

import en from './en.json';
import de from './de.json';
import no from './no.json';
import da from './da.json';
import es from './es.json';

export type Locale = 'en' | 'de' | 'no' | 'da' | 'es';

export const LOCALES: readonly Locale[] = ['en', 'de', 'no', 'da', 'es'];

export const ALL_LOCALES_INCLUDING_SV: readonly (Locale | 'sv')[] = [
  'sv',
  ...LOCALES,
];

export const LOCALE_LABELS: Record<Locale | 'sv', string> = {
  sv: 'Svenska',
  en: 'English',
  de: 'Deutsch',
  no: 'Norsk',
  da: 'Dansk',
  es: 'Español',
};

export const LOCALE_FLAGS: Record<Locale | 'sv', string> = {
  sv: '🇸🇪',
  en: '🇬🇧',
  de: '🇩🇪',
  no: '🇳🇴',
  da: '🇩🇰',
  es: '🇪🇸',
};

/** OG / Schema.org BCP-47 codes per locale. */
export const LOCALE_BCP47: Record<Locale | 'sv', string> = {
  sv: 'sv-SE',
  en: 'en-US',
  de: 'de-DE',
  no: 'nb-NO',
  da: 'da-DK',
  es: 'es-ES',
};

/** Universal apps — the ones with i18n pages. Order = display order. */
export const UNIVERSAL_APPS: readonly string[] = [
  'fodelsedagar',
  'andas',
  'rita',
  'surdeg',
  'plantera',
];

export interface AppTranslation {
  name: string;
  tagline: string;
  description: string;
  features: string[];
}

export interface LocaleStrings {
  ui: {
    homeHero: string;
    homeSubhero: string;
    appsTitle: string;
    appsSubtitle: string;
    featuresTitle: string;
    downloadCta: string;
    backToHome: string;
    aboutAuthor: string;
    seeAllLanguages: string;
  };
  apps: Record<string, AppTranslation>;
}

const data: Record<Locale, LocaleStrings> = { en, de, no, da, es };

export function t(locale: Locale): LocaleStrings {
  return data[locale];
}
