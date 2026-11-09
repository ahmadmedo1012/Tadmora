# TADMORA Brand Bible — «تادمورا» · The Tadmora Arch Brand System

> **Date:** 2026-11-09 · **Branch:** `rebrand/tadmora-foundation`
> This is the authoritative brand reference for **TADMORA (تادمورا)**, the product
> identity of the platform formerly known as **Madarek (مدارك)**. It supersedes the
> retired R323 Madarek brand system (preserved as engineering history under
> `docs/archive/redesign/r323/brand/`). Where this document and any older brand
> document disagree, **this document wins**.
>
> Companion documents: [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) (tokens & foundations) ·
> [`LOGO-GUIDELINES.md`](LOGO-GUIDELINES.md) (logo usage) ·
> [`ASSET-MANIFEST.md`](ASSET-MANIFEST.md) (asset inventory & regeneration) ·
> [`../legal/THIRD_PARTY-RIGHTS.md`](../legal/THIRD_PARTY-RIGHTS.md) (rights & source audit).

---

## 1 · The name & the story — «تادمورا»

**TADMORA / تادمورا** is the new product identity of the platform: an **Arabic-first,
RTL-first** integrated academic management & learning platform — the
**«نظام تشغيل الجامعة» (University Operating System)**.

The platform runs the whole institution as one system: universities, colleges,
departments, programs, courses, lectures, exams, the mastery matrix (مصفوفة الإتقان),
research, live sessions, and institutions at large — around its people, in the roles
they actually hold: **student (طالب) · teacher (مدرّس) · researcher (باحث) ·
admin (إداري) · owner (مالك)**.

The name evokes **Tadmor / Palmyra (تدمر)** — the ancient city of columns and the
great arch. Palmyra's colonnade is a line of gates: you walk through one frame and
the next aligns behind it. That is the product thesis — every part of the university
(passing through one arch: enrollment, learning, assessment, research, governance)
aligned on one axis, one system.

> **الجامعة في منظومة واحدة** — the university in one system. *(The tagline seat —
> see §4.)*

What changed and what did not:

| | Madarek (مدارك) — retired | TADMORA (تادمورا) — current |
|---|---|---|
| Product name | مدارك | تادمورا |
| Positioning | منصّة التعليم الذكي (smart-learning platform) | «نظام تشغيل الجامعة» (University Operating System) |
| Mark | The khatam — two squares, one rotated 45°, orange point at NE | **قوس تادمورا** — the Tadmora Arch, orange keystone at the apex |
| Tagline | «كلّ معرفة تبدأ نقطةً وتصبح مدارًا» | «الجامعة في منظومة واحدة» |
| Colors, typography, stroke grammar | paper / ink / orange · IBM Plex Sans Arabic + Geist Mono · hairline miter | **unchanged** — deliberately preserved for continuity |

The rebrand changes the **product identity only**. The visual grammar (the
engineering system: hairlines, radius 0, the three-colour palette, the type
voices) is inherited as-is — see [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).

---

## 2 · The mark — «قوس تادمورا» (The Tadmora Arch)

An **original design** created for this project. The retired Madarek khatam
(two-squares) mark is replaced entirely — see
[`../legal/THIRD_PARTY-RIGHTS.md`](../legal/THIRD_PARTY-RIGHTS.md) §a.

### 2.1 The idea

The mark draws the **Palmyra colonnade gateway**: two pillars and the arch they
carry, with **one solid orange keystone** seated at the apex.

- The **gateway** — the university as the gateway of knowledge: you enter through
  it, and it stands open.
- The **arch** — the institution's structure: colleges, departments, programs,
  courses — a load-bearing curve where every stone holds the others.
- The **orange keystone** — the person (student, teacher, researcher) at the apex
  of the system. Remove the keystone and the arch falls: the University Operating
  System is built around its people, and the person is the one element rendered
  solid.

### 2.2 Construction — the 32-unit grid

ViewBox `0 0 32 32`. All anchors sit on the grid of the 32-unit construction.

| Element | Spec |
|---|---|
| **Left pillar** | hairline vertical at `x=8`, from baseline `y=27` up to arch spring `y=15` |
| **Right pillar** | hairline vertical at `x=24`, from baseline `y=27` up to arch spring `y=15` |
| **Arch** | semicircle, radius `8`, centre `(16,15)`; springs at `(8,15)` and `(24,15)`; apex at `(16,7)` |
| **Baseline** | hairline horizontal from `(8,27)` to `(24,27)` |
| **Keystone** | ONE solid orange 4×4 square at `x=14..18`, `y=5..9` — seated exactly at the arch apex `(16,7)`, **interrupting the arch line like a true keystone** |
| **Ink bbox** | `x 8..24`, `y 5..27` — 16×22 units; perfectly centered in the 32-grid: 8-unit side margins, 5-unit top/bottom margins |

### 2.3 The anchor table

Every point the construction is judged on (the unit belt
`frontend/tests/unit/r323-brand-system.test.ts` pins these):

| Anchor | Coordinates | Role |
|---|---|---|
| Left spring | `(8, 15)` | arch springs off the left pillar |
| Right spring | `(24, 15)` | arch springs off the right pillar |
| Apex | `(16, 7)` | top of the arch — the keystone's seat |
| Arch centre | `(16, 15)` | radius-8 centre |
| Left base | `(8, 27)` | baseline start |
| Right base | `(24, 27)` | baseline end |
| Keystone corners | `(14, 5)` · `(18, 5)` · `(14, 9)` · `(18, 9)` | the 4×4 solid square, centered on the apex |

### 2.4 The single-ink path

The gateway outline is one closed path; the keystone is one rect:

```svg
<!-- gateway outline (closed) -->
<path d="M8 27L8 15A8 8 0 0 1 24 15L24 27Z" />

<!-- the keystone — the ONLY fill in the system -->
<rect x="14" y="5" width="4" height="4" fill="#FA3600" />
```

Source of truth for the geometry: `frontend/src/brand/mark.ts` (the `<Logo>`
component renders it) and `apps/mobile/src/brand/mark.ts` (the mobile twin — the
same numbers, parser-verified by `scripts/brand/build-app-icons.mjs`). The static
twins re-state the same construction from `scripts/r323/brand-assets.mjs`, and
`frontend/tests/unit/r323-brand-system.test.ts` pins all of them together —
**never edit one without the other.**

### 2.5 Stroke discipline

Inherited unchanged from the platform's engineering system:

- **Hairline uniform strokes** — component: `1.5px` non-scaling
  (`vector-effect: non-scaling-stroke`); favicon: `2.25` viewBox-units
  proportional — **the ONLY sanctioned deviation** (a non-scaling 1.5px hairline
  dissolves at a true 16px raster; the optical-size ramp below exists to fix the
  same problem for in-app seats).
- `stroke-linejoin="miter"` — always. No round joins, no rounded corners, no
  rounded terminals.
- **Radius 0** — no rounded corners anywhere in brand surfaces.
- **NO fills except the keystone.** The gateway outline is stroke-only.
- **NO gradients. NO shadows. NO glows.**
- **Optical-size ramp** (below 32px the screen stroke tapers so the hairline never
  turns to blob or wash): `1.5px @32 → 1.125px @16`, floor `0.9px`.

  | size (px) | 32 | 26 | 24 | 22 | 16 | 14 | 12 |
  |---|---|---|---|---|---|---|---|
  | stroke (px) | 1.500 | 1.359 | 1.313 | 1.266 | 1.125 | 1.078 | 1.031 |

  (≥32px stays the design 1.5px; `markStrokePx()` in `mark.ts` implements it.)

### 2.6 Colour

Only three — the platform's own token palette, deliberately preserved for
continuity:

| Token | Hex | Role in the mark |
|---|---|---|
| paper | `#F6F6EE` | the ground (light mode / static twins) |
| ink | `#282828` | the gateway strokes — rides `currentColor` in the component |
| orange | `#FA3600` | the keystone — the single accent; rides `var(--accent)` in the component |

Dark theme is a **token swap, never a second logo**: `tokens.css` re-keys
`--accent` to the luminous ember `#FF5A1F` under `[data-theme="dark"]` and the
keystone follows — one `var()`, no props, no redrawn assets.

**Off-palette is forbidden and gated.** No gradients, no shadows, no
copper/gold (`#B57438` · `#E9B44C`), no indigo/blue drift, no fourth colour. The
"copper-clean" test (`frontend/tests/unit/r323-brand-system.test.ts`) fails the
build on off-palette hexes in brand assets.

---

## 3 · The wordmark — «تادمورا»

- **Arabic wordmark «تادمورا»**: IBM Plex Sans Arabic **600** (the display voice),
  rendered **stroke-only** (hollow drafting render: `fill:none`,
  `stroke:currentColor`, non-scaling ≈1.5px). **NEVER letter-spaced** — Arabic is
  never letter-spaced, anywhere, in any seat (the one absolute Arabic rule).
- **Latin micro-label «TADMORA»**: Geist Mono **500**, **0.08em tracking** (Latin
  MAY be tracked — the mono voice is the exception), rendered **FILLED** solid
  `currentColor`.
- **Deterministic generation** — the wordmark is built by script, never drawn by
  hand: `scripts/r323/wordmark-build-r323.mjs` (harfbuzzjs shaping → opentype.js
  outlines → clipper-lib union for the contextual joins). Shaping of «تادمورا»:
  **ت initial joins ا** (تـا) · **د isolated** · **م initial joins و** (مـو) ·
  **ر isolated** · **ا isolated**. No kashida. Normalized sheet: ink height
  100 units, 6-unit construction margins, 2dp coordinates.
- Outputs: `frontend/src/brand/wordmark.generated.ts` (the generated module —
  DO NOT hand-edit) + `frontend/public/brand/wordmark.svg`.

The lockup compositions (§4) pair the mark with the wordmark per these voices.

---

## 4 · Lockups & compositions

Four sanctioned variants (the `<Logo>` component API — `variant`, `size`, `tone`,
`animated`; see [`LOGO-GUIDELINES.md`](LOGO-GUIDELINES.md) for the full usage spec):

| Variant | Composition | Ordering (RTL rule) |
|---|---|---|
| **horizontal lockup** (default) | mark + Arabic wordmark | **RTL: the mark sits RIGHT, «تادمورا» sits LEFT** — the reader enters through the arch, then the name |
| **stacked** | mark / «تادمورا» / `TADMORA` Latin micro-label | vertical, centered; the Latin label is the smallest, tracked mono line |
| **wordmark alone** | «تادمورا» hollow, no mark | wide in-text brand seats |
| **mark alone** | «قوس تادمورا» only | avatars, icons, favicons, tight chrome |

**Tagline seat** — «الجامعة في منظومة واحدة» (the university in one system) sets
under a lockup only in spacious seats (OG card, splash, about page). It never
crams inside a lockup used in chrome.

---

## 5 · Minimum sizes

| Element | Floor | Notes |
|---|---|---|
| Mark | **16px** | below 16px the hairline geometry is illegible — do not render the mark at all |
| Wordmark | **30px ink height** | the hollow strokes close up below this |
| Horizontal lockup | sized from a ≥16px mark; the wordmark must independently clear its 30px floor | if the seat cannot fit both floors, drop to `mark` alone |
| Stacked lockup | generous seats only (covers, splash, OG) | never in dense chrome |

The **favicon deviation**: `frontend/public/favicon.svg` renders the mark with a
**2.25-unit proportional stroke** (instead of the 1.5px non-scaling hairline) — the
only sanctioned static deviation, existing solely for 16px legibility. See
[`LOGO-GUIDELINES.md`](LOGO-GUIDELINES.md) §favicon.

---

## 6 · Clearspace

**Clearspace = one keystone height on every side** — 4 grid units (the keystone is
the 4×4 square; at a 32px render that is 4px of clearspace per side).

Nothing enters the clearspace: no text, no card edges, no table hairlines, no
other marks, no fold. The construction grid's own margins (8-unit sides, 5-unit
top/bottom to the ink bbox) are internal breathing room — clearspace is measured
**outside the ink bbox** on all four sides.

---

## 7 · Misuse — never

| Never | Why |
|---|---|
| **Never gradient** | the system is flat ink on paper — one accent, solid |
| **Never shadow / glow / bevel** | the mark is a drafting drawing, not a render |
| **Never letter-space Arabic** | «تادمورا» keeps its natural joins — tracking breaks the script (absolute rule) |
| **Never recolor outside the three** | `#F6F6EE` · `#282828` · `#FA3600` (dark: `#FF5A1F` via `var(--accent)` only) — the copper-clean test gates this |
| **Never rotate the keystone off-apex** | the keystone sits exactly at `(16,7)` — a keystone anywhere else is a stone about to fall |
| **Never outline the keystone** | the keystone is the ONE solid — inverting it (hollow keystone, solid arch) inverts the meaning: the person is not empty structure |
| **Never round the joins** | miter only; radius 0 |
| **Never stretch / skew** | scale uniformly or not at all |
| **Never hand-redraw** | the geometry lives in `mark.ts` + the deterministic generators; a hand-edited asset is drift and fails `tokens:check` |
| **Never a second "dark version"** | dark theming is the `--accent` token swap, not a redrawn logo |

---

## 8 · Do / Don't

**Do**

- Build on the 32-unit grid before touching any coordinate — and then don't touch
  the coordinates: edit `mark.ts` (both copies) and regenerate.
- One solid orange keystone at the apex `(16,7)`; everything else hairline ink.
- Uniform hairlines (1.5px non-scaling component / ramp below 32px), miter joins,
  radius 0.
- Clearspace = keystone height (4 units) on every side.
- `currentColor` for ink, `var(--accent)` for the keystone — theme for free.
- Arabic («تادمورا») never letter-spaced; Latin (`TADMORA`) tracked 0.08em, filled.
- Regenerate every asset from the scripts (`§9` below) — the outputs are
  deterministic: same inputs ⇒ same bytes.

**Don't**

- Don't fill the gateway, don't outline the keystone, don't add a fourth colour.
- Don't draw a "dark logo", a "gradient edition", or any festive variant.
- Don't set the wordmark under 30px ink height or the mark under 16px.
- Don't letter-space, stretch, rotate, or shadow anything.
- Don't reuse the retired marks (the Madarek khatam, the r188 star, `StarMark`,
  `BrandMark`) — all retired with the rebrand.

---

## 9 · Assets & regeneration (summary)

```bash
node scripts/r323/wordmark-build-r323.mjs   # the wordmark → src module + wordmark.svg
node scripts/r323/brand-assets.mjs          # static twins: tadmora-mark/mark/lockup(+stacked)/favicon/icons/OG
npm run icons -w apps/mobile                # mobile PNGs + shared/brand/mark.svg (build-app-icons.mjs)
npm run tokens:check                        # byte-verification belt (root + apps/mobile)
```

Every asset, its format, dimensions and generating script is tabulated in
[`ASSET-MANIFEST.md`](ASSET-MANIFEST.md). The inspection sheet lives at the
`/__brand` route (`frontend/src/pages/BrandPage.tsx`): the construction grid, the
four variants, clearspace, minimums, tone modes, do/don't — correct in both themes.

---

*«الجامعة في منظومة واحدة» — تادمورا، نظام تشغيل الجامعة.*
