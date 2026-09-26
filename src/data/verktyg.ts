/**
 * The /verktyg/ calculator hub. One list drives the hub page, the
 * "Fler räknare" block under every calculator, and the tool cards on
 * the Tidrapportera / VAB-koll landing pages — so a new calculator is
 * linked from everywhere by adding one entry here.
 */
export interface Verktyg {
  href: string;
  title: string;
  description: string;
  /** App slug the calculator funnels into (src/content/apps/<slug>.json). */
  app: string;
  /** Grouping on the hub page. */
  group: 'lon' | 'ovrigt';
}

export const VERKTYG: Verktyg[] = [
  {
    href: '/verktyg/ob-tillagg/',
    title: 'OB-tillägg räknare',
    description: 'Räkna OB för kväll, natt, helg och storhelg – i procent eller kr per timme.',
    app: 'tidrapport',
    group: 'lon',
  },
  {
    href: '/verktyg/timlon-efter-skatt/',
    title: 'Timlön efter skatt',
    description: 'Timlön × timmar, med semesterersättning och din kommunalskatt.',
    app: 'tidrapport',
    group: 'lon',
  },
  {
    href: '/verktyg/vab-ersattning/',
    title: 'VAB-ersättning 2026',
    description: 'Vad får du per vab-dag? Från månadslön till ersättning från Försäkringskassan.',
    app: 'vab-koll',
    group: 'lon',
  },
  {
    href: '/verktyg/semesterersattning/',
    title: 'Semesterersättning',
    description: '12 % enligt semesterlagen – eller högre om ditt avtal säger det.',
    app: 'tidrapport',
    group: 'lon',
  },
  {
    href: '/tidrapport/timlone-rakna/',
    title: 'Månadslön till timlön',
    description: 'Räkna om månadslön till timlön, dagslön och årslön.',
    app: 'tidrapport',
    group: 'lon',
  },
  {
    href: '/vab-koll/dagar-rakna/',
    title: 'Vab-dagar kvar',
    description: 'Hur många av de 120 vab-dagarna per barn har du kvar i år?',
    app: 'vab-koll',
    group: 'lon',
  },
  {
    href: '/snusfri-resa/kalkylator/',
    title: 'Snusfri-kalkylator',
    description: 'Räkna ut vad du sparar per dag, månad och år på att sluta snusa.',
    app: 'snusfri-resa',
    group: 'ovrigt',
  },
  {
    href: '/renovera/betongkalkylator/',
    title: 'Betongkalkylator',
    description: 'Hur mycket betong behöver du till plattan eller plintarna?',
    app: 'renovera',
    group: 'ovrigt',
  },
  {
    href: '/surdeg/hydration-rakna/',
    title: 'Hydration-räknare',
    description: 'Mjöl + vatten → exakt hydrering för ditt surdegsbröd.',
    app: 'surdeg',
    group: 'ovrigt',
  },
  {
    href: '/plantera/frostrisk-rakna/',
    title: 'Frostrisk-räknare',
    description: 'När är det säkert att plantera ut i din odlingszon?',
    app: 'plantera',
    group: 'ovrigt',
  },
  {
    href: '/fodelsedagar/aldersrakna/',
    title: 'Åldersräknare',
    description: 'Exakt ålder i år, månader, dagar och sekunder.',
    app: 'fodelsedagar',
    group: 'ovrigt',
  },
];

/** The four new money calculators, for cross-linking between them. */
export const LON_VERKTYG = VERKTYG.filter((v) => v.href.startsWith('/verktyg/'));
