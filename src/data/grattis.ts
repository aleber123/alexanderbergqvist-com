// Data behind the /fodelsedagar/grattis/ cluster.
//
// Why this exists: "grattis på födelsedagen"-queries already surface the site at
// positions 7-10 with no page actually targeting them, and Google shows no
// answer box for them — so a real page can take the click. The searcher is
// mid-task (writing a message right now), which is about as close to install
// intent as a birthday app gets.
//
// The messages are written to be *sendable* — no filler, no rhyme-for-the-sake
// -of-rhyme. Someone should be able to copy one without editing it.

export interface Relation {
  slug: string;
  name: string; // used in headings: "Grattis till <name>"
  label: string; // nav/card label
  intro: string;
  messages: { warm: string[]; funny: string[]; short: string[] };
}

export const MILESTONES = [18, 30, 40, 50, 60, 70] as const;

export const RELATIONS: Relation[] = [
  {
    slug: 'mamma',
    name: 'mamma',
    label: 'Mamma',
    intro:
      'Till mamma får det gärna bli personligt. Det som brukar landa bäst är inte de stora orden, utan att du nämner något konkret hon gjort.',
    messages: {
      warm: [
        'Grattis på födelsedagen, mamma. Tack för att du alltid finns — även när jag inte säger att jag behöver det.',
        'Grattis mamma! Ju äldre jag blir, desto mer förstår jag hur mycket du faktiskt har gjort. Tack.',
        'Stort grattis på dagen, mamma. Hoppas du blir ordentligt firad idag — du förtjänar det mer än de flesta.',
        'Grattis, mamma. Du har en förmåga att få allt att kännas lite lättare. Hoppas dagen blir precis som du vill ha den.',
        'Grattis på födelsedagen! Tack för all mat, alla skjutsar och alla samtal. Jag glömmer inte.',
        'Idag firar vi dig, mamma. Tack för att du är den du är — ha en underbar dag.',
      ],
      funny: [
        'Grattis mamma! Du åldras med värdighet — till skillnad från mig, som ärvde ditt tålamod men inte ditt lugn.',
        'Grattis på dagen! Lugn, jag har inte glömt — jag har bara en app som påminner mig.',
        'Grattis mamma! Officiellt har du fyllt år. Inofficiellt är du fortfarande yngre än alla dina vänner.',
        'Grattis! Tack för generna, tålamodet och för att du fortfarande låtsas att mina skämt är roliga.',
      ],
      short: [
        'Grattis på födelsedagen, mamma! ❤️',
        'Grattis, mamma. Ha en fin dag!',
        'Stort grattis! Kramar.',
        'Grattis mamma — du är bäst.',
      ],
    },
  },
  {
    slug: 'pappa',
    name: 'pappa',
    label: 'Pappa',
    intro:
      'Till pappa fungerar ofta det korta och konkreta bättre än det känslosamma. Ett tack för något specifikt slår en lång hyllning.',
    messages: {
      warm: [
        'Grattis på födelsedagen, pappa. Tack för allt du lärt mig — mest genom att bara göra det, inte prata om det.',
        'Grattis, pappa! Du har alltid ställt upp utan att göra en grej av det. Det betyder mer än du tror.',
        'Stort grattis på dagen. Hoppas du får göra precis det du vill idag — helst utan att fixa något åt någon annan.',
        'Grattis pappa. Tack för lugnet, för hjälpen och för att du alltid svarar när jag ringer.',
        'Grattis på födelsedagen! Ha en riktigt bra dag idag, du har förtjänat den.',
      ],
      funny: [
        'Grattis pappa! Ännu ett år närmare att få säga vad du tycker utan att någon protesterar.',
        'Grattis! Du blir inte äldre, bara mer erfaren på att ha rätt.',
        'Grattis på dagen, pappa. Jag har ärvt din humor — förlåt till alla andra.',
        'Grattis! Firandet står jag för. Grillen står du för, som vanligt.',
      ],
      short: [
        'Grattis på födelsedagen, pappa!',
        'Grattis, pappa. Ha en fin dag.',
        'Stort grattis! Kram.',
        'Grattis — hoppas dagen blir bra!',
      ],
    },
  },
  {
    slug: 'van',
    name: 'en vän',
    label: 'Vän',
    intro:
      'Till en vän kan du vara mer avslappnad. Det bästa gratulationsmeddelandet till en kompis låter som du — inte som ett kort från affären.',
    messages: {
      warm: [
        'Grattis på födelsedagen! Så glad att du finns. Vi måste ses snart.',
        'Grattis! Hoppas dagen blir precis så bra som du är.',
        'Stort grattis på dagen! Tack för att du är en sådan bra vän — det är inte självklart.',
        'Grattis! Ännu ett år med dig i mitt liv, vilket är rätt bra deal för mig.',
        'Grattis på födelsedagen! Fira ordentligt, du förtjänar det.',
      ],
      funny: [
        'Grattis! Du ser inte en dag äldre ut än förra året, vilket säger mer om förra året än om idag.',
        'Grattis på dagen! Jag hade skrivit något djupt, men du hade blivit misstänksam.',
        'Grattis! Åldern är bara en siffra. En stigande sådan, men ändå.',
        'Grattis! Lovar att komma på kalaset. Lovar inget om när jag går hem.',
        'Grattis på födelsedagen! Officiellt äldre, praktiskt taget oförändrad.',
      ],
      short: [
        'Grattis på födelsedagen! 🎉',
        'Grattis! Ha en fin dag.',
        'Stort grattis!',
        'Grattis — vi hörs!',
      ],
    },
  },
  {
    slug: 'kollega',
    name: 'en kollega',
    label: 'Kollega',
    intro:
      'Till en kollega gäller vänligt men neutralt. Håll det kort — ett för personligt meddelande kan kännas obekvämt på jobbet.',
    messages: {
      warm: [
        'Grattis på födelsedagen! Hoppas du får en fin dag.',
        'Stort grattis! Trevligt att jobba med dig — ha en bra dag idag.',
        'Grattis på dagen! Hoppas du hinner fira ordentligt efter jobbet.',
        'Grattis! Önskar dig en riktigt trevlig födelsedag.',
      ],
      funny: [
        'Grattis på födelsedagen! Du får ta ledigt i tanken åtminstone.',
        'Grattis! Tårta i fikarummet är väl en rimlig förväntan?',
        'Grattis på dagen — jag lovar att inte boka några möten efter tre.',
      ],
      short: [
        'Grattis på födelsedagen!',
        'Stort grattis!',
        'Grattis — ha en fin dag!',
        'Grattis på dagen!',
      ],
    },
  },
  {
    slug: 'partner',
    name: 'din partner',
    label: 'Partner',
    intro:
      'Till en partner får det gärna bli personligt och specifikt. Nämn något bara ni två vet om — det slår varje färdig fras.',
    messages: {
      warm: [
        'Grattis på födelsedagen, älskling. Tacksam varje dag för att det blev du.',
        'Grattis! Att få fira dig är det bästa jag vet. Älskar dig.',
        'Stort grattis på dagen. Du gör vardagen bättre utan att ens försöka.',
        'Grattis, min favorit. Idag är det bara du som gäller.',
        'Grattis på födelsedagen! Ännu ett år tillsammans — och jag skulle valt likadant igen.',
      ],
      funny: [
        'Grattis! Du blir äldre, jag blir tålmodigare. Systemet fungerar.',
        'Grattis på dagen! Du får bestämma allt idag. Bara idag.',
        'Grattis, älskling. Jag har till och med diskat. Frivilligt.',
      ],
      short: [
        'Grattis, älskling! ❤️',
        'Grattis på dagen, min favorit.',
        'Stort grattis! Älskar dig.',
        'Grattis! ❤️',
      ],
    },
  },
  {
    slug: 'syster',
    name: 'din syster',
    label: 'Syster',
    intro:
      'Till en syster funkar humor och värme lika bra — ni känner varandra tillräckligt väl för båda.',
    messages: {
      warm: [
        'Grattis på födelsedagen, syrran! Glad att jag har dig.',
        'Grattis! Tack för att du alltid förstår utan att jag behöver förklara.',
        'Stort grattis på dagen. Hoppas den blir precis som du vill.',
        'Grattis, syrran. Du är en av de bästa jag vet.',
      ],
      funny: [
        'Grattis! Du är fortfarande äldst. Eller yngst. Poängen kvarstår.',
        'Grattis på dagen! Jag lovar att inte berätta hur gammal du fyller.',
        'Grattis syrran! Tack för att du tog smällen först i allt.',
      ],
      short: [
        'Grattis, syrran! 🎉',
        'Stort grattis!',
        'Grattis — kram!',
        'Grattis på dagen!',
      ],
    },
  },
  {
    slug: 'bror',
    name: 'din bror',
    label: 'Bror',
    intro:
      'Till en bror räcker det ofta långt med kort och lite skämtsamt — men ett ärligt ord brukar landa hårdare än man tror.',
    messages: {
      warm: [
        'Grattis på födelsedagen, brorsan! Bra att ha dig.',
        'Grattis! Tack för att du alltid ställer upp när det gäller.',
        'Stort grattis på dagen — hoppas den blir bra.',
        'Grattis, brorsan. Du är en av få jag alltid kan ringa.',
      ],
      funny: [
        'Grattis! Fortfarande äldre än mig i minst ett år till.',
        'Grattis på dagen, brorsan. Presenten kommer. Någon gång.',
        'Grattis! Du åldras som ett bra vin — långsamt och lite surt.',
      ],
      short: [
        'Grattis, brorsan!',
        'Stort grattis!',
        'Grattis på dagen!',
        'Grattis — vi ses!',
      ],
    },
  },
  {
    slug: 'barn',
    name: 'ditt barn',
    label: 'Barn',
    intro:
      'Till ett barn ska det vara enkelt, varmt och lite festligt. Håll meningarna korta — de ska kunna läsas högt.',
    messages: {
      warm: [
        'Grattis på födelsedagen, älskade du! Vi är så stolta över dig.',
        'Grattis! Idag är hela dagen din. Vad vill du göra?',
        'Stort grattis på födelsedagen! Du gör oss glada varje dag.',
        'Grattis, gubben/gumman! Vi älskar dig så mycket.',
      ],
      funny: [
        'Grattis! Nu är du så gammal att du nästan får bestämma middagen. Nästan.',
        'Grattis på dagen! Tårta till frukost räknas idag.',
        'Grattis! Ett år äldre, ett år bättre på att förhandla om läggtiden.',
      ],
      short: [
        'Grattis på födelsedagen! 🎂',
        'Grattis, älskling!',
        'Stort grattis! 🎉',
        'Grattis på dagen!',
      ],
    },
  },
  {
    slug: 'mormor-farmor',
    name: 'mormor eller farmor',
    label: 'Mormor/Farmor',
    intro:
      'Till mormor eller farmor uppskattas det traditionella och varma. Ett handskrivet kort slår ett sms — men ett sms slår tystnad.',
    messages: {
      warm: [
        'Grattis på födelsedagen, mormor! Tack för allt du gör för oss.',
        'Grattis farmor! Hoppas du blir riktigt firad idag.',
        'Stort grattis på dagen. Tack för alla goda bakverk och alla goda råd.',
        'Grattis! Du är en klippa i familjen. Ha en underbar dag.',
        'Grattis på födelsedagen — vi tänker på dig idag!',
      ],
      funny: [
        'Grattis! Du har fler år men mer energi än oss alla.',
        'Grattis på dagen! Lovar att komma på kaffe snart — den här gången på riktigt.',
        'Grattis mormor! Du är bevis på att man blir bättre med åren.',
      ],
      short: [
        'Grattis på födelsedagen, mormor! ❤️',
        'Stort grattis, farmor!',
        'Grattis — kram från oss!',
        'Grattis på dagen!',
      ],
    },
  },
];

export const TONES = [
  { key: 'warm', label: 'Varmt', hint: 'Personligt och uppriktigt' },
  { key: 'funny', label: 'Roligt', hint: 'Lättsamt och skämtsamt' },
  { key: 'short', label: 'Kort', hint: 'När du bara vill hinna säga det' },
] as const;

/** Milestone-specific lines, appended on the milestone pages. */
export const MILESTONE_LINES: Record<number, string[]> = {
  18: [
    'Grattis på 18-årsdagen! Nu är allt ditt eget ansvar — lycka till med det.',
    'Stort grattis till 18! Myndig, men lova att fortsätta ringa hem.',
    'Grattis! 18 år. Nu börjar det roliga (och räkningarna).',
  ],
  30: [
    'Grattis på 30-årsdagen! Sägs vara då man börjar veta vem man är. Vi får se.',
    'Stort grattis till 30! Fortfarande ung, men nu med bättre säng.',
    'Grattis! 30 år och fortfarande inte tråkig. Bra jobbat.',
  ],
  40: [
    'Grattis på 40-årsdagen! Halvvägs, och den bästa halvan börjar nu.',
    'Stort grattis till 40! Ålder är en siffra — din är bara lite större nu.',
    'Grattis! 40 år av erfarenhet och fortfarande nyfiken. Snyggt.',
  ],
  50: [
    'Grattis på 50-årsdagen! Ett halvt sekel av att göra det på ditt sätt.',
    'Stort grattis till 50! Nu får du säga "på min tid" utan att någon protesterar.',
    'Grattis! 50 år, och du bär det bättre än de flesta.',
  ],
  60: [
    'Grattis på 60-årsdagen! Ännu ett decennium av att veta bäst — och ofta ha rätt.',
    'Stort grattis till 60! Ha en dag lika fin som du förtjänar.',
    'Grattis! 60 år och fler bra historier än någon annan i rummet.',
  ],
  70: [
    'Grattis på 70-årsdagen! Sju decennier — det ska firas ordentligt.',
    'Stort grattis till 70! Tack för allt du delat med dig av.',
    'Grattis! 70 år och fortfarande den som håller ihop oss.',
  ],
};
