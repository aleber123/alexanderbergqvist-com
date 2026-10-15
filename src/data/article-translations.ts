/**
 * Which articles are translations (or localized equivalents) of each
 * other. Each group lists content-collection ids, one per language.
 *
 * Used for:
 *  - reciprocal <link rel="alternate" hreflang> on every article in a
 *    group (+ x-default → the Swedish version, else the English one).
 *    Before this, every article only declared itself, so Google had no
 *    way to connect /andas/box-andning-4-4-4-4/ with its English, German,
 *    Spanish and French versions.
 *  - the "Läs på andra språk" links under each article.
 *
 * Localized equivalents count (e.g. the sowing calendars for Sweden,
 * Germany, France, Spain, Italy and the USDA zones answer the same
 * question for each market) — that is what hreflang is for.
 *
 * When you add a translated article, add its id to the right group.
 * lib/article-translations.ts throws at build time if an id here does
 * not exist or two ids in a group share a language.
 */
export const ARTICLE_TRANSLATIONS: string[][] = [
  // Andas
  ['andas/4-7-8-andning-somn', 'andas/4-7-8-atmung-schlaf', 'andas/4-7-8-breathing-sleep', 'andas/respiracion-4-7-8-dormir', 'andas/respiration-4-7-8-sommeil', 'andas/respirazione-4-7-8-sonno'],
  ['andas/andning-mot-stress', 'andas/atmung-gegen-stress', 'andas/breathing-for-stress'],
  ['andas/box-andning-4-4-4-4', 'andas/box-atmung-4-4-4-4', 'andas/box-breathing-4-4-4-4', 'andas/respiracion-cuadrada-4-4-4-4', 'andas/respiration-carree-4-4-4-4'],
  ['andas/wim-hof-metoden-andning', 'andas/wim-hof-methode-atmung', 'andas/wim-hof-method-breathing', 'andas/metodo-wim-hof-respiracion', 'andas/methode-wim-hof-respiration'],
  ['andas/basta-andningsappen', 'andas/best-breathing-app-2026'],
  // Födelsedagar
  ['fodelsedagar/glomt-fodelsedag', 'fodelsedagar/forgot-a-birthday', 'fodelsedagar/geburtstag-vergessen', 'fodelsedagar/olvidar-cumpleanos', 'fodelsedagar/oublier-anniversaire'],
  ['fodelsedagar/familjekalender-fodelsedagar', 'fodelsedagar/family-birthday-calendar', 'fodelsedagar/familien-geburtstagskalender', 'fodelsedagar/calendrier-anniversaires-famille'],
  ['fodelsedagar/sms-grattis-fodelsedag', 'fodelsedagar/birthday-text-messages', 'fodelsedagar/geburtstagswuensche-sms', 'fodelsedagar/sms-anniversaire'],
  ['fodelsedagar/birthday-gift-ideas', 'fodelsedagar/geburtstagsgeschenke-ideen', 'fodelsedagar/ideas-regalos-cumpleanos', 'fodelsedagar/idees-cadeaux-anniversaire'],
  ['fodelsedagar/birthday-party-planning-checklist', 'fodelsedagar/geburtstagsfeier-checkliste', 'fodelsedagar/lista-planificacion-fiesta', 'fodelsedagar/checklist-planification-anniversaire'],
  ['fodelsedagar/wedding-anniversary-gifts-by-year', 'fodelsedagar/hochzeitstag-geschenke-nach-jahr', 'fodelsedagar/cadeaux-anniversaire-mariage-annee'],
  // Plantera
  ['plantera/forsta-tradgarden-fran-grunden', 'plantera/garten-anlegen', 'plantera/start-garden-from-scratch', 'plantera/crear-huerto-desde-cero', 'plantera/creer-potager-zero', 'plantera/creare-orto-da-zero'],
  ['plantera/jord-och-godsel-grunder', 'plantera/boden-duenger-grundlagen', 'plantera/soil-fertilizer-basics', 'plantera/suelo-fertilizantes-huerto', 'plantera/sol-engrais-potager', 'plantera/suolo-fertilizzanti-orto'],
  ['plantera/lattaste-grontsaker-att-odla', 'plantera/einfachstes-gemuese-anbauen', 'plantera/easiest-vegetables-to-grow', 'plantera/verduras-faciles-cultivar', 'plantera/legumes-faciles-cultiver', 'plantera/verdure-facili-coltivare'],
  ['plantera/odla-pa-balkong', 'plantera/balkongarten-fuer-anfaenger', 'plantera/container-gardening-beginners', 'plantera/jardineria-balcon-principiantes', 'plantera/jardin-balcon-debutants', 'plantera/orto-balcone-principianti'],
  ['plantera/skador-pa-tradgarden', 'plantera/schaedlinge-pflanzenkrankheiten', 'plantera/common-garden-pests-diseases', 'plantera/plagas-enfermedades-huerto', 'plantera/parasites-maladies-potager', 'plantera/parassiti-malattie-orto'],
  ['plantera/sa-kalender-sverige', 'plantera/aussaatkalender-deutschland', 'plantera/vegetable-sowing-calendar-usda', 'plantera/calendario-siembra-hortalizas', 'plantera/calendrier-semis-france', 'plantera/calendario-semina-orto'],
  // Surdeg
  ['surdeg/basta-mjolet-for-surdeg', 'surdeg/bestes-mehl-fuer-sauerteig', 'surdeg/best-flour-for-sourdough', 'surdeg/meilleure-farine-levain'],
  ['surdeg/basta-surdegsappen-2026', 'surdeg/best-sourdough-app-2026'],
  ['surdeg/min-surdeg-jaser-inte', 'surdeg/sauerteig-geht-nicht-auf', 'surdeg/sourdough-not-rising', 'surdeg/levain-ne-monte-pas'],
  ['surdeg/oven-spring-knapra-skorpa', 'surdeg/ofentrieb-knusprige-kruste', 'surdeg/oven-spring-crusty-crust'],
  ['surdeg/surdeg-fran-grunden', 'surdeg/sauerteig-ansatz-selber-machen', 'surdeg/sourdough-starter-from-scratch', 'surdeg/levain-depart-zero'],
  ['surdeg/surdeg-i-kylen', 'surdeg/sauerteig-im-kuehlschrank', 'surdeg/sourdough-storage-fridge', 'surdeg/levain-au-frigo'],
  ['surdeg/utrustning-surdegsbakning', 'surdeg/sauerteig-ausruestung', 'surdeg/sourdough-equipment-guide', 'surdeg/equipement-boulange-levain'],
  // Rita
  ['rita/basta-farglaggningsapp-barn', 'rita/best-coloring-app-for-kids-2026'],
];
