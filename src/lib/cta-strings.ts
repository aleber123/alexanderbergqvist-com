/**
 * Short UI strings for the sticky mobile CTA and the desktop QR code.
 * App names and taglines come from src/i18n/<lang>.json (via `t()`);
 * these are only the few words around them. Unknown locales fall back
 * to English.
 */
export interface CtaStrings {
  /** Button label in the sticky bar. */
  getFree: string;
  /** Pitch line when no translated tagline exists. */
  freeOnAppStore: string;
  /** aria-label for the close (X) button. */
  close: string;
  /** Caption under the desktop QR code. */
  scanQr: string;
  /** Accessible name for the sticky bar region. */
  region: string;
}

const STRINGS: Record<string, CtaStrings> = {
  sv: { getFree: 'Hämta gratis', freeOnAppStore: 'Gratis på App Store', close: 'Stäng', scanQr: 'Skanna med iPhone-kameran', region: 'Hämta appen' },
  en: { getFree: 'Get it free', freeOnAppStore: 'Free on the App Store', close: 'Close', scanQr: 'Scan with your iPhone camera', region: 'Get the app' },
  de: { getFree: 'Gratis laden', freeOnAppStore: 'Kostenlos im App Store', close: 'Schließen', scanQr: 'Mit der iPhone-Kamera scannen', region: 'App laden' },
  no: { getFree: 'Last ned gratis', freeOnAppStore: 'Gratis i App Store', close: 'Lukk', scanQr: 'Skann med iPhone-kameraet', region: 'Last ned appen' },
  da: { getFree: 'Hent gratis', freeOnAppStore: 'Gratis i App Store', close: 'Luk', scanQr: 'Scan med iPhone-kameraet', region: 'Hent appen' },
  es: { getFree: 'Descargar gratis', freeOnAppStore: 'Gratis en la App Store', close: 'Cerrar', scanQr: 'Escanea con la cámara del iPhone', region: 'Descargar la app' },
  fr: { getFree: 'Télécharger', freeOnAppStore: "Gratuit sur l'App Store", close: 'Fermer', scanQr: "Scannez avec l'appareil photo de l'iPhone", region: "Télécharger l'app" },
  fi: { getFree: 'Lataa ilmaiseksi', freeOnAppStore: 'Ilmainen App Storessa', close: 'Sulje', scanQr: 'Skannaa iPhonen kameralla', region: 'Lataa sovellus' },
  is: { getFree: 'Sækja ókeypis', freeOnAppStore: 'Ókeypis í App Store', close: 'Loka', scanQr: 'Skannaðu með iPhone-myndavélinni', region: 'Sækja appið' },
  it: { getFree: 'Scarica gratis', freeOnAppStore: "Gratis sull'App Store", close: 'Chiudi', scanQr: "Inquadra con la fotocamera dell'iPhone", region: "Scarica l'app" },
  el: { getFree: 'Δωρεάν λήψη', freeOnAppStore: 'Δωρεάν στο App Store', close: 'Κλείσιμο', scanQr: 'Σαρώστε με την κάμερα του iPhone', region: 'Λήψη εφαρμογής' },
  nl: { getFree: 'Gratis downloaden', freeOnAppStore: 'Gratis in de App Store', close: 'Sluiten', scanQr: 'Scan met de iPhone-camera', region: 'Download de app' },
  pl: { getFree: 'Pobierz za darmo', freeOnAppStore: 'Za darmo w App Store', close: 'Zamknij', scanQr: 'Zeskanuj aparatem iPhone’a', region: 'Pobierz aplikację' },
  pt: { getFree: 'Obter grátis', freeOnAppStore: 'Grátis na App Store', close: 'Fechar', scanQr: 'Digitalize com a câmara do iPhone', region: 'Obter a app' },
};

export function ctaStrings(lang: string): CtaStrings {
  return STRINGS[lang] ?? STRINGS.en;
}
