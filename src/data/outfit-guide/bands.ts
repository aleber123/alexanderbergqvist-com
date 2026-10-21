import type { Band } from './types';

/**
 * Seven temperature bands = the Today's Outfit engine's bands
 * (arctic + freezing folded together). Ranges are FEELS-LIKE
 * temperatures; °F ranges are the integer °F values that round into the
 * same °C band (e.g. 42 °F = 5.6 °C → rounds to 6 → chilly).
 */
export const BANDS: Band[] = [
  {
    key: 'freezing',
    band: 'freezing',
    slug: 'below-freezing',
    name: 'Below freezing',
    crumb: 'Below freezing',
    minC: null,
    maxC: -1,
    minF: null,
    maxF: 31,
    image: 'freezing',
    imageAlt:
      'Woman on a snowy city street in a long black down parka, cream knit, grey wool scarf, black beanie and gloves, black wide trousers and black lace-up boots',
    eyebrow: 'Below 0 °C · Below 32 °F',
    title: 'What to Wear Below Freezing (Under 0 °C / 32 °F)',
    metaDescription:
      'What to wear when it is below freezing: a thermal base layer, a thick knit and an insulated coat, plus hat, gloves, scarf and lined boots. Outfits for women and men.',
    h1: 'What to wear below freezing',
    answer:
      'Below freezing, dress in three layers: a thermal or merino base layer, a thick wool or fleece mid layer and an insulated, windproof coat that covers your hips. Add a beanie, gloves and a scarf, warm trousers (or thick tights under a skirt) and lined, grippy boots.',
    appRule:
      'Below 0 °C feels-like, Today’s Outfit always adds a warm coat over a knit, asks for a beanie and gloves (from 3 °C down) and a scarf (from 8 °C down), and picks the warmest legs and shoes you own. Below −10 °C it goes for maximum warmth on every zone.',
    intro: [
      'Freezing weather is about keeping warm air close to your body. Three thin-to-thick layers trap more heat than one bulky coat over a T-shirt, and they let you unzip on the bus or in a shop instead of overheating.',
      'Feels-like temperature matters more than the thermometer here: −2 °C with a stiff wind easily feels like −8 °C. Dress for the coldest part of your day — usually the walk to work in the morning.',
    ],
    formula: {
      base: 'Thermal or merino long-sleeve top, close to the skin',
      top: 'Thick wool, cashmere or fleece knit — crew or roll neck',
      bottom: 'Lined or wool trousers; thermal leggings underneath below −10 °C',
      shoes: 'Insulated, waterproof boots with a grippy sole',
      outer: 'Insulated parka or long down/wool coat that covers the hips',
      accessories: 'Beanie, gloves or mittens, thick scarf, wool socks',
    },
    women: {
      base: 'Merino or thermal long-sleeve',
      top: 'Cream wool or cashmere knit',
      bottom: 'Black wide-leg wool trousers (or a knit skirt with 100-denier tights)',
      shoes: 'Black lined lace-up boots with a lug sole',
      outer: 'Long black down parka that covers the hips',
      accessories: 'Black beanie, black gloves, long grey wool scarf',
    },
    men: {
      base: 'Merino crew or thermal long-sleeve',
      top: 'Heavy shawl-collar cardigan or a thick crew-neck knit',
      bottom: 'Flannel-lined chinos, wool trousers or heavyweight jeans',
      shoes: 'Insulated lace-up boots with a lug sole',
      outer: 'Down parka or a wool overcoat over a thin down vest',
      accessories: 'Wool beanie, insulated gloves, chunky scarf',
    },
    situations: {
      commute:
        'Walking or waiting at a stop is where you get cold. Wear the parka, and choose a scarf you can pull up over your chin. Gloves with touchscreen fingertips stay on.',
      office:
        'Keep the thermal and knit; the coat comes off. A merino base under a shirt and fine-gauge knit keeps you warm outside without overheating at your desk.',
      evening:
        'A long wool coat over a dark knit and tailored trousers works for dinner. Swap trainers for leather boots with a rubber sole — icy pavements do not care how smart you are.',
    },
    fabrics: [
      { name: 'Merino wool', why: 'Warm even when slightly damp, breathes, and does not hold odour — the best base layer.' },
      { name: 'Down or synthetic insulation', why: 'The most warmth for the weight in a coat. Synthetic copes better with wet snow.' },
      { name: 'Boiled or heavy wool', why: 'Dense and wind-resistant for coats and knits.' },
      { name: 'Fleece', why: 'Light, warm mid layer that dries fast.' },
      { name: 'Cashmere', why: 'Very warm for its thickness — ideal for a roll neck under a coat.' },
    ],
    avoid: [
      'Cotton next to the skin — it holds sweat and chills you',
      'Short jackets that leave the lower back exposed',
      'Canvas trainers, suede and smooth leather soles on ice',
      'One huge coat over a T-shirt: you overheat indoors and freeze outside',
    ],
    tips: [
      'Wind takes the heat first: a windproof shell over a knit beats a thicker coat that the wind goes straight through.',
      'Warm feet keep you warm: wool socks plus a half-size of room in the boot.',
      'Children lose heat faster — Today’s Outfit dresses kids about one band warmer than adults.',
    ],
    faq: [
      {
        q: 'How many layers should I wear below freezing?',
        a: 'Three is the rule: a base layer that wicks moisture (merino or thermal), an insulating mid layer (wool knit or fleece) and an insulated, windproof outer layer. Below −10 °C (14 °F), add thermal leggings and a second thin layer on top.',
      },
      {
        q: 'Do I need a hat and gloves at 0 °C?',
        a: 'Yes. Today’s Outfit suggests a beanie and gloves from a feels-like temperature of about 3 °C (37 °F) and below, and a scarf from about 8 °C (46 °F) — or 12 °C (54 °F) when it is windy.',
      },
      {
        q: 'Can I wear a skirt or dress below freezing?',
        a: 'Yes, with thick (around 100-denier) or fleece-lined tights, knee-high boots and a coat long enough to cover the hem. A wool or knit skirt is much warmer than cotton or silk.',
      },
      {
        q: 'What shoes are best for icy pavements?',
        a: 'Insulated boots with a deep, soft rubber sole. Avoid smooth leather soles, suede and canvas, and choose waterproof boots whenever there is slush.',
      },
    ],
  },
  {
    key: 'cold',
    band: 'cold',
    slug: 'cold-weather',
    name: 'Cold',
    crumb: 'Cold weather',
    minC: 0,
    maxC: 5,
    minF: 32,
    maxF: 41,
    image: 'cold',
    imageAlt:
      'Man on a frosty waterfront in a camel wool overcoat, grey roll-neck, grey scarf, black gloves, charcoal trousers and black leather boots',
    eyebrow: '0–5 °C · 32–41 °F',
    title: 'What to Wear in Cold Weather (0–5 °C / 32–41 °F)',
    metaDescription:
      'What to wear in cold weather between 0 and 5 °C (32–41 °F): a knit under a wool coat or puffer, covered legs, closed boots, a scarf, and hat and gloves on the coldest mornings.',
    h1: 'What to wear in cold weather',
    answer:
      'Between 0 and 5 °C (32–41 °F), wear a long-sleeve base, a wool or cashmere knit and a warm coat — wool or a puffer. Keep your legs covered with trousers or thick tights, wear closed boots, and add a scarf. Take a hat and gloves when it feels like 3 °C (37 °F) or colder.',
    appRule:
      'In the 0–5 °C band Today’s Outfit always adds an outer layer over a knit, prefers thick legwear, suggests a scarf, and adds a beanie and gloves from 3 °C feels-like. With rain or snow between −2 and +3 °C it treats the day as slush: waterproof boots only, no suede, canvas or loafers.',
    intro: [
      'This is classic winter-coat weather in most cities: not dramatic, but cold enough that a light jacket will leave you shivering at the bus stop. The trick is a warm middle layer, so the coat does not have to do all the work.',
      'Around freezing point, rain and snow turn into slush. That changes your shoes more than anything else — waterproof soles and no suede.',
    ],
    formula: {
      base: 'Long-sleeve tee, thin merino or a shirt',
      top: 'Wool, lambswool or cashmere knit',
      bottom: 'Wool trousers, cords or jeans; thick tights with skirts',
      shoes: 'Leather or rubber-soled boots — waterproof if it is wet',
      outer: 'Wool coat, padded coat or puffer',
      accessories: 'Scarf; beanie and gloves on the coldest mornings',
    },
    women: {
      base: 'Fine merino long-sleeve or a fitted cotton tee',
      top: 'Cashmere crew neck or a cable knit',
      bottom: 'Straight-leg wool trousers, dark jeans, or a midi skirt with opaque 80–100-denier tights',
      shoes: 'Chelsea boots or knee-high boots with a rubber sole',
      outer: 'Camel or charcoal wool coat, or a cropped puffer over a long knit',
      accessories: 'Wool scarf, leather gloves, a beanie or ear warmers',
    },
    men: {
      base: 'Long-sleeve tee or thin merino',
      top: 'Grey merino or lambswool roll-neck',
      bottom: 'Charcoal wool trousers',
      shoes: 'Black leather boots with a rubber sole',
      outer: 'Camel wool overcoat (or a quilted down jacket)',
      accessories: 'Grey wool scarf, black leather gloves',
    },
    situations: {
      commute:
        'Cycling or a long walk: choose the puffer or a windproof coat and gloves. On public transport a wool coat you can open is more comfortable.',
      office:
        'Under the coat, a knit over a shirt is enough indoors. If your office runs cold, a merino base under the shirt is invisible and warm.',
      evening:
        'A dark wool coat, roll-neck and tailored trousers or a knit dress with tights and boots. Bring gloves: evenings are a couple of degrees colder.',
    },
    fabrics: [
      { name: 'Wool and lambswool', why: 'Warm, breathable and naturally water-resistant for coats and knits.' },
      { name: 'Cashmere', why: 'High warmth for a thin layer — great under a tailored coat.' },
      { name: 'Corduroy and flannel', why: 'Brushed surfaces trap air: warmer legs than thin chinos.' },
      { name: 'Down and synthetic fill', why: 'For puffers and padded coats — light and very warm.' },
      { name: 'Waxed or rubberised leather', why: 'For boots that survive slush.' },
    ],
    avoid: [
      'Suede, canvas trainers and loafers when it is slushy',
      'Bare ankles — cropped trousers let the cold in',
      'Thin cotton jackets as your only outer layer',
      'Thin tights under a skirt (go for 80 denier or more)',
    ],
    tips: [
      'Humid cold feels colder: at 0–10 °C with high humidity the app subtracts two degrees.',
      'Dress for the morning: Today’s Outfit blends the day 60/40 towards the coldest feels-like.',
      'A scarf is the cheapest extra layer you can wear.',
    ],
    faq: [
      {
        q: 'Is a puffer or a wool coat warmer at 0–5 °C?',
        a: 'A puffer is warmer for its weight and better in wind; a wool coat is smarter and fine for most cold days if you wear a knit underneath. Below about 0 °C feels-like, or for long waits outdoors, choose the puffer.',
      },
      {
        q: 'Do I need gloves at 5 °C?',
        a: 'Usually not in still air. Today’s Outfit adds a beanie and gloves from a feels-like temperature of about 3 °C (37 °F), so at 5 °C with wind they are worth bringing.',
      },
      {
        q: 'What should I wear in slush?',
        a: 'Waterproof boots with a grippy rubber sole and trousers that sit above the boot or tuck in. Avoid suede, canvas and loafers. Today’s Outfit treats any wet day between −2 and +3 °C as slush.',
      },
      {
        q: 'Can I wear trainers in cold weather?',
        a: 'On dry days, leather trainers with warm socks are fine. When it is wet or slushy, switch to waterproof boots.',
      },
    ],
  },
  {
    key: 'chilly',
    band: 'chilly',
    slug: 'chilly-weather',
    name: 'Chilly',
    crumb: 'Chilly weather',
    minC: 6,
    maxC: 11,
    minF: 42,
    maxF: 52,
    image: 'chilly',
    imageAlt:
      'Woman on an autumn cobbled street in a black leather jacket over a grey knit, ecru straight jeans, black ankle boots and a crossbody bag',
    eyebrow: '6–11 °C · 42–52 °F',
    title: 'What to Wear in Chilly Weather (6–11 °C / 42–52 °F)',
    metaDescription:
      'What to wear in chilly weather between 6 and 11 °C (42–52 °F): a knit or sweatshirt under a transitional jacket — trench, field jacket or light wool coat — with long trousers and closed shoes.',
    h1: 'What to wear in chilly weather',
    answer:
      'At 6–11 °C (42–52 °F), wear a base layer, a knit or sweatshirt and a transitional jacket — a trench, field jacket, quilted jacket or light wool coat. Choose long trousers or a skirt with tights, closed shoes, and a scarf when it feels like 8 °C (46 °F) or less.',
    appRule:
      'In the 6–11 °C band Today’s Outfit always adds an outer layer — usually a transitional jacket — over a base and a mid layer. It wants legs covered below 12 °C (thin tights with a skirt, thick below 6 °C) and adds a scarf below 8 °C or when it is windy.',
    intro: [
      'Chilly weather is layering weather. Mornings are cold, afternoons can be pleasant, and a single heavy coat is too much by lunch. A knit plus a light jacket gives you two options.',
      'This is the band where the wind makes the biggest difference: 9 °C in still sunshine is pleasant, 9 °C with a strong breeze needs a scarf and a windproof layer.',
    ],
    formula: {
      base: 'T-shirt, long-sleeve tee or a shirt',
      top: 'Knit, sweatshirt or cardigan',
      bottom: 'Jeans, chinos or trousers; tights with skirts and dresses',
      shoes: 'Leather trainers, loafers or ankle boots',
      outer: 'Trench, field jacket, quilted or light wool coat',
      accessories: 'Light scarf when it feels like 8 °C or less',
    },
    women: {
      base: 'Fitted long-sleeve tee',
      top: 'Grey fine-knit crew neck',
      bottom: 'Ecru straight jeans (or a midi skirt with 40–60-denier tights)',
      shoes: 'Black leather ankle boots',
      outer: 'Black leather jacket (or a classic trench)',
      accessories: 'Black crossbody bag; a light scarf below 8 °C',
    },
    men: {
      base: 'Oxford shirt or heavy tee',
      top: 'Crew-neck sweatshirt or a merino knit',
      bottom: 'Chinos or straight jeans',
      shoes: 'Leather trainers, desert boots or Derbies',
      outer: 'Field jacket, Harrington, quilted jacket or a mac',
      accessories: 'Light scarf, cap or beanie on windy days',
    },
    situations: {
      commute:
        'For cycling, a windproof jacket over a knit and full-length trousers. Walking: a trench you can open as you warm up.',
      office:
        'Shirt plus knit is the office uniform here; the jacket stays on the hook. A blazer under a trench works too.',
      evening:
        'It gets colder after dark — switch the light jacket for a wool coat, or add a scarf and closed shoes.',
    },
    fabrics: [
      { name: 'Merino and lambswool', why: 'Light warmth that does not overheat indoors.' },
      { name: 'Cotton gabardine', why: 'The trench fabric: wind- and shower-resistant.' },
      { name: 'Denim and twill', why: 'Sturdy legs that block a breeze.' },
      { name: 'Quilted nylon', why: 'Light, packable insulation for a transitional jacket.' },
      { name: 'Brushed cotton and flannel shirts', why: 'A shirt that doubles as a light layer.' },
    ],
    avoid: [
      'Shorts and bare legs — the app wants legs covered below 12 °C',
      'Sandals and mesh trainers',
      'Only a T-shirt under a light jacket — add a knit',
      'A heavy winter parka: you will be too warm by lunch',
    ],
    tips: [
      'When the day swings more than 8 °C, Today’s Outfit picks layers you can take off.',
      'A cardigan is the most flexible piece in this band: on, off, or over the shoulders.',
      'Damp chilly days feel colder than the number — dress for one band down.',
    ],
    faq: [
      {
        q: 'Do I need a jacket at 10 °C?',
        a: 'Yes. Below 12 °C feels-like, Today’s Outfit always adds an outer layer. A trench, field jacket or light wool coat over a knit is ideal at 10 °C (50 °F).',
      },
      {
        q: 'Is a hoodie enough at 8 °C?',
        a: 'Only for a short walk in still air. At 8 °C (46 °F) wear the hoodie under a light jacket, and add a scarf if it is windy.',
      },
      {
        q: 'Can I wear a dress in chilly weather?',
        a: 'Yes — with tights (40–60 denier from 6 to 11 °C), ankle boots and a jacket. A knit dress or a dress with a cardigan works best.',
      },
    ],
  },
  {
    key: 'cool',
    band: 'cool',
    slug: 'cool-weather',
    name: 'Cool',
    crumb: 'Cool weather',
    minC: 12,
    maxC: 16,
    minF: 53,
    maxF: 61,
    image: 'cool',
    imageAlt:
      'Man walking in a long navy trench coat over a grey crew-neck knit and white tee, beige chinos and white leather trainers',
    eyebrow: '12–16 °C · 53–61 °F',
    title: 'What to Wear in Cool Weather (12–16 °C / 53–61 °F)',
    metaDescription:
      'What to wear in cool weather between 12 and 16 °C (53–61 °F): a long-sleeve top with a knit or a light jacket — denim, overshirt or blazer — trousers or jeans and trainers.',
    h1: 'What to wear in cool weather',
    answer:
      'At 12–16 °C (53–61 °F), wear a long-sleeve top or a T-shirt with a light layer: a fine knit, cardigan, overshirt, denim jacket or blazer. Jeans or trousers and trainers or loafers are right. If you wear short sleeves or a dress, bring a jacket — and add one whenever it is windy.',
    appRule:
      'In the 12–16 °C band Today’s Outfit adds a mid layer OR a light jacket. The jacket becomes required when the base is short-sleeved or a dress, or when the wind is strong (from about 8 m/s, 18 mph).',
    intro: [
      'Cool weather is the easiest band to get right and the easiest to get slightly wrong: one light layer too few, and the shady side of the street feels cold. The answer is one layer you can carry.',
      'Sun makes a big difference here. 14 °C in sunshine feels like spring; 14 °C under cloud with a breeze feels like autumn.',
    ],
    formula: {
      base: 'Long-sleeve top, shirt or a T-shirt',
      top: 'Fine knit, cardigan or overshirt',
      bottom: 'Jeans, chinos or trousers; a skirt with sheer tights',
      shoes: 'Trainers, loafers or ankle boots',
      outer: 'Denim jacket, light bomber or blazer — required with short sleeves or wind',
      accessories: 'Light scarf on windy days, sunglasses when it is bright',
    },
    women: {
      base: 'Fitted long-sleeve or a poplin shirt',
      top: 'Fine-gauge cardigan or a V-neck knit',
      bottom: 'Wide-leg jeans, tailored trousers or a slip skirt with sheer tights',
      shoes: 'Loafers, ballet flats with socks or white trainers',
      outer: 'Denim jacket, cropped trench or an oversized blazer',
      accessories: 'Sunglasses, light scarf, shoulder bag',
    },
    men: {
      base: 'White crew-neck T-shirt',
      top: 'Grey fine merino crew neck',
      bottom: 'Beige chinos',
      shoes: 'White leather trainers',
      outer: 'Navy trench or mac (or a denim or chore jacket)',
      accessories: 'Sunglasses when it is bright',
    },
    situations: {
      commute:
        'A light jacket you can stuff in a bag. Cycling: a windproof shell over a knit — wind chill counts at speed.',
      office:
        'A shirt with a fine knit or a blazer is all you need. Trainers are fine in most offices.',
      evening:
        'Evenings drop into chilly territory: bring the jacket or a heavier knit even if the afternoon was warm.',
    },
    fabrics: [
      { name: 'Fine merino and cotton knit', why: 'Thin warmth that layers under a jacket.' },
      { name: 'Denim', why: 'A denim jacket blocks a breeze and goes with almost everything.' },
      { name: 'Cotton twill and canvas', why: 'Overshirts and chore jackets that work as a layer.' },
      { name: 'Light wool', why: 'Blazers and trousers that are comfortable all day.' },
    ],
    avoid: [
      'A heavy winter coat — you will carry it all afternoon',
      'Only a T-shirt and no layer to add',
      'Sandals on cloudy or windy days',
    ],
    tips: [
      'Short sleeve or dress? Today’s Outfit insists on a jacket in this band.',
      'Wind of 8 m/s (about 18 mph) or more turns a cool day into a jacket day.',
      'A blazer counts as a mid layer and as an outer layer in this band.',
    ],
    faq: [
      {
        q: 'Do I need a jacket at 15 °C?',
        a: 'Bring a light one. At 15 °C (59 °F) a knit or overshirt is often enough in sunshine, but you need a jacket with short sleeves, a dress, wind or a chilly morning.',
      },
      {
        q: 'Can I wear shorts at 15 °C?',
        a: 'Most people find 15 °C (59 °F) too cool for shorts, especially in the shade. Today’s Outfit requires covered legs below 12 °C and still favours trousers, jeans or a skirt with tights up to 16 °C.',
      },
      {
        q: 'Is a hoodie enough at 14 °C?',
        a: 'In sunshine and still air, yes. With cloud or a breeze, wear a denim or light jacket over it.',
      },
    ],
  },
  {
    key: 'mild',
    band: 'mild',
    slug: 'mild-weather',
    name: 'Mild',
    crumb: 'Mild weather',
    minC: 17,
    maxC: 21,
    minF: 62,
    maxF: 70,
    image: 'mild',
    imageAlt:
      'Woman by a café terrace in an ecru linen blazer over a black top, grey wide-leg trousers and black loafers, sunglasses in hand',
    eyebrow: '17–21 °C · 62–70 °F',
    title: 'What to Wear in Mild Weather (17–21 °C / 62–70 °F)',
    metaDescription:
      'What to wear in mild weather between 17 and 21 °C (62–70 °F): a T-shirt, shirt or light dress, with an optional thin knit or jacket for the morning and evening.',
    h1: 'What to wear in mild weather',
    answer:
      'At 17–21 °C (62–70 °F), a T-shirt, shirt, blouse or light dress is enough for most of the day. Take an optional light layer — a thin cardigan, overshirt or light jacket — for the morning, evening or wind. Jeans, chinos, a skirt or a midi dress with trainers or loafers all work.',
    appRule:
      'In the 17–21 °C band Today’s Outfit dresses you in a base layer and makes the mid layer or light jacket optional. It adds the jacket when it is windy or when the morning feels colder than 14 °C.',
    intro: [
      'Mild weather is the most comfortable band and the one where outfits have the most freedom. The only real question is the morning: 19 °C at noon can still be 12 °C when you leave home.',
      'Light fabrics and a layer you can carry are all you need.',
    ],
    formula: {
      base: 'T-shirt, shirt, blouse or a light dress',
      top: 'Optional thin cardigan, knit or overshirt',
      bottom: 'Jeans, chinos, light trousers or a skirt',
      shoes: 'Trainers, loafers, ballet flats or espadrilles',
      outer: 'Optional: light jacket for a cool morning or wind',
      accessories: 'Sunglasses; a cap when the UV is high',
    },
    women: {
      base: 'Black fitted top or tee',
      top: 'Ecru linen blazer — the optional layer',
      bottom: 'Grey wide-leg trousers (or a pleated midi skirt)',
      shoes: 'Black leather loafers',
      outer: 'None needed — the blazer covers a cool morning',
      accessories: 'Sunglasses, shoulder bag',
    },
    men: {
      base: 'T-shirt, polo or a short-sleeve shirt',
      top: 'Light overshirt worn open',
      bottom: 'Chinos or light-wash jeans',
      shoes: 'Canvas or leather trainers, loafers',
      outer: 'Light bomber or a cotton jacket if the morning is cool',
      accessories: 'Sunglasses, cap',
    },
    situations: {
      commute:
        'If you leave early, start with the overshirt or cardigan and carry it home. Cycling in the morning can still need a thin windproof.',
      office:
        'Shirt or blouse with trousers; keep a cardigan at your desk for air-conditioning.',
      evening:
        'Add the light jacket or a knit — mild afternoons often become cool evenings.',
    },
    fabrics: [
      { name: 'Cotton jersey and poplin', why: 'Breathable everyday tees and shirts.' },
      { name: 'Linen blends', why: 'Cool without being as creased as pure linen.' },
      { name: 'Light denim', why: 'Comfortable all day in this band.' },
      { name: 'Fine knit cotton', why: 'A cardigan that is warm enough for a cool morning but not heavy.' },
    ],
    avoid: [
      'Heavy knits and wool coats',
      'Thick tights — bare legs or sheer tights are fine in this band',
      'Forgetting the morning: check how cold it is when you leave',
    ],
    tips: [
      'Morning below 14 °C feels-like? Today’s Outfit adds a light jacket even on a mild day.',
      'Mild + windy = jacket. The app adds one when the wind is strong.',
      'This is the best band to wear your favourite T-shirt with tailored trousers.',
    ],
    faq: [
      {
        q: 'Do I need a jacket at 20 °C?',
        a: 'Usually not during the day. At 20 °C (68 °F) a T-shirt or shirt is enough; bring a light jacket or cardigan if the morning or evening is cooler, or if it is windy.',
      },
      {
        q: 'Is 18 °C shorts weather?',
        a: 'For many people, yes, especially in the sun. In the shade or wind, 18 °C (64 °F) can feel cool, so light trousers or a skirt are a safer default.',
      },
      {
        q: 'What shoes for 17–21 °C?',
        a: 'Trainers, loafers, ballet flats or espadrilles. Sandals work on sunny afternoons above about 20 °C.',
      },
    ],
  },
  {
    key: 'warm',
    band: 'warm',
    slug: 'warm-weather',
    name: 'Warm',
    crumb: 'Warm weather',
    minC: 22,
    maxC: 25,
    minF: 71,
    maxF: 77,
    image: 'warm',
    imageAlt:
      'Man on a sunny harbour promenade in an open camel short-sleeve linen shirt over a white tee, black shorts, leather sandals and sunglasses',
    eyebrow: '22–25 °C · 71–77 °F',
    title: 'What to Wear in Warm Weather (22–25 °C / 71–77 °F)',
    metaDescription:
      'What to wear in warm weather between 22 and 25 °C (71–77 °F): one breathable layer — tee, short-sleeve shirt or light dress — with shorts, a skirt or linen trousers and sandals or trainers.',
    h1: 'What to wear in warm weather',
    answer:
      'At 22–25 °C (71–77 °F), wear a single breathable layer: a T-shirt, short-sleeve shirt, tank or light dress, with shorts, a skirt, or cotton or linen trousers. Sandals, espadrilles or canvas trainers keep feet cool. Skip the jacket unless it rains or the morning is cold, and wear sunglasses.',
    appRule:
      'In the 22–25 °C band Today’s Outfit dresses you in a base layer only and does not add an outer layer on dry days — unless the morning feels colder than 14 °C. With UV 3 or more it suggests sunglasses or a cap.',
    intro: [
      'Warm weather is one-layer weather. The goal is airflow: looser cuts, natural fibres and lighter colours keep you more comfortable than the shortest shorts.',
      'Watch the sun more than the thermometer. A UV index of 3 or more is the point to add sunglasses and a cap.',
    ],
    formula: {
      base: 'T-shirt, short-sleeve shirt, tank or a light dress',
      top: 'None needed',
      bottom: 'Shorts, a skirt or linen/cotton trousers',
      shoes: 'Sandals, espadrilles or canvas trainers',
      outer: 'None on dry days — a light layer only for a cold morning',
      accessories: 'Sunglasses, cap or sun hat when the UV is high',
    },
    women: {
      base: 'Cotton tank, short-sleeve shirt or a linen midi dress',
      top: 'None needed',
      bottom: 'Linen trousers, a cotton midi skirt or tailored shorts',
      shoes: 'Flat leather sandals or espadrilles',
      outer: 'None — a cotton shirt over the shoulders for the evening',
      accessories: 'Sunglasses, straw or canvas sun hat',
    },
    men: {
      base: 'White T-shirt',
      top: 'Camel short-sleeve linen shirt worn open',
      bottom: 'Black tailored shorts above the knee',
      shoes: 'Leather sandals (or canvas trainers)',
      outer: 'None on dry days',
      accessories: 'Sunglasses',
    },
    situations: {
      commute:
        'Breathable fabrics and a shirt that does not show sweat; carry the jacket only if the morning is cold.',
      office:
        'Linen or cotton trousers and a short-sleeve shirt or a light dress. A thin cardigan in the bag for air-conditioning.',
      evening:
        'A long-sleeve linen shirt or a light knit over the shoulders covers you when the sun goes down.',
    },
    fabrics: [
      { name: 'Linen', why: 'Breathes and dries quickly — the app counts it as cooler than cotton.' },
      { name: 'Cotton poplin and seersucker', why: 'Light and airy; seersucker stands away from the skin.' },
      { name: 'Lightweight jersey', why: 'Soft tees that do not cling.' },
      { name: 'Chambray', why: 'A denim-like shirt without the weight.' },
    ],
    avoid: [
      'Jackets and knits on dry days',
      'Dark, heavy denim in full sun',
      'Synthetic fabrics that trap sweat',
      'Tight cuts — looser clothes move air',
    ],
    tips: [
      'Dress for the morning if you leave early: below 14 °C feels-like, the app still suggests a light layer.',
      'Light colours reflect the sun; dark colours absorb it.',
      'Rain on a warm day? A thin unlined rain jacket, not a coat.',
    ],
    faq: [
      {
        q: 'Is 24 °C warm enough for shorts?',
        a: 'Yes. At 24 °C (75 °F) shorts, skirts and light dresses are comfortable for most people, especially in the sun.',
      },
      {
        q: 'Do I need a jacket at 22 °C?',
        a: 'Not on a dry day. Today’s Outfit leaves the outer layer off from 22 °C feels-like unless it rains or the morning is colder than 14 °C.',
      },
      {
        q: 'What should I wear at 25 °C for work?',
        a: 'Linen or cotton trousers or a skirt with a short-sleeve shirt, a fine-knit polo or a light blouse, plus loafers or clean trainers.',
      },
    ],
  },
  {
    key: 'hot',
    band: 'hot',
    slug: 'hot-weather',
    name: 'Hot',
    crumb: 'Hot weather',
    minC: 26,
    maxC: null,
    minF: 78,
    maxF: null,
    image: 'hot',
    imageAlt:
      'Woman on a sunlit whitewashed street in a white tiered midi sundress, wide-brim straw hat, woven straw bag and flat leather sandals',
    eyebrow: '26 °C+ · 78 °F+',
    title: 'What to Wear in Hot Weather (26 °C+ / 78 °F+)',
    metaDescription:
      'What to wear in hot weather from 26 °C (78 °F): the lightest single layer — loose linen and cotton, shorts, skirts or airy dresses — open sandals, sunglasses and a hat.',
    h1: 'What to wear in hot weather',
    answer:
      'From 26 °C (78 °F), wear the lightest single layer you own: loose linen or cotton — a camp-collar shirt, tank or airy dress — with shorts, a skirt or wide linen trousers. Choose open sandals or espadrilles, and protect yourself from the sun with sunglasses and a cap or wide-brim hat.',
    appRule:
      'From 26 °C feels-like Today’s Outfit dresses for the base layer only and picks the lightest pieces you own; linen counts as cooler than cotton. In humid heat it uses the heat index, so 28 °C with high humidity is treated as hotter.',
    intro: [
      'Hot weather is about getting heat away from your body. Loose shapes that move air beat tight, minimal clothes; linen and cotton beat synthetics.',
      'Humidity matters: dry 30 °C is far more comfortable than humid 30 °C. On sticky days, go looser and lighter in colour.',
    ],
    formula: {
      base: 'Loose linen or cotton shirt, tank or an airy dress',
      top: 'None needed',
      bottom: 'Shorts, a light skirt or wide linen trousers',
      shoes: 'Open sandals, slides or espadrilles',
      outer: 'None',
      accessories: 'Sunglasses and a cap or wide-brim hat',
    },
    women: {
      base: 'White cotton tiered midi sundress',
      top: 'None needed',
      bottom: 'None — the dress does it (or linen shorts or a flowing skirt)',
      shoes: 'Flat leather sandals',
      outer: 'None',
      accessories: 'Wide-brim straw hat, woven straw bag, sunglasses',
    },
    men: {
      base: 'Linen camp-collar shirt or a loose cotton tee',
      top: 'None needed',
      bottom: 'Linen or cotton shorts, or wide linen trousers',
      shoes: 'Leather sandals, espadrilles or slides',
      outer: 'None',
      accessories: 'Sunglasses, cap or bucket hat',
    },
    situations: {
      commute:
        'Wear the lightest fabric you own and a shirt with some room; change into a fresh top at work if you cycle.',
      office:
        'Linen trousers or a midi skirt with a short-sleeve shirt or shell top. Keep a light layer for strong air-conditioning.',
      evening:
        'Stay in linen; a long-sleeve linen shirt protects from mosquitoes without trapping heat.',
    },
    fabrics: [
      { name: 'Linen', why: 'The coolest everyday fabric: breathes, dries fast, stands away from the skin.' },
      { name: 'Cotton voile and seersucker', why: 'Very light weaves that let air through.' },
      { name: 'Lyocell and viscose', why: 'Smooth and cool against the skin for dresses and shirts.' },
      { name: 'Open-weave knits', why: 'A summer polo that breathes.' },
    ],
    avoid: [
      'Polyester and other synthetics that trap sweat',
      'Tight jeans and skinny fits',
      'Closed, heavy shoes',
      'Dark colours in direct sun',
    ],
    tips: [
      'Loose beats short: a wide linen trouser is cooler than tight shorts.',
      'UV 3 or more: add sunglasses and a cap or hat — the app suggests one.',
      'Bring a thin layer for air-conditioned trains and offices.',
    ],
    faq: [
      {
        q: 'What is the coolest fabric for hot weather?',
        a: 'Linen, then light cotton weaves like voile and seersucker. They breathe and dry quickly; synthetics trap heat and sweat.',
      },
      {
        q: 'Should I wear light or dark colours in the heat?',
        a: 'Light colours reflect more sunlight and feel cooler in direct sun. Loose fit matters even more than colour.',
      },
      {
        q: 'What should I wear in humid heat?',
        a: 'The loosest, lightest pieces you own — linen, open weaves, sandals. Today’s Outfit uses the heat index from 27 °C, so humid days count as hotter.',
      },
    ],
  },
];

export const BAND_BY_KEY = Object.fromEntries(BANDS.map((b) => [b.band, b])) as Record<
  Band['band'],
  Band
>;
