// Data behind the /snusfri-resa/sluta-snusa/ day-by-day cluster.
//
// Why: "sluta snusa dag 3"-style queries already rank the site at positions
// 33-58 with ~1,400 impressions/90d and no page targeting them. Unlike a
// calculator query, the searcher is in acute need at the exact moment they
// search — which is the highest install intent on the whole site.
//
// ACCURACY RULE (non-negotiable): snus is NOT smoking. Never claim lung
// recovery, carbon monoxide clearance, breathing or cough improvements — those
// are smoking-specific and would be false here. Snus health effects concern
// nicotine withdrawal, oral health (gums, mucosa, taste), blood pressure and
// cardiovascular risk. The milestones below mirror the app's own timeline.

export interface DayGuide {
  slug: string;
  day: number;
  label: string;
  title: string;
  /** <title> for the day page, shaped like the searches ("sluta snusa dag 3"). */
  seoTitle: string;
  /** What is physically happening — snus-specific, no smoking claims. */
  body: string;
  /** Honest expectation-setting for how it tends to feel. */
  feels: string;
  tips: string[];
}

export const DAYS: DayGuide[] = [
  {
    slug: 'dag-1',
    day: 1,
    label: 'Dag 1',
    title: 'Första dygnet utan snus',
    seoTitle: 'Sluta snusa dag 1 – när går nikotinet ur kroppen?',
    body: 'Nikotinets halveringstid i blodet är ungefär två timmar. Eftersom snus avger nikotin långsamt genom munslemhinnan sjunker nivån lite senare än efter en cigarett, men efter ungefär ett dygn är nästan allt nikotin borta ur blodet. Nedbrytningsprodukten kotinin finns kvar och går att mäta i några dagar till. Nikotin höjer puls och blodtryck tillfälligt, så de börjar gå ner när nikotinet försvinner. Samtidigt saknar hjärnan sin vanliga dos, och det är därför suget kommer nu.',
    feels: 'Rastlöshet, irritation och en nästan konstant känsla av att något fattas. Många beskriver det som svårt att sitta still. Det är nikotinreceptorerna som saknar sin dos — inte ett tecken på att du gör fel.',
    tips: [
      'Ta dagen i timmar, inte i dagar. "Klarar jag två timmar till" är hanterbart.',
      'Rensa bort dosorna helt. Att veta att det finns en burk kvar kostar mental energi hela dagen.',
      'Drick mer vatten än du tror behövs — det ger munnen något att göra.',
      'Säg till dem omkring dig. Att slippa förklara varför du är kort i tonen sparar konflikter.',
    ],
  },
  {
    slug: 'dag-2',
    day: 2,
    label: 'Dag 2',
    title: 'Andra dagen — nikotinet är borta, abstinensen är kvar',
    seoTitle: 'Sluta snusa dag 2 – vad händer i kroppen nu?',
    body: 'Nikotinet har i stort sett lämnat kroppen. Det som återstår är abstinensen, alltså hjärnans reaktion på att nikotinet saknas, och vanan. Hjärnans nikotinreceptorer har vant sig vid en jämn tillförsel och behöver tid att ställa om.',
    feels: 'För många en av de tyngsta dagarna, tillsammans med dag 3. Huvudvärk, dålig sömn och ett kort stubin är vanligt. Suget kommer i vågor på några minuter — inte som ett konstant tillstånd.',
    tips: [
      'Vänta ut suget. En craving toppar och klingar av på 3–5 minuter, nästan alltid.',
      'Byt miljö när det kommer. Res dig, gå ut, gör något annat i två minuter.',
      'Undvik de starkaste triggarna den här veckan — ofta kaffe, alkohol och specifika platser.',
      'Sov om du kan. Trötthet gör suget mätbart värre.',
    ],
  },
  {
    slug: 'dag-3',
    day: 3,
    label: 'Dag 3',
    title: 'Dag 3 — toppen på abstinensen',
    seoTitle: 'Sluta snusa dag 3 – därför är det värst nu',
    body: 'Abstinensen brukar vara som starkast under de första dagarna, och för många är dag tre toppen. Kroppen har varit nikotinfri ett par dygn och hjärnan protesterar som mest. Härifrån brukar suget långsamt bli glesare.',
    feels: 'Om du känner dig ovanligt irriterad, okoncentrerad eller nedstämd just nu är det helt förväntat — de första dagarna är för de flesta den svåraste perioden. Det brukar bli lättare härifrån.',
    tips: [
      'Det här är dagen folk återfaller. Vet du om det är du bättre rustad.',
      'Räkna på pengarna. En dosa om dagen är ungefär 1 500–2 000 kr i månaden.',
      'Ha en ersättning i munnen redo: tuggummi, tandpetare, nikotinfritt snus.',
      'Planera en belöning för att ha tagit dig hit. Du har passerat det värsta.',
    ],
  },
  {
    slug: 'dag-4',
    day: 4,
    label: 'Dag 4',
    title: 'Dag 4 — det börjar vända',
    seoTitle: 'Sluta snusa dag 4 – nu börjar det vända',
    body: 'Från och med nu är det mer vana än kemi. Nikotinet är sedan länge ute ur kroppen; det som är kvar är situationerna där handen automatiskt söker sig till dosan.',
    feels: 'Många beskriver dag 4 som första dagen det känns lite lättare. Suget finns kvar men kommer glesare, och du hinner tänka innan det tar över.',
    tips: [
      'Kartlägg dina triggersituationer — efter maten, i bilen, vid datorn.',
      'Ge varje trigger en ny rutin. Efter maten: res dig och gå ut i två minuter.',
      'Undvik "bara en" — en enda prilla återställer receptorerna och du börjar om.',
    ],
  },
  {
    slug: 'dag-5',
    day: 5,
    label: 'Dag 5',
    title: 'Dag 5 — vanan sitter kvar, inte nikotinet',
    seoTitle: 'Sluta snusa dag 5 – vanan sitter kvar',
    body: 'Kroppen har varit nikotinfri i flera dygn. Hjärnan håller på att ställa om, men beroendet sitter också i vanor: situationer där handen automatiskt söker sig till dosan. Det är mycket av det du kämpar mot nu.',
    feels: 'Sömnen brukar börja normaliseras. Humöret svänger fortfarande, och suget kan komma plötsligt och starkt i specifika situationer.',
    tips: [
      'Notera vad som utlöste suget när det kommer — mönstret blir tydligt snabbt.',
      'Säg nej till "en enda" även socialt. Det är den vanligaste vägen tillbaka.',
      'Titta på din räknare. Att se timmarna och kronorna växa är konkret motivation.',
    ],
  },
  {
    slug: 'dag-6',
    day: 6,
    label: 'Dag 6',
    title: 'Dag 6 — nästan en vecka',
    seoTitle: 'Sluta snusa dag 6 – nästan en vecka',
    body: 'Nästan en hel vecka utan nikotin. Slemhinnan där prillan brukade ligga får vila, och för många känns det redan annorlunda i munnen. Abstinensen har för de flesta passerat sin topp.',
    feels: 'Cravings kommer nu mer sällan men kan fortfarande vara intensiva. Många känner sig ovanligt trötta — det är normalt och går över.',
    tips: [
      'Planera för helgen om den är på väg. Alkohol är den vanligaste återfallstriggern.',
      'Ha en plan för vad du säger när någon erbjuder. "Jag har slutat" räcker.',
      'Fortsätt räkna dagarna. Att ha en obruten svit blir motivation i sig.',
    ],
  },
  {
    slug: 'dag-7',
    day: 7,
    label: 'Dag 7',
    title: 'En vecka snusfri',
    seoTitle: 'Snusfri en vecka – vad händer efter 7 dagar?',
    body: 'En vecka utan nikotin. Den tillfälliga höjning av puls och blodtryck som nikotinet gav är borta, och slemhinnan i munnen har fått en veckas vila. Snusförändringar i munnen brukar gå tillbaka inom några veckor efter att man slutat.',
    feels: 'Det värsta av den akuta abstinensen brukar vara över. Suget finns kvar men är kortare och glesare. De flesta känner sig mer som sig själva igen.',
    tips: [
      'Du har passerat den svåraste veckan — många återfall sker just under de första dagarna.',
      'Räkna ihop vad du sparat. En vecka är ofta 350–500 kr.',
      'Byt ut vanan permanent, lägg inte bara locket på. Vad gör du istället efter maten?',
      'Håll koll på tandköttet. Läker det inte alls efter ett par veckor — boka tandläkare.',
    ],
  },
  {
    slug: 'dag-14',
    day: 14,
    label: '2 veckor',
    title: 'Två veckor snusfri',
    seoTitle: 'Sluta snusa 2 veckor – vad händer nu?',
    body: 'De flesta fysiska abstinenssymtomen klingar av under de första två till fyra veckorna. Hjärnans nikotinreceptorer håller på att ställa om, och det är en del av förklaringen till att suget känns svagare. Munslemhinnan fortsätter återhämta sig.',
    feels: 'Suget är nu mest situationsbundet. Många går hela dagar utan att tänka på det, och blir sedan överraskade av en plötslig craving i en specifik situation.',
    tips: [
      'Se upp för "jag klarar en" nu när det känns lätt. Det är den klassiska fällan vid 2–4 veckor.',
      'Beräkna vad ett år ger dig i pengar. För många är det 18 000–24 000 kr.',
      'Fyll tiden med något du faktiskt vill göra, inte bara "inte snusa".',
    ],
  },
  {
    slug: 'dag-30',
    day: 30,
    label: '1 månad',
    title: 'En månad snusfri',
    seoTitle: 'Snusfri en månad – så mår kroppen efter 30 dagar',
    body: 'Efter en månad har den fysiska abstinensen klingat av för de flesta. Snusförändringar i munslemhinnan, den vita och skrynkliga ytan där prillan legat, brukar ha gått tillbaka eller vara på väg bort. Det som finns kvar är främst sug kopplat till vanor och situationer, och det blir svagare för varje vecka.',
    feels: 'De flesta beskriver det som att det knappt är en kamp längre. Suget dyker upp sällan, ofta kopplat till stress eller alkohol.',
    tips: [
      'Du har sparat ungefär 1 500–2 000 kr. Gör något konkret av dem.',
      'Finns det kvar en förändring i munnen där prillan låg? Visa den för tandläkaren.',
      'Skriv ner varför du slutade. Du kommer behöva läsa det någon gång.',
    ],
  },
  {
    slug: 'dag-90',
    day: 90,
    label: '3 månader',
    title: 'Tre månader snusfri',
    seoTitle: 'Snusfri 3 månader – vad har hänt i kroppen?',
    body: 'Munslemhinnan har haft gott om tid att återhämta sig. Tandkött som har dragit sig tillbaka där prillan låg växer inte ut igen, men det slutar påverkas av snuset. Kroppen har ställt om till ett liv utan nikotin, och för de flesta är det nu vanan snarare än beroendet som ibland gör sig påmind.',
    feels: 'För de flesta är snusfritt nu normaltillståndet. Enstaka sug kan komma vid stark stress, men de går över snabbt.',
    tips: [
      'Du har sparat i storleksordningen 5 000 kr. Det syns.',
      'Var extra uppmärksam vid livskriser — det är då gamla vanor kommer tillbaka.',
      'Räkna dig inte som "nästan klar". Snusfri är ett tillstånd, inte en målgång.',
    ],
  },
];

export const FAQ_COMMON = [
  {
    q: 'Hur länge varar abstinensen när man slutar snusa?',
    a: 'Abstinensen brukar vara som starkast de första dagarna, ofta dag 1–3. De flesta fysiska symtomen klingar av inom två till fyra veckor. Sug kopplat till vanor och situationer kan dyka upp i flera månader, men blir glesare och svagare över tid.',
  },
  {
    q: 'Vilken dag är svårast?',
    a: 'För de flesta är dag 2 och 3 svårast — nikotinet är borta och hjärnan reagerar som mest. Kommer du förbi de första dagarna brukar det bli lättare. Många återfall sker tidigt, så det lönar sig att ha en plan just för den första veckan.',
  },
  {
    q: 'Vad händer i munnen när man slutar snusa?',
    a: 'Snus ger ofta en vit, skrynklig förändring i slemhinnan där prillan brukar ligga. Den brukar gå tillbaka inom några veckor efter att man slutat. Tandkött som dragit sig tillbaka växer inte ut igen, men slutar påverkas. Finns en förändring kvar efter ett par månader, eller är det ett sår som inte läker, ska du visa det för en tandläkare.',
  },
  {
    q: 'Går man upp i vikt när man slutar snusa?',
    a: 'Vissa gör det. Nikotin dämpar aptiten, så många blir hungrigare när de slutar, och munnen letar efter något annat att göra. Det brukar handla om några kilo. Ha nyttiga alternativ nära till hands, till exempel frukt, grönsaksstavar eller sockerfritt tuggummi, och rör på dig.',
  },
  {
    q: 'Hjälper nikotinfritt snus?',
    a: 'För många ja, eftersom det behåller den fysiska vanan medan nikotinberoendet bryts. Nackdelen är att rutinen bevaras, vilket kan göra det svårare att släppa helt längre fram. Prova och se vad som fungerar för dig.',
  },
  {
    q: 'Hur mycket pengar sparar man?',
    a: 'En dosa om dagen kostar ungefär 50–65 kr, alltså cirka 1 500–2 000 kr i månaden och 18 000–24 000 kr om året. Snusfri Resa räknar det åt dig i realtid utifrån ditt eget pris och din egen förbrukning.',
  },
];
