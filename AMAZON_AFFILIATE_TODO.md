# Amazon Affiliate Setup — Action Required

Articles written overnight (2026-05-21/22) include placeholder Amazon
affiliate links. To activate them, do **one find/replace** across the
repo:

## Step 1 — Get your Amazon Associates tag

Format: `yourname-20` (US), `yourname-21` (UK), `yourname-22` (DE),
etc. See your dashboard at
https://affiliate-program.amazon.com (US) or country equivalents.

## Step 2 — Replace the placeholder

The placeholder string `YOUR_AMAZON_TAG` appears in articles' Amazon
URLs.

Run from repo root:

```bash
# US (default — keep this one if you only have US):
grep -rl "YOUR_AMAZON_TAG" src/content/articles/ | \
  xargs sed -i.bak 's/YOUR_AMAZON_TAG/yourname-20/g' && \
  find src/content/articles -name "*.bak" -delete
```

(Replace `yourname-20` with your real tag.)

## Step 3 — Multi-country setup (optional)

If you want country-specific Amazon links per locale (US article →
amazon.com, DE article → amazon.de, etc.), the placeholder is
already shaped that way. The base URL in each article already
points to the right Amazon storefront for that language. Just the
tag suffix needs replacement.

| Language | Storefront | Typical tag suffix |
|---|---|---|
| en | amazon.com | `-20` |
| de | amazon.de | `-21` |
| fr | amazon.fr | `-21` |
| it | amazon.it | `-21` |
| es | amazon.es | `-21` |
| en (UK targeting) | amazon.co.uk | `-21` |

## Articles with affiliate placeholders

As of 2026-05-22 morning:

- `src/content/articles/fodelsedagar/birthday-gift-ideas.mdx`
- `src/content/articles/fodelsedagar/birthday-party-planning-checklist.mdx`

When you write/translate more gift- or equipment-related articles,
keep using `YOUR_AMAZON_TAG` as the placeholder so a single
find/replace handles them all.

## How the links work

Each link is a **search URL** rather than a specific product page:

```
https://www.amazon.com/s?k=premium+candles&tag=YOUR_AMAZON_TAG
```

Why search URLs:
- No need to maintain specific ASINs (they get discontinued)
- Reader picks what fits their budget/taste
- Amazon's 24-hour cookie credits you for anything they buy after
  clicking, not just that specific product

This is the standard approach used by gift-guide and review sites.
