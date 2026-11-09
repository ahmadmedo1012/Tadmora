# TADMORA Third-Party Rights — Brand & Legal Source Audit

> **Date:** 2026-11-09 · **Branch:** `rebrand/tadmora-foundation`
> The rights and provenance audit for the TADMORA (تادمورا) rebrand: what is
> original, what is generated, what is licensed, and what is retired. This
> document is the reference for any due-diligence review of the brand change.
> Brand specs: [`../brand/BRAND.md`](../brand/BRAND.md) · asset inventory:
> [`../brand/ASSET-MANIFEST.md`](../brand/ASSET-MANIFEST.md).

---

## a · The mark is an original design

**«قوس تادمورا» (The Tadmora Arch) is an ORIGINAL design created for this
project.** No third-party logo, emblem, or trademark was copied, traced, or
derived:

- The construction is fully specified in-project on a 32-unit grid — two pillars
  at `x=8`/`x=24`, a radius-8 arch springing at `(8,15)`/`(24,15)` with apex
  `(16,7)`, the baseline `(8,27)–(24,27)`, and one solid keystone (4×4 at
  `x=14..18`, `y=5..9`) at the apex — with the single-ink path
  `M8 27L8 15A8 8 0 0 1 24 15L24 27Z` + the keystone rect (`docs/brand/BRAND.md`
  §2). The geometry is original and its sources (`frontend/src/brand/mark.ts`,
  `apps/mobile/src/brand/mark.ts`) are project-authored.
- An arch-and-keystone is a generic architectural form; the specific geometry,
  proportions, stroke grammar, and the orange-keystone symbolism are this
  project's own.
- The reference to **Tadmor/Palmyra (تدمر)** is to the ancient city as a cultural
  and historical concept — the "city of columns and the great arch" — used as
  naming inspiration only. No photograph, drawing, or heritage depiction of
  Palmyra is embedded in any brand asset, and no entity holds (or is claimed to
  hold) rights over the ancient form.
- **The RETIRED Madarek khatam mark** (two squares, one rotated 45°, orange point
  at the north-east intersection) **is replaced entirely** — no asset, path, or
  rendering of the old mark ships in the TADMORA brand seats. Its spec is
  preserved verbatim as engineering history under
  `docs/archive/redesign/r323/brand/` (BRAND.md · VARIANTS.md · AUDIT.md).

## b · All brand assets are generated from project-owned deterministic scripts

Every shipped brand asset is produced inside the repository by deterministic,
project-owned tooling — none is a downloaded or externally authored file:

| Generator | Role | Output |
|---|---|---|
| `scripts/r323/wordmark-build-r323.mjs` | shapes «تادمورا» with **harfbuzzjs** (real contextual joining), extracts outlines with **opentype.js**, unions the joined contours with **clipper-lib** — from the project's self-hosted IBM Plex Sans Arabic 600 font file | `frontend/src/brand/wordmark.generated.ts` + `frontend/public/brand/wordmark.svg` |
| `scripts/r323/brand-assets.mjs` | re-states the `mark.ts` construction and rasterizes via Playwright/Chromium | the web statics (`tadmora-mark.svg`, `mark.svg`, `lockup.svg`, `lockup-stacked.svg`, `icon-{180,192,512}.png`, `tadmora-og.jpg`, `frontend/public/favicon.svg`) |
| `scripts/brand/build-app-icons.mjs` | parses the constants out of `apps/mobile/src/brand/mark.ts` (failing loudly on shape change) and builds every app asset | `apps/mobile/assets/images/*.png` + `shared/brand/mark.svg` |

Same inputs ⇒ same bytes; the outputs are byte-verified in CI
(`npm run tokens:check`, `npm run tokens:check -w apps/mobile` — see
[`../brand/ASSET-MANIFEST.md`](../brand/ASSET-MANIFEST.md) §5). Build-time
tooling licenses: harfbuzzjs (MIT) · opentype.js (MIT) · clipper-lib (Boost
Software License) — used at build time only; no third-party runtime code is
embedded in brand assets.

## c · Open-source licenses (fonts, frameworks, libraries)

**Fonts** (the only fonts used in brand seats):

| Font | License | Notes |
|---|---|---|
| **IBM Plex Sans Arabic** (400/500/600 — the body/display/wordmark voice) | **SIL Open Font License 1.1** | self-hosted as arabic-subset woff2 under `frontend/public/fonts/`; OFL permits self-hosting, embedding, and the deterministic outline-extraction pipeline in §b |
| **Geist Mono** (500 latin — the instrument/readout voice, the `TADMORA` micro-label) | **SIL Open Font License 1.1** (via Vercel) | self-hosted latin woff2; license verified in the r305 font audit (`docs/redesign/r305-heron-reference-spec.md` §fonts) |

The r305 font audit explicitly evaluated and **excluded** non-licensable faces:
the reference-era display face BT Grotesk was ruled **proprietary — NOT
reusable, not self-hosted, not hot-linked** and kept out of the platform.

**Frameworks and libraries** — each dependency is licensed per its own LICENSE
file as distributed with the package (MIT and compatible permissive licenses for
the toolchain; verified for the brand build path: harfbuzzjs MIT, opentype.js
MIT, clipper-lib BSL). The `package.json` files declare no conflicting license
fields; the workspace is private.

**The repository's own license** (read-only inspection of `/LICENSE`):
a **Proprietary Software License** — Copyright (c) 2026 Ahmad Medo
(ahmadmedo1012), all rights reserved. The source is published for reference
only: no right to deploy, modify, or redistribute is granted without prior
written permission. *This rebrand changes nothing about the repository license.*
(See also §d.)

## d · The original author's engineering work is preserved

The repository is the engineering work of **Ahmad Medo (ahmadmedo1012)**. The
TADMORA rebrand **changes the product identity only** — the name, the mark, the
wordmark, and the positioning. It does not rewrite, reattribute, or diminish the
authorship of the platform's engineering: the architecture, the design-token
system, the test belts, the scripts, and the history documents all remain
credited to their author, and the repository `LICENSE` and its copyright notice
are untouched by the rebrand. The former identity is documented, not erased:
`docs/archive/` and `docs/redesign/` preserve the Madarek-era documents verbatim
as engineering history.

## e · No third-party screenshots, logos, or unlicensed fonts in brand seats

The brand seats (mark, wordmark, lockups, icons, favicon, OG card, splash,
notification/adaptive icons, boot plate) contain:

- **no third-party screenshots** — every raster is generated by the project's own
  rasterizer from the project's own SVG construction;
- **no third-party logos or emblems** — the only marks rendered are «قوس تادمورا»
  and the generated «تادمورا»/`TADMORA` wordmarks;
- **no fonts beyond the licensed set** (IBM Plex Sans Arabic, Geist Mono — both
  SIL OFL 1.1, §c).

Historical note: the University of Zawia records shown in the platform are
showcase/reference data, **not affiliation or endorsement** (per the repository
`LICENSE`); with the rebrand, demo institution data is re-seated under the
explicitly fictional name (§g).

## f · "Heron" — a retired design-system era name

**"Heron"** appears throughout the repository's historical documentation as the
name of a previous design-system era (the r305 token foundation reverse-
engineered from a third-party reference site as a *study*, documented with full
evidence and licensing decisions in
`docs/redesign/r305-heron-reference-spec.md`). With the TADMORA rebrand:

- the name **"Heron" is retired from product surfaces** — it no longer names any
  user-visible surface, asset, or brand element;
- the **historical documents are preserved verbatim** under `docs/archive/` and
  `docs/redesign/` as engineering history — they describe their era accurately
  and are not rewritten;
- nothing from the studied third-party reference is shipped as brand identity:
  the token palette that era produced was re-canonicalized as the platform's own
  token system (`shared/design-tokens.json`), and the TADMORA mark (§a) is an
  original construction that postdates and replaces that era's marks entirely.

## g · Demo data is fictional — «جامعة تادمورا التجريبية»

All demonstration/seed institution data in the TADMORA platform is presented
under the name **«جامعة تادمورا التجريبية» (Tadmora Experimental University)** —
a name chosen to be **explicitly fictional and synthetic**. It corresponds to no
real institution, and no real persons, records, or academic data are included.
Any resemblance to a real institution is coincidental and unintended. The
platform's own deployed instance and its reference-data disclaimers remain
governed by the repository `LICENSE` (§c).

---

## Summary table

| Item | Status |
|---|---|
| «قوس تادمورا» mark | **Original** project design (§a) |
| Retired Madarek khatam mark | Replaced entirely; history preserved (§a) |
| Brand asset pipeline | Project-owned deterministic generators (§b) |
| IBM Plex Sans Arabic · Geist Mono | SIL OFL 1.1 — licensed, self-hosted (§c) |
| Other libraries | Per their LICENSE files (MIT/BSL on the brand build path) (§c) |
| Repository license | Proprietary, © 2026 Ahmad Medo — unchanged by the rebrand (§c, §d) |
| Authorship | Preserved; identity-only change (§d) |
| Third-party media in brand seats | None (§e) |
| "Heron" | Retired era name; docs preserved verbatim (§f) |
| Demo data | «جامعة تادمورا التجريبية» — explicitly fictional (§g) |
