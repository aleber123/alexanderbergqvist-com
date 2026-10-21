import type { Point } from './types';
import { BAND_BY_KEY } from './bands';

/**
 * Exact-temperature pages. Only temperatures with real search demand get
 * a page: the common US "what to wear in NN degree weather" queries in
 * 5 °F steps, and the °C values people search for that do NOT already
 * coincide with one of those (0, 20, 25 °C). 5/10/15/30 °C are the same
 * weather as 40/50/60/85 °F, so they are answered on that page (`twin`)
 * instead of a second, competing near-duplicate URL.
 */
const img = (band: Point['band']) => ({
  image: BAND_BY_KEY[band].image,
  imageAlt: BAND_BY_KEY[band].imageAlt,
});

export const POINTS: Point[] = [
  {
    key: '0c',
    slug: '0-degrees-celsius',
    band: 'cold',
    value: 0,
    unit: 'C',
    ...img('cold'),
    crumb: '0 °C (32 °F)',
    eyebrow: 'Freezing point · Cold',
    title: 'What to Wear in 0 °C Weather (32 °F)',
    metaDescription:
      'What to wear at 0 °C (32 °F): thermal or merino base, thick knit, a warm coat or puffer, hat, gloves and scarf, and waterproof boots for slush and ice. Women’s and men’s outfits.',
    h1: 'What to wear in 0 °C weather',
    answer:
      'At 0 °C (32 °F), wear a merino or thermal base, a thick knit and a warm coat or puffer that covers your hips. Add a beanie, gloves and a scarf, trousers or thick tights, and waterproof boots with grip — at freezing point, any rain or snow turns into slush and ice.',
    feel:
      'Zero degrees is the temperature of slush. Pavements can be wet at noon and icy by evening, and with any wind it feels like −4 °C or colder. It is the point where hat and gloves stop being optional.',
    formula: {
      base: 'Merino or thermal long-sleeve',
      top: 'Thick wool or cashmere knit',
      bottom: 'Wool or lined trousers; thick tights under skirts',
      shoes: 'Waterproof, insulated boots with a grippy sole',
      outer: 'Puffer or long wool coat over the knit',
      accessories: 'Beanie, gloves, scarf, wool socks',
    },
    women: {
      base: 'Merino long-sleeve',
      top: 'Roll-neck in wool or cashmere',
      bottom: 'Wool trousers or a knit midi skirt with 100-denier tights',
      shoes: 'Lined, waterproof Chelsea or lace-up boots',
      outer: 'Long padded coat or a wool coat over a thin down vest',
      accessories: 'Beanie, lined gloves, wool scarf',
    },
    men: {
      base: 'Merino crew or thermal long-sleeve',
      top: 'Heavy crew-neck or shawl cardigan',
      bottom: 'Wool trousers, cords or heavyweight jeans',
      shoes: 'Waterproof leather boots with a lug sole',
      outer: 'Down jacket or wool overcoat',
      accessories: 'Beanie, gloves, scarf',
    },
    situations: {
      commute:
        'If it snowed or rained, it is slush: waterproof boots, trousers that sit over or inside the boot, and a coat you can close up to the chin.',
      office:
        'The knit and merino base stay on; the coat comes off. Keep a pair of indoor shoes at work if your boots are heavy.',
      evening:
        'The temperature drops below zero after dark and puddles freeze. Gloves, grippy soles and a long coat over a dark knit dress or trousers.',
    },
    tips: [
      'Today’s Outfit treats any wet day between −2 and +3 °C as slush: waterproof boots only, no suede, canvas or loafers.',
      'Below 3 °C feels-like the app adds a beanie and gloves; below 8 °C a scarf.',
      'Humid zero feels colder than dry zero — the app subtracts 2 °C on raw, humid days.',
    ],
    faq: [
      {
        q: 'Is 0 °C cold enough for a winter coat?',
        a: 'Yes. At 0 °C (32 °F) you want an insulated coat or a wool coat over a thick knit — a light jacket is not enough, especially with wind.',
      },
      {
        q: 'What shoes should I wear at 0 °C?',
        a: 'Waterproof boots with a grippy rubber sole. Freezing point means slush in the day and ice in the evening, so avoid suede, canvas and smooth leather soles.',
      },
      {
        q: 'Do I need thermal underwear at 0 °C?',
        a: 'Not always. A merino or thermal top is a good idea if you will be outside for long; thermal leggings are mostly for below about −10 °C or for long periods standing still.',
      },
    ],
  },
  {
    key: '40f',
    slug: '40-degree-weather',
    band: 'cold',
    value: 40,
    unit: 'F',
    twin: { value: 5, unit: 'C' },
    ...img('cold'),
    crumb: '40 °F (5 °C)',
    eyebrow: '40 °F · 4–5 °C · Cold',
    title: 'What to Wear in 40 Degree Weather (40 °F / 5 °C)',
    metaDescription:
      'What to wear in 40 degree weather (about 5 °C): a sweater under a wool coat or puffer, jeans or trousers, boots and a scarf — plus outfits for women and men, work and evening.',
    h1: 'What to wear in 40 degree weather',
    answer:
      'At 40 °F (about 5 °C), wear a long-sleeve top, a warm sweater and a wool coat or puffer. Choose jeans or trousers — or a skirt with opaque tights — and boots or leather sneakers. Add a scarf; bring a hat and gloves if it is windy, because wind quickly makes 40 °F feel like 30 °F.',
    feel:
      '40 °F is properly cold but rarely brutal. In still sunshine a wool coat over a sweater feels comfortable; at a windy bus stop it feels like freezing. The difference is almost always the wind.',
    formula: {
      base: 'Long-sleeve tee or shirt',
      top: 'Wool or cashmere sweater',
      bottom: 'Jeans, cords or wool trousers',
      shoes: 'Leather boots or leather sneakers with warm socks',
      outer: 'Wool coat or a puffer',
      accessories: 'Scarf; hat and gloves when it is windy',
    },
    women: {
      base: 'Fitted long-sleeve tee',
      top: 'Cable-knit or cashmere crew',
      bottom: 'Straight jeans, or a midi skirt with 80-denier tights',
      shoes: 'Ankle boots with a rubber sole',
      outer: 'Long wool coat or a cropped puffer',
      accessories: 'Wool scarf, leather gloves',
    },
    men: {
      base: 'Oxford shirt or long-sleeve tee',
      top: 'Lambswool sweater or quarter-zip',
      bottom: 'Dark jeans or cords',
      shoes: 'Leather boots or leather sneakers',
      outer: 'Peacoat, overcoat or quilted down jacket',
      accessories: 'Scarf, beanie for the walk',
    },
    situations: {
      commute:
        'Walking or cycling? Wind chill at 40 °F is real — a puffer and gloves. On the subway, a wool coat you can open.',
      office:
        'A sweater over a shirt or blouse is enough at your desk. Leave the coat and scarf at the door.',
      evening:
        'Night drops toward the mid-30s: wool coat, roll-neck, dark trousers or a knit dress with tights and boots.',
    },
    tips: [
      'If it rains at 40 °F, switch to a waterproof coat with a hood and waterproof boots — wet and cold is the worst combination.',
      'Today’s Outfit suggests a scarf below about 46 °F feels-like and hat and gloves below about 37 °F.',
      'Sunny 40 °F feels like 45; windy 40 °F feels like 32. Dress for the feels-like temperature.',
    ],
    faq: [
      {
        q: 'Is 40 degrees cold enough for a winter coat?',
        a: 'Yes — a wool coat or a light-to-mid puffer. A heavy parka is only needed if it is very windy or you will stand outside for a long time.',
      },
      {
        q: 'Can I wear a leather jacket at 40 °F?',
        a: 'Only with a thick sweater or a hoodie underneath and a scarf. On windy or wet days a wool coat or puffer is warmer.',
      },
      {
        q: 'What should I wear at 5 °C?',
        a: '5 °C is about 41 °F, so the same outfit applies: a sweater under a warm coat, covered legs, boots and a scarf. Add gloves if it is windy.',
      },
    ],
  },
  {
    key: '45f',
    slug: '45-degree-weather',
    band: 'chilly',
    value: 45,
    unit: 'F',
    ...img('chilly'),
    crumb: '45 °F (7 °C)',
    eyebrow: '45 °F · 7 °C · Chilly',
    title: 'What to Wear in 45 Degree Weather (45 °F / 7 °C)',
    metaDescription:
      'What to wear in 45 degree weather (7 °C): a sweater under a trench, field jacket or light wool coat, jeans or trousers, closed shoes and a scarf. Outfits for women and men.',
    h1: 'What to wear in 45 degree weather',
    answer:
      'At 45 °F (7 °C), wear a sweater or sweatshirt under a transitional jacket — a trench, field jacket, quilted jacket or light wool coat. Jeans or trousers and closed shoes or ankle boots are right. A scarf is worth it: 45 °F is just below the point where Today’s Outfit starts adding one.',
    feel:
      '45 °F sits right between winter and spring. It feels cold in the morning and fine in the afternoon sun. A winter coat is usually too warm, a light jacket alone too cold — a sweater plus a mid-weight jacket hits the middle.',
    formula: {
      base: 'Long-sleeve tee or shirt',
      top: 'Sweater, sweatshirt or cardigan',
      bottom: 'Jeans, chinos or trousers; skirts with 60-denier tights',
      shoes: 'Ankle boots, loafers with socks or leather sneakers',
      outer: 'Trench, quilted jacket or a light wool coat',
      accessories: 'Light wool scarf',
    },
    women: {
      base: 'Striped long-sleeve',
      top: 'Chunky cardigan or merino crew',
      bottom: 'Straight jeans, or a midi skirt with 60-denier tights',
      shoes: 'Ankle boots or loafers',
      outer: 'Trench coat or a short wool jacket',
      accessories: 'Wool scarf, crossbody bag',
    },
    men: {
      base: 'Heavy tee or flannel shirt',
      top: 'Crew-neck sweatshirt or merino sweater',
      bottom: 'Chinos or straight jeans',
      shoes: 'Desert boots, Derbies or leather sneakers',
      outer: 'Quilted jacket, field jacket or a mac',
      accessories: 'Scarf or beanie on a windy day',
    },
    situations: {
      commute:
        'Cycling: windproof jacket, gloves and full-length trousers. Walking: a trench you can unbutton as you warm up.',
      office:
        'A sweater over a shirt or blouse. If your office is warm, choose a thin merino you can keep on.',
      evening:
        'Evenings drop toward 40 °F: upgrade to a wool coat or add a scarf and closed shoes.',
    },
    tips: [
      'Mornings at 45 °F are often colder than the forecast high — the app dresses for the cooler part of the day.',
      'A skirt or dress needs tights at this temperature; the app adds them below about 54 °F.',
      'Rain at 45 °F: a hooded waterproof over the sweater beats a wool coat.',
    ],
    faq: [
      {
        q: 'Is 45 degrees jacket weather?',
        a: 'Yes. At 45 °F (7 °C) you need a jacket every time — Today’s Outfit always adds an outer layer below about 54 °F feels-like.',
      },
      {
        q: 'Is a hoodie enough at 45 °F?',
        a: 'Not on its own. Wear it under a light jacket and add a scarf if it is windy.',
      },
      {
        q: 'Can I wear shorts at 45 °F?',
        a: 'Not comfortably. Legs should be covered below about 54 °F — jeans, chinos or a skirt with tights.',
      },
    ],
  },
  {
    key: '50f',
    slug: '50-degree-weather',
    band: 'chilly',
    value: 50,
    unit: 'F',
    twin: { value: 10, unit: 'C' },
    ...img('chilly'),
    crumb: '50 °F (10 °C)',
    eyebrow: '50 °F · 10 °C · Chilly',
    title: 'What to Wear in 50 Degree Weather (50 °F / 10 °C)',
    metaDescription:
      'What to wear in 50 degree weather (10 °C): a knit or sweatshirt with a trench, denim or field jacket, jeans or chinos and sneakers or ankle boots. Outfits for women and men.',
    h1: 'What to wear in 50 degree weather',
    answer:
      'At 50 °F (10 °C), wear a long-sleeve top or shirt with a light sweater, and a transitional jacket: a trench, field jacket, leather jacket or denim jacket over a knit. Jeans or chinos and sneakers, loafers or ankle boots work. Bring a scarf only if it is windy or damp.',
    feel:
      '50 °F is the classic in-between day. In the sun it feels mild; in the shade or wind it feels cold. You need a jacket, but not a winter coat — the layer underneath does the rest.',
    formula: {
      base: 'Long-sleeve tee or a shirt',
      top: 'Light sweater, sweatshirt or cardigan',
      bottom: 'Jeans or chinos; skirts with sheer-to-40-denier tights',
      shoes: 'Sneakers, loafers or ankle boots',
      outer: 'Trench, leather, denim or field jacket',
      accessories: 'Scarf only when windy or damp',
    },
    women: {
      base: 'White shirt or fitted long-sleeve',
      top: 'Fine merino crew or a cropped cardigan',
      bottom: 'Wide-leg jeans, or a slip skirt with sheer black tights',
      shoes: 'Loafers, ankle boots or white sneakers',
      outer: 'Trench coat or a leather jacket',
      accessories: 'Light scarf, sunglasses',
    },
    men: {
      base: 'Oxford shirt or long-sleeve tee',
      top: 'Crew-neck sweatshirt or merino sweater',
      bottom: 'Chinos or straight jeans',
      shoes: 'Leather sneakers or Chelsea boots',
      outer: 'Field jacket, denim jacket over a sweater, or a mac',
      accessories: 'Cap or beanie when it is windy',
    },
    situations: {
      commute:
        'A jacket you can open; cyclists should go windproof. If it is a 40 °F morning and a 60 °F afternoon, layers you can take off are the point.',
      office:
        'Shirt plus sweater or a blazer — the jacket stays on the hook. Loafers or clean sneakers.',
      evening:
        'Swap the denim jacket for a wool coat or a leather jacket with a knit underneath.',
    },
    tips: [
      'When the day swings more than about 15 °F, Today’s Outfit picks layers you can take off.',
      '10 °C with drizzle feels like 5 °C: a hooded waterproof and closed shoes.',
      'A leather or denim jacket only works here with a sweater underneath.',
    ],
    faq: [
      {
        q: 'Is 50 degrees cold enough for a jacket?',
        a: 'Yes. At 50 °F (10 °C) a light-to-medium jacket over a sweater is right; Today’s Outfit always adds an outer layer below about 54 °F feels-like.',
      },
      {
        q: 'What should I wear in 10 °C weather?',
        a: '10 °C is exactly 50 °F: a knit or sweatshirt, a trench, field jacket or denim jacket, jeans or trousers and closed shoes. Add a scarf if it is windy.',
      },
      {
        q: 'Can I wear a dress at 50 °F?',
        a: 'Yes — with tights, ankle boots and a jacket. A knit dress or a dress with a cardigan underneath the jacket is the most comfortable.',
      },
    ],
  },
  {
    key: '55f',
    slug: '55-degree-weather',
    band: 'cool',
    value: 55,
    unit: 'F',
    ...img('cool'),
    crumb: '55 °F (13 °C)',
    eyebrow: '55 °F · 13 °C · Cool',
    title: 'What to Wear in 55 Degree Weather (55 °F / 13 °C)',
    metaDescription:
      'What to wear in 55 degree weather (13 °C): a long-sleeve top with a sweater or light jacket — denim, overshirt or blazer — and jeans or trousers with sneakers.',
    h1: 'What to wear in 55 degree weather',
    answer:
      'At 55 °F (13 °C), wear a long-sleeve top or shirt with one warm layer: a sweater, cardigan, overshirt or a light jacket such as denim or a blazer. Jeans or trousers and sneakers or loafers are right. With short sleeves, a dress or wind, make that layer a proper jacket.',
    feel:
      '55 °F is cool rather than cold. Sun makes it pleasant, and many people are comfortable in a sweater alone. Shade, cloud or a breeze bring back the need for a jacket.',
    formula: {
      base: 'Long-sleeve top, shirt or tee',
      top: 'Sweater, cardigan or overshirt',
      bottom: 'Jeans, chinos or trousers',
      shoes: 'Sneakers, loafers or ankle boots',
      outer: 'Denim jacket, light bomber or blazer if windy or short-sleeved',
      accessories: 'Light scarf when windy',
    },
    women: {
      base: 'Breton top or a poplin shirt',
      top: 'V-neck cardigan',
      bottom: 'Straight jeans or tailored trousers',
      shoes: 'Loafers or sneakers',
      outer: 'Denim jacket or an oversized blazer',
      accessories: 'Sunglasses, light scarf',
    },
    men: {
      base: 'T-shirt or Oxford shirt',
      top: 'Cotton overshirt or a fine sweater',
      bottom: 'Chinos or straight jeans',
      shoes: 'Leather or canvas sneakers',
      outer: 'Chore jacket or light bomber',
      accessories: 'Cap',
    },
    situations: {
      commute:
        'Morning 55 °F often means a 48 °F start: wear the jacket and carry it later. Cyclists: a thin windproof.',
      office:
        'Shirt or blouse with a sweater or blazer. Sneakers work in most offices.',
      evening:
        'Evenings drop into the 40s — add the jacket or a heavier sweater.',
    },
    tips: [
      'In this band the app adds a mid layer or a light jacket; with a short-sleeve top or a dress it always adds the jacket.',
      'Wind of about 18 mph or more turns 55 °F into jacket weather.',
      'A blazer counts as both a layer and a jacket at 55 °F.',
    ],
    faq: [
      {
        q: 'Is 55 degrees jacket weather?',
        a: 'Often. In the sun a sweater can be enough at 55 °F (13 °C), but with wind, cloud, short sleeves or a dress you want a light jacket.',
      },
      {
        q: 'Can I wear shorts at 55 °F?',
        a: 'It is cool for shorts. Most people are more comfortable in jeans or trousers until the mid-60s °F.',
      },
      {
        q: 'Is a hoodie enough at 55 °F?',
        a: 'In sunshine and still air, yes. Add a light jacket on top if it is cloudy or windy.',
      },
    ],
  },
  {
    key: '60f',
    slug: '60-degree-weather',
    band: 'cool',
    value: 60,
    unit: 'F',
    twin: { value: 15, unit: 'C' },
    ...img('cool'),
    crumb: '60 °F (15 °C)',
    eyebrow: '60 °F · 15–16 °C · Cool',
    title: 'What to Wear in 60 Degree Weather (60 °F / 15 °C)',
    metaDescription:
      'What to wear in 60 degree weather (15–16 °C): a T-shirt or long-sleeve with a light layer — denim jacket, cardigan, overshirt or blazer — jeans or trousers and sneakers. Women’s and men’s outfits.',
    h1: 'What to wear in 60 degree weather',
    answer:
      'At 60 °F (15–16 °C), wear a T-shirt or long-sleeve top with one light layer — a denim jacket, cardigan, overshirt, light sweater or blazer. Jeans, chinos or a midi skirt with sneakers or loafers are right. You can take the layer off in the sun; keep it on in the shade, wind or evening.',
    feel:
      '60 °F is the most forgiving temperature of the year — but also the most misjudged. In full sun it feels like 68 °F; in shade with a breeze it feels like 50 °F. A light layer you can carry solves both.',
    formula: {
      base: 'T-shirt or long-sleeve top',
      top: 'Light sweater, cardigan or overshirt',
      bottom: 'Jeans, chinos or a midi skirt',
      shoes: 'Sneakers, loafers or ballet flats',
      outer: 'Denim jacket, light trench or blazer — needed with short sleeves or wind',
      accessories: 'Sunglasses',
    },
    women: {
      base: 'Fitted tee or a silk-feel blouse',
      top: 'Thin cardigan',
      bottom: 'Straight jeans or a satin midi skirt',
      shoes: 'Ballet flats, loafers or white sneakers',
      outer: 'Denim jacket or a lightweight trench',
      accessories: 'Sunglasses, shoulder bag',
    },
    men: {
      base: 'Heavy tee or a short-sleeve polo',
      top: 'Overshirt worn open',
      bottom: 'Chinos or straight jeans',
      shoes: 'Canvas or leather sneakers',
      outer: 'Denim or chore jacket, or an unstructured blazer',
      accessories: 'Sunglasses, cap',
    },
    situations: {
      commute:
        'A light jacket you can stuff into a bag. On a bike the wind makes 60 °F feel like the low 50s — keep the jacket on.',
      office:
        'Shirt and a light sweater or blazer; trousers or a skirt; clean sneakers or loafers.',
      evening:
        'After sunset 60 °F days drop into the 50s. Bring the jacket or a heavier knit for dinner outside.',
    },
    tips: [
      'Short sleeves or a dress at 60 °F? Today’s Outfit always adds a jacket in this band.',
      'Sunny 60 °F is warmer than it sounds — a T-shirt plus a carried layer is plenty.',
      '15 °C in Europe and 60 °F in the US are effectively the same day: the same outfit applies.',
    ],
    faq: [
      {
        q: 'Is 60 degrees cold or warm?',
        a: 'Cool. Most people need a light layer at 60 °F (15–16 °C), and a jacket in the shade, wind or evening. In full sun it can feel warm.',
      },
      {
        q: 'What should I wear in 15 °C weather?',
        a: '15 °C is 59 °F, so the same outfit applies: a T-shirt or long-sleeve, a light layer such as a cardigan or denim jacket, jeans or trousers and sneakers.',
      },
      {
        q: 'Can I wear shorts at 60 degrees?',
        a: 'Some people do in full sun, but most are more comfortable in trousers, jeans or a skirt. Today’s Outfit favours covered legs up to about 62 °F feels-like.',
      },
      {
        q: 'Can I wear a dress at 60 °F?',
        a: 'Yes — a midi or long-sleeve dress with a denim jacket or cardigan and sneakers or loafers. Bare legs are usually fine at 60 °F.',
      },
    ],
  },
  {
    key: '65f',
    slug: '65-degree-weather',
    band: 'mild',
    value: 65,
    unit: 'F',
    ...img('mild'),
    crumb: '65 °F (18 °C)',
    eyebrow: '65 °F · 18 °C · Mild',
    title: 'What to Wear in 65 Degree Weather (65 °F / 18 °C)',
    metaDescription:
      'What to wear in 65 degree weather (18 °C): a T-shirt, shirt or light dress with an optional light layer for the morning — jeans, chinos or a skirt and sneakers or loafers.',
    h1: 'What to wear in 65 degree weather',
    answer:
      'At 65 °F (18 °C), a T-shirt, shirt, blouse or light dress is enough for the day. Bring an optional light layer — a thin cardigan, overshirt or denim jacket — for the morning, the evening or wind. Jeans, chinos, a skirt or light trousers with sneakers or loafers all work.',
    feel:
      '65 °F feels pleasantly mild. Afternoons are T-shirt weather; mornings and evenings can still be in the 50s. The one mistake is leaving without a layer.',
    formula: {
      base: 'T-shirt, shirt or a light dress',
      top: 'Optional thin cardigan or overshirt',
      bottom: 'Jeans, chinos, light trousers or a skirt',
      shoes: 'Sneakers, loafers or ballet flats',
      outer: 'Optional light jacket for a cool morning or wind',
      accessories: 'Sunglasses',
    },
    women: {
      base: 'Cotton tee or a linen-blend shirt',
      top: 'Light cardigan over the shoulders',
      bottom: 'Relaxed jeans or a midi skirt',
      shoes: 'Ballet flats or white sneakers',
      outer: 'Denim jacket for the evening',
      accessories: 'Sunglasses, tote',
    },
    men: {
      base: 'T-shirt or a short-sleeve shirt',
      top: 'Light overshirt',
      bottom: 'Chinos or light-wash jeans',
      shoes: 'Canvas or leather sneakers',
      outer: 'Light bomber if the morning is cool',
      accessories: 'Sunglasses',
    },
    situations: {
      commute:
        'Leaving before 8? Start with the overshirt or cardigan; it goes in the bag by lunch.',
      office:
        'Shirt or blouse with trousers or a skirt — and a cardigan for the air-conditioning.',
      evening:
        'Add a light jacket or knit; 65 °F afternoons often end in the high 50s.',
    },
    tips: [
      'If the morning feels colder than about 57 °F, Today’s Outfit adds a light jacket even on a mild day.',
      'Wind makes the jacket worth it again — the app adds one on windy mild days.',
      'Bare legs are comfortable at 65 °F; tights are not needed.',
    ],
    faq: [
      {
        q: 'Is 65 degrees warm enough for shorts?',
        a: 'For many people, yes, especially in the sun. If you run cold or will be in the shade, light trousers or a skirt are more comfortable.',
      },
      {
        q: 'Do I need a jacket at 65 °F?',
        a: 'Not during the day. Bring a light one for the morning or evening, or if it is windy.',
      },
      {
        q: 'What should I wear at 18 °C?',
        a: '18 °C is about 65 °F: a T-shirt or shirt, light trousers, jeans or a skirt, sneakers, and a light layer for later.',
      },
    ],
  },
  {
    key: '20c',
    slug: '20-degrees-celsius',
    band: 'mild',
    value: 20,
    unit: 'C',
    ...img('mild'),
    crumb: '20 °C (68 °F)',
    eyebrow: '20 °C · 68 °F · Mild',
    title: 'What to Wear in 20 °C Weather (68 °F)',
    metaDescription:
      'What to wear at 20 °C (68 °F): a T-shirt, shirt or light dress with jeans, chinos or a skirt and trainers, plus a thin layer for the morning and evening. Outfits for women and men.',
    h1: 'What to wear in 20 °C weather',
    answer:
      'At 20 °C (68 °F), wear a T-shirt, shirt, blouse or light dress with jeans, chinos, a skirt or light trousers and trainers, loafers or sandals in the sun. You do not need a jacket during the day; carry a thin cardigan or overshirt for the morning, the evening or a breeze.',
    feel:
      'Twenty degrees is the temperature most people call perfect. It is warm in the sun and cool in the shade. Shorts work for some, light trousers for most — the only real decision is whether to carry a layer.',
    formula: {
      base: 'T-shirt, shirt, blouse or a light dress',
      top: 'Optional thin cardigan or overshirt',
      bottom: 'Jeans, chinos, light trousers, a skirt or shorts in the sun',
      shoes: 'Trainers, loafers or sandals',
      outer: 'None during the day; a light jacket for a cool evening',
      accessories: 'Sunglasses; a cap when the UV is high',
    },
    women: {
      base: 'Linen-blend shirt or a cotton midi dress',
      top: 'Fine cotton cardigan',
      bottom: 'Wide-leg trousers or a pleated midi skirt',
      shoes: 'Loafers, ballet flats or flat sandals',
      outer: 'Unlined blazer for the evening',
      accessories: 'Sunglasses, straw tote',
    },
    men: {
      base: 'T-shirt, polo or short-sleeve shirt',
      top: 'Overshirt worn open',
      bottom: 'Chinos or tailored shorts in the sun',
      shoes: 'White trainers or loafers',
      outer: 'Light cotton jacket for the evening',
      accessories: 'Sunglasses, cap',
    },
    situations: {
      commute:
        'A cardigan or overshirt over a T-shirt is ideal for an early start; carry it home.',
      office:
        'Light trousers or a skirt and a shirt or blouse. Keep a layer for the air-conditioning.',
      evening:
        'Evenings at 20 °C days are often 14–16 °C — bring the light jacket or knit.',
    },
    tips: [
      'If the morning feels colder than 14 °C, Today’s Outfit adds a light jacket even on a 20 °C day.',
      'Windy 20 °C feels like 16 °C — the app adds a jacket on windy mild days.',
      'Sandals work in sunshine; trainers are the safer all-day choice.',
    ],
    faq: [
      {
        q: 'Is 20 °C warm enough for shorts?',
        a: 'In the sun, yes, for most people. In the shade or wind, 20 °C (68 °F) can feel cool, so light trousers or a skirt are a safe default.',
      },
      {
        q: 'Do I need a jacket at 20 °C?',
        a: 'Not during the day. Carry a light jacket or cardigan for the morning or evening, or if it is windy.',
      },
      {
        q: 'Can I wear a dress at 20 °C?',
        a: 'Yes — 20 °C is ideal for a cotton or linen midi dress with trainers or sandals, plus a cardigan for later.',
      },
    ],
  },
  {
    key: '70f',
    slug: '70-degree-weather',
    band: 'mild',
    value: 70,
    unit: 'F',
    ...img('mild'),
    crumb: '70 °F (21 °C)',
    eyebrow: '70 °F · 21 °C · Mild to warm',
    title: 'What to Wear in 70 Degree Weather (70 °F / 21 °C)',
    metaDescription:
      'What to wear in 70 degree weather (21 °C): a T-shirt, short-sleeve shirt or light dress with shorts, a skirt or light trousers and sneakers or sandals. No jacket needed on a dry day.',
    h1: 'What to wear in 70 degree weather',
    answer:
      'At 70 °F (21 °C), a single layer is enough: a T-shirt, short-sleeve shirt, blouse or light dress with shorts, a skirt, light chinos or jeans. Sneakers, loafers or sandals all work. You do not need a jacket on a dry day — just a light layer if you will be out late or it is windy.',
    feel:
      '70 °F is the top of the mild range — warm in the sun, comfortable in the shade. It is the first temperature where most people happily wear shorts all day.',
    formula: {
      base: 'T-shirt, short-sleeve shirt or a light dress',
      top: 'None needed (a thin layer for the evening)',
      bottom: 'Shorts, a skirt, chinos or light jeans',
      shoes: 'Sneakers, loafers or sandals',
      outer: 'None on a dry day',
      accessories: 'Sunglasses, cap',
    },
    women: {
      base: 'Cotton tee or a sleeveless blouse',
      top: 'None needed',
      bottom: 'Linen trousers, a denim skirt or a light midi dress',
      shoes: 'Flat sandals or sneakers',
      outer: 'A light shirt over the shoulders for later',
      accessories: 'Sunglasses',
    },
    men: {
      base: 'T-shirt or a camp-collar shirt',
      top: 'None needed',
      bottom: 'Chino shorts or light chinos',
      shoes: 'Canvas sneakers or loafers without socks',
      outer: 'None',
      accessories: 'Sunglasses, cap',
    },
    situations: {
      commute:
        'One layer and breathable fabrics; on a cool morning, a light overshirt you can carry.',
      office:
        'Light trousers or a skirt with a short-sleeve shirt or blouse; a cardigan for the air-conditioning.',
      evening:
        'A long-sleeve shirt or thin knit for when the sun goes down.',
    },
    tips: [
      '70 °F with a cool morning (below about 57 °F feels-like) still gets a light layer in Today’s Outfit.',
      'Wind can make 70 °F feel like 62 °F — the app adds a jacket on windy mild days.',
      'Above about 71 °F the app stops adding outer layers on dry days.',
    ],
    faq: [
      {
        q: 'Is 70 degrees shorts weather?',
        a: 'Yes, for most people. 70 °F (21 °C) is comfortable in shorts, skirts and light dresses, especially in the sun.',
      },
      {
        q: 'Do I need a jacket at 70 degrees?',
        a: 'No, not on a dry day. Bring a light layer only for an early morning, a late evening or wind.',
      },
      {
        q: 'Can I wear jeans at 70 °F?',
        a: 'Yes — lighter washes and relaxed fits are comfortable. In full sun, chinos or linen trousers feel cooler.',
      },
    ],
  },
  {
    key: '25c',
    slug: '25-degrees-celsius',
    band: 'warm',
    value: 25,
    unit: 'C',
    ...img('warm'),
    crumb: '25 °C (77 °F)',
    eyebrow: '25 °C · 77 °F · Warm',
    title: 'What to Wear in 25 °C Weather (77 °F)',
    metaDescription:
      'What to wear at 25 °C (77 °F): one breathable layer — tee, short-sleeve shirt or light dress — with shorts, a skirt or linen trousers, sandals and sunglasses. No jacket needed.',
    h1: 'What to wear in 25 °C weather',
    answer:
      'At 25 °C (77 °F), wear one breathable layer: a T-shirt, short-sleeve shirt, tank or light dress with shorts, a skirt or linen trousers. Sandals, espadrilles or canvas trainers keep feet cool. No jacket is needed on a dry day — protect yourself from the sun with sunglasses and a cap or hat.',
    feel:
      'Twenty-five degrees is a real summer day: comfortable in the shade, hot in direct sun. Fabric matters more than coverage — linen trousers can feel cooler than tight shorts.',
    formula: {
      base: 'T-shirt, short-sleeve shirt, tank or a light dress',
      top: 'None needed',
      bottom: 'Shorts, a skirt or linen trousers',
      shoes: 'Sandals, espadrilles or canvas trainers',
      outer: 'None on a dry day',
      accessories: 'Sunglasses, cap or sun hat',
    },
    women: {
      base: 'Linen midi dress or a cotton tank',
      top: 'None needed',
      bottom: 'Linen trousers or a flowing skirt',
      shoes: 'Flat sandals or espadrilles',
      outer: 'None',
      accessories: 'Sun hat, sunglasses',
    },
    men: {
      base: 'Linen or seersucker short-sleeve shirt',
      top: 'None needed',
      bottom: 'Chino shorts or linen trousers',
      shoes: 'Espadrilles or canvas trainers',
      outer: 'None',
      accessories: 'Sunglasses, cap',
    },
    situations: {
      commute:
        'Breathable shirt, light trousers or a skirt; bring a fresh top if you cycle.',
      office:
        'Linen or cotton trousers and a short-sleeve shirt or light blouse; a thin layer for the air-conditioning.',
      evening:
        'Stay in linen; add a light long-sleeve if you will be out after sunset.',
    },
    tips: [
      'Today’s Outfit never adds an outer layer at 25 °C on a dry day unless the morning feels colder than 14 °C.',
      'UV 3 or more: the app suggests sunglasses or a cap.',
      'Humid 25 °C feels hotter — go looser and lighter.',
    ],
    faq: [
      {
        q: 'Is 25 °C hot?',
        a: '25 °C (77 °F) is warm: comfortable in the shade and hot in full sun. Dress in one breathable layer.',
      },
      {
        q: 'Can I wear jeans at 25 °C?',
        a: 'Light, relaxed jeans are fine in the shade, but linen or cotton trousers, shorts or a skirt are cooler in the sun.',
      },
      {
        q: 'What shoes should I wear at 25 °C?',
        a: 'Sandals, espadrilles or canvas trainers. Leather loafers without socks work for the office.',
      },
    ],
  },
  {
    key: '75f',
    slug: '75-degree-weather',
    band: 'warm',
    value: 75,
    unit: 'F',
    ...img('warm'),
    crumb: '75 °F (24 °C)',
    eyebrow: '75 °F · 24 °C · Warm',
    title: 'What to Wear in 75 Degree Weather (75 °F / 24 °C)',
    metaDescription:
      'What to wear in 75 degree weather (24 °C): a T-shirt, tank or short-sleeve shirt with shorts, a skirt or a light dress and sandals or sneakers. No jacket on a dry day.',
    h1: 'What to wear in 75 degree weather',
    answer:
      'At 75 °F (24 °C), wear a T-shirt, tank, short-sleeve shirt or light dress with shorts, a skirt or light trousers, and sandals or sneakers. Skip the jacket on a dry day. Sunglasses and a cap help in strong sun, and a thin layer is only needed for air-conditioning or a late evening.',
    feel:
      '75 °F is classic summer weather: warm but not oppressive. Shade is comfortable, sun is hot, and breathable fabrics make the difference.',
    formula: {
      base: 'T-shirt, tank, short-sleeve shirt or a light dress',
      top: 'None needed',
      bottom: 'Shorts, a skirt or light trousers',
      shoes: 'Sandals, espadrilles or sneakers',
      outer: 'None on a dry day',
      accessories: 'Sunglasses, cap',
    },
    women: {
      base: 'Cotton tank or a short-sleeve shirt',
      top: 'None needed',
      bottom: 'Denim shorts, a midi skirt or a sundress',
      shoes: 'Flat sandals or white sneakers',
      outer: 'None',
      accessories: 'Sunglasses, canvas tote',
    },
    men: {
      base: 'T-shirt or a camp-collar shirt',
      top: 'None needed',
      bottom: 'Chino shorts or light chinos',
      shoes: 'Canvas sneakers or leather sandals',
      outer: 'None',
      accessories: 'Sunglasses, cap',
    },
    situations: {
      commute:
        'Breathable top and light bottoms; a fresh shirt in the bag if you bike.',
      office:
        'Chinos or a skirt with a short-sleeve shirt or blouse, loafers, and a thin cardigan for cold offices.',
      evening:
        'Still comfortable in one layer; a light long-sleeve for after dark.',
    },
    tips: [
      'From about 71 °F feels-like, Today’s Outfit stops adding jackets on dry days.',
      'Linen is cooler than cotton at this temperature — the app counts it that way.',
      'Rain at 75 °F? A thin unlined rain jacket, never a coat.',
    ],
    faq: [
      {
        q: 'Is 75 degrees hot?',
        a: 'It is warm. 75 °F (24 °C) is comfortable in shorts and T-shirts; in strong sun it can feel hot.',
      },
      {
        q: 'Do I need a jacket at 75 °F?',
        a: 'No. On a dry day leave it at home; bring a thin layer only for air-conditioning or a late evening.',
      },
      {
        q: 'Can I wear jeans in 75 degree weather?',
        a: 'Yes, light and relaxed jeans are fine, especially in the shade. Shorts, linen trousers or a skirt are cooler in direct sun.',
      },
    ],
  },
  {
    key: '80f',
    slug: '80-degree-weather',
    band: 'hot',
    value: 80,
    unit: 'F',
    ...img('hot'),
    crumb: '80 °F (27 °C)',
    eyebrow: '80 °F · 27 °C · Hot',
    title: 'What to Wear in 80 Degree Weather (80 °F / 27 °C)',
    metaDescription:
      'What to wear in 80 degree weather (27 °C): loose linen or cotton — a tee, tank or airy dress — with shorts or a light skirt, sandals, sunglasses and a cap.',
    h1: 'What to wear in 80 degree weather',
    answer:
      'At 80 °F (27 °C), wear loose, light fabrics: a cotton or linen T-shirt, tank, short-sleeve shirt or airy dress with shorts or a light skirt. Open sandals or espadrilles keep feet cool. Add sunglasses and a cap or hat, and choose looser cuts if it is humid.',
    feel:
      '80 °F is where heat starts to matter. In dry air it is pleasant summer weather; in humidity it feels several degrees hotter and every synthetic fabric shows it.',
    formula: {
      base: 'Loose tee, tank, linen shirt or an airy dress',
      top: 'None needed',
      bottom: 'Shorts or a light skirt',
      shoes: 'Sandals or espadrilles',
      outer: 'None',
      accessories: 'Sunglasses, cap or sun hat',
    },
    women: {
      base: 'Linen tank or a cotton sundress',
      top: 'None needed',
      bottom: 'Linen shorts or a flowing midi skirt',
      shoes: 'Flat sandals',
      outer: 'None',
      accessories: 'Sun hat, sunglasses',
    },
    men: {
      base: 'Linen camp-collar shirt or a loose tee',
      top: 'None needed',
      bottom: 'Linen or cotton shorts',
      shoes: 'Leather sandals or espadrilles',
      outer: 'None',
      accessories: 'Sunglasses, cap',
    },
    situations: {
      commute:
        'The lightest fabric you own; avoid backpacks on a dark shirt if you can.',
      office:
        'Linen trousers or a skirt with a short-sleeve shirt; a thin layer in the bag for strong air-conditioning.',
      evening:
        'Still warm — linen, sandals and a long-sleeve linen shirt if mosquitoes are around.',
    },
    tips: [
      'From about 81 °F, Today’s Outfit uses the heat index — humid 80s are treated as hotter.',
      'Loose linen trousers are often cooler than tight shorts.',
      'UV 3 or more: sunglasses and a cap or hat.',
    ],
    faq: [
      {
        q: 'Is 80 degrees hot?',
        a: 'Yes, 80 °F (27 °C) is hot, especially in the sun or with high humidity. Wear one loose, light layer.',
      },
      {
        q: 'Can I wear jeans at 80 °F?',
        a: 'You can, but linen trousers, cotton chinos, shorts or a skirt are much cooler.',
      },
      {
        q: 'What should I wear to work at 80 degrees?',
        a: 'Linen or lightweight cotton trousers or a midi skirt with a short-sleeve shirt or light blouse, plus loafers or clean sneakers.',
      },
    ],
  },
  {
    key: '85f',
    slug: '85-degree-weather',
    band: 'hot',
    value: 85,
    unit: 'F',
    twin: { value: 30, unit: 'C' },
    ...img('hot'),
    crumb: '85 °F (30 °C)',
    eyebrow: '85 °F · 29–30 °C · Hot',
    title: 'What to Wear in 85 Degree Weather (85 °F / 30 °C)',
    metaDescription:
      'What to wear in 85 degree weather (about 30 °C): the lightest loose linen or cotton you own, shorts or an airy dress, open sandals, a hat and sunglasses. Outfits for women and men.',
    h1: 'What to wear in 85 degree weather',
    answer:
      'At 85 °F (about 30 °C), wear the lightest, loosest single layer you own: a linen shirt, cotton tank or airy dress with linen shorts or a flowing skirt. Choose open sandals, a wide-brim hat or cap and sunglasses. Avoid synthetics and tight fits — they trap heat and sweat.',
    feel:
      '85 °F is properly hot. Sun on the skin feels intense, pavements radiate heat, and humidity can make it feel like the 90s. Loose and light beats short and tight.',
    formula: {
      base: 'Loose linen shirt, cotton tank or an airy dress',
      top: 'None needed',
      bottom: 'Linen shorts, a light skirt or wide linen trousers',
      shoes: 'Open sandals or slides',
      outer: 'None',
      accessories: 'Wide-brim hat or cap, sunglasses',
    },
    women: {
      base: 'Linen slip dress or a cotton voile blouse',
      top: 'None needed',
      bottom: 'Wide linen trousers or a flowing midi skirt',
      shoes: 'Flat sandals',
      outer: 'None',
      accessories: 'Wide-brim hat, sunglasses',
    },
    men: {
      base: 'Linen camp-collar shirt',
      top: 'None needed',
      bottom: 'Linen shorts or wide linen trousers',
      shoes: 'Leather sandals or slides',
      outer: 'None',
      accessories: 'Bucket hat or cap, sunglasses',
    },
    situations: {
      commute:
        'Lightest fabric, light colours, and a change of top if you walk or cycle far.',
      office:
        'Linen trousers or a skirt with a short-sleeve shirt; a thin layer for cold air-conditioning.',
      evening:
        'Still in the 70s or warmer — linen and sandals; long sleeves only against mosquitoes.',
    },
    tips: [
      '30 °C in Europe and 85 °F in the US are the same day: the same outfit applies.',
      'Humid 85 °F feels hotter — Today’s Outfit uses the heat index from 27 °C.',
      'A hat does more for comfort than any fabric choice in direct sun.',
    ],
    faq: [
      {
        q: 'What should I wear in 30 °C heat?',
        a: '30 °C is about 86 °F: the lightest loose linen or cotton, shorts or a light skirt or dress, open sandals, a hat and sunglasses.',
      },
      {
        q: 'Is it OK to wear black at 85 °F?',
        a: 'Loose black linen is fine in the shade, but in direct sun light colours stay cooler. Fit matters more than colour.',
      },
      {
        q: 'What fabric is best at 85 degrees?',
        a: 'Linen first, then light cotton weaves like voile and seersucker. Avoid polyester and other synthetics.',
      },
    ],
  },
  {
    key: '90f',
    slug: '90-degree-weather',
    band: 'hot',
    value: 90,
    unit: 'F',
    ...img('hot'),
    crumb: '90 °F (32 °C)',
    eyebrow: '90 °F · 32 °C · Very hot',
    title: 'What to Wear in 90 Degree Weather (90 °F / 32 °C)',
    metaDescription:
      'What to wear in 90 degree weather (32 °C): loose, light-coloured linen or cotton, airy shorts, skirts or dresses, open sandals, a wide-brim hat and sunglasses.',
    h1: 'What to wear in 90 degree weather',
    answer:
      'At 90 °F (32 °C), wear loose, light-coloured linen or cotton: an airy dress, a camp-collar shirt or a tank with linen shorts or wide linen trousers. Open sandals, a wide-brim hat and sunglasses are essential. Avoid synthetics, dark colours in the sun and anything tight.',
    feel:
      '90 °F is heat that you feel immediately — especially with humidity, when it can feel well over 100 °F. Comfort comes from airflow and shade, not from wearing less.',
    formula: {
      base: 'Loose linen or cotton shirt, tank or an airy dress',
      top: 'None needed',
      bottom: 'Linen shorts, a light skirt or wide linen trousers',
      shoes: 'Open sandals or slides',
      outer: 'None',
      accessories: 'Wide-brim hat, sunglasses',
    },
    women: {
      base: 'Loose linen shirt dress or a cotton voile tank',
      top: 'None needed',
      bottom: 'Wide linen trousers or a light maxi skirt',
      shoes: 'Flat sandals',
      outer: 'None',
      accessories: 'Wide-brim hat, sunglasses',
    },
    men: {
      base: 'Loose linen shirt, light colour',
      top: 'None needed',
      bottom: 'Linen shorts or drawstring linen trousers',
      shoes: 'Leather sandals or slides',
      outer: 'None',
      accessories: 'Wide-brim or bucket hat, sunglasses',
    },
    situations: {
      commute:
        'Lightest colours and fabrics; walk on the shady side and change your top at work.',
      office:
        'Linen trousers or a skirt and a loose short-sleeve shirt; a thin layer for the air-conditioning.',
      evening:
        'Still hot — linen, sandals and a long-sleeve linen shirt for mosquitoes.',
    },
    tips: [
      'Loose, long linen sleeves can be cooler than bare skin in strong sun.',
      'Humid 90 °F can feel like 105 °F: Today’s Outfit dresses for the heat index.',
      'A wide-brim hat cools your face and neck more than any garment.',
    ],
    faq: [
      {
        q: 'What is the coolest thing to wear at 90 degrees?',
        a: 'Loose, light-coloured linen — a shirt or dress that stands away from the skin — with open sandals and a wide-brim hat.',
      },
      {
        q: 'Should I wear shorts or trousers at 90 °F?',
        a: 'Either. Wide linen trousers are as cool as shorts and protect your legs from sun; tight shorts in synthetic fabric are the least comfortable choice.',
      },
      {
        q: 'What should I wear to work at 90 °F?',
        a: 'Loose linen or lightweight cotton trousers or a skirt with a short-sleeve shirt or shell top, loafers or neat sandals, and a light layer for the air-conditioning.',
      },
    ],
  },
];

export const POINTS_F = POINTS.filter((p) => p.unit === 'F').sort((a, b) => a.value - b.value);
export const POINTS_C = POINTS.filter((p) => p.unit === 'C' || p.twin?.unit === 'C').sort(
  (a, b) => cValue(a) - cValue(b),
);

/** The °C value a page answers (its own value or its °C twin). */
export function cValue(p: Point): number {
  if (p.unit === 'C') return p.value;
  return p.twin?.unit === 'C' ? p.twin.value : Math.round(((p.value - 32) * 5) / 9);
}
