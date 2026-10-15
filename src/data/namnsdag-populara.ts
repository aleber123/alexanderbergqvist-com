/**
 * The almanac names that get an indexable /namnsdag/namn/<slug>/ page.
 *
 * Why a list at all: the almanac has ~630 names and one thin page per
 * name made up two thirds of the sitemap. Google left most of them
 * "Discovered – currently not indexed", and the mass of near-identical
 * programmatic pages dragged down crawl priority for the whole site.
 * Only names people actually search for keep an indexable page; every
 * other name page stays reachable (same URL, `noindex, follow`) and every
 * name is still listed on its month page (/namnsdag/<månad>/).
 *
 * SELECTION — 150 names, 75 male + 75 female, ordered by popularity:
 * SCB:s namnstatistik, the most common tilltalsnamn (given names used
 * day to day) among people registered in Sweden — the published top-100
 * lists for men and women — intersected with the names that actually
 * appear in the Swedish almanac (Svenska Akademiens namnlängd). Spellings
 * follow the almanac: SCB's "Thomas", "Marcus", "Linnéa", "Wilma" etc.
 * are counted under the almanac's Tomas, Markus, Linnea, Vilma. Names
 * that are common but have no almanac day (e.g. Mohammed, Thomas, Marie,
 * Susanne, Therese) cannot have a name-day page and are skipped.
 * The order is approximate (SCB's lists change a little every year) and
 * is only used for the cut-off. Check a name in SCB:s Namnsök
 * (https://www.scb.se/hitta-statistik/sverige-i-siffror/namnsok/).
 *
 * ORIGIN NOTES — short, conservative, written by us. Only names whose
 * origin is well established in standard name dictionaries have a note;
 * where the meaning is disputed (e.g. Oskar, Gustav, Linda, Ida, Maria's
 * meaning) the note is left out rather than guessed.
 *
 * RELATED — spelling variants, short forms and male/female pairs. Shown
 * as links; a related name only links if it has its own page.
 */

/** Ordered by popularity (approx.), men first then women. */
export const POPULARA_HERRNAMN = [
  'Lars', 'Mikael', 'Anders', 'Johan', 'Erik', 'Per', 'Karl', 'Peter', 'Tomas', 'Jan',
  'Daniel', 'Fredrik', 'Hans', 'Andreas', 'Stefan', 'Mats', 'Markus', 'Magnus', 'Jonas', 'Bengt',
  'Nils', 'Martin', 'Mattias', 'Alexander', 'Bo', 'Sven', 'Leif', 'Göran', 'Oskar', 'Björn',
  'Gustav', 'Kjell', 'Henrik', 'Ulf', 'Krister', 'Patrik', 'Emil', 'Simon', 'Lennart', 'Viktor',
  'Filip', 'Robert', 'David', 'Rolf', 'William', 'Anton', 'Sebastian', 'Jonatan', 'Kristoffer', 'Joakim',
  'Roger', 'Lukas', 'Axel', 'Kent', 'Håkan', 'Linus', 'Elias', 'Hugo', 'Ludvig', 'Oliver',
  'Isak', 'Adam', 'Tobias', 'Rikard', 'Niklas', 'Jesper', 'Gunnar', 'Arne', 'Robin', 'Albin',
  'Jakob', 'Olof', 'Edvin', 'Leo', 'Vincent',
] as const;

export const POPULARA_DAMNAMN = [
  'Anna', 'Eva', 'Maria', 'Karin', 'Kristina', 'Lena', 'Sara', 'Kerstin', 'Emma', 'Ingrid',
  'Malin', 'Linda', 'Jenny', 'Hanna', 'Annika', 'Elin', 'Birgitta', 'Johanna', 'Inger', 'Sofia',
  'Carina', 'Elisabet', 'Ida', 'Julia', 'Ulla', 'Katarina', 'Linnea', 'Monika', 'Ebba', 'Matilda',
  'Camilla', 'Helena', 'Amanda', 'Åsa', 'Margareta', 'Elsa', 'Gunilla', 'Anneli', 'Sandra', 'Maja',
  'Alice', 'Vilma', 'Ella', 'Agneta', 'Astrid', 'Ellen', 'Klara', 'Lisa', 'Frida', 'Josefina',
  'Moa', 'Saga', 'Olivia', 'Alva', 'Ingela', 'Cecilia', 'Karolina', 'Erika', 'Felicia', 'Viktoria',
  'Mona', 'Gun', 'Siv', 'Barbro', 'Marianne', 'Berit', 'Pia', 'Anita', 'Agnes', 'Freja',
  'Louise', 'Lovisa', 'Emilia', 'Selma', 'Vera',
] as const;

export const POPULARA_NAMN: readonly string[] = [...POPULARA_HERRNAMN, ...POPULARA_DAMNAMN];

/** Short origin note (Swedish). Omitted where we are not confident. */
export const URSPRUNG: Record<string, string> = {
  // Herrnamn
  Lars: 'Svensk form av latinets Laurentius, ”mannen från Laurentum”.',
  Mikael: 'Från hebreiskan, ”vem är som Gud?”.',
  Anders: 'Svensk form av grekiska Andreas, som bygger på ordet för ”man”.',
  Johan: 'Kortform av Johannes, från hebreiskan ”Gud är nådig”.',
  Erik: 'Fornnordiskt namn som brukar tolkas som ”ensam härskare”.',
  Per: 'Svensk form av Petrus, grekiska för ”klippa”.',
  Karl: 'Fornnordiskt och germanskt namn som betyder ”fri man”.',
  Peter: 'Från grekiska Petros, ”klippa”.',
  Tomas: 'Från arameiskan, ”tvilling”.',
  Jan: 'Kortform av Johannes, från hebreiskan ”Gud är nådig”.',
  Daniel: 'Från hebreiskan, ”Gud är min domare”.',
  Fredrik: 'Germanskt namn av ord för ”fred” och ”härskare”.',
  Hans: 'Kortform av Johannes, från hebreiskan ”Gud är nådig”.',
  Andreas: 'Grekiskt namn som bygger på ordet för ”man”, ofta tolkat ”manlig, modig”.',
  Stefan: 'Från grekiska Stefanos, ”krans” eller ”krona”.',
  Mats: 'Svensk kortform av Mattias.',
  Markus: 'Latinskt namn, troligen bildat till krigsguden Mars.',
  Magnus: 'Latin för ”stor”.',
  Jonas: 'Från hebreiskan, ”duva”.',
  Bengt: 'Svensk form av Benedikt, latin för ”välsignad”.',
  Nils: 'Nordisk form av Nikolaus, grekiska för ”folkets seger”.',
  Martin: 'Latinskt namn bildat till krigsguden Mars.',
  Mattias: 'Från hebreiskan, ”Guds gåva”.',
  Alexander: 'Grekiskt namn, ”den som försvarar män”.',
  Sven: 'Fornnordiskt namn som betyder ”ung man”.',
  Leif: 'Fornnordiskt namn som betyder ”arvinge” eller ”ättling”.',
  Göran: 'Svensk form av Georg, grekiska för ”jordbrukare”.',
  Björn: 'Fornnordiskt namn efter djuret björn.',
  Kjell: 'Från fornnordiska Ketill, ”kittel”.',
  Henrik: 'Germanskt namn av ord för ”hem” och ”härskare”.',
  Ulf: 'Fornnordiskt namn som betyder ”varg”.',
  Patrik: 'Från latinets patricius, ”adelsman”.',
  Emil: 'Från det romerska släktnamnet Aemilius.',
  Simon: 'Från hebreiskan, ofta tolkat ”han har hört”.',
  Lennart: 'Svensk form av Leonhard, germanskt för ”stark som ett lejon”.',
  Viktor: 'Latin för ”segrare”.',
  Filip: 'Från grekiskan, ”den som älskar hästar”.',
  Robert: 'Germanskt namn av ord för ”ära” och ”lysande”.',
  David: 'Från hebreiskan, ”älskad”.',
  Rolf: 'Germanskt namn, av Hrodulf: ”ära” och ”varg”.',
  William: 'Engelsk form av Vilhelm, germanskt för ”vilja” och ”hjälm”.',
  Anton: 'Från det romerska släktnamnet Antonius.',
  Sebastian: 'Från grekiskan, ”vördnadsvärd”.',
  Jonatan: 'Från hebreiskan, ”Gud har gett”.',
  Kristoffer: 'Från grekiskan, ”den som bär Kristus”.',
  Joakim: 'Från hebreiskan, ”Gud upprättar”.',
  Roger: 'Germanskt namn av ord för ”ära” och ”spjut”.',
  Lukas: 'Latinskt namn, ”mannen från Lukanien”.',
  Axel: 'Nordisk form av det hebreiska namnet Absalom, ”fadern är fred”.',
  Kent: 'Efter det engelska grevskapet Kent.',
  Elias: 'Från hebreiskan, ”Herren är min Gud”.',
  Hugo: 'Germanskt namn som betyder ”sinne, förstånd”.',
  Ludvig: 'Germanskt namn av ord för ”berömd” och ”strid”.',
  Isak: 'Från hebreiskan, ”han skrattar”.',
  Adam: 'Från hebreiskan, ”människa”.',
  Tobias: 'Från hebreiskan, ”Gud är god”.',
  Rikard: 'Germanskt namn av ord för ”mäktig” och ”stark”.',
  Niklas: 'Kortform av Nikolaus, grekiska för ”folkets seger”.',
  Jesper: 'Nordisk form av Kasper, ett av namnen på de tre vise männen.',
  Gunnar: 'Fornnordiskt namn av ord för ”strid” och ”krigare”.',
  Arne: 'Fornnordiskt namn som betyder ”örn”.',
  Robin: 'Ursprungligen en smeknamnsform av Robert.',
  Albin: 'Från latinets albus, ”vit”.',
  Olof: 'Fornnordiskt namn som brukar tolkas ”förfädernas arvinge”.',
  Edvin: 'Fornengelskt namn av ord för ”rikedom” och ”vän”.',
  Leo: 'Latin för ”lejon”.',
  Vincent: 'Latin för ”segrande”.',
  // Damnamn
  Anna: 'Från hebreiska Hanna, ”nåd”.',
  Eva: 'Från hebreiskan, ”liv”.',
  Maria: 'Från hebreiska Mirjam.',
  Karin: 'Svensk form av Katarina.',
  Kristina: 'Från latinet, ”kristen”.',
  Lena: 'Kortform av Helena eller Magdalena.',
  Sara: 'Från hebreiskan, ”furstinna”.',
  Kerstin: 'Svensk form av Kristina.',
  Ingrid: 'Fornnordiskt namn, bildat till guden Ing och ”vacker”.',
  Malin: 'Svensk kortform av Magdalena.',
  Jenny: 'Smeknamnsform av Johanna.',
  Hanna: 'Från hebreiskan, ”nåd”.',
  Annika: 'Smeknamnsform av Anna.',
  Elin: 'Svensk form av Helena.',
  Johanna: 'Kvinnlig form av Johannes, ”Gud är nådig”.',
  Inger: 'Fornnordiskt namn bildat till guden Ing.',
  Sofia: 'Grekiska för ”visdom”.',
  Elisabet: 'Från hebreiskan, ofta tolkat ”Gud är mitt löfte”.',
  Julia: 'Kvinnlig form av det romerska släktnamnet Julius.',
  Ulla: 'Smeknamnsform av Ulrika.',
  Linnea: 'Efter blomman linnea, som fått sitt namn efter Carl von Linné.',
  Matilda: 'Germanskt namn av ord för ”kraft” och ”strid”.',
  Amanda: 'Latin för ”värd att älskas”.',
  Margareta: 'Från grekiskan, ”pärla”.',
  Elsa: 'Kortform av Elisabet.',
  Gunilla: 'Latiniserad form av det fornnordiska Gunhild, ”strid”.',
  Sandra: 'Kortform av Alexandra.',
  Maja: 'Svensk smeknamnsform av Maria.',
  Vilma: 'Kortform av Vilhelmina.',
  Agneta: 'Svensk form av Agnes.',
  Astrid: 'Fornnordiskt namn av ord för ”gud” och ”vacker”.',
  Ellen: 'Form av Helena.',
  Klara: 'Latin för ”klar, ljus”.',
  Lisa: 'Kortform av Elisabet.',
  Josefina: 'Kvinnlig form av Josef, från hebreiskan ”Gud ska lägga till”.',
  Saga: 'Efter Saga, en gudinna i den nordiska mytologin.',
  Olivia: 'Bildat till latinets oliva, ”olivträd”.',
  Cecilia: 'Från det romerska släktnamnet Caecilius.',
  Karolina: 'Kvinnlig form av Karl.',
  Erika: 'Kvinnlig form av Erik.',
  Felicia: 'Från latinet, ”lycklig”.',
  Viktoria: 'Latin för ”seger”.',
  Gun: 'Fornnordiskt namn som betyder ”strid”.',
  Siv: 'Efter Siv, Tors hustru i den nordiska mytologin.',
  Barbro: 'Svensk form av Barbara, grekiska för ”främmande”.',
  Marianne: 'Sammansättning av Maria och Anna.',
  Berit: 'Nordisk form av Birgitta.',
  Pia: 'Latin för ”from”.',
  Anita: 'Spansk smeknamnsform av Ana (Anna).',
  Freja: 'Efter kärleksgudinnan Freja i den nordiska mytologin.',
  Louise: 'Fransk kvinnlig form av Louis (Ludvig).',
  Lovisa: 'Svensk form av Louise, kvinnlig form av Ludvig.',
  Emilia: 'Kvinnlig form av Emil.',
  Vera: 'Ryska för ”tro”.',
};

/** Name families. A name's related names = the other members of every
 *  group it is in. Only almanac spellings; unknown names are ignored. */
const FAMILJER: string[][] = [
  ['Johan', 'Johannes', 'Jan', 'Hans', 'Johanna', 'Jenny'],
  ['Anna', 'Hanna', 'Annika', 'Anneli', 'Anita', 'Marianne'],
  ['Maria', 'Maja', 'Marianne'],
  ['Karl', 'Karolina'],
  ['Katarina', 'Karin'],
  ['Kristina', 'Kerstin', 'Krister', 'Kristoffer'],
  ['Erik', 'Erika'],
  ['Per', 'Peter', 'Petra'],
  ['Anders', 'Andreas'],
  ['Mats', 'Mattias'],
  ['Nils', 'Niklas'],
  ['Göran', 'Jörgen'],
  ['Alexander', 'Alexandra', 'Sandra'],
  ['Viktor', 'Viktoria'],
  ['Emil', 'Emilia'],
  ['Robert', 'Robin'],
  ['Ludvig', 'Louise', 'Lovisa'],
  ['Elisabet', 'Elsa', 'Lisa', 'Elise'],
  ['Helena', 'Elin', 'Ellen', 'Lena'],
  ['Magdalena', 'Malin', 'Lena'],
  ['Agnes', 'Agneta'],
  ['Birgitta', 'Berit', 'Britta'],
  ['Ingrid', 'Inger', 'Ingela', 'Ingemar', 'Ingegerd'],
  ['Barbro', 'Barbara'],
  ['Ulla', 'Ulrika'],
  ['Josefina', 'Josef'],
  ['Kasper', 'Jesper'],
  ['Gunhild', 'Gunilla', 'Gun'],
  ['Vilma', 'Vilhelm', 'William'],
  ['Mikael', 'Mikaela'],
  ['Daniel', 'Daniela'],
  ['Olof', 'Ola', 'Olle'],
  ['Henrik', 'Henry'],
  ['Markus', 'Marko'],
];

export function relatedNames(name: string, inAlmanac: (n: string) => boolean): string[] {
  const out = new Set<string>();
  for (const g of FAMILJER) {
    if (!g.includes(name)) continue;
    for (const n of g) if (n !== name && inAlmanac(n)) out.add(n);
  }
  return [...out];
}
