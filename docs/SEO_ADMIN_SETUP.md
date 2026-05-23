# SEO Admin Setup

`/admin/seo-reports` är en intern dashboard som hämtar live-data från
Google Search Console + GA4 för alexanderbergqvist.com.

## Översikt

För att admin-sidan ska fungera behövs:
1. Ett eget Google Cloud-projekt (isolerat från doxvl)
2. Två APIs aktiverade i projektet
3. Ett service account med JSON-nyckel
4. Service accountet tillagt på GSC + GA4 properties
5. Tre env vars i Vercel

Hela setupen tar ~10-15 min.

---

## Steg 1 — Skapa Google Cloud-projekt

1. Gå till [Google Cloud Console](https://console.cloud.google.com/)
2. Klicka på projekt-väljaren (uppe vänster) → **New Project**
3. **Project name:** `alexanderbergqvist-seo` (eller valfritt)
4. **Organization:** No organization (om du inte har en)
5. Klicka **Create**. Vänta 10-20 sek tills projektet är skapat.
6. Välj det nya projektet i project picker

## Steg 2 — Aktivera APIs

1. I sidomenyn: **APIs & Services** → **Library**
2. Sök "**Google Search Console API**" → klicka → **Enable**
3. Sök "**Google Analytics Data API**" → klicka → **Enable**

## Steg 3 — Skapa service account

1. **IAM & Admin** → **Service Accounts**
2. **+ CREATE SERVICE ACCOUNT** (uppe)
3. **Service account name:** `seo-reader`
4. **Service account ID:** auto-genereras (`seo-reader`)
5. **Description:** "Reads GSC + GA4 data for alex.com admin dashboard"
6. **CREATE AND CONTINUE**
7. Steg 2 (Grant access): hoppa över — klicka **CONTINUE**
8. Steg 3 (Grant users): hoppa över — klicka **DONE**

Nu finns SA:t i listan. Notera dess email — det ser ut så här:
```
seo-reader@alexanderbergqvist-seo.iam.gserviceaccount.com
```
(Ditt project-id kan vara aningen annorlunda, t.ex. `alexanderbergqvist-seo-12345` om namnet var taget.)

## Steg 4 — Skapa JSON-nyckel

1. Klicka på det nya service accountet i listan
2. Flik **KEYS**
3. **ADD KEY** → **Create new key**
4. **Key type:** JSON
5. **CREATE** → en `.json`-fil laddas ner till din dator. Behåll filen — vi behöver innehållet i steg 6.

## Steg 5 — Lägg till SA på GSC + GA4

### Search Console
1. [Google Search Console](https://search.google.com/search-console) → välj propertyn `alexanderbergqvist.com`
2. Settings (kugghjul nere vänster) → **Users and Permissions**
3. **Add user** → klistra in service account-emailen från steg 3
4. **Permission: Restricted** (read-only räcker för analys)
5. **Add**

### GA4
1. [GA4](https://analytics.google.com) → Admin (kugghjul nere vänster)
2. **Property Access Management** (under Property-kolumnen)
3. **+** uppe till höger → **Add users**
4. Email: samma SA-email
5. **Roles: Viewer**
6. **Add**
7. Notera **Property ID** (Admin → Property Details → siffersträng, t.ex. `123456789`)

## Steg 6 — Vercel env vars

Vercel Dashboard → alexanderbergqvist.com → **Settings** → **Environment Variables**

Lägg till **sju** env vars, alla för **Production** + **Preview**:

### Grundläggande (krävs för basrapporter)

| Namn | Värde |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Hela innehållet i JSON-filen från steg 4 |
| `GA_PROPERTY_ID` | Siffror från GA4 Property Details |
| `ADMIN_PASSWORD` | Långt slumpmässigt lösenord |

### App Store Connect (krävs för 🧠 SEO Expert-läget)

`SEO Expert`-läget kombinerar GSC + GA4 + ASC sales för att hitta funnel-läckor.
Utan dessa fyra fungerar de andra rapporterna men Expert-läget visar "ASC ej konfigurerad".

| Namn | Värde |
|---|---|
| `ASC_KEY_ID` | 10-char ASC API key id (samma som `asc-launcher` använder) |
| `ASC_ISSUER_ID` | Issuer UUID (samma) |
| `ASC_PRIVATE_KEY` | Innehållet i `.p8`-filen (öppna i text-editor, kopiera ALLT inkl `-----BEGIN PRIVATE KEY-----` / `-----END PRIVATE KEY-----`-raderna). **Eller:** base64-encode hela filen (`base64 -i AuthKey_XXX.p8 \| pbcopy`) och spara i `ASC_PRIVATE_KEY_B64` istället. |
| `ASC_VENDOR_NUMBER` | Apple vendor number (~10 siffror, hittar i [ASC → Sales and Trends](https://appstoreconnect.apple.com/trends/) längst upp på sidan) |

**Save** alla.

## Steg 7 — Redeploy

Efter env vars är satta: Vercel → Deployments → senaste prod → **Redeploy**. Annars läser inte funktionen de nya variablerna.

## Steg 8 — Test lokalt (valfritt)

```bash
cd ~/Downloads/alexanderbergqvist-com
mv ~/Downloads/alexanderbergqvist-seo-*.json ./service-account.json
echo "ADMIN_PASSWORD=ditt-lösenord" > .env
echo "GA_PROPERTY_ID=123456789" >> .env
npm run dev
# Öppna http://localhost:4321/admin/seo-reports/
```

`service-account.json` och `.env` är gitignored — committa aldrig.

## Steg 9 — Använd admin-sidan

1. Gå till `https://alexanderbergqvist.com/admin/seo-reports/`
2. Skriv in `ADMIN_PASSWORD` (lagras i `localStorage`)
3. Tryck på en rapport-knapp:
   - **🔎 Toppsökord** — Vilka söktermer driver klick
   - **📄 Toppsidor** — Vilka sidor får mest exponering
   - **🎯 Sökord per sida** — Drill ner på en specifik URL
   - **📊 GA: Trafikkällor** — Kanalfördelning (Organic / Direct / etc.)
   - **📈 GA: Toppsidor** — Pageviews per sida

Varje rapport visar **insikter** ovanför tabellen (🔴 high / 🟠 med / 🟢 low) baserat på Google CTR-benchmarks per ranking-position.

---

## Felsökning

**403 från Search Console API:** Service account är inte tillagt som user på propertyn. Gå tillbaka till steg 5.

**404 från Search Console API:** Domain-property mismatch. Verifiera att propertyn heter exakt `alexanderbergqvist.com` (med eller utan https beroende på vilken typ av property du har).

**403 från GA4 API:** Service account saknar Viewer-rollen, eller GA_PROPERTY_ID är fel.

**500 "GOOGLE_SERVICE_ACCOUNT_JSON not valid JSON":** Klistrade in ofullständigt — öppna JSON-filen igen och kopiera HELT innehåll.

**Admin-sidan visar bara lösenordsfältet och sen ingenting händer:** ADMIN_PASSWORD är inte satt i Vercel, eller du behöver Redeploy.

## Säkerhet

- Admin-sidan har `noindex` i metan så Google crawlar den inte
- Lösenordsskyddad — utan ADMIN_PASSWORD går inte API:t att anropa
- Service accountets JSON-nyckel exponeras ALDRIG till browsern, bara servern
- För extra skydd: överväg att lägga `/admin/*` i `robots.txt`
