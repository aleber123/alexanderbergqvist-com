/**
 * Protein calculator (/en/protein-calculator/, /proteinkalkylator/,
 * /de/eiweiss-rechner/). Formulas, food values and references are copied
 * from the Top Up app (~/Downloads/protein: lib/core/calc.dart,
 * lib/data/foods.dart, lib/data/evidence.dart) so the web calculator and
 * the app give the same numbers. Change them there first.
 *
 *  - Protein: 1.6 g/kg/day standard, 2.2 g/kg/day "max" (Morton et al.
 *    2018: gains plateau at ~1.6, upper 95 % CI ~2.2).
 *  - Per meal: 0.4 g/kg over at least 4 meals; 0.55 g/kg × 4 reaches
 *    2.2 g/kg (Schoenfeld & Aragon 2018).
 *  - BMR: Mifflin–St Jeor; sex unspecified = midpoint (−78).
 *  - Activity factor from strength-training days: 0–1 → 1.2, 2–3 → 1.375,
 *    4–5 → 1.55, 6–7 → 1.725.
 *  - Goal: build muscle +10 %, lean bulk +5 %, maintain 0 (Iraki 2019).
 *    The app has no deficit goal, and none of its sources prescribes a
 *    deficit size, so for fat loss we show maintenance as the ceiling and
 *    raise protein to 2.2 g/kg rather than invent a number.
 */

export type PcLang = 'en' | 'sv' | 'de';

export const PC = {
  gStd: 1.6,
  gMax: 2.2,
  perMealStd: 0.4,
  perMealMax: 0.55,
  meals: 4,
  kgPerLb: 0.45359237,
  surplus: { build: 0.1, lean: 0.05 },
} as const;

export const PC_PATHS: Record<PcLang, string> = {
  en: '/en/protein-calculator/',
  sv: '/proteinkalkylator/',
  de: '/de/eiweiss-rechner/',
};

/** Hand-portion values from the app's foods.dart (typical values,
 *  Livsmedelsverket + USDA FoodData Central, rounded). */
export const PC_FOODS = {
  meat: 28, // palm ≈ 110 g cooked chicken / lean meat
  fish: 25, // palm ≈ 120 g cooked fish
  eggs: 13, // 2 eggs
  dairy: 13, // cupped hand ≈ 150 g quark / Greek yogurt / skyr / cottage cheese
  legumes: 13, // cupped hand ≈ 150 g cooked lentils / beans or ~120 g tofu
  shake: 24, // 1 scoop (30 g) whey in water
} as const;
export type PcFood = keyof typeof PC_FOODS;

export interface PcRef {
  authors: string;
  year?: number;
  title: string;
  journal: string;
  doi?: string;
  url?: string;
}

/** Same list and wording as the app's Evidence screen (not translated). */
export const PC_REFS: PcRef[] = [
  {
    authors:
      'Morton RW, Murphy KT, McKellar SR, Schoenfeld BJ, Henselmans M, Helms E, Aragon AA, Devries MC, Banfield L, Krieger JW, Phillips SM',
    year: 2018,
    title:
      'A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults',
    journal: 'British Journal of Sports Medicine 52(6):376–384',
    doi: '10.1136/bjsports-2017-097608',
  },
  {
    authors: 'Schoenfeld BJ, Aragon AA',
    year: 2018,
    title:
      'How much protein can the body use in a single meal for muscle-building? Implications for daily protein distribution',
    journal: 'Journal of the International Society of Sports Nutrition 15:10',
    doi: '10.1186/s12970-018-0215-1',
  },
  {
    authors:
      'Jäger R, Kerksick CM, Campbell BI, Cribb PJ, Wells SD, Skwiat TM, Purpura M, Ziegenfuss TN, Ferrando AA, Arent SM, Smith-Ryan AE, Stout JR, Arciero PJ, Ormsbee MJ, Taylor LW, Wilborn CD, Kalman DS, Kreider RB, Willoughby DS, Hoffman JR, Krzykowski JL, Antonio J',
    year: 2017,
    title: 'International Society of Sports Nutrition Position Stand: protein and exercise',
    journal: 'Journal of the International Society of Sports Nutrition 14:20',
    doi: '10.1186/s12970-017-0177-8',
  },
  {
    authors: 'Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO',
    year: 1990,
    title: 'A new predictive equation for resting energy expenditure in healthy individuals',
    journal: 'American Journal of Clinical Nutrition 51(2):241–247',
    doi: '10.1093/ajcn/51.2.241',
  },
  {
    authors: 'Frankenfield D, Roth-Yousey L, Compher C',
    year: 2005,
    title:
      'Comparison of predictive equations for resting metabolic rate in healthy nonobese and obese adults: a systematic review',
    journal: 'Journal of the American Dietetic Association 105(5):775–789',
    doi: '10.1016/j.jada.2005.02.005',
  },
  {
    authors: 'Iraki J, Fitschen P, Espinar S, Helms E',
    year: 2019,
    title: 'Nutrition recommendations for bodybuilders in the off-season: a narrative review',
    journal: 'Sports 7(7):154',
    doi: '10.3390/sports7070154',
  },
  {
    authors: 'Livsmedelsverket (Swedish Food Agency)',
    title: 'Livsmedelsdatabasen — food composition database',
    journal: 'livsmedelsverket.se/livsmedelsdatabasen',
    url: 'https://soknaringsinnehall.livsmedelsverket.se/',
  },
  {
    authors: 'U.S. Department of Agriculture, Agricultural Research Service',
    title: 'FoodData Central',
    journal: 'fdc.nal.usda.gov',
    url: 'https://fdc.nal.usda.gov/',
  },
];

/** Rows of the quick-answer table (anchors #kg-70 etc.). */
export const PC_KG_ROWS = Array.from({ length: 15 }, (_, i) => 50 + i * 5); // 50–120 kg
export const PC_LB_ROWS = Array.from({ length: 15 }, (_, i) => 120 + i * 10); // 120–260 lb
export const PC_POPULAR_KG = [60, 70, 80, 90, 100];
export const PC_POPULAR_LB = [150, 160, 180, 200];

export const grams = (kg: number, gPerKg: number) => Math.round(kg * gPerKg);

/* ── localized copy ──────────────────────────────────────────────── */

export interface PcFaq {
  q: string;
  a: string;
}
export interface PcSection {
  id: string;
  h2: string;
  html: string;
}

export interface PcCopy {
  lang: PcLang;
  htmlLang: string;
  numberLocale: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  answerHtml: string;
  crumbs: { name: string; url?: string }[];
  crumbLabel: string;
  appName: string;
  /** Client-side strings (serialized into the page as JSON). */
  ui: {
    weight: string;
    kg: string;
    lb: string;
    goal: string;
    goals: { build: string; maintain: string; cut: string };
    level: string;
    levelStd: string;
    levelMax: string;
    perDay: string;
    range: string;
    perMeal: string;
    perMealMax: string;
    example: string;
    invalid: string;
    calTitle: string;
    calIntro: string;
    days: string;
    daysOpt: string[];
    sex: string;
    sexM: string;
    sexF: string;
    sexX: string;
    age: string;
    height: string;
    cm: string;
    ft: string;
    inch: string;
    calNeedMore: string;
    calInvalid: string;
    bmr: string;
    maintenance: string;
    targetBuild: string;
    targetMaintain: string;
    targetCut: string;
    kcal: string;
    ctaDefault: string;
    ctaResult: string;
    foodTitle: string;
    foodIntro: string;
    mealNames: [string, string, string, string];
    foodNames: Record<PcFood, string>;
    /** [one, other] — {n} is the count (½, 1, 1½ …), {e} the number of eggs. */
    portions: Record<PcFood, [string, string]>;
    total: string;
  };
  ctaFree: string;
  ctaIphoneOnly: string;
  ctaAside: string;
  onPage: string;
  toc: { href: string; label: string }[];
  tableTitle: string;
  tableIntro: string;
  tablePopular: string;
  th: { weight: string; std: string; max: string; meal: string };
  lbTableTitle?: string;
  portionTitle: string;
  portionIntro: string;
  portionTh: { food: string; portion: string; protein: string };
  sections: PcSection[];
  sourcesTitle: string;
  sourcesIntro: string;
  disclaimerTitle: string;
  disclaimer: string;
  faqTitle: string;
  faq: PcFaq[];
  relatedTitle: string;
  related: { href: string; title: string; text: string }[];
  updated: string;
  webAppName: string;
  currency: string;
}

const lb = (kg: number) => Math.round(kg / PC.kgPerLb);

export const PC_COPY: Record<PcLang, PcCopy> = {
  en: {
    lang: 'en',
    htmlLang: 'en-US',
    numberLocale: 'en-US',
    title: 'How Much Protein Do I Need? Protein Calculator',
    description:
      'Protein calculator for muscle gain: about 1.6 g per kg (0.7 g per lb) a day, up to 2.2 g/kg. Get your daily and per-meal target, calories and what it looks like in food.',
    keywords: [
      'how much protein do i need',
      'protein calculator',
      'protein calculator for muscle gain',
      'how much protein per day to build muscle',
      'protein per kg',
      'grams of protein per pound',
      'how much protein per meal',
    ],
    h1: 'How much protein do I need? Protein calculator for muscle gain',
    answerHtml: `If you lift weights, aim for <strong>about 1.6 g of protein per kg of body weight a day (0.7 g per lb)</strong> – ${grams(80, 1.6)} g for an 80 kg (${lb(80)} lb) person. In a meta-analysis of 49 trials, extra muscle gains levelled off around 1.6 g/kg; up to 2.2 g/kg (1 g per lb) covers those who respond best. Spread it over at least 4 meals.`,
    crumbs: [
      { name: 'Home', url: '/en/' },
      { name: 'Top Up', url: '/top-up/' },
      { name: 'Protein calculator' },
    ],
    crumbLabel: 'Breadcrumb',
    appName: 'Top Up: Protein Coach',
    ui: {
      weight: 'Body weight',
      kg: 'kg',
      lb: 'lb',
      goal: 'Goal',
      goals: { build: 'Build muscle', maintain: 'Maintain', cut: 'Lose fat, keep muscle' },
      level: 'Protein level',
      levelStd: 'Standard · 1.6 g/kg',
      levelMax: 'Max · 2.2 g/kg',
      perDay: 'g protein a day',
      range: 'Evidence range 1.6–2.2 g/kg: {lo}–{hi} g a day',
      perMeal: '≈ {g} g per meal × 4 meals (0.4 g/kg per meal)',
      perMealMax: '≈ {g} g per meal × 4 meals (0.55 g/kg per meal)',
      example: 'Example for {w}:',
      invalid: 'Enter a body weight between 30 and 300 kg (66–660 lb).',
      calTitle: 'Calories (optional)',
      calIntro: 'Add training days, age and height to get your calorie target too – same formula as the Top Up app.',
      days: 'Strength training',
      daysOpt: ['0 days a week', '1 day a week', '2 days a week', '3 days a week', '4 days a week', '5 days a week', '6 days a week', '7 days a week'],
      sex: 'Sex',
      sexM: 'Male',
      sexF: 'Female',
      sexX: 'Prefer not to say',
      age: 'Age',
      height: 'Height',
      cm: 'cm',
      ft: 'ft',
      inch: 'in',
      calNeedMore: 'Fill in age and height to see your calories.',
      calInvalid: 'Check age (18–100) and height (120–230 cm / 4–7 ft).',
      bmr: 'Resting energy (Mifflin–St Jeor)',
      maintenance: 'Maintenance calories',
      targetBuild: 'Build muscle (+10 %): {k} kcal a day · slower lean bulk (+5 %): {l} kcal',
      targetMaintain: 'Maintain: {k} kcal a day',
      targetCut: 'To lose fat, eat below {k} kcal a day. Neither this calculator nor the Top Up app sets a deficit size for you – keep protein at the upper end while you cut.',
      kcal: 'kcal',
      ctaDefault:
        'Hit it every day without weighing food – Top Up reminds you at meals and tells you in the evening what to top up with.',
      ctaResult:
        'Your target is {g} g a day. Hit it every day without weighing food – Top Up reminds you at meals and tells you in the evening what to top up with.',
      foodTitle: 'What {g} g looks like in food',
      foodIntro: 'One example day with hand portions – the same method Top Up uses to log a meal in three taps, no scale:',
      mealNames: ['Breakfast', 'Lunch', 'Snack', 'Dinner'],
      foodNames: {
        meat: 'chicken',
        fish: 'fish',
        eggs: 'eggs',
        dairy: 'quark or Greek yogurt',
        legumes: 'lentils or beans',
        shake: 'protein shake',
      },
      portions: {
        meat: ['{n} palm', '{n} palms'],
        fish: ['{n} palm', '{n} palms'],
        eggs: ['{e} egg', '{e} eggs'],
        dairy: ['{n} cupped hand', '{n} cupped hands'],
        legumes: ['{n} cupped hand', '{n} cupped hands'],
        shake: ['{n} scoop', '{n} scoops'],
      },
      total: 'Total ≈ {g} g protein',
    },
    ctaFree: 'Free · iPhone',
    ctaIphoneOnly: 'Top Up is available for iPhone only for now.',
    ctaAside: 'Free to log and track; Premium adds Apple Health and full history.',
    onPage: 'On this page:',
    toc: [
      { href: '#by-weight', label: 'Protein by body weight' },
      { href: '#portions', label: 'Hand portions' },
      { href: '#how', label: 'How it is calculated' },
      { href: '#sources', label: 'Sources' },
      { href: '#faq', label: 'FAQ' },
    ],
    tableTitle: 'How much protein per day for 60, 70, 80 or 90 kg?',
    tableIntro:
      'Daily protein at 1.6 g/kg (standard) and 2.2 g/kg (upper end of the evidence), plus the per-meal amount at 0.4 g/kg over 4 meals.',
    tablePopular: 'Jump to:',
    th: { weight: 'Body weight', std: '1.6 g/kg', max: '2.2 g/kg', meal: 'Per meal' },
    lbTableTitle: 'Protein per day in pounds: 150, 180 or 200 lb',
    portionTitle: 'Protein in a hand portion',
    portionIntro:
      'No food scale needed: your hand is roughly in proportion to your body. These are the typical values Top Up uses (Swedish Food Agency and USDA FoodData Central, rounded). Hand sizes vary, so treat them as estimates.',
    portionTh: { food: 'Food', portion: 'Portion', protein: 'Protein' },
    sections: [
      {
        id: 'how',
        h2: 'How the calculator works',
        html: `<p><strong>Protein.</strong> Your weight in kg × 1.6 g. A meta-analysis of 49 randomised trials with 1,863 participants (Morton et al., 2018) found that extra protein increases muscle gains from strength training, but the benefit levels off at about 1.6 g per kg of body weight per day. Because people differ, the upper end of the statistical range was about 2.2 g/kg – that is the “Max” level. In pounds: 1.6 g/kg ≈ 0.73 g per lb, 2.2 g/kg ≈ 1 g per lb.</p>
<p><strong>Per meal.</strong> About 0.4 g/kg per meal over at least four meals reaches 1.6 g/kg; 0.55 g/kg × 4 meals reaches 2.2 g/kg (Schoenfeld &amp; Aragon, 2018). Bigger servings are not wasted – spreading protein out is simply a practical strategy.</p>
<p><strong>Calories.</strong> Resting energy with the Mifflin–St Jeor equation (men: 10 × kg + 6.25 × cm − 5 × age + 5; women: … − 161; “prefer not to say” uses the midpoint, − 78), which was among the most accurate equations in a systematic review (Frankenfield et al., 2005). It is multiplied by an activity factor from your strength-training days: 0–1 days 1.2, 2–3 days 1.375, 4–5 days 1.55, 6–7 days 1.725. For building muscle a modest surplus of roughly 5–15 % is recommended to support gains while limiting fat gain (Iraki et al., 2019): build muscle uses +10 %, lean bulk +5 %.</p>`,
      },
      {
        id: 'fat-loss',
        h2: 'How much protein to lose fat and keep muscle?',
        html: `<p>When you eat less than you burn, protein matters more, not less. The International Society of Sports Nutrition (Jäger et al., 2017) says 1.4–2.0 g/kg a day is enough for most people who exercise, and that resistance-trained people in a calorie deficit may need 2.3–3.1 g per kg of <em>fat-free</em> mass to keep as much muscle as possible. Per kg of total body weight that lands close to the upper end of the 1.6–2.2 g/kg range, which is why the calculator switches to 2.2 g/kg when you choose “Lose fat, keep muscle”. Keep lifting while you cut.</p>`,
      },
      {
        id: 'rda',
        h2: 'Is 0.8 g/kg (the RDA) enough?',
        html: `<p>The RDA of 0.8 g/kg a day is set to cover the needs of almost all healthy adults – it is a minimum, not a target for building muscle. For people who train, the ISSN position stand recommends 1.4–2.0 g/kg, and the meta-analysis behind this calculator puts the level where extra gains stop at about 1.6 g/kg.</p>`,
      },
    ],
    sourcesTitle: 'Sources',
    sourcesIntro: 'The same references as the Evidence screen in the Top Up app.',
    disclaimerTitle: 'Not medical advice',
    disclaimer:
      'This calculator gives general nutrition estimates for healthy adults. It is not medical advice. Talk to a doctor before raising your protein intake if you have kidney disease or reduced kidney function, diabetes, are pregnant or breastfeeding, have or have had an eating disorder, or have any other medical condition. Not intended for children or teenagers.',
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        q: 'How much protein do I need a day to build muscle?',
        a: `About 1.6 g per kg of body weight a day (0.73 g per lb). That is where extra muscle gains levelled off in a meta-analysis of 49 trials (Morton et al., 2018). Up to 2.2 g/kg (1 g per lb) gives extra margin. For 70 kg that is ${grams(70, 1.6)}–${grams(70, 2.2)} g a day; for 80 kg ${grams(80, 1.6)}–${grams(80, 2.2)} g.`,
      },
      {
        q: 'Is 1 gram of protein per pound too much?',
        a: '1 g per lb is about 2.2 g/kg – the upper end of what the research supports for muscle gain. It is not needed by most people (gains level off around 1.6 g/kg) but it is a reasonable target if you want margin or are in a calorie deficit. If you have kidney disease, talk to your doctor first.',
      },
      {
        q: 'How much protein should I eat per meal?',
        a: 'About 0.4 g per kg of body weight per meal, over at least four meals – roughly 30 g for 75 kg (Schoenfeld & Aragon, 2018). At 2.2 g/kg a day that becomes about 0.55 g/kg per meal. Larger servings are not wasted.',
      },
      {
        q: 'How much protein do I need to lose fat without losing muscle?',
        a: 'Aim for the upper end, about 2.2 g per kg of body weight a day, and keep strength training. The ISSN position stand notes that trained people in a calorie deficit may need 2.3–3.1 g per kg of fat-free mass (Jäger et al., 2017).',
      },
      {
        q: 'How much protein for a 70 kg person?',
        a: `${grams(70, 1.6)} g a day at 1.6 g/kg, up to ${grams(70, 2.2)} g at 2.2 g/kg – about ${grams(70, 0.4)} g per meal over four meals. See the table above for every weight from 50 to 120 kg.`,
      },
      {
        q: 'Do I need protein shakes?',
        a: 'No. A shake (about 24 g per scoop) is just a convenient way to top up. Two eggs give about 13 g, a palm of chicken about 28 g and a cupped hand of quark or Greek yogurt about 13 g.',
      },
      {
        q: 'Should I calculate protein from total body weight or lean mass?',
        a: 'The studies behind 1.6 g/kg used total body weight, so that is what the calculator uses. If you carry a lot of body fat, using the weight you are aiming for gives a more realistic number.',
      },
    ],
    relatedTitle: 'More',
    related: [
      { href: '/top-up/', title: 'Top Up: Protein Coach', text: 'The iPhone app that tracks this target with hand portions.' },
      { href: '/proteinkalkylator/', title: 'Proteinkalkylator (Svenska)', text: 'The same calculator in Swedish.' },
      { href: '/de/eiweiss-rechner/', title: 'Eiweißrechner (Deutsch)', text: 'The same calculator in German.' },
    ],
    updated: 'Last updated: October 2026',
    webAppName: 'Protein calculator – how much protein do I need?',
    currency: 'USD',
  },

  sv: {
    lang: 'sv',
    htmlLang: 'sv',
    numberLocale: 'sv-SE',
    title: 'Hur mycket protein behöver jag? Proteinkalkylator',
    description:
      'Proteinkalkylator för styrketräning: cirka 1,6 g protein per kg kroppsvikt och dag, upp till 2,2 g/kg. Få ditt dagsmål, protein per måltid, kalorier och hur det ser ut i mat.',
    keywords: [
      'hur mycket protein behöver jag',
      'proteinkalkylator',
      'proteinbehov',
      'protein per kg',
      'hur mycket protein för att bygga muskler',
      'protein per dag',
    ],
    h1: 'Hur mycket protein behöver jag? Proteinkalkylator',
    answerHtml: `Tränar du styrka: sikta på <strong>ungefär 1,6 g protein per kg kroppsvikt och dag</strong> – ${grams(80, 1.6)} g om du väger 80 kg och ${grams(70, 1.6)} g vid 70 kg. I en metaanalys av 49 studier planade muskeltillväxten ut kring 1,6 g/kg; upp till 2,2 g/kg ger marginal. Fördela det på minst 4 måltider.`,
    crumbs: [
      { name: 'Hem', url: '/' },
      { name: 'Gratis räknare', url: '/verktyg/' },
      { name: 'Proteinkalkylator' },
    ],
    crumbLabel: 'Brödsmulor',
    appName: 'Top Up: Protein Coach',
    ui: {
      weight: 'Kroppsvikt',
      kg: 'kg',
      lb: 'lb',
      goal: 'Mål',
      goals: { build: 'Bygga muskler', maintain: 'Behålla', cut: 'Gå ner i fett, behålla muskler' },
      level: 'Proteinnivå',
      levelStd: 'Standard · 1,6 g/kg',
      levelMax: 'Max · 2,2 g/kg',
      perDay: 'g protein per dag',
      range: 'Forskningens spann 1,6–2,2 g/kg: {lo}–{hi} g per dag',
      perMeal: '≈ {g} g per måltid × 4 måltider (0,4 g/kg per måltid)',
      perMealMax: '≈ {g} g per måltid × 4 måltider (0,55 g/kg per måltid)',
      example: 'Exempel för {w}:',
      invalid: 'Skriv en kroppsvikt mellan 30 och 300 kg.',
      calTitle: 'Kalorier (valfritt)',
      calIntro: 'Fyll i träningsdagar, ålder och längd så får du kalorimålet också – samma formel som i appen Top Up.',
      days: 'Styrketräning',
      daysOpt: ['0 dagar i veckan', '1 dag i veckan', '2 dagar i veckan', '3 dagar i veckan', '4 dagar i veckan', '5 dagar i veckan', '6 dagar i veckan', '7 dagar i veckan'],
      sex: 'Kön',
      sexM: 'Man',
      sexF: 'Kvinna',
      sexX: 'Vill inte ange',
      age: 'Ålder',
      height: 'Längd',
      cm: 'cm',
      ft: 'ft',
      inch: 'in',
      calNeedMore: 'Fyll i ålder och längd för att se dina kalorier.',
      calInvalid: 'Kontrollera ålder (18–100) och längd (120–230 cm).',
      bmr: 'Viloförbrukning (Mifflin–St Jeor)',
      maintenance: 'Underhållskalorier',
      targetBuild: 'Bygga muskler (+10 %): {k} kcal per dag · lugnare lean bulk (+5 %): {l} kcal',
      targetMaintain: 'Behålla: {k} kcal per dag',
      targetCut: 'För att gå ner i fett äter du under {k} kcal per dag. Varken räknaren eller appen Top Up bestämmer hur stort underskottet ska vara – håll proteinet i den övre delen medan du bantar.',
      kcal: 'kcal',
      ctaDefault:
        'Nå målet varje dag utan att väga maten – Top Up påminner dig vid måltiderna och säger på kvällen vad du ska fylla på med.',
      ctaResult:
        'Ditt mål är {g} g om dagen. Nå det varje dag utan att väga maten – Top Up påminner dig vid måltiderna och säger på kvällen vad du ska fylla på med.',
      foodTitle: 'Så ser {g} g protein ut i mat',
      foodIntro: 'En exempeldag i handportioner – samma metod som Top Up använder för att logga en måltid med tre tryck, utan våg:',
      mealNames: ['Frukost', 'Lunch', 'Mellanmål', 'Middag'],
      foodNames: {
        meat: 'kyckling',
        fish: 'fisk',
        eggs: 'ägg',
        dairy: 'kvarg eller grekisk yoghurt',
        legumes: 'linser eller bönor',
        shake: 'proteinshake',
      },
      portions: {
        meat: ['{n} handflata', '{n} handflator'],
        fish: ['{n} handflata', '{n} handflator'],
        eggs: ['{e} ägg', '{e} ägg'],
        dairy: ['{n} kupad hand', '{n} kupade händer'],
        legumes: ['{n} kupad hand', '{n} kupade händer'],
        shake: ['{n} skopa', '{n} skopor'],
      },
      total: 'Totalt ≈ {g} g protein',
    },
    ctaFree: 'Gratis · iPhone',
    ctaIphoneOnly: 'Top Up finns just nu bara för iPhone.',
    ctaAside: 'Gratis att logga; Premium lägger till Apple Hälsa och full historik.',
    onPage: 'På sidan:',
    toc: [
      { href: '#per-vikt', label: 'Protein per kroppsvikt' },
      { href: '#portioner', label: 'Handportioner' },
      { href: '#sa-raknar-vi', label: 'Så räknar vi' },
      { href: '#kallor', label: 'Källor' },
      { href: '#fragor', label: 'Vanliga frågor' },
    ],
    tableTitle: 'Hur mycket protein per dag vid 60, 70, 80 eller 90 kg?',
    tableIntro:
      'Protein per dag vid 1,6 g/kg (standard) och 2,2 g/kg (övre gränsen i forskningen), plus mängden per måltid vid 0,4 g/kg fördelat på 4 måltider.',
    tablePopular: 'Hoppa till:',
    th: { weight: 'Kroppsvikt', std: '1,6 g/kg', max: '2,2 g/kg', meal: 'Per måltid' },
    portionTitle: 'Protein i en handportion',
    portionIntro:
      'Ingen köksvåg behövs: handen står ungefär i proportion till kroppen. Det här är de typvärden Top Up använder (Livsmedelsverkets livsmedelsdatabas och USDA FoodData Central, avrundade). Händer är olika stora, så se dem som uppskattningar.',
    portionTh: { food: 'Livsmedel', portion: 'Portion', protein: 'Protein' },
    sections: [
      {
        id: 'sa-raknar-vi',
        h2: 'Så räknar kalkylatorn',
        html: `<p><strong>Protein.</strong> Din vikt i kg × 1,6 g. En metaanalys av 49 randomiserade studier med 1 863 deltagare (Morton m.fl., 2018) visade att extra protein ökar muskeltillväxten vid styrketräning, men att nyttan planar ut vid ungefär 1,6 g per kg kroppsvikt och dag. Eftersom människor skiljer sig åt låg den övre delen av det statistiska intervallet kring 2,2 g/kg – det är nivån ”Max”.</p>
<p><strong>Per måltid.</strong> Ungefär 0,4 g/kg per måltid fördelat på minst fyra måltider ger 1,6 g/kg; 0,55 g/kg × 4 måltider ger 2,2 g/kg (Schoenfeld &amp; Aragon, 2018). Större portioner går inte till spillo – att sprida ut proteinet är bara en praktisk strategi.</p>
<p><strong>Kalorier.</strong> Viloförbrukningen räknas med Mifflin–St Jeor-ekvationen (män: 10 × kg + 6,25 × cm − 5 × ålder + 5; kvinnor: … − 161; ”vill inte ange” använder mittvärdet, − 78), som hörde till de mest träffsäkra i en systematisk översikt (Frankenfield m.fl., 2005). Den multipliceras med en aktivitetsfaktor utifrån dina styrketräningsdagar: 0–1 dagar 1,2, 2–3 dagar 1,375, 4–5 dagar 1,55, 6–7 dagar 1,725. För att bygga muskler rekommenderas ett måttligt överskott på ungefär 5–15 % för att stödja tillväxten och begränsa fettökningen (Iraki m.fl., 2019): bygga muskler använder +10 %, lean bulk +5 %.</p>`,
      },
      {
        id: 'ga-ner-i-vikt',
        h2: 'Hur mycket protein när man vill gå ner i fett och behålla musklerna?',
        html: `<p>När du äter mindre än du gör av med blir proteinet viktigare, inte mindre viktigt. International Society of Sports Nutrition (Jäger m.fl., 2017) anger att 1,4–2,0 g/kg om dagen räcker för de flesta som tränar, och att styrketränade personer i kaloriunderskott kan behöva 2,3–3,1 g per kg <em>fettfri</em> massa för att behålla så mycket muskler som möjligt. Räknat på hela kroppsvikten hamnar det nära den övre delen av spannet 1,6–2,2 g/kg, och därför växlar kalkylatorn till 2,2 g/kg när du väljer ”Gå ner i fett, behålla muskler”. Fortsätt styrketräna medan du bantar.</p>`,
      },
      {
        id: 'rekommenderat-intag',
        h2: 'Räcker 0,8 g/kg?',
        html: `<p>Det allmänna rekommenderade intaget på 0,8 g/kg om dagen ska täcka behovet hos nästan alla friska vuxna – det är ett minimum, inte ett mål för att bygga muskler. För den som tränar rekommenderar ISSN 1,4–2,0 g/kg, och metaanalysen bakom kalkylatorn sätter nivån där extra effekt upphör vid ungefär 1,6 g/kg.</p>`,
      },
    ],
    sourcesTitle: 'Källor',
    sourcesIntro: 'Samma referenser som skärmen Forskning i appen Top Up.',
    disclaimerTitle: 'Inte medicinsk rådgivning',
    disclaimer:
      'Kalkylatorn ger allmänna näringsuppskattningar för friska vuxna. Det är inte medicinsk rådgivning. Prata med en läkare innan du ökar proteinintaget om du har njursjukdom eller nedsatt njurfunktion, diabetes, är gravid eller ammar, har eller har haft en ätstörning, eller har någon annan sjukdom. Inte avsedd för barn och tonåringar.',
    faqTitle: 'Vanliga frågor',
    faq: [
      {
        q: 'Hur mycket protein behöver man per dag för att bygga muskler?',
        a: `Ungefär 1,6 g per kg kroppsvikt och dag. Där planade den extra muskeltillväxten ut i en metaanalys av 49 studier (Morton m.fl., 2018). Upp till 2,2 g/kg ger extra marginal. Vid 70 kg blir det ${grams(70, 1.6)}–${grams(70, 2.2)} g per dag, vid 80 kg ${grams(80, 1.6)}–${grams(80, 2.2)} g.`,
      },
      {
        q: 'Hur mycket protein per måltid?',
        a: 'Ungefär 0,4 g per kg kroppsvikt och måltid, fördelat på minst fyra måltider – cirka 30 g om du väger 75 kg (Schoenfeld & Aragon, 2018). Vid 2,2 g/kg om dagen blir det cirka 0,55 g/kg per måltid. Större portioner går inte till spillo.',
      },
      {
        q: 'Hur mycket protein behöver jag för att gå ner i vikt utan att tappa muskler?',
        a: 'Sikta på den övre delen, ungefär 2,2 g per kg kroppsvikt och dag, och fortsätt styrketräna. ISSN konstaterar att tränade personer i kaloriunderskott kan behöva 2,3–3,1 g per kg fettfri massa (Jäger m.fl., 2017).',
      },
      {
        q: 'Hur mycket protein behöver man om man väger 70 kg?',
        a: `${grams(70, 1.6)} g om dagen vid 1,6 g/kg, upp till ${grams(70, 2.2)} g vid 2,2 g/kg – ungefär ${grams(70, 0.4)} g per måltid fördelat på fyra måltider. Tabellen ovan visar alla vikter från 50 till 120 kg.`,
      },
      {
        q: 'Är 2 g protein per kg för mycket?',
        a: '2 g/kg ligger inom det spann forskningen stöder (1,6–2,2 g/kg). De flesta behöver inte så mycket – effekten planar ut kring 1,6 g/kg – men det är ett rimligt mål om du vill ha marginal eller äter i underskott. Har du njursjukdom ska du prata med läkare först.',
      },
      {
        q: 'Behöver jag proteinpulver?',
        a: 'Nej. En shake (cirka 24 g per skopa) är bara ett smidigt sätt att fylla på. Två ägg ger cirka 13 g, en handflata kyckling cirka 28 g och en kupad hand kvarg eller grekisk yoghurt cirka 13 g.',
      },
      {
        q: 'Ska jag räkna på hela kroppsvikten eller bara muskelmassan?',
        a: 'Studierna bakom 1,6 g/kg räknade på hela kroppsvikten, så det gör kalkylatorn också. Har du mycket kroppsfett ger målvikten ett mer realistiskt värde.',
      },
    ],
    relatedTitle: 'Mer',
    related: [
      { href: '/top-up/', title: 'Top Up: Protein Coach', text: 'iPhone-appen som håller koll på målet med handportioner (på engelska).' },
      { href: '/stark/', title: 'Stark', text: 'Bodyweight-träning hemma – passen som proteinet ska bygga på.' },
      { href: '/verktyg/', title: 'Fler gratis räknare', text: 'OB, lön efter skatt, sömncykler och mer.' },
      { href: '/en/protein-calculator/', title: 'Protein calculator (English)', text: 'Samma kalkylator på engelska, med pounds.' },
    ],
    updated: 'Senast uppdaterad: oktober 2026',
    webAppName: 'Proteinkalkylator – hur mycket protein behöver jag?',
    currency: 'SEK',
  },

  de: {
    lang: 'de',
    htmlLang: 'de-DE',
    numberLocale: 'de-DE',
    title: 'Wie viel Eiweiß brauche ich? Eiweißrechner',
    description:
      'Eiweißrechner für Muskelaufbau: etwa 1,6 g Protein pro kg Körpergewicht am Tag, bis 2,2 g/kg. Tagesziel, Protein pro Mahlzeit, Kalorien und wie das als Essen aussieht.',
    keywords: [
      'wie viel eiweiß brauche ich',
      'eiweißrechner',
      'proteinrechner',
      'eiweißbedarf muskelaufbau',
      'protein pro kg körpergewicht',
      'wie viel protein am tag',
    ],
    h1: 'Wie viel Eiweiß brauche ich? Eiweißrechner für den Muskelaufbau',
    answerHtml: `Wenn du Krafttraining machst: <strong>etwa 1,6 g Eiweiß pro kg Körpergewicht am Tag</strong> – ${grams(80, 1.6)} g bei 80 kg, ${grams(70, 1.6)} g bei 70 kg. In einer Metaanalyse von 49 Studien flachte der zusätzliche Muskelzuwachs bei etwa 1,6 g/kg ab; bis 2,2 g/kg gibt Spielraum. Verteile es auf mindestens 4 Mahlzeiten.`,
    crumbs: [
      { name: 'Startseite', url: '/de/' },
      { name: 'Top Up', url: '/top-up/' },
      { name: 'Eiweißrechner' },
    ],
    crumbLabel: 'Brotkrumen',
    appName: 'Top Up: Protein Coach',
    ui: {
      weight: 'Körpergewicht',
      kg: 'kg',
      lb: 'lb',
      goal: 'Ziel',
      goals: { build: 'Muskelaufbau', maintain: 'Halten', cut: 'Fett verlieren, Muskeln halten' },
      level: 'Proteinstufe',
      levelStd: 'Standard · 1,6 g/kg',
      levelMax: 'Max · 2,2 g/kg',
      perDay: 'g Eiweiß pro Tag',
      range: 'Spanne laut Studien 1,6–2,2 g/kg: {lo}–{hi} g pro Tag',
      perMeal: '≈ {g} g pro Mahlzeit × 4 Mahlzeiten (0,4 g/kg pro Mahlzeit)',
      perMealMax: '≈ {g} g pro Mahlzeit × 4 Mahlzeiten (0,55 g/kg pro Mahlzeit)',
      example: 'Beispiel für {w}:',
      invalid: 'Gib ein Körpergewicht zwischen 30 und 300 kg ein.',
      calTitle: 'Kalorien (optional)',
      calIntro: 'Mit Trainingstagen, Alter und Größe bekommst du auch dein Kalorienziel – dieselbe Formel wie in der App Top Up.',
      days: 'Krafttraining',
      daysOpt: ['0 Tage pro Woche', '1 Tag pro Woche', '2 Tage pro Woche', '3 Tage pro Woche', '4 Tage pro Woche', '5 Tage pro Woche', '6 Tage pro Woche', '7 Tage pro Woche'],
      sex: 'Geschlecht',
      sexM: 'Männlich',
      sexF: 'Weiblich',
      sexX: 'Keine Angabe',
      age: 'Alter',
      height: 'Größe',
      cm: 'cm',
      ft: 'ft',
      inch: 'in',
      calNeedMore: 'Gib Alter und Größe ein, um deine Kalorien zu sehen.',
      calInvalid: 'Prüfe Alter (18–100) und Größe (120–230 cm).',
      bmr: 'Ruheumsatz (Mifflin–St Jeor)',
      maintenance: 'Erhaltungsbedarf',
      targetBuild: 'Muskelaufbau (+10 %): {k} kcal pro Tag · langsamer Lean Bulk (+5 %): {l} kcal',
      targetMaintain: 'Halten: {k} kcal pro Tag',
      targetCut: 'Um Fett zu verlieren, iss weniger als {k} kcal pro Tag. Weder dieser Rechner noch die App Top Up legen die Größe des Defizits fest – halte das Eiweiß in der Diät am oberen Ende.',
      kcal: 'kcal',
      ctaDefault:
        'Erreiche es jeden Tag, ohne Essen abzuwiegen – Top Up erinnert dich zu den Mahlzeiten und sagt dir abends, womit du auffüllst.',
      ctaResult:
        'Dein Ziel: {g} g am Tag. Erreiche es jeden Tag, ohne Essen abzuwiegen – Top Up erinnert dich zu den Mahlzeiten und sagt dir abends, womit du auffüllst.',
      foodTitle: 'So sehen {g} g Eiweiß als Essen aus',
      foodIntro: 'Ein Beispieltag in Handportionen – dieselbe Methode, mit der Top Up eine Mahlzeit mit drei Tipps erfasst, ohne Waage:',
      mealNames: ['Frühstück', 'Mittagessen', 'Snack', 'Abendessen'],
      foodNames: {
        meat: 'Hähnchen',
        fish: 'Fisch',
        eggs: 'Eier',
        dairy: 'Magerquark oder griechischer Joghurt',
        legumes: 'Linsen oder Bohnen',
        shake: 'Proteinshake',
      },
      portions: {
        meat: ['{n} Handfläche', '{n} Handflächen'],
        fish: ['{n} Handfläche', '{n} Handflächen'],
        eggs: ['{e} Ei', '{e} Eier'],
        dairy: ['{n} Handvoll', '{n} Handvoll'],
        legumes: ['{n} Handvoll', '{n} Handvoll'],
        shake: ['{n} Messlöffel', '{n} Messlöffel'],
      },
      total: 'Gesamt ≈ {g} g Eiweiß',
    },
    ctaFree: 'Kostenlos · iPhone',
    ctaIphoneOnly: 'Top Up gibt es derzeit nur für das iPhone.',
    ctaAside: 'Erfassen ist kostenlos; Premium bringt Apple Health und den vollen Verlauf.',
    onPage: 'Auf dieser Seite:',
    toc: [
      { href: '#nach-gewicht', label: 'Eiweiß nach Körpergewicht' },
      { href: '#portionen', label: 'Handportionen' },
      { href: '#berechnung', label: 'So wird gerechnet' },
      { href: '#quellen', label: 'Quellen' },
      { href: '#faq', label: 'Häufige Fragen' },
    ],
    tableTitle: 'Wie viel Eiweiß am Tag bei 60, 70, 80 oder 90 kg?',
    tableIntro:
      'Eiweiß pro Tag bei 1,6 g/kg (Standard) und 2,2 g/kg (oberes Ende der Studienlage), dazu die Menge pro Mahlzeit bei 0,4 g/kg auf 4 Mahlzeiten.',
    tablePopular: 'Springe zu:',
    th: { weight: 'Körpergewicht', std: '1,6 g/kg', max: '2,2 g/kg', meal: 'Pro Mahlzeit' },
    portionTitle: 'Eiweiß in einer Handportion',
    portionIntro:
      'Keine Küchenwaage nötig: Deine Hand ist ungefähr proportional zu deinem Körper. Das sind die typischen Werte, die Top Up nutzt (schwedische Lebensmitteldatenbank Livsmedelsverket und USDA FoodData Central, gerundet). Hände sind unterschiedlich groß – sieh sie als Schätzungen.',
    portionTh: { food: 'Lebensmittel', portion: 'Portion', protein: 'Eiweiß' },
    sections: [
      {
        id: 'berechnung',
        h2: 'So rechnet der Eiweißrechner',
        html: `<p><strong>Eiweiß.</strong> Dein Gewicht in kg × 1,6 g. Eine Metaanalyse von 49 randomisierten Studien mit 1.863 Teilnehmenden (Morton et al., 2018) ergab, dass zusätzliches Protein den Muskelzuwachs durch Krafttraining steigert, der Nutzen aber bei etwa 1,6 g pro kg Körpergewicht und Tag abflacht. Da Menschen unterschiedlich sind, lag das obere Ende des statistischen Bereichs bei etwa 2,2 g/kg – das ist die Stufe „Max“.</p>
<p><strong>Pro Mahlzeit.</strong> Etwa 0,4 g/kg pro Mahlzeit auf mindestens vier Mahlzeiten ergeben 1,6 g/kg; 0,55 g/kg × 4 Mahlzeiten ergeben 2,2 g/kg (Schoenfeld &amp; Aragon, 2018). Größere Portionen sind nicht verschwendet – Protein zu verteilen ist einfach eine praktische Strategie.</p>
<p><strong>Kalorien.</strong> Der Ruheumsatz wird mit der Mifflin–St-Jeor-Gleichung berechnet (Männer: 10 × kg + 6,25 × cm − 5 × Alter + 5; Frauen: … − 161; „keine Angabe“ nutzt den Mittelwert, − 78), die in einer systematischen Übersichtsarbeit zu den genauesten gehörte (Frankenfield et al., 2005). Er wird mit einem Aktivitätsfaktor nach deinen Krafttrainingstagen multipliziert: 0–1 Tage 1,2, 2–3 Tage 1,375, 4–5 Tage 1,55, 6–7 Tage 1,725. Für den Muskelaufbau wird ein moderater Überschuss von etwa 5–15 % empfohlen, um Zuwächse zu unterstützen und die Fettzunahme zu begrenzen (Iraki et al., 2019): Muskelaufbau nutzt +10 %, Lean Bulk +5 %.</p>`,
      },
      {
        id: 'abnehmen',
        h2: 'Wie viel Eiweiß beim Abnehmen, um Muskeln zu halten?',
        html: `<p>Wenn du weniger isst, als du verbrauchst, wird Eiweiß wichtiger, nicht unwichtiger. Die International Society of Sports Nutrition (Jäger et al., 2017) hält 1,4–2,0 g/kg am Tag für die meisten Sporttreibenden für ausreichend und schreibt, dass Kraftsportler im Kaloriendefizit 2,3–3,1 g pro kg <em>fettfreier</em> Masse brauchen können, um möglichst viel Muskulatur zu erhalten. Auf das gesamte Körpergewicht gerechnet liegt das nahe am oberen Ende der Spanne 1,6–2,2 g/kg – deshalb wechselt der Rechner auf 2,2 g/kg, wenn du „Fett verlieren, Muskeln halten“ wählst. Trainiere in der Diät weiter mit Gewichten.</p>`,
      },
      {
        id: 'empfehlung',
        h2: 'Reichen 0,8 g/kg?',
        html: `<p>Die allgemeine Zufuhrempfehlung von 0,8 g/kg am Tag soll den Bedarf fast aller gesunden Erwachsenen decken – sie ist ein Minimum, kein Ziel für den Muskelaufbau. Für Trainierende empfiehlt die ISSN 1,4–2,0 g/kg, und die Metaanalyse hinter diesem Rechner sieht den Punkt, ab dem kein zusätzlicher Effekt mehr kommt, bei etwa 1,6 g/kg.</p>`,
      },
    ],
    sourcesTitle: 'Quellen',
    sourcesIntro: 'Dieselben Quellen wie der Bildschirm „Studienlage“ in der App Top Up.',
    disclaimerTitle: 'Keine medizinische Beratung',
    disclaimer:
      'Dieser Rechner liefert allgemeine Schätzungen zur Ernährung für gesunde Erwachsene. Das ist keine medizinische Beratung. Sprich mit einer Ärztin oder einem Arzt, bevor du deine Eiweißzufuhr erhöhst, wenn du eine Nierenerkrankung oder eingeschränkte Nierenfunktion oder Diabetes hast, schwanger bist oder stillst, eine Essstörung hast oder hattest oder eine andere Erkrankung hast. Nicht für Kinder und Jugendliche gedacht.',
    faqTitle: 'Häufige Fragen',
    faq: [
      {
        q: 'Wie viel Eiweiß brauche ich am Tag für den Muskelaufbau?',
        a: `Etwa 1,6 g pro kg Körpergewicht am Tag. Dort flachte der zusätzliche Muskelzuwachs in einer Metaanalyse von 49 Studien ab (Morton et al., 2018). Bis 2,2 g/kg geben zusätzlichen Spielraum. Bei 70 kg sind das ${grams(70, 1.6)}–${grams(70, 2.2)} g am Tag, bei 80 kg ${grams(80, 1.6)}–${grams(80, 2.2)} g.`,
      },
      {
        q: 'Wie viel Eiweiß pro Mahlzeit?',
        a: 'Etwa 0,4 g pro kg Körpergewicht und Mahlzeit, auf mindestens vier Mahlzeiten verteilt – rund 30 g bei 75 kg (Schoenfeld & Aragon, 2018). Bei 2,2 g/kg am Tag sind es etwa 0,55 g/kg pro Mahlzeit. Größere Portionen sind nicht verschwendet.',
      },
      {
        q: 'Wie viel Eiweiß beim Abnehmen, ohne Muskeln zu verlieren?',
        a: 'Ziele auf das obere Ende, etwa 2,2 g pro kg Körpergewicht am Tag, und trainiere weiter mit Gewichten. Die ISSN weist darauf hin, dass Trainierte im Kaloriendefizit 2,3–3,1 g pro kg fettfreier Masse brauchen können (Jäger et al., 2017).',
      },
      {
        q: 'Wie viel Eiweiß bei 70 kg Körpergewicht?',
        a: `${grams(70, 1.6)} g am Tag bei 1,6 g/kg, bis ${grams(70, 2.2)} g bei 2,2 g/kg – etwa ${grams(70, 0.4)} g pro Mahlzeit bei vier Mahlzeiten. Die Tabelle oben zeigt alle Gewichte von 50 bis 120 kg.`,
      },
      {
        q: 'Sind 2 g Eiweiß pro kg zu viel?',
        a: '2 g/kg liegen innerhalb der Spanne, die die Forschung stützt (1,6–2,2 g/kg). Die meisten brauchen nicht so viel – der Effekt flacht bei etwa 1,6 g/kg ab –, aber es ist ein vernünftiges Ziel, wenn du Spielraum willst oder im Defizit bist. Bei einer Nierenerkrankung sprich zuerst mit deiner Ärztin oder deinem Arzt.',
      },
      {
        q: 'Brauche ich Eiweißpulver?',
        a: 'Nein. Ein Shake (etwa 24 g pro Messlöffel) ist nur ein bequemer Weg zum Auffüllen. Zwei Eier liefern etwa 13 g, eine Handfläche Hähnchen etwa 28 g und eine Handvoll Magerquark oder griechischer Joghurt etwa 13 g.',
      },
      {
        q: 'Rechne ich mit dem gesamten Körpergewicht oder der Magermasse?',
        a: 'Die Studien hinter 1,6 g/kg rechneten mit dem gesamten Körpergewicht, deshalb tut es der Rechner auch. Bei viel Körperfett ergibt das Zielgewicht einen realistischeren Wert.',
      },
    ],
    relatedTitle: 'Mehr',
    related: [
      { href: '/top-up/', title: 'Top Up: Protein Coach', text: 'Die iPhone-App, die dieses Ziel mit Handportionen verfolgt (Seite auf Englisch, App auf Deutsch).' },
      { href: '/en/protein-calculator/', title: 'Protein calculator (English)', text: 'Derselbe Rechner auf Englisch, mit Pfund.' },
      { href: '/proteinkalkylator/', title: 'Proteinkalkylator (Svenska)', text: 'Derselbe Rechner auf Schwedisch.' },
    ],
    updated: 'Zuletzt aktualisiert: Oktober 2026',
    webAppName: 'Eiweißrechner – wie viel Eiweiß brauche ich?',
    currency: 'EUR',
  },
};
