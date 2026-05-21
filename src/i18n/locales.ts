/**
 * Single source of truth for which non-Swedish locales the site
 * supports. Swedish stays at the root (`/`, `/fodelsedagar/`, …) so
 * existing rankings don't break — every other locale is path-prefixed
 * (`/en/`, `/de/`, `/no/`, `/da/`, `/es/`, …).
 *
 * The list of "universal apps" is the subset that makes sense outside
 * Sweden. Country-specific utilities (VAB-koll, Tidrapportera,
 * Snusfri-resa, …) stay sv-only.
 *
 * Crucially: not every universal app supports every locale. The
 * `APP_LOCALES` map below mirrors the ASC localizations exactly —
 * we only render /<lang>/<app>/ when the App Store listing for that
 * locale exists, otherwise the App Store CTA would deeplink users to
 * an English fallback (bad UX, broken trust).
 */

import en from './en.json';
import de from './de.json';
import no from './no.json';
import da from './da.json';
import es from './es.json';
import fr from './fr.json';
import fi from './fi.json';
import is from './is.json';
import it from './it.json';
import el from './el.json';
import nl from './nl.json';
import pl from './pl.json';
import pt from './pt.json';

export type Locale =
  | 'en' | 'de' | 'no' | 'da' | 'es'
  | 'fr' | 'fi' | 'is'
  | 'it' | 'el' | 'nl' | 'pl' | 'pt';

export const LOCALES: readonly Locale[] = [
  'en', 'de', 'no', 'da', 'es',
  'fr', 'fi', 'is',
  'it', 'el', 'nl', 'pl', 'pt',
];

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
  fr: 'Français',
  fi: 'Suomi',
  is: 'Íslenska',
  it: 'Italiano',
  el: 'Ελληνικά',
  nl: 'Nederlands',
  pl: 'Polski',
  pt: 'Português',
};

export const LOCALE_FLAGS: Record<Locale | 'sv', string> = {
  sv: '🇸🇪',
  en: '🇬🇧',
  de: '🇩🇪',
  no: '🇳🇴',
  da: '🇩🇰',
  es: '🇪🇸',
  fr: '🇫🇷',
  fi: '🇫🇮',
  is: '🇮🇸',
  it: '🇮🇹',
  el: '🇬🇷',
  nl: '🇳🇱',
  pl: '🇵🇱',
  pt: '🇵🇹',
};

/** OG / Schema.org BCP-47 codes per locale. */
export const LOCALE_BCP47: Record<Locale | 'sv', string> = {
  sv: 'sv-SE',
  en: 'en-US',
  de: 'de-DE',
  no: 'nb-NO',
  da: 'da-DK',
  es: 'es-ES',
  fr: 'fr-FR',
  fi: 'fi-FI',
  is: 'is-IS',
  it: 'it-IT',
  el: 'el-GR',
  nl: 'nl-NL',
  pl: 'pl-PL',
  pt: 'pt-PT',
};

/** Universal apps — the ones with i18n pages. Order = display order. */
export const UNIVERSAL_APPS: readonly string[] = [
  'fodelsedagar',
  'andas',
  'rita',
  'surdeg',
  'plantera',
];

/**
 * Per-app locale support, mirroring App Store Connect listings. The
 * site only renders /<lang>/<app>/ when the corresponding ASC listing
 * exists, so the "Download in App Store" CTA always lands on a page
 * in the same language as the website.
 *
 * If you add a new ASC locale for an app, append it here AND make sure
 * the locale's JSON file in this folder has an entry under `apps`.
 */
export const APP_LOCALES: Record<string, readonly (Locale | 'sv')[]> = {
  fodelsedagar: [
    'sv', 'en', 'de', 'no', 'da', 'es', 'fr', 'fi', 'is',
  ],
  andas: [
    'sv', 'en', 'de', 'no', 'da', 'es', 'fr', 'fi', 'is',
    'it', 'el', 'nl', 'pl', 'pt',
  ],
  plantera: [
    'sv', 'en', 'de', 'no', 'da', 'es', 'fr', 'fi', 'is',
    'it', 'el',
  ],
  surdeg: [
    'sv', 'en', 'de', 'no', 'da', 'fr', 'fi', 'is',
  ],
  rita: [
    'sv',
  ],
};

export function appSupportsLocale(
  appId: string,
  locale: Locale | 'sv',
): boolean {
  return APP_LOCALES[appId]?.includes(locale) ?? false;
}

/**
 * App Store country code per UI locale. Used to swap the `/se/` in
 * Apple's app URLs for the target storefront — so a `/de/fodelsedagar/`
 * visitor lands on the German App Store where the app's localized name
 * "Geburtstage Familie" is displayed instead of the Swedish "Födelsedagar".
 *
 * If a locale's country isn't in this map, the original URL is used.
 */
export const APP_STORE_COUNTRY: Record<Locale | 'sv', string> = {
  sv: 'se',
  en: 'us',
  de: 'de',
  no: 'no',
  da: 'dk',
  es: 'es',
  fr: 'fr',
  fi: 'fi',
  is: 'is',
  it: 'it',
  el: 'gr',
  nl: 'nl',
  pl: 'pl',
  pt: 'pt',
};

/**
 * Rewrite an Apple App Store URL to point to the locale's storefront.
 * Input shape: https://apps.apple.com/<cc>/app/<slug>/id<numeric_id>
 * Returns the same URL with <cc> swapped for the target country.
 */
export function localizeAppStoreUrl(
  url: string | undefined,
  locale: Locale | 'sv',
): string | undefined {
  if (!url) return url;
  const country = APP_STORE_COUNTRY[locale];
  if (!country) return url;
  return url.replace(/(apps\.apple\.com)\/[a-z]{2}\//, `$1/${country}/`);
}

export function appsForLocale(locale: Locale | 'sv'): string[] {
  return UNIVERSAL_APPS.filter((id) => appSupportsLocale(id, locale));
}

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
  /** Partial — some apps don't have a translation for every locale. */
  apps: Partial<Record<string, AppTranslation>>;
}

const data: Record<Locale, LocaleStrings> = {
  en, de, no, da, es, fr, fi, is,
  it, el, nl, pl, pt,
};

export function t(locale: Locale): LocaleStrings {
  return data[locale];
}
