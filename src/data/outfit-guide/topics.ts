import type { Topic } from './types';

/**
 * Weather conditions (rain, wind, snow) and occasions (office, date
 * night, travel). Each has a per-temperature table, which is what makes
 * them more than a rewrite of the band pages. App rules quoted here are
 * taken from the dressday engine (outfit_engine.dart, weather_bands.dart).
 */
export const TOPICS: Topic[] = [
  {
    key: 'rain',
    kind: 'weather',
    slug: 'rain',
    crumb: 'Rain',
    image: 'rain',
    imageAlt:
      'Man on a rain-soaked evening street under a black umbrella, in a long black raincoat, black roll-neck, charcoal trousers and black leather boots',
    eyebrow: 'Weather · Rain',
    title: 'What to Wear When It’s Raining: Outfits by Temperature',
    metaDescription:
      'What to wear when it’s raining: a waterproof or water-resistant jacket with a hood, quick-drying layers and waterproof shoes — with outfits for cold, mild and warm rain.',
    h1: 'What to wear when it’s raining',
    answer:
      'When it rains, wear a hooded waterproof jacket or trench over layers that suit the temperature, trousers that dry quickly or sit above the ankle, and waterproof shoes or boots with a rubber sole. In light drizzle a water-resistant jacket is enough; in steady rain choose fully waterproof. Leave suede and canvas at home.',
    appRule:
      'Today’s Outfit treats a day as rainy from 0.5 mm of rain. Up to 2 mm a water-resistant outer layer is enough; above 2 mm (or with heavy rain or thunder) it wants a waterproof one from 6 °C up and moves rain-sensitive shoes like suede and canvas out of the way. Rain makes an outer layer required at every temperature — even on a warm day.',
    intro: [
      'Rain changes three things: your outer layer, your shoes and your fabrics. The temperature still decides everything underneath, so a rainy 18 °C day needs a very different outfit from a rainy 4 °C day.',
      'The most common mistake is wearing a warm coat that is not waterproof. Wool keeps out a shower but soaks through in steady rain — a waterproof shell over a knit is warmer and drier.',
    ],
    tableTitle: 'Rain outfit by temperature',
    rows: [
      {
        label: 'Below 6 °C · 42 °F',
        outfit:
          'Knit under a waterproof parka or a padded coat with a water-resistant finish; waterproof boots; hat or hood, gloves.',
        note: 'Between −2 and +3 °C rain means slush: waterproof boots only.',
      },
      {
        label: '6–11 °C · 42–52 °F',
        outfit:
          'Sweater under a hooded waterproof jacket or a lined trench; jeans or trousers; waterproof boots or rubber-soled shoes.',
      },
      {
        label: '12–16 °C · 53–61 °F',
        outfit:
          'Long-sleeve top or light knit under an unlined waterproof or a trench; trousers that dry fast; leather sneakers or boots.',
      },
      {
        label: '17–21 °C · 62–70 °F',
        outfit:
          'T-shirt or shirt under a thin waterproof shell; cropped trousers or a skirt; rubber-soled shoes.',
      },
      {
        label: '22 °C+ · 71 °F+',
        outfit:
          'One light layer under a packable, breathable rain jacket; shorts or a skirt; sandals with a grippy sole or rubber shoes.',
        note: 'Warm rain: skip the coat, stay breathable.',
      },
    ],
    formula: {
      base: 'Quick-drying top suited to the temperature',
      top: 'Wool or synthetic knit when it is cool — not cotton sweatshirts',
      bottom: 'Trousers that dry fast, or cropped above the puddles',
      shoes: 'Waterproof boots or rubber-soled shoes',
      outer: 'Hooded waterproof jacket or a waterproof trench',
      accessories: 'Compact umbrella; a hat if the jacket has no hood',
    },
    women: {
      base: 'Merino or viscose long-sleeve',
      top: 'Fine-gauge knit',
      bottom: 'Straight trousers or dark jeans; a skirt with tights and boots',
      shoes: 'Rubber Chelsea boots or waterproof leather boots',
      outer: 'Waterproof trench with a hood, or a rubberised raincoat',
      accessories: 'Compact umbrella, water-resistant tote',
    },
    men: {
      base: 'T-shirt or thin long-sleeve',
      top: 'Black merino roll-neck',
      bottom: 'Charcoal trousers — dark hides the splashes',
      shoes: 'Black waterproof leather boots with a rubber sole',
      outer: 'Long black waterproof raincoat (or a hooded shell)',
      accessories: 'Large black umbrella',
    },
    fabrics: [
      { name: 'Waterproof membranes and coated shells', why: 'The only thing that stays dry in steady rain.' },
      { name: 'Waxed cotton and rubberised fabrics', why: 'Classic raincoat materials that shed water.' },
      { name: 'Merino wool', why: 'Stays warm when damp, unlike cotton.' },
      { name: 'Synthetic and nylon trousers', why: 'Dry in minutes after a downpour.' },
    ],
    avoid: [
      'Suede, canvas trainers and anything rain-sensitive in steady rain',
      'Wide trousers that drag in puddles',
      'Cotton hoodies as your only layer — they soak through and stay cold',
      'A wool coat in a downpour without a waterproof layer',
    ],
    tips: [
      'Light drizzle (up to about 2 mm) needs water-resistant, not waterproof — a trench is perfect.',
      'A hood beats an umbrella in wind.',
      'Dark trousers hide splashes; cropped trousers avoid them.',
    ],
    faq: [
      {
        q: 'What should I wear in the rain to stay dry?',
        a: 'A hooded waterproof jacket, quick-drying trousers and waterproof shoes. Layer for the temperature underneath — the waterproof only keeps the water out.',
      },
      {
        q: 'What shoes are best for rainy days?',
        a: 'Rubber boots, waterproof leather boots or shoes with a rubber sole. Avoid suede and canvas, which soak through and stain.',
      },
      {
        q: 'What should I wear on a warm rainy day?',
        a: 'A thin, breathable rain jacket over one light layer, shorts or a skirt, and shoes that can get wet. Skip warm coats — you will overheat.',
      },
      {
        q: 'Is a trench coat waterproof?',
        a: 'Most trench coats are water-resistant: fine in drizzle and showers, not in steady rain. Choose a coated or membrane trench for heavy rain.',
      },
    ],
  },
  {
    key: 'wind',
    kind: 'weather',
    slug: 'windy-weather',
    crumb: 'Wind',
    image: 'chilly',
    imageAlt:
      'Woman on an autumn cobbled street in a black leather jacket over a grey knit, ecru straight jeans and black ankle boots',
    eyebrow: 'Weather · Wind',
    title: 'What to Wear on a Windy Day: Wind-Proof Outfits',
    metaDescription:
      'What to wear when it’s windy: a closed, windproof outer layer, close-fitting layers underneath, trousers instead of loose skirts and a scarf — with outfits by temperature.',
    h1: 'What to wear on a windy day',
    answer:
      'On a windy day, wear a closed, windproof outer layer — a shell, quilted jacket or tightly woven trench — over a knit, and choose trousers or a fitted skirt with tights over loose hems. Add a scarf below about 12 °C (54 °F). Wind makes it feel colder, so dress for the feels-like temperature, not the thermometer.',
    appRule:
      'Today’s Outfit calls a day windy from 8 m/s (about 29 km/h or 18 mph). It uses wind chill to work out the feels-like temperature, scores windproof outer layers higher, adds a scarf below 12 °C when it is windy, and requires a jacket in the 12–16 °C band and suggests one on mild days.',
    intro: [
      'Wind does not lower the temperature — it strips away the warm air around your body. That is why 8 °C with a strong wind feels like 3–4 °C, and why a thin windproof layer can be warmer than a thick knit on its own.',
      'Closed fronts, fitted cuffs and a collar or scarf matter more on a windy day than extra thickness.',
    ],
    tableTitle: 'Windy-day outfit by temperature',
    rows: [
      {
        label: 'Below 6 °C · 42 °F',
        outfit:
          'Knit under a windproof puffer or parka with a high collar; hat, gloves and scarf; trousers rather than a skirt.',
      },
      {
        label: '6–11 °C · 42–52 °F',
        outfit:
          'Sweater under a windproof shell, quilted or field jacket; scarf; closed shoes.',
      },
      {
        label: '12–16 °C · 53–61 °F',
        outfit:
          'Long-sleeve top or fine knit plus a jacket you can close — the jacket is required on windy cool days.',
      },
      {
        label: '17–21 °C · 62–70 °F',
        outfit:
          'T-shirt or shirt with a light windbreaker or denim jacket; trousers or a fitted skirt.',
      },
      {
        label: '22 °C+ · 71 °F+',
        outfit:
          'One layer as usual — a breeze helps in the heat. Choose fitted or weighted hems and secure hats.',
      },
    ],
    formula: {
      base: 'Close-fitting base layer',
      top: 'Knit or fleece — warmth that the shell protects',
      bottom: 'Trousers, or a fitted skirt with tights',
      shoes: 'Closed shoes that stay on',
      outer: 'Windproof shell, quilted jacket or tightly woven trench, zipped up',
      accessories: 'Scarf or snood; a beanie rather than a brimmed hat',
    },
    women: {
      base: 'Fitted long-sleeve',
      top: 'Roll-neck knit',
      bottom: 'Straight trousers or a pencil skirt with tights',
      shoes: 'Ankle boots or loafers',
      outer: 'Zipped leather jacket, belted trench or a short quilted jacket',
      accessories: 'Wool scarf, rib beanie',
    },
    men: {
      base: 'T-shirt or long-sleeve tee',
      top: 'Merino sweater or a fleece quarter-zip',
      bottom: 'Chinos or jeans',
      shoes: 'Leather boots or sneakers',
      outer: 'Windproof shell, Harrington or field jacket',
      accessories: 'Scarf, beanie',
    },
    fabrics: [
      { name: 'Windproof membranes and shells', why: 'Block the wind with almost no weight.' },
      { name: 'Tightly woven cotton (gabardine, ventile)', why: 'Classic wind-resistant trench and jacket cloth.' },
      { name: 'Boiled wool and dense knits', why: 'Far more wind-resistant than open, loose knits.' },
      { name: 'Quilted nylon', why: 'Insulation with a wind-resistant outer.' },
    ],
    avoid: [
      'Loose, open-weave knits as your outer layer',
      'Flowing skirts and wide-brimmed hats',
      'Open jackets — close them up',
      'Umbrellas in strong gusts: wear a hood',
    ],
    tips: [
      'Dress one band colder than the thermometer when it is windy.',
      'A windproof layer over a thin knit beats a thick knit on its own.',
      'Cyclists create their own wind: dress as if it were windy every day.',
    ],
    faq: [
      {
        q: 'What wind speed counts as windy for clothes?',
        a: 'From about 8 m/s (29 km/h, 18 mph) you feel it in your clothes. That is the point where Today’s Outfit switches to wind-aware outfits.',
      },
      {
        q: 'How much colder does wind make it feel?',
        a: 'A lot when it is cold. At 5 °C (41 °F) a 30 km/h (18 mph) wind makes it feel around 0 °C (32 °F). In heat, wind helps you feel cooler.',
      },
      {
        q: 'What jacket is best for wind?',
        a: 'A windproof shell or a tightly woven jacket that closes to the neck. Add insulation underneath rather than relying on a thick but porous coat.',
      },
    ],
  },
  {
    key: 'snow',
    kind: 'weather',
    slug: 'snow',
    crumb: 'Snow',
    image: 'freezing',
    imageAlt:
      'Woman on a snowy street in a long black down parka, cream knit, grey scarf, black beanie and gloves, wide black trousers and lace-up boots',
    eyebrow: 'Weather · Snow',
    title: 'What to Wear in the Snow: Warm, Dry Outfits',
    metaDescription:
      'What to wear in the snow: thermal base, warm knit, insulated and water-resistant coat, waterproof boots with grip, hat, gloves and scarf — for dry snow and wet slush.',
    h1: 'What to wear in the snow',
    answer:
      'In the snow, wear a thermal or merino base, a warm knit and an insulated coat with a water-resistant outer, plus a beanie, gloves and a scarf. Waterproof, insulated boots with a deep rubber sole are the most important piece. For wet snow and slush around 0 °C (32 °F), choose waterproof over warm.',
    appRule:
      'On snowy days Today’s Outfit moves rain-sensitive shoes like suede and canvas aside and prefers warm, water-resistant outer layers. Between −2 and +3 °C with rain or snow it treats the day as slush: waterproof boots only, no loafers, and skirts or dresses only with thick tights.',
    intro: [
      'There are two kinds of snow days. Dry snow below about −2 °C is cold but easy: it brushes off. Wet snow and slush around zero is the tricky one — it soaks shoes and hems.',
      'Dress for both cold and wet: insulation underneath, something that sheds water on the outside, and boots that keep feet dry.',
    ],
    tableTitle: 'Snow outfit by type of snow',
    rows: [
      {
        label: 'Wet snow / slush · −2 to +3 °C · 28–37 °F',
        outfit:
          'Knit under a waterproof or water-resistant padded coat; waterproof boots with grip; trousers tucked in or above the boot.',
        note: 'No suede, canvas or loafers; skirts only with thick tights.',
      },
      {
        label: 'Dry snow · −2 to −10 °C · 14–28 °F',
        outfit:
          'Thermal base, thick knit, insulated coat or parka; beanie, gloves, scarf; insulated boots.',
      },
      {
        label: 'Deep cold · below −10 °C · 14 °F',
        outfit:
          'Thermal top and leggings, wool knit, long down parka with a hood; mittens; warmest boots and wool socks.',
      },
    ],
    formula: {
      base: 'Thermal or merino long-sleeve',
      top: 'Thick wool knit or fleece',
      bottom: 'Lined or wool trousers; thermal leggings when it is very cold',
      shoes: 'Insulated, waterproof boots with a deep rubber sole',
      outer: 'Insulated coat or parka with a water-resistant outer and a hood',
      accessories: 'Beanie, gloves or mittens, scarf, wool socks',
    },
    women: {
      base: 'Merino long-sleeve',
      top: 'Chunky roll-neck',
      bottom: 'Wool trousers, or a knit skirt with thick tights and tall boots',
      shoes: 'Lined, waterproof lace-up or tall boots with lug soles',
      outer: 'Long hooded down coat',
      accessories: 'Beanie, mittens, wool scarf',
    },
    men: {
      base: 'Thermal long-sleeve',
      top: 'Heavy wool sweater',
      bottom: 'Heavyweight jeans or lined chinos',
      shoes: 'Insulated waterproof boots',
      outer: 'Down parka with a hood',
      accessories: 'Beanie, insulated gloves, scarf',
    },
    fabrics: [
      { name: 'Down and synthetic insulation', why: 'Most warmth for the weight; synthetic copes better with wet snow.' },
      { name: 'Merino wool', why: 'A warm base that handles sweat from walking in snow.' },
      { name: 'Waterproof leather and rubber', why: 'Boots that keep feet dry.' },
      { name: 'Water-resistant shells', why: 'Shed snow so the insulation stays dry.' },
    ],
    avoid: [
      'Suede, canvas and mesh shoes',
      'Long, wide trousers that soak up slush',
      'Cotton base layers',
      'Smooth soles on packed snow and ice',
    ],
    tips: [
      'Boots first: warm, dry feet decide how the whole day feels.',
      'Gaiters or trousers tucked into boots keep snow out.',
      'Kids need about one band warmer than adults — the app dresses them that way.',
    ],
    faq: [
      {
        q: 'What should I wear in the snow if I don’t have snow boots?',
        a: 'Waterproof leather boots with a rubber sole and wool socks, ideally treated with a waterproofing spray. Avoid trainers in wet snow.',
      },
      {
        q: 'Are jeans OK in the snow?',
        a: 'In dry, light snow for a short time, yes. Jeans soak up wet snow and get very cold, so choose wool or lined trousers for long walks or slush.',
      },
      {
        q: 'Is a wool coat OK in snow?',
        a: 'Dense wool sheds light, dry snow well. In wet snow or for long periods, a water-resistant padded coat keeps you warmer.',
      },
    ],
  },
  {
    key: 'office',
    kind: 'occasion',
    slug: 'office',
    crumb: 'Office',
    image: 'hero-wide-2',
    imageAlt:
      'Woman leaning on a stone wall in a grey tailored blazer, white shirt and black pleated trousers with a cream leather tote',
    eyebrow: 'Occasion · Office',
    title: 'What to Wear to the Office in Any Weather',
    metaDescription:
      'What to wear to work in every temperature, from below freezing to 30 °C+: office outfits with layers, fabrics and shoes for cold commutes, mild days and summer heat.',
    h1: 'What to wear to the office in any weather',
    answer:
      'For the office, build on a work-appropriate base — shirt, blouse or fine knit with tailored trousers, a skirt or dark jeans — then adjust the layers to the weather: a wool coat and knit below 6 °C (42 °F), a trench or blazer at 6–16 °C, no jacket above 22 °C (71 °F). Always keep a light layer at your desk for the air-conditioning.',
    appRule:
      'Work is one of Today’s Outfit’s Premium occasions. It targets a smarter range on the app’s formality scale (3–4 of 5) and gives formality twice the weight it has on everyday outfits — then applies exactly the same weather rules on top.',
    intro: [
      'An office outfit has to survive three climates: the commute outside, the office inside and the air-conditioning in between. The answer is a smart core outfit that works indoors, with weather layers on top that come off at the door.',
      'The core changes surprisingly little through the year — it is the fabrics that change, from flannel and merino in winter to linen and cotton in summer.',
    ],
    tableTitle: 'Office outfit by temperature',
    rows: [
      { label: 'Below freezing · below 0 °C · 32 °F', outfit: 'Merino base under a shirt or blouse, fine wool knit, wool trousers; long insulated coat, scarf, gloves; waterproof leather boots — carry indoor shoes.' },
      { label: 'Cold · 0–5 °C · 32–41 °F', outfit: 'Roll-neck or shirt and knit, wool trousers or a midi skirt with thick tights; wool overcoat; leather boots.' },
      { label: 'Chilly · 6–11 °C · 42–52 °F', outfit: 'Shirt or blouse with a merino knit or blazer; trench or mac; loafers or Chelsea boots.' },
      { label: 'Cool · 12–16 °C · 53–61 °F', outfit: 'Shirt or blouse with a blazer or fine cardigan; tailored trousers or skirt; loafers or clean leather trainers.' },
      { label: 'Mild · 17–21 °C · 62–70 °F', outfit: 'Shirt, blouse or a knit polo with trousers or a midi skirt; unlined blazer for the commute.' },
      { label: 'Warm · 22–25 °C · 71–77 °F', outfit: 'Short-sleeve shirt or shell top, cotton or linen trousers or a skirt; no jacket outside; cardigan at the desk.' },
      { label: 'Hot · 26 °C+ · 78 °F+', outfit: 'Linen trousers or a midi dress, a loose short-sleeve shirt; loafers or neat sandals where allowed; light layer for the air-conditioning.' },
    ],
    formula: {
      base: 'Shirt, blouse or a fine knit',
      top: 'Blazer, cardigan or merino knit — the indoor layer',
      bottom: 'Tailored trousers, a midi skirt or dark jeans',
      shoes: 'Loafers, leather boots or clean leather trainers',
      outer: 'Weather layer that comes off at the door: overcoat, trench or none',
      accessories: 'A cardigan or scarf for the air-conditioning',
    },
    women: {
      base: 'Silk-feel blouse or a fine merino top',
      top: 'Single-breasted blazer or a long cardigan',
      bottom: 'Wide tailored trousers or a pleated midi skirt',
      shoes: 'Loafers, block heels or ankle boots',
      outer: 'Wool coat in winter, trench in spring and autumn',
      accessories: 'Structured tote, fine scarf',
    },
    men: {
      base: 'Oxford or poplin shirt',
      top: 'Merino crew or an unstructured blazer',
      bottom: 'Wool or cotton trousers',
      shoes: 'Loafers, Derbies or leather trainers',
      outer: 'Overcoat in winter, mac in spring and autumn',
      accessories: 'Leather bag, scarf in winter',
    },
    fabrics: [
      { name: 'Merino', why: 'Smart, thin warmth that does not overheat in a warm office.' },
      { name: 'Wool and wool blends', why: 'Trousers and blazers that hold their shape all day.' },
      { name: 'Cotton poplin', why: 'Crisp shirts and blouses year-round.' },
      { name: 'Linen blends', why: 'Summer tailoring that breathes but creases less than pure linen.' },
    ],
    avoid: [
      'Heavy knits that are too hot at your desk',
      'Rain-sensitive suede shoes on wet commutes',
      'Sheer summer fabrics without a layer for the air-conditioning',
    ],
    tips: [
      'Commute layer and office layer are two different things — plan both.',
      'Keep a pair of indoor shoes at work in winter.',
      'A blazer is the most useful office piece from 6 to 21 °C.',
    ],
    faq: [
      {
        q: 'What should I wear to work in winter?',
        a: 'A smart core — shirt or blouse, fine knit, wool trousers or a skirt with thick tights — under a long wool or insulated coat, with waterproof leather boots for the commute.',
      },
      {
        q: 'What should I wear to the office when it is hot?',
        a: 'Linen or cotton trousers or a midi skirt, a loose short-sleeve shirt or shell top, and loafers. Keep a light cardigan for the air-conditioning.',
      },
      {
        q: 'How do I dress for a cold office in summer?',
        a: 'Wear summer fabrics for the commute and keep a thin cardigan or merino layer at your desk.',
      },
    ],
  },
  {
    key: 'date',
    kind: 'occasion',
    slug: 'date-night',
    crumb: 'Date night',
    image: 'cold',
    imageAlt:
      'Man on a frosty waterfront in a camel wool overcoat, grey roll-neck, grey scarf, black gloves, charcoal trousers and black leather boots',
    eyebrow: 'Occasion · Date night',
    title: 'What to Wear on a Date Night, Whatever the Weather',
    metaDescription:
      'What to wear on a date night in every temperature: evening outfits for women and men from below freezing to hot summer nights, with the layer you need when the sun goes down.',
    h1: 'What to wear on a date night',
    answer:
      'For a date night, dress one step smarter than every day and plan for the evening temperature, which is usually a few degrees below the afternoon: a dark knit, tailored trousers or a dress and a wool coat when it is cold; a shirt or slip dress with a light jacket when it is mild; linen when it is hot.',
    appRule:
      'Party is one of Today’s Outfit’s Premium occasions: it aims for the dressiest pieces you own (4–5 on the app’s formality scale) and favours your most dressed-up pieces, while keeping every weather rule. The engine also dresses for the cooler part of the day, which is exactly what an evening out needs.',
    intro: [
      'Evenings are colder than afternoons, and restaurants are warmer than streets. A date-night outfit needs one great indoor layer and an outer layer that is easy to take off and hang up.',
      'Darker colours, better fabrics and one interesting piece do more than a completely new outfit.',
    ],
    tableTitle: 'Date-night outfit by evening temperature',
    rows: [
      { label: 'Below freezing · below 0 °C · 32 °F', outfit: 'Fine roll-neck, tailored wool trousers or a knit dress with thick tights; long wool coat; leather boots with a rubber sole; leather gloves.' },
      { label: 'Cold · 0–5 °C · 32–41 °F', outfit: 'Cashmere knit or silk-feel blouse, dark trousers or a midi skirt with tights; tailored overcoat; Chelsea boots.' },
      { label: 'Chilly · 6–11 °C · 42–52 °F', outfit: 'Shirt or slip dress with a knit layer; leather jacket or short wool coat; loafers or ankle boots.' },
      { label: 'Cool · 12–16 °C · 53–61 °F', outfit: 'Shirt or blouse with a blazer; dark jeans or a satin skirt; loafers or heeled boots.' },
      { label: 'Mild · 17–21 °C · 62–70 °F', outfit: 'Silk-feel shirt or a midi dress; light blazer or denim jacket for later; loafers or strappy flats.' },
      { label: 'Warm · 22–25 °C · 71–77 °F', outfit: 'Linen shirt or slip dress, light trousers or a skirt; a thin knit over the shoulders for later.' },
      { label: 'Hot · 26 °C+ · 78 °F+', outfit: 'Loose linen shirt or airy dress; linen trousers; leather sandals or espadrilles.' },
    ],
    formula: {
      base: 'Shirt, blouse, fine knit or a dress',
      top: 'One great indoor layer — knit or blazer',
      bottom: 'Dark tailored trousers, dark jeans or a midi skirt',
      shoes: 'Polished boots, loafers or neat sandals',
      outer: 'Coat or jacket that is easy to take off',
      accessories: 'One interesting piece: a scarf, bag or jewellery',
    },
    women: {
      base: 'Slip dress or a satin-finish blouse',
      top: 'Fine cardigan or a cropped knit',
      bottom: 'Tailored trousers or a midi skirt',
      shoes: 'Heeled boots, loafers or strappy flats',
      outer: 'Long wool coat or a leather jacket',
      accessories: 'Small shoulder bag, statement earrings',
    },
    men: {
      base: 'Knit polo or a crisp shirt',
      top: 'Fine merino or an unstructured blazer',
      bottom: 'Dark tailored trousers or dark jeans',
      shoes: 'Chelsea boots or loafers',
      outer: 'Overcoat, or a leather jacket on milder nights',
      accessories: 'Watch, scarf in winter',
    },
    fabrics: [
      { name: 'Cashmere and fine merino', why: 'Soft, warm and smart for cold evenings.' },
      { name: 'Satin-finish and silk-feel fabrics', why: 'Instantly dressier for shirts, blouses and skirts.' },
      { name: 'Wool tailoring', why: 'Trousers and blazers that hold their shape.' },
      { name: 'Linen', why: 'The smart choice for hot summer nights.' },
    ],
    avoid: [
      'Dressing for the afternoon temperature',
      'A coat you cannot comfortably take off and carry',
      'Smooth soles on icy evenings',
    ],
    tips: [
      'Evening temperature is usually 3–5 °C below the afternoon high.',
      'Dark colours and one texture (satin, cashmere, leather) do the dressing up.',
      'Restaurant terraces need a layer even in summer.',
    ],
    faq: [
      {
        q: 'What should I wear on a winter date?',
        a: 'A fine knit or blouse, dark tailored trousers or a knit dress with thick tights, a long wool coat and leather boots with a grippy sole.',
      },
      {
        q: 'What should I wear on a summer date night?',
        a: 'A linen shirt, slip dress or light trousers with sandals or loafers — and a thin knit or shirt for after sunset.',
      },
      {
        q: 'Should I dress for the daytime or evening temperature?',
        a: 'The evening. It is usually a few degrees cooler, so bring a layer you can take off in the restaurant.',
      },
    ],
  },
  {
    key: 'travel',
    kind: 'occasion',
    slug: 'travel',
    crumb: 'Travel',
    image: 'warm',
    imageAlt:
      'Man on a sunny harbour promenade in an open camel short-sleeve linen shirt over a white tee, black shorts and leather sandals',
    eyebrow: 'Occasion · Travel',
    title: 'What to Wear When Travelling: Pack for the Weather',
    metaDescription:
      'What to wear when travelling and what to pack for the weather at your destination: a travel-day outfit, layers that cover a wide temperature range and capsule packing by climate.',
    h1: 'What to wear when travelling',
    answer:
      'On a travel day, wear your bulkiest pieces — the warmest shoes, the jacket and a knit — in comfortable layers you can take off on a warm train or a cold plane. Then pack a small capsule for the destination’s temperature band: one outer layer, one or two warm layers and bottoms and tops that all go together.',
    appRule:
      'Today’s Outfit (Premium) can make a packing list: it plans one outfit per day from your own wardrobe for the current weather and lists the unique pieces to bring. Use this page to plan a trip to a different climate.',
    intro: [
      'Travel outfits have two jobs: survive the journey, and work for the weather you will meet. The journey is a mix of overheated trains, cold planes and outdoor waiting — layers are the answer.',
      'For the trip itself, pack by temperature band, not by day. A capsule of pieces that all go together gives more outfits from less luggage.',
    ],
    tableTitle: 'What to pack by destination temperature',
    rows: [
      { label: 'Winter city · below 5 °C · 41 °F', outfit: 'Wear the coat and boots; pack 2 knits, 2 trousers, 3 base layers, thermal top, scarf, hat, gloves.' },
      { label: 'Shoulder season · 6–16 °C · 42–61 °F', outfit: 'Wear a trench or field jacket and sneakers; pack 2 knits, a shirt, 3 tees, jeans and trousers, loafers or boots.' },
      { label: 'Spring / mild · 17–21 °C · 62–70 °F', outfit: 'Wear a light jacket; pack tees, a shirt, a thin cardigan, chinos or a skirt, a dress, sneakers.' },
      { label: 'Summer city · 22–25 °C · 71–77 °F', outfit: 'Pack linen and cotton tops, shorts, a skirt or light trousers, sandals and sneakers, a thin layer for evenings.' },
      { label: 'Heat and beach · 26 °C+ · 78 °F+', outfit: 'Pack linen shirts and dresses, light shorts, sandals, a hat, sunglasses and one long-sleeve for sun and air-conditioning.' },
    ],
    formula: {
      base: 'Soft, breathable T-shirt or long-sleeve',
      top: 'A knit or cardigan you can take off',
      bottom: 'Comfortable trousers with some stretch',
      shoes: 'Your bulkiest pair — sneakers or boots',
      outer: 'The jacket or coat you would otherwise pack',
      accessories: 'Scarf that doubles as a blanket',
    },
    women: {
      base: 'Soft long-sleeve tee',
      top: 'Long cardigan',
      bottom: 'Wide knit trousers or relaxed jeans',
      shoes: 'White sneakers or ankle boots',
      outer: 'Trench or light puffer',
      accessories: 'Large scarf, crossbody bag',
    },
    men: {
      base: 'Heavy tee',
      top: 'Merino crew or a zip knit',
      bottom: 'Stretch chinos',
      shoes: 'Leather sneakers or boots',
      outer: 'Field jacket or light down jacket',
      accessories: 'Scarf, cap',
    },
    fabrics: [
      { name: 'Merino', why: 'Warm, breathable and odour-resistant: wear it several times.' },
      { name: 'Jersey and stretch cotton', why: 'Comfortable for long journeys and does not crease.' },
      { name: 'Light down', why: 'Packs small and adds real warmth.' },
      { name: 'Linen blends', why: 'For warm destinations, with fewer creases than pure linen.' },
    ],
    avoid: [
      'Packing outfits that only work with one pair of shoes',
      'Tight waistbands on long journeys',
      'Bringing a coat in your case instead of wearing it',
    ],
    tips: [
      'Pack by temperature band, not by day.',
      'Pick a colour base (navy, black or camel) so everything combines.',
      'One layer more than you think for planes and trains.',
    ],
    faq: [
      {
        q: 'What is the most comfortable outfit for a long flight?',
        a: 'Soft layers you can take off: a breathable tee, a cardigan or knit, stretchy trousers, slip-on sneakers and a large scarf.',
      },
      {
        q: 'How many outfits should I pack for a week?',
        a: 'Fewer than you think: 5–6 tops, 2–3 bottoms, one dress or smarter outfit, two pairs of shoes and one outer layer combine into a full week when they share a colour base.',
      },
      {
        q: 'How do I pack for changing weather?',
        a: 'Layers: a T-shirt, a knit and a light waterproof jacket cover roughly 8–22 °C between them.',
      },
    ],
  },
];

export const TOPIC_BY_KEY = Object.fromEntries(TOPICS.map((t) => [t.key, t])) as Record<
  string,
  Topic
>;
