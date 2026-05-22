# Overnight work 2026-05-21 → 22 morning

## Summary

Wrote new articles overnight for **bestseller apps** (Födelsedagar,
Surdeg, Plantera) + added Amazon affiliate placeholders to gift &
equipment articles.

**Nothing committed or pushed.** All changes uncommitted — review
with `git status` / `git diff`, then commit when you approve.

## New articles (20 files uncommitted)

### Plantera FR — completes the cluster (3 new)
- `src/content/articles/plantera/sol-engrais-potager.mdx`
- `src/content/articles/plantera/calendrier-semis-france.mdx`
- `src/content/articles/plantera/parasites-maladies-potager.mdx`

### Plantera ES — new Spanish market (3 new)
- `src/content/articles/plantera/verduras-faciles-cultivar.mdx`
- `src/content/articles/plantera/jardineria-balcon-principiantes.mdx`
- `src/content/articles/plantera/crear-huerto-desde-cero.mdx`

### Plantera IT — new Italian market (3 new)
- `src/content/articles/plantera/verdure-facili-coltivare.mdx`
- `src/content/articles/plantera/orto-balcone-principianti.mdx`
- `src/content/articles/plantera/creare-orto-da-zero.mdx`

### Födelsedagar — NEW topics (not translations) — affiliate-tunga
- `src/content/articles/fodelsedagar/birthday-gift-ideas.mdx` (EN, with Amazon)
- `src/content/articles/fodelsedagar/birthday-party-planning-checklist.mdx` (EN, with Amazon)
- `src/content/articles/fodelsedagar/geburtstagsgeschenke-ideen.mdx` (DE, with Amazon)
- `src/content/articles/fodelsedagar/idees-cadeaux-anniversaire.mdx` (FR, with Amazon)

### Modified — added Amazon affiliate placeholders
- `src/content/articles/surdeg/sourdough-equipment-guide.mdx`

### New documentation
- `AMAZON_AFFILIATE_TODO.md` — how to activate affiliate links
- `OVERNIGHT_2026-05-21.md` — this file

## Amazon affiliate placeholder

All affiliate URLs use `YOUR_AMAZON_TAG` as placeholder. To activate:

```bash
cd ~/Downloads/alexanderbergqvist-com
# Replace YOUR_AMAZON_TAG with your real tag everywhere:
grep -rl "YOUR_AMAZON_TAG" src/content/articles/ | \
  xargs sed -i.bak 's/YOUR_AMAZON_TAG/yourname-20/g' && \
  find src/content/articles -name "*.bak" -delete
```

(Replace `yourname-20` with your real Amazon Associates tag.)

The placeholder appears in:
- `fodelsedagar/birthday-gift-ideas.mdx` — ~30 product links
- `fodelsedagar/birthday-party-planning-checklist.mdx` — 7 product links
- `fodelsedagar/geburtstagsgeschenke-ideen.mdx` — ~30 product links (DE)
- `fodelsedagar/idees-cadeaux-anniversaire.mdx` — ~30 product links (FR)
- `surdeg/sourdough-equipment-guide.mdx` — 9 product links

Total affiliate links: ~110

See `AMAZON_AFFILIATE_TODO.md` for multi-country setup details.

## Suggested commit strategy

```bash
cd ~/Downloads/alexanderbergqvist-com

# Batch 1 — Plantera language expansion (9 articles)
git add src/content/articles/plantera/
git commit -m "plantera: 9 new articles (FR depth, ES+IT new markets)"

# Batch 2 — New Födelsedagar revenue articles (4 articles with affiliate)
git add src/content/articles/fodelsedagar/
git commit -m "fodelsedagar: 4 new affiliate-monetized articles (gift ideas, party)"

# Batch 3 — Surdeg equipment affiliate update
git add src/content/articles/surdeg/sourdough-equipment-guide.mdx
git commit -m "surdeg: add Amazon affiliate placeholders to equipment guide"

# Batch 4 — Documentation
git add AMAZON_AFFILIATE_TODO.md OVERNIGHT_2026-05-21.md
git commit -m "docs: Amazon affiliate setup + overnight report"

# Then push:
git push origin main
```

Or one-liner if you just want it all in:

```bash
git add -A && \
  git commit -m "overnight: 20 articles (Plantera FR/ES/IT, Födelsedagar gift+party EN/DE/FR, affiliate setup)" && \
  git push origin main
```

## Build status

Last `npm run build` ran clean — all new articles produce valid HTML.

### Verified URLs (will be live after push):

**Plantera FR (depth):**
- /fr/plantera/sol-engrais-potager/
- /fr/plantera/calendrier-semis-france/
- /fr/plantera/parasites-maladies-potager/

**Plantera ES:**
- /es/plantera/verduras-faciles-cultivar/
- /es/plantera/jardineria-balcon-principiantes/
- /es/plantera/crear-huerto-desde-cero/

**Plantera IT:**
- /it/plantera/verdure-facili-coltivare/
- /it/plantera/orto-balcone-principianti/
- /it/plantera/creare-orto-da-zero/

**Födelsedagar gift+party (affiliate-monetized):**
- /en/fodelsedagar/birthday-gift-ideas/
- /en/fodelsedagar/birthday-party-planning-checklist/
- /de/fodelsedagar/geburtstagsgeschenke-ideen/
- /fr/fodelsedagar/idees-cadeaux-anniversaire/

## Cluster status after this batch

| App | Locales | Total articles |
|---|---|---|
| Födelsedagar | sv + en 5 + de 4 + fr 4 | 13 EN/DE/FR + sv |
| Surdeg | sv + en 6 + de 6 + fr 5 | 17 EN/DE/FR + sv |
| **Plantera** | sv + en 6 + de 6 + fr 6 + es 3 + it 3 | **24 EN/DE/FR/ES/IT + sv** |
| Andas | sv + en 4 + de 4 + fr 3 + es 3 + it 1 | 15 + sv (paused) |
| Rita | sv + en 3 (draft) | sv only live |

## Next morning checklist (suggested)

1. Read this file + `AMAZON_AFFILIATE_TODO.md` (5 min)
2. `git status` to see all uncommitted changes (1 min)
3. Skim 2-3 articles to sanity-check translation quality (10 min)
4. Run the affiliate find/replace with your real Amazon tag (1 min)
5. Commit + push using one of the suggested commands (1 min)
6. Wait for Vercel deploy (~2 min)
7. Submit new URLs to Google Search Console:
   - Sitemap: `https://alexanderbergqvist.com/sitemap-index.xml`
   - Manual prio for gift/party affiliate URLs (4 listed above)
8. Verify a couple of live URLs look correct
