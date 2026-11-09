# TADMORA Design System — Tokens & Foundations — «تادمورا»

> **Date:** 2026-11-09 · **Branch:** `rebrand/tadmora-foundation`
> The foundations the TADMORA (تادمورا) brand renders in: color tokens, the theme
> system, the type ramp, spacing & the radius-0 discipline, the motion voice,
> iconography, and the boot plate. The brand mark itself («قوس تادمورا») is
> specified in [`BRAND.md`](BRAND.md); its logo-specific usage in
> [`LOGO-GUIDELINES.md`](LOGO-GUIDELINES.md).
>
> **Unchanged by the rebrand.** The TADMORA rebrand changes the product identity
> (name, mark, wordmark, positioning). The token system below is the platform's
> own — deliberately preserved for continuity. Nothing here introduces a new
> colour, font, or surface rule.

---

## 1 · Color tokens

Three brand colours only. Everything else in the platform palette is a neutral
step or a status tone derived in `tokens.css` — never a fourth brand colour.

| Token | Hex | Role |
|---|---|---|
| **paper** | `#F6F6EE` | the ground — light-mode background, PWA `theme_color` / `background_color`, static asset background |
| **ink** | `#282828` | light-mode strokes & text; in dark mode the ground itself (the charcoal promoted to a full theme) |
| **orange** | `#FA3600` | the ONE accent — the keystone of «قوس تادمورا», focus rings, primary CTA fills, the scanline |

### 1.1 The accent seat and the dark remap

The accent is consumed through CSS custom properties — never as a raw hex at a
call-site:

| Seat | Light | Dark (`[data-theme="dark"]`) | Notes |
|---|---|---|---|
| `--accent` | `#FA3600` | **`#FF5A1F`** — the *luminous ember* | the keystone, rings, fills. The dark remap lives in `frontend/src/styles/tokens/tokens.css` and is the **only sanctioned dark-theme colour swap** — the logo needs no second version |
| `--accent-fg` | `#FFFFFF` | `--warm-ink` | label ink on accent fills (weight ≥600 + ≥14px where feasible; AA-large register) |
| `--accent-ink` | `#C72E00` | dark equivalent | the text-safe accent (5.06:1) — accent **text** routes here, never raw `#FA3600` |
| `--accent-hover` / `--accent-soft` | derived | derived | hover tier & non-text soft wash |

Contrast, measured on the seats: raw orange `#FA3600` is a large-text/UI tone
(3.46:1 on the light ground); `--accent-ink` carries body-size text at AA. The
ember `#FF5A1F` reads 4.73:1 on the dark ground (AA-large/UI) with warm-ink
labels at 5.64:1.

### 1.2 Off-palette discipline

**No gradients. No shadows on brand surfaces. No copper/gold (`#B57438`,
`#E9B44C`). No indigo/blue drift. No fourth colour.** The "copper-clean" gate
(`frontend/tests/unit/r323-brand-system.test.ts`, scanner a) walks
`frontend/src`, `frontend/public` and `frontend/index.html` and fails the build
on off-palette hexes in brand assets — `frontend/public` carries no allowlist
entry at all: the shipped brand assets are clean.

### 1.3 The one source of truth

`shared/design-tokens.json` is the canonical token set (neutrals · triads ·
semantic seats · spacing · radius · motion · the mobile type ladder).
`scripts/tokens/build.mjs` emits both platform halves:

- `frontend/src/styles/tokens/tokens.generated.css` — web CSS custom properties
  inside the same `@layer tokens` as `tokens.css`, imported before it; the
  hand-written seats in `tokens.css` compose on top.
- `apps/mobile/src/design/tokens.generated.ts` — the typed mobile data.

`npm run tokens:build` regenerates; `npm run tokens:check` (root) re-runs the
build and byte-compares — **the verification belt wired into CI** (in
`apps/mobile` it also byte-verifies every app icon via
`scripts/brand/build-app-icons.mjs --check`).

---

## 2 · Theme system

| Property | Rule |
|---|---|
| Default | **light** (paper ground) — aligned with the theme store's default on both sides of the React mount |
| Dark | `[data-theme="dark"]` on the root element — the charcoal `#282828` becomes the ground, surfaces step up (`#2E2E2E`), warm hairlines, near-white ink. Never a cold blue-black |
| Resolution | **pre-paint, from localStorage** — an inline script in `frontend/index.html` runs before first paint |
| Signals | `madarek-theme` (the zustand-persisted store: `mode` `light\|dark\|system` + `modeUpdatedAt`) and `mdrk-theme-profile` (the profile preference cached by `useThemeProfileSync` on every `me` observation) |
| Precedence | an explicit profile choice wins over the local default (`system`); a strictly **newer** profile wins over a stale stored local choice; a cached `SYSTEM` means the profile made no explicit choice and the local mode governs |
| Why | the old bootstrap painted one theme and flipped ~1–2s later once `me` resolved. Resolving pre-paint removes the flash entirely — the correct background from the first frame |

The brand mark themes **for free** through this system: ink rides
`currentColor` (follows the text colour of the seat), the keystone rides
`var(--accent)` (re-keyed to `#FF5A1F` in dark by `tokens.css`). No logo
variant, prop, or second asset is involved. See [`LOGO-GUIDELINES.md`](LOGO-GUIDELINES.md) §tones.

---

## 3 · Typography

### 3.1 The two voices

| Voice | Family | Weights in service | Role |
|---|---|---|---|
| **Arabic (the platform voice)** | IBM Plex Sans Arabic — self-hosted, arabic-subset woff2 | **400 / 500 / 600** (700 is retired dead weight) | body 400/500, emphasis 500/600, display 600, the wordmark «تادمورا» 600 |
| **Latin instrument / readout** | Geist Mono — self-hosted latin woff2 | **500** | micro-labels, readouts, code-ish UI, the `TADMORA` Latin micro-label |

### 3.2 Preload strategy

`frontend/index.html` preloads exactly two font files — the arabic subsets the
first paint actually sets:

```html
<link rel="preload" href="/fonts/plex-sans-arabic-400-normal-arabic.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/plex-sans-arabic-600-normal-arabic.woff2" as="font" type="font/woff2" crossorigin />
```

(400 body + 600 display/wordmark. 500 loads lazily with the rest of the font
sheet; nothing else is preloaded — the preload budget is spent only on the
first-paint faces.)

### 3.3 The tracking rules (absolute)

| Script | Letter-spacing | Why |
|---|---|---|
| **Arabic** | **NEVER letter-spaced — `letter-spacing: 0` always** | Arabic is a joined script; tracking severs the joins and breaks the letterforms. Applies everywhere: wordmark, boot plate, buttons, headings — no exceptions, gated by test |
| **Latin** | MAY be tracked | the sanctioned exception is the micro-label voice: Geist Mono 500 at **0.08em** (`TADMORA`, instrument readouts) |

### 3.4 Scale

The type ladder itself (sizes/line-heights per role) is tokenized in
`shared/design-tokens.json` and emitted per platform — the web ramp composes in
`tokens.css`/`tokens.generated.css`, the mobile ladder in
`apps/mobile/src/design/tokens.generated.ts`. The rebrand changes **no sizes**:
the wordmark seats a 600-weight display role; the Latin micro-label seats the
mono instrument voice at the smallest end.

---

## 4 · Spacing & radius

- **Spacing** — the tokenized spacing scale (`--sp-*` seats from
  `shared/design-tokens.json`). No raw spacing literals in enforced CSS
  surfaces.
- **Radius 0 discipline** — the platform measured its reference surface census
  and collapsed the radius ladder to **0**: square corners everywhere in brand
  and product surfaces. The ONLY genuinely circular primitives keep
  `--r-full: 9999px` (avatars, status dots). The Tadmora Arch inherits this:
  miter joins, square terminals, a square keystone — the geometry and the
  surface system agree.
- Brand surfaces (the logo, boot plate, OG card, icons) set **radius 0** always.

---

## 5 · The motion voice

Motion in this system is **drafting, not animation theatre**: things are drawn,
seated, and aligned — never bounced, blurred, or paraded.

### 5.1 The logo draw (the canonical brand motion)

`<Logo animated>` performs a **stroke-draw construction** of «قوس تادمورا»:

| Property | Spec |
|---|---|
| Duration | **600–900ms** total |
| Sequence | pillars/arch hairlines draw first (stroke-dashoffset), the wordmark draws with them, and the **keystone seats LAST** — the person arrives at the apex after the structure stands |
| Keystone | fades/settles in as the final beat — it is the one fill; it does not "draw" |
| Easing | the tokenized motion curves (`heronEase` seats in the shared token set) |
| `prefers-reduced-motion: reduce` | **respected — the animation never applies**; the logo renders in its final static state (the reduced-motion kill in `tokens.css` wins by import order) |

### 5.2 General rules

- Motion tokens (`--motion-*` / the mobile `motion` set) are the only sanctioned
  durations/easings; `npm run check:motion-tokens` gates raw literals.
- Entrance reveals draw or translate once — no loops on brand surfaces, no
  shadow/glow pulses (there are no shadows to pulse).

---

## 6 · Iconography

- **UI iconography is Lucide-only** (`frontend/src/components/Icon.tsx` wraps
  it) — the discipline gate `bash scripts/check-icons.sh` fails on emoji
  presentation characters and on raw inline `<svg>` outside the allowlist.
- **Brand symbology is the exception** (allowlisted): `frontend/src/brand/`
  (mark.ts / lockups.ts / Logo.tsx render «قوس تادمورا» itself),
  `frontend/src/pages/BrandPage.tsx` (the `/__brand` spec sheet — its raw SVG
  is the 32-grid construction drawing), and the bespoke scene illustration kits
  (`src/lib/illustrations/`, `src/components/illustrations/`).
- The mark is rendered **inline SVG only** in app chrome — no `<img>` logo, no
  `document.logo` outside the generated `/brand/*` statics (see
  [`ASSET-MANIFEST.md`](ASSET-MANIFEST.md) for where the statics live).

---

## 7 · The boot plate

The **first-paint static frame**: a meaningful, opaque, zero-CLS plate inside
`#root` covering the window between first paint and the React mount (production
loads the bundle over the network; an empty shell would paint as an unexplained
blank viewport).

| Property | Spec |
|---|---|
| Content | the word «**تادمورا**» — one static Arabic word, centered |
| Ground / ink | `#F6F6EE` / `#282828`; under `html[data-theme="dark"]`: `#282828` ground, near-white ink — **follows the pre-paint-resolved theme** (§2), so no flash |
| Type | system stack at the plate seat, `letter-spacing: 0` (the Arabic rule holds even pre-React) |
| Layout | `position: fixed; inset: 0`, grid-centered, `z-index` above everything — zero layout shift by construction |
| Lifecycle | REPLACED by React's first commit; `aria-hidden` (it is paint, not content) |
| CSP | no impact — style-src already allows the inline block |

The plate is the brand's first word to the user: the name alone, on paper,
before any code runs.

---

## 8 · Foundations map (file seats)

| Concern | File |
|---|---|
| Canonical token set | `shared/design-tokens.json` |
| Token build/verify | `scripts/tokens/build.mjs` → `npm run tokens:build` / `npm run tokens:check` |
| Web tokens (hand seats + theming) | `frontend/src/styles/tokens/tokens.css` |
| Web tokens (generated) | `frontend/src/styles/tokens/tokens.generated.css` |
| Mobile tokens (typed) | `apps/mobile/src/design/tokens.generated.ts` |
| Mark geometry source | `frontend/src/brand/mark.ts` + `apps/mobile/src/brand/mark.ts` (pinned together) |
| Logo renderer & variants | `frontend/src/brand/Logo.tsx` / `index.ts` / `lockups.ts` |
| Wordmark (generated) | `frontend/src/brand/wordmark.generated.ts` + `frontend/public/brand/wordmark.svg` |
| Brand unit belt | `frontend/tests/unit/r323-brand-system.test.ts` |
| Brand spec sheet | `/__brand` → `frontend/src/pages/BrandPage.tsx` |
| Boot plate & pre-paint theme | `frontend/index.html` |
| PWA manifest | `frontend/public/manifest.webmanifest` |
