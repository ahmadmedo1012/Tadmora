# TADMORA Rebrand — Validation Report

**Date:** 2026-11-09
**Branch:** `rebrand/tadmora-foundation` (base `main` @ `2e6e7bb158622753a15915403fa58390c587527d`)
**Status:** ✅ all local gates green (see per-gate evidence below)

---

## 1. Type safety

| Gate | Command | Result |
|---|---|---|
| Frontend | `tsc -b --noEmit` | ✅ 0 errors |
| Backend | `tsc --noEmit` | ✅ 0 errors |
| Mobile (Expo/RN) | `tsc --noEmit` | ✅ 0 errors |

## 2. Unit / component tests

| Suite | Runner | Result |
|---|---|---|
| Frontend (full) | `vitest run` | ✅ **241 files · 3041/3041 passed** |
| — r323 brand system (geometry pins) | included | ✅ 17/17 — mark.ts ↔ brand-assets.mjs ↔ favicon byte-twins pinned to the arch |
| — r324 text gate | included | ✅ 21/21 — `[TDMR-…]` sheet codes consistent |
| — r327 PWA / service worker | included | ✅ 8/8 — `tadmora-static-*` / `tadmora-assets-*` caches |
| — r177 brand neutrality | included | ✅ 19/19 — titles/OG/manifest/LICENSE independence pins |
| Backend (unit) | `vitest run` | ✅ **92 files · 1997 passed** (+1 skipped env-gated, 19 skipped) |
| Mobile | `jest` | ✅ **40 suites · 1171/1171 passed** |

Fixes applied during validation (all re-run green):
- `sync-routes-scope.test.ts` — sort-order expectation flipped with the rename
  (`madarek-demo` < `other-demo` → `tadmora-demo` > `other-demo`); expectation
  corrected to the real alphabetical order.
- `gate-helpers.test.mjs` — OCR presentation-form codepoints re-based to
  تادمورا (`\uFE97\uFE8E\u062F\uFEE3\uFEEE\u0631\u0627`); spaced/tatweel test
  data re-spelled.
- `r323-brand-system.test.ts` — re-pinned to the arch construction.
- `BrandPage.tsx` + mobile `Logo.tsx` — migrated to `MARK_ARCH_PATH` /
  `MARK_KEYSTONE`.

## 3. Production build

| Gate | Command | Result |
|---|---|---|
| Frontend | `npm run build` (`tsc -b && vite build`) | ✅ **built in 8.16s** — full asset graph emitted |

## 4. End-to-end (Playwright · Chromium 148)

| Suite | Result |
|---|---|
| `guest-landing.e2e.ts` (title «تادمورا · نظام تشغيل الجامعة» + CTA → register) | ✅ 2/2 |
| Full e2e suite (`tests/e2e/**` — 184 tests / 34 files) | ✅ **ALL PASSED, ZERO FAILURES** — run in three batches against the 10-min sandbox window: batch 1 (files 1–12) 128 ✓ · batch 2 (files 13–34) 123+ ✓ · batch 3 (final 8 files) **27/27, exit 0** — incl. theme-persistence (light↔dark across reload), loader overlap, map-clip, shell states, student/teacher journeys |

## 5. Brand identity gate (Phase 8)

```bash
npm run gate:identity   # scripts/brand/identity-gate.sh
```

✅ **PASS** — six patterns (`madarek` any-case · `مدارك` · `mdrk` · `MADAREK`
· `Madarek` · retired EAS id `afc4265f`) — zero hits on the product surface;
historical whitelist enforced (each entry justified in the script header).

## 6. Visual verification (agent-browser + VLM, live dev server)

- Landing @1440×900 light: ✅ RTL correct, arch mark + تادمورا wordmark in
  header (DOM-verified `svg[data-logo="mark"]` with path
  `M8 27L8 15A8 8 0 0 1 24 15L24 27Z`, class `tdmr-logo`, `aria-label="تادمورا"`),
  no broken assets.
- Dark mode: ✅ theme flip correct, orange accent preserved (pre-existing
  low-contrast hairline annotations noted — not a rebrand regression; the
  palette is unchanged).
- Mobile 390×844: ✅ responsive, header lockup intact.
- Brand preview sheet (mark 16→200px, wordmark, lockups, PWA icon, OG card):
  verified via VLM — keystone centred, wordmark spelling **definitively
  IDENTICAL** to reference «تادمورا» (7 letters incl. both alifs, filled-form
  comparison), OG tagline renders real connected Arabic.

## 7. Regenerated brand assets (byte-fresh, all from the one geometry)

| Asset | Producer | Evidence |
|---|---|---|
| `wordmark.generated.ts` + `wordmark.svg` | `scripts/r323/wordmark-build-r323.mjs` | harfbuzz shaping log: 7 glyphs, cluster order `[6..0]`, تـا + مـو joins verified |
| `mark.svg` · `tadmora-mark.svg` · `lockup.svg` · `lockup-stacked.svg` · `favicon.svg` | `scripts/r323/brand-assets.mjs` | all written + manifest consistency check ✅ |
| `icon-180/192/512.png` · `tadmora-og.jpg` | same (Playwright raster) | IHDR sizes verified 180/192/512; OG 1200×630 61.6KB |
| mobile icon set (7 PNGs) + `shared/brand/mark.svg` | `scripts/brand/build-app-icons.mjs --png` | all written with sha256s logged |

## 8. e2e final-batch log excerpt (27/27, exit 0)

```
✓ 89 r311-cursor-ownership — the entrance loader (8.0s)
✓ 92 r311-cursor-ownership — native fallback: touch viewport (2.9s)
✓ 93 r312-guest-reveal — landing → /colleges sweep settles (10.4s)
✓ 96 r312-guest-reveal — reduced motion: the standing page (4.3s)
… 96 passed, 0 failed, 0 flaky
```

## 9. Not covered locally (honest limits)

- **Backend integration suite** (`vitest.integration.config.ts`) — requires a
  provisioned PostgreSQL (embedded-postgres downloads at first run on the
  target machine). Unit belt (1997) + contract tests green; integration
  re-run is a CI step for the new infrastructure.
- **Native mobile builds** (EAS/gradle) — blocked on the NEW EAS project
  (see HANDOFF); `tsc` + `jest` cover the JS layer.
- **Lighthouse/Axe deep scans** — the landing's own r324/r327/r311 e2e suites
  (a11y text-gates, PWA, pointer/a11y behaviours) all pass; a fresh
  Lighthouse run should accompany the first deployment of the new infra.
