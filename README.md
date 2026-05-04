# alexanderbergqvist.com

SEO-optimerad portfolio + free-tool-site för att driva organisk app-trafik.
Astro 5 + Tailwind v4 + MDX, deployas på Vercel.

## Lokalt

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # produktionsbygge i dist/
npm run preview      # preview av build
```

## Struktur

```
src/
├── content/
│   ├── apps/                ← 1 JSON per app (= 1 landing-sida)
│   └── articles/[app]/*.mdx ← SEO-artiklar per app
├── components/              ← BaseLayout, SEO, Nav, Footer, AppCard, AppStoreBadge
├── pages/
│   ├── index.astro          ← startsida
│   ├── appar/index.astro    ← alla appar
│   ├── [app]/index.astro    ← dynamisk app-landing (alla 9 appar)
│   ├── [app]/[slug].astro   ← dynamiska artiklar
│   ├── snusfri-resa/kalkylator.astro  ← interaktiv kalkylator
│   ├── om/index.astro
│   └── blog/index.astro
└── styles/global.css
```

## Lägg till en ny artikel

1. Skapa `src/content/articles/<app-slug>/<artikel-slug>.mdx`
2. Frontmatter:
   ```mdx
   ---
   title: "Rubrik"
   description: "Meta-beskrivning för Google"
   app: snusfri-resa
   publishedAt: 2026-05-04
   keywords: ["keyword 1", "keyword 2"]
   ---
   ```
3. Skriv MDX-innehåll under frontmattern
4. Visas automatiskt på `/snusfri-resa/<artikel-slug>/` och listas på app-sidan

## Lägg till en ny app

Skapa `src/content/apps/<app-slug>.json` (kopiera mall från befintlig).
URL blir `/<app-slug>/`. App-bilen syns automatiskt på startsidan + /appar/.

## Deploya till Vercel

### Första gången

1. Skapa GitHub-repo + push:
   ```bash
   cd ~/Downloads/alexanderbergqvist-com
   git init
   git add -A
   git commit -m "Initial site"
   git remote add origin git@github.com:<din-user>/alexanderbergqvist-com.git
   git push -u origin main
   ```

2. På [vercel.com/new](https://vercel.com/new) — välj GitHub-repot. Vercel
   detekterar Astro automatiskt. Klicka **Deploy**.

3. Vercel ger dig en `*.vercel.app`-URL direkt. Testa att den funkar.

### Koppla alexanderbergqvist.com (Strato → Vercel)

1. På Vercel: **Project → Settings → Domains** → Add domain
   `alexanderbergqvist.com` (och `www.alexanderbergqvist.com`).
2. Vercel visar DNS-records som behöver sättas. Två vanliga set-ups:
   - **Apex (alexanderbergqvist.com)** → `A` 76.76.21.21
   - **www** → `CNAME` cname.vercel-dns.com
3. Logga in på Strato → DNS-hantering för domänen → lägg in records.
4. Vänta 5–60 min på DNS-propagering. Vercel sätter automatiskt SSL.

## Innehållsroadmap

Prioritera per app i denna ordning för max SEO-payback:

### Snusfri Resa (största TAM)
- ✅ /snusfri-resa/kalkylator
- ✅ /snusfri-resa/abstinens-tidslinje
- ⬜ /snusfri-resa/tandkott-efter-snus
- ⬜ /snusfri-resa/sluta-kallt-eller-trappa-ner
- ⬜ /snusfri-resa/sa-mycket-kostar-snus-per-ar

### Surdeg
- ⬜ /surdeg/hydration-kalkylator (free tool)
- ⬜ /surdeg/matningsschema (free tool)
- ⬜ /surdeg/recept/[slug] — 33 sidor, 1 per recept
- ⬜ /surdeg/surdeg-fran-grunden

### VAB-koll
- ⬜ /vab-koll/dagar-rakna-ut (free tool)
- ⬜ /vab-koll/vab-regler-2026

### Resten
Mall: 1 free tool + 3-5 artiklar per app.

## Google Analytics 4

Sajten har inbyggd GA4-integration som auto-trackar pageviews + outbound clicks (App Store-länkar).

### Sätt upp GA4 (engångsjobb)

1. Gå till [Google Analytics](https://analytics.google.com/) → "Skapa egendom"
2. Egenskapsnamn: `alexanderbergqvist.com`
3. Tidszon: Sverige · Valuta: SEK
4. Branschkategori: "Technology"
5. Skapa "Web data stream" → URL: `https://alexanderbergqvist.com`
6. Kopiera **Measurement ID** (`G-XXXXXXXXXX`)

### Aktivera på Vercel

1. Vercel-projekt → Settings → Environment Variables
2. Lägg till: `PUBLIC_GA_ID` = `G-XXXXXXXXXX`
3. Apply på alla environments
4. Trigger en omdistribuering (push valfri commit eller "Redeploy")

GA aktiveras bara i prod-builds — under utveckling lokalt loggas inget.

### Vad som tracker auto:

- Pageviews (varje sida)
- `outbound_click`-event för alla externa länkar med `link_url`,
  `link_domain`, `link_text`, och `is_app_store: true/false`

Det betyder att du i GA4 kan se exakt hur många klick varje
App Store-knapp får per sida — perfekt för att mäta SEO → install-funnel.

## OG-bilder (för länkdelningar)

Bilder visas när någon delar en länk till sajten i iMessage / Facebook /
LinkedIn / Slack. Genereras automatiskt från en mall:

```bash
python3 scripts/gen-og.py
```

Skapar 1200×630 PNG per sida i `public/og/`. Kör efter att du lagt till
nya artiklar/appar och innan du pushar.

## SEO-checklist innan launch

- [x] Sitemap genereras automatiskt via @astrojs/sitemap
- [x] OpenGraph + Twitter cards via SEO.astro
- [x] JSON-LD SoftwareApplication på app-sidor
- [x] robots.txt
- [ ] Verifiera i Google Search Console (efter deploy)
- [ ] Submit sitemap-index.xml till GSC
- [ ] Lägg till Plausible eller Google Analytics 4
- [ ] Kontrollera Core Web Vitals via PageSpeed Insights

## Bidra med innehåll

Skriv så naturligt du kan på svenska. Long-tail keywords är vad du
söker — sökfraser med 3+ ord är där den lägsta konkurrensen finns. En
artikel som rankar #1 för en fras med 200 sökningar/mån slår en artikel
som rankar #50 för en fras med 50 000.

Om du fastnar — be Claude om förslag på artiklar baserat på en app, så
genererar den 5–10 artikelämnen med target-keywords.
