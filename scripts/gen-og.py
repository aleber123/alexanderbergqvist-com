#!/usr/bin/env python3
"""Generate per-page OG images (1200x630) for the SEO site.

Reads the content collections (apps + articles) and produces one PNG
per piece, output to public/og/<slug>.png.

Why generate locally and commit:
  - Vercel doesn't run Python in the build pipeline by default
  - Avoids Node-side `satori` complexity for now
  - Each rebuild is fast (~1s per image)

Run before pushing if you've added new content:
  python3 scripts/gen-og.py
"""

import json
import re
import textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src" / "content"
PUBLIC_OG = ROOT / "public" / "og"
PUBLIC_OG.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630

# System fonts that exist on macOS — fallback chain.
FONT_CANDIDATES = [
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial Bold.ttf",
]


def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            try:
                # ttc files have multiple faces; index 1 is usually bold.
                if path.endswith(".ttc"):
                    return ImageFont.truetype(path, size, index=1 if bold else 0)
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def parse_frontmatter(mdx_path: Path) -> dict:
    """Minimal YAML frontmatter parser — title + description only."""
    text = mdx_path.read_text()
    if not text.startswith("---"):
        return {}
    end = text.find("---", 3)
    if end == -1:
        return {}
    fm = text[3:end]
    out = {}
    for line in fm.split("\n"):
        m = re.match(r'^(\w+):\s*"?(.*?)"?$', line.strip())
        if m and m.group(1) in ("title", "description", "app"):
            out[m.group(1)] = m.group(2).rstrip('"')
    return out


def hex_to_rgb(hx: str) -> tuple:
    hx = hx.lstrip("#")
    return tuple(int(hx[i : i + 2], 16) for i in (0, 2, 4))


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def draw_card(out_path: Path, *, kicker: str, title: str, accent: str,
              accent_dark: str | None = None) -> None:
    """Render a single OG image with gradient background + bold title."""
    img = Image.new("RGB", (W, H), (15, 23, 42))  # slate-900 fallback
    d = ImageDraw.Draw(img)

    a = hex_to_rgb(accent)
    b = hex_to_rgb(accent_dark) if accent_dark else hex_to_rgb(accent)
    # Vertical gradient.
    for y in range(H):
        d.line([(0, y), (W, y)], fill=lerp(a, b, y / H))

    # Subtle dark vignette in lower-right for text contrast.
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rectangle((0, H * 0.5, W, H), fill=(0, 0, 0, 50))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    d = ImageDraw.Draw(img)

    # Padding.
    pad = 80

    # Kicker (small uppercase label) above title.
    kicker_font = load_font(28, bold=True)
    d.text((pad, pad), kicker.upper(), font=kicker_font, fill=(255, 255, 255, 220))

    # Title — wrap and shrink-to-fit.
    title_size = 72
    while title_size >= 36:
        title_font = load_font(title_size, bold=True)
        wrapped = textwrap.wrap(title, width=int(900 / (title_size * 0.55)))
        line_height = int(title_size * 1.2)
        total_height = len(wrapped) * line_height
        if total_height <= H - 2 * pad - 60 and len(wrapped) <= 4:
            break
        title_size -= 4

    y = pad + 60
    for line in wrapped:
        d.text((pad, y), line, font=title_font, fill="white")
        y += line_height

    # Site name in bottom-right.
    site_font = load_font(24, bold=True)
    site_text = "alexanderbergqvist.com"
    bbox = d.textbbox((0, 0), site_text, font=site_font)
    site_w = bbox[2] - bbox[0]
    d.text((W - pad - site_w, H - pad - 24), site_text,
           font=site_font, fill=(255, 255, 255, 220))

    img.save(out_path, "PNG", optimize=True)


def main():
    # Load app metadata for accent colors + names.
    apps = {}
    for f in (CONTENT / "apps").glob("*.json"):
        data = json.loads(f.read_text())
        apps[f.stem] = data

    count = 0

    # 1. Default site OG.
    draw_card(
        PUBLIC_OG / "default.png",
        kicker="Indie iOS-utvecklare · Sverige",
        title="Appar och fria verktyg som löser vardagsproblem.",
        accent="#1e40af",
        accent_dark="#0f172a",
    )
    count += 1

    # 2. Per app.
    for slug, data in apps.items():
        draw_card(
            PUBLIC_OG / f"{slug}.png",
            kicker=data.get("category", "App"),
            title=data["name"] + " — " + data["tagline"],
            accent=data["accent"],
            accent_dark=data.get("accentDark"),
        )
        count += 1

    # 3. Per article.
    for f in (CONTENT / "articles").glob("**/*.mdx"):
        fm = parse_frontmatter(f)
        if not fm or fm.get("draft"):
            continue
        app_slug = fm.get("app")
        app_data = apps.get(app_slug, {})
        slug = f.stem
        out_name = f"{app_slug}-{slug}.png" if app_slug else f"{slug}.png"
        draw_card(
            PUBLIC_OG / out_name,
            kicker=app_data.get("name", "Artikel"),
            title=fm.get("title", "Artikel"),
            accent=app_data.get("accent", "#0f172a"),
            accent_dark=app_data.get("accentDark"),
        )
        count += 1

    print(f"Generated {count} OG images in {PUBLIC_OG.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
