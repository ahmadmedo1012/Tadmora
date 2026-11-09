# TADMORA Logo Guidelines — «قوس تادمورا» Usage

> **Date:** 2026-11-09 · **Branch:** `rebrand/tadmora-foundation`
> Logo-specific usage for the TADMORA (تادمورا) identity: the four variants, tone
> modes, size floors, stroke behavior per size, the favicon deviation, platform
> seats, and the file inventory with regeneration commands. The mark's
> construction and symbolism live in [`BRAND.md`](BRAND.md); the token system in
> [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md); the full asset table in
> [`ASSET-MANIFEST.md`](ASSET-MANIFEST.md).

---

## 1 · The component API

```tsx
import { Logo } from '@/brand';

export type LogoVariant = 'lockup' | 'mark' | 'wordmark' | 'stacked';
export type LogoTone = 'auto' | 'ink' | 'paper' | 'orange';

<Logo
  variant="lockup"   // default — see §2
  size={32}          // the mark's render height in px (default 32)
  tone="auto"        // see §3
  animated={false}   // stroke-draw 600–900ms, keystone LAST (§DESIGN-SYSTEM 5.1)
  className="…"
/>
```

Rendered **inline SVG only** — never an `<img>` in app chrome, never a
`document.logo` outside the generated `/brand/*` statics. The root carries
`data-logo`, `role="img"`, and `<title>تادمورا</title>`.

---

## 2 · The four variants

### 2.1 `lockup` — horizontal (the default)

| Property | Spec |
|---|---|
| Composition | the mark **RIGHT** + the Arabic wordmark «تادمورا» **LEFT** |
| Ordering rule | **RTL ordering**: in right-to-left reading order the eye meets the arch first (the entry), then the name. In code the DOM order follows the RTL direction — never mirror it to LTR ordering |
| Wordmark voice | IBM Plex Sans Arabic 600, stroke-only hollow, **never letter-spaced** |
| Sizing | driven by the mark's `size` (mark height); the wordmark scales with it and must independently clear the 30px ink floor (§4) |
| Seats | header, auth screens, footer — the everyday chrome |

### 2.2 `mark` — the arch alone

| Property | Spec |
|---|---|
| Composition | «قوس تادمورا» only — pillars, arch, baseline, one solid keystone |
| Sizing | the square 32-grid; floor 16px (§4) |
| Seats | sidebar, avatars, favicons, tight chrome, anywhere the wordmark floor cannot fit |

### 2.3 `wordmark` — «تادمورا» alone

| Property | Spec |
|---|---|
| Composition | the hollow Arabic wordmark only, no mark |
| Voice | stroke-only drafting render (fill:none, stroke:currentColor, non-scaling ≈1.5px); **never letter-spaced** |
| Sizing | measured in **ink height**; floor 30px |
| Seats | wide in-text brand mentions, editorial seats |

### 2.4 `stacked`

| Property | Spec |
|---|---|
| Composition | mark on top / «تادمورا» (Arabic 600, hollow) / `TADMORA` (Geist Mono 500, **filled**, **0.08em tracking** — Latin may be tracked) |
| Alignment | centered column; the Latin micro-label is the smallest line — the mono instrument voice |
| Sizing | generous seats only — covers, splash, OG card, metadata plates. Never dense chrome |

**Tagline seat**: «الجامعة في منظومة واحدة» sets **under** a lockup in spacious
seats only (OG, splash, about) — never inside chrome lockups.

---

## 3 · Tone modes

| `tone` | Ink (strokes / wordmark) | Keystone | Use on |
|---|---|---|---|
| `auto` (default) | `currentColor` | `var(--accent)` | any themed seat — the logo follows the text colour and the theme's accent (`#FA3600` light · luminous ember `#FF5A1F` dark) with zero props |
| `ink` | `#282828` | `#282828` | paper / light imagery — the whole mark reads as one ink drawing |
| `paper` | `#F6F6EE` | `#F6F6EE` | ink / dark or photographic grounds |
| `orange` | `#FA3600` | `#FA3600` | single-signal plates (rare) — never an orange background behind the mark |

Rules:

- **There is no second logo for dark mode.** Dark theming is the `--accent` token
  swap riding through `tone="auto"` (`currentColor` follows the seat's text
  colour; `var(--accent)` is re-keyed by `tokens.css`).
- The keystone loses its signal when its colour equals the ink on a busy ground —
  switch to `tone="ink"` / `tone="paper"` per the ground. Never box the mark in an
  orange panel instead.
- `tone` recolors **only** — it never changes geometry, stroke, or composition.

---

## 4 · Size floors

| Element | Floor | Below the floor |
|---|---|---|
| Mark (`mark`, or the mark inside lockups) | **16px** | render nothing — the hairline geometry is illegible smaller |
| Wordmark (ink height) | **30px** | the hollow strokes close up — use `mark` instead |
| Stacked lockup | generous seats only | — |

---

## 5 · Stroke behavior per size — the optical-size ramp

A constant 1.5px screen stroke reads progressively heavier as the mark shrinks
(12.5% of the mark's height at 12px vs the designed 4.7% at 32px — 2.7× too
heavy; small seats turn the hairline into a blob). The component's non-scaling
stroke therefore **tapers linearly** below the 32-grid design size, implemented
by `markStrokePx(size)` in `frontend/src/brand/mark.ts`:

| Render size (px) | Stroke (px) | | Render size (px) | Stroke (px) |
|---:|---:|---|---:|---:|
| 32 (and above) | **1.500** | | 16 | **1.125** |
| 26 | 1.359 | | 14 | 1.078 |
| 24 | 1.313 | | 12 | 1.031 |
| 22 | 1.266 | | floor | **0.9** |

- The taper lands **exactly on the favicon's sanctioned 2.25/32 ratio at 16px**
  (2.25 ÷ 32 × 16 = 1.125) — the two disciplines meet at the floor.
- The **0.9px floor** keeps the hairline from washing out sub-pixel below 12px.
- ≥32px stays the design stroke 1.5px — the ramp only ever tapers down.

### 5.1 The favicon deviation — the ONLY sanctioned static exception

`frontend/public/favicon.svg` renders the mark with a **2.25 viewBox-unit
proportional stroke** (2.25/32 = 7.03% of the grid) instead of the 1.5px
non-scaling hairline. Rationale: at a true 16px browser raster a non-scaling
1.5px stroke dissolves into anti-aliased noise; the thicker proportional ratio
is the only way the arch survives the favicon seat. It applies **nowhere else** —
every other static twin uses the standard stroke discipline.

---

## 6 · Platform seats

| Seat | Asset / behavior | Spec |
|---|---|---|
| **PWA manifest icons** | `frontend/public/manifest.webmanifest` → `/brand/icon-192.png`, `/brand/icon-512.png` | registered `purpose: "maskable"` **and** `"any"` — the maskable renders must keep the mark inside the **maskable safe zone** (the 32-grid's 8-unit side margins / 5-unit top-bottom margins provide it); `theme_color`/`background_color` = paper `#F6F6EE`; `name` «تادمورا — نظام تشغيل الجامعة» · `short_name` «تادمورا» · `lang: ar` · `dir: rtl` |
| **apple-touch icon** | `<link rel="apple-touch-icon" sizes="180x180" href="/brand/icon-180.png">` in `frontend/index.html` | iOS ignores the manifest's icons and reads this link directly; 180×180 is Apple's exact recommendation — paper ground, punchy stroke |
| **Splash (mobile)** | `apps/mobile/assets/images/splash-icon.png` (1024) | transparent ground, hairline stroke — the arch floats on the native splash |
| **Notification silhouette (Android)** | `apps/mobile/assets/images/notification-icon.png` (96) | **all-white silhouette** — Android tints notification icons and requires alpha-only artwork |
| **Adaptive monochrome (Android 13+)** | `apps/mobile/assets/images/adaptive-monochrome.png` (1024) | all-white, the themed-icon seat — Android 13+ re-tints it per the user's wallpaper theme |
| **Adaptive icon pair** | `adaptive-foreground.png` (transparent, safe-zone scaled) + `adaptive-background.png` (solid paper) | the two-layer Android adaptive icon |
| **Favicon (web)** | `frontend/public/favicon.svg` | the 2.25-stroke deviation (§5.1) |
| **Favicon (mobile webview)** | `apps/mobile/assets/images/favicon.png` (48) | paper ground, favicon stroke ratio |
| **App icon** | `apps/mobile/assets/images/icon.png` (1024) | paper ground, punchy stroke |
| **OG / social card** | `frontend/public/brand/tadmora-og.jpg` (1200×630) | paper ground, hairline frame, stacked composition, the tagline line |

---

## 7 · File inventory & regeneration

```bash
# 1 — the wordmark (generated src module + static svg)
node scripts/r323/wordmark-build-r323.mjs
#    → frontend/src/brand/wordmark.generated.ts
#      frontend/public/brand/wordmark.svg

# 2 — the static web twins (Playwright rasterizer)
node scripts/r323/brand-assets.mjs
#    → frontend/public/brand/{tadmora-mark.svg, mark.svg, lockup.svg,
#      lockup-stacked.svg, icon-180.png, icon-192.png, icon-512.png,
#      tadmora-og.jpg} + frontend/public/favicon.svg

# 3 — the mobile app icons + the shared SVG
npm run icons -w apps/mobile        # scripts/brand/build-app-icons.mjs --png
#    → apps/mobile/assets/images/{icon,adaptive-foreground,adaptive-background,
#      adaptive-monochrome,splash-icon,favicon,notification-icon}.png
#      + shared/brand/mark.svg

# 4 — verification (CI belt)
npm run tokens:check                # root: token build --check
npm run tokens:check -w apps/mobile # + build-app-icons.mjs --check (byte-compare)
```

Geometry is **never re-stated by hand**: `frontend/src/brand/mark.ts` +
`apps/mobile/src/brand/mark.ts` carry the same numbers (the mobile script
**parses** them out of the file and fails loudly if the shape changes), and
`frontend/tests/unit/r323-brand-system.test.ts` pins the generated statics
byte-for-byte to the sources. Same inputs ⇒ same bytes — any hand edit is drift
and fails the belt.

Full per-asset table (format, dimensions, generator, verification): see
[`ASSET-MANIFEST.md`](ASSET-MANIFEST.md).

---

## 8 · Quick do / don't (logo-specific)

**Do** — inline SVG in chrome; `tone="auto"` on any themed seat; miter joins,
radius 0; the ramp below 32px; keystone LAST in any animation;
`prefers-reduced-motion` respected (static render).

**Don't** — no `<img>` logos in app chrome; no gradients/shadows/second dark
logo; no letter-spacing on «تادمورا» (0.08em belongs to `TADMORA` Latin only);
no renders below the floors (mark 16px / wordmark 30px ink); no orange panel
behind the mark; no keystone off the apex, no hollow keystone, no filled arch.
