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
    body: 'Nikotinhalten i blodet halveras redan efter ungefär åtta timmar. Efter ett dygn är nikotinet i stort sett utrensat ur kroppen — och det är precis därför abstinensen toppar nu. Puls och blodtryck har börjat sjunka.',
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
    title: 'Andra dagen — smaken börjar komma tillbaka',
    body: 'Efter ungefär 48 timmar börjar smakreceptorerna i munnen återhämta sig. Många märker det först på kaffe och mat som plötsligt smakar starkare. Nikotinet är borta ur kroppen; det som återstår är vanan och abstinensen.',
    feels: 'Ofta den tyngsta dagen tillsammans med dag 3. Huvudvärk, dålig sömn och ett kort stubin är vanligt. Suget kommer i vågor på några minuter — inte som ett konstant tillstånd.',
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
    body: 'Dag tre är för de flesta vändpunkten: de värsta cravingsen börjar klinga av härifrån. Kroppen är nikotinfri sedan ett par dygn, och tandköttet har börjat läka där prillan legat.',
    feels: 'Om du känner dig ovanligt irriterad, okoncentrerad eller nedstämd just nu är det helt förväntat — dag 2–3 är statistiskt den svåraste perioden. Det blir mätbart lättare härifrån.',
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
    body: 'Kroppen har varit nikotinfri i flera dygn. Tandköttet fortsätter läka och smaken är på väg tillbaka. Det du kämpar mot nu är inbyggda automatiska rörelser, inte ett fysiskt beroende.',
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
    body: 'Nästan en hel vecka utan nikotin. Smaken är märkbart bättre för de flesta, och tandköttet har börjat återhämta sig ordentligt där prillan legat.',
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
    body: 'Efter en vecka är smaken tillbaka och tandköttet läker synligt för många. Blodtrycket har börjat stabiliseras på en lägre nivå än när du snusade.',
    feels: 'Den akuta abstinensen är över. Suget finns kvar men är kortare och glesare. De flesta känner sig mer som sig själva igen.',
    tips: [
      'Du har passerat den svåraste veckan — de flesta återfall sker före dag 7.',
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
    body: 'Blodtrycket har stabiliserats på en lägre nivå. Munslemhinnan och tandköttet fortsätter läka där prillan legat. Nikotinreceptorerna börjar normaliseras — det är därför suget känns svagare.',
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
    body: 'Efter en månad har munlesioner läkt för de flesta och tandköttet har återhämtat sig betydligt. Nikotinberoendet är brutet fysiologiskt — det som är kvar är psykologiskt och blir svagare för varje vecka.',
    feels: 'De flesta beskriver det som att det knappt är en kamp längre. Suget dyker upp sällan, ofta kopplat till stress eller alkohol.',
    tips: [
      'Du har sparat ungefär 1 500–2 000 kr. Gör något konkret av dem.',
      'Boka tandläkare om du inte gjort det — tandköttet är det som påverkats mest.',
      'Skriv ner varför du slutade. Du kommer behöva läsa det någon gång.',
    ],
  },
  {
    slug: 'dag-90',
    day: 90,
    label: '3 månader',
    title: 'Tre månader snusfri',
    body: 'Munhälsan är märkbart bättre och risken för tandlossning sjunker. Efter ett år närmar sig hjärtkärlrisken en icke-användares nivå — du är en tredjedel dit.',
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
    a: 'Den fysiska abstinensen toppar efter ungefär ett dygn, när nikotinet lämnat kroppen, och klingar av tydligt från dag 3. De flesta är igenom det värsta efter en vecka. Suget som kommer därefter är vanemässigt snarare än fysiskt och blir glesare för varje vecka.',
  },
  {
    q: 'Vilken dag är svårast?',
    a: 'Dag 2 och 3 är statistiskt de svåraste — nikotinet är utrensat och receptorerna reagerar som mest. Kommer du förbi dag 3 blir det mätbart lättare. De flesta återfall sker under den första veckan.',
  },
  {
    q: 'Vad händer i munnen när man slutar snusa?',
    a: 'Smakreceptorerna börjar återhämta sig efter ungefär två dygn. Tandköttet där prillan legat börjar läka inom en vecka, och munlesioner läker vanligen inom en månad. Efter ungefär tre månader är munhälsan märkbart bättre och risken för tandlossning sjunker.',
  },
  {
    q: 'Går man upp i vikt när man slutar snusa?',
    a: 'Vissa gör det, ofta för att munnen söker något annat att göra och för att smaken kommer tillbaka. Det brukar handla om några kilo och går att motverka med att ha ett nikotinfritt alternativ redo. Viktuppgången är en betydligt mindre hälsorisk än fortsatt bruk.',
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
