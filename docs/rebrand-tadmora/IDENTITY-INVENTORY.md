# TADMORA Rebrand — Phase 2: Identity Inventory (Audit Report)

![phase](https://img.shields.io/badge/phase-2-identity%20audit-blue) ![status](https://img.shields.io/badge/status-COMPLETE-brightgreen) ![date](https://img.shields.io/badge/date-2026--11--09-informational)

**Scope:** full-text audit of the working clone at `/home/z/tadmora-work/Tadmora` (branch `rebrand/tadmora-foundation`, baseline `2e6e7bb158622753a15915403fa58390c587527d`) for every occurrence of the old product identity **Madarek / مدارك / mdrk**, categorized and mapped to the new identity **TADMORA / تادمورا / tdmr**.

**Method:** case-insensitive full-tree search excluding `.git`. Arabic strings searched as exact Unicode matches (`مدارك`). Identifier-prefix searches matched `mdrk`-prefixed tokens (CSS classes, storage keys, cookie names, constants).

---

## 1. Aggregate Counts

| Pattern (any case) | Files | Occurrences |
|--------------------|-------|-------------|
| Latin `madarek` | **600** | **2,380** |
| Arabic `مدارك` | **274** | **781** |
| Prefix identifier `mdrk` | **123** files | — (identifier-prefix scan) |

Total product-surface exposure is large and widely distributed — 600+ files carry the Latin brand token alone. This is why the rename is executed systematically (Phase 4) with an automated brand gate (Phase 8) rather than by hand.

## 2. Categorized Inventory

### 2.1 URLs and Domains

| Surface | Old value | Where it appears |
|---------|-----------|------------------|
| Production API/web URL | `https://madarek.onrender.com` | canonical URL, OpenGraph metadata, sitemap entries, mobile API default base URL (`apps/mobile/app.config.ts` — `EXPO_PUBLIC_API_BASE_URL ?? "https://madarek.onrender.com/api/v1"`), `apps/mobile/eas.json`, `.env.example`, docs |
| Email domain | `madarek.ly` | backend mail configuration/tests |
| Demo email domain | `demo.madarek.ly` | backend seed data + mail tests |

**Deployment-independence note:** `tadmora.onrender.com` is a **planned new deployment** (new Render service), not a rename of the existing Render service. Old production credentials are never reused (see `MIGRATION-PLAN.md` Phase 6). The URL is a placeholder until the new service is provisioned (RISK-08).

### 2.2 Package Names

| Surface | Old value | New value |
|---------|-----------|-----------|
| Root package | `madarek` | `tadmora` |
| Frontend workspace | `@madarek/frontend` | `@tadmora/frontend` |
| Backend workspace | `@madarek/backend` | `@tadmora/backend` |
| Mobile package | `madarek-mobile` | `tadmora-mobile` |

### 2.3 Mobile Identity (`apps/mobile/`)

| Surface | Old value | Where |
|---------|-----------|-------|
| Expo slug | `madarek-mobile` | `apps/mobile/app.config.ts` |
| Deep-link scheme | `madarek` | `apps/mobile/app.config.ts` |
| iOS bundleIdentifier | `ly.madarek.mobile` | `apps/mobile/app.config.ts` |
| Android package | `ly.madarek.mobile` | `apps/mobile/app.config.ts` |
| App display name | مدارك | `apps/mobile/app.config.ts` |
| EAS projectId | `afc4265f-664e-4325-a0ff-b621b81fe1b0` | `apps/mobile/app.config.ts` — **placeholder; must be replaced by a NEW EAS project** (old id must not be reused; `EXPO_TOKEN` unavailable this session — RISK-02) |

### 2.4 Cookies and Storage Keys

| Surface | Old value | Where |
|---------|-----------|-------|
| Auth refresh cookie | `mdrk_refresh` | `backend/src/http/routes/auth.routes.ts` (`const REFRESH_COOKIE = 'mdrk_refresh'`) |
| Theme persistence (zustand persist) | `madarek-theme` | frontend theme store |
| Theme profile key | `mdrk-theme-profile` | frontend theme-profile sync |
| Intro-onboarding flag | `madarek-intro-seen` | frontend |
| Mobile SecureStore keys | `mdrk-mobile-*` | `apps/mobile/src/` (session/token storage) |

Renaming keys logs out existing users and resets stored theme preferences — accepted for a product relaunch; see `RISK-REGISTER.md` RISK-04/RISK-05 for the documented migration note.

### 2.5 CSS Classes

| Surface | Old value | New value |
|---------|-----------|-----------|
| Boot plate | `.mdrk-boot-plate` | `.tdmr-boot-plate` |
| Logo container | `.mdrk-logo` | `.tdmr-logo` |
| Grain overlay | `.mdrk-grain` | `.tdmr-grain` |
| Overlay exit classes | `madarek-overlay-out` (and siblings) | `tadmora-overlay-out` (and siblings) |

### 2.6 Service Worker (`frontend/public/sw.js`)

| Surface | Old value | New value |
|---------|-----------|-----------|
| Static cache | `madarek-static-${VERSION}` (currently `madarek-static-r327-e2-1`) | `tadmora-static-${VERSION}` |
| Asset cache | `madarek-assets-${VERSION}` (currently `madarek-assets-r327-e2-1`) | `tadmora-assets-${VERSION}` |

The `VERSION` constant **must also be bumped** on rename so that already-installed PWAs fetch a fresh cache namespace and never serve a stale-cache mix of old/new identity (RISK-06, handled by design).

### 2.7 Brand Assets (`frontend/public/brand/`)

| Asset | Old | New |
|-------|-----|-----|
| Standalone mark | `madarek-mark.svg` | `tadmora-mark.svg` |
| OG image | `madarek-og.jpg` | `tadmora-og.jpg` |
| Mark (neutral) | `mark.svg` | regenerated in place |
| Lockups | `lockup.svg`, `lockup-stacked.svg` | regenerated in place |
| Wordmark | `wordmark.svg` | regenerated in place |
| Icons | `icon-180.png`, `icon-192.png`, `icon-512.png` | regenerated in place |
| Favicon | `frontend/public/favicon.svg` | regenerated in place |

⚠️ **The filename `madarek-mark.svg` is pinned in multiple places that must be updated together with the file rename:** `backend/prisma/seed.ts` (seeded poster/logo data), `frontend/index.html` (schema.org `"logo": "https://madarek.onrender.com/brand/madarek-mark.svg"`), `frontend/public/sw.js` (precache list), `frontend/tests/e2e/lecture-poster-geometry.e2e.ts` (poster fixture `/brand/madarek-mark.svg`), `scripts/r320/legal-icons.mjs` (`MARK_PATH`), and `apps/mobile/app/owner/content.tsx` (brand-asset listing). Renaming the file without updating all references breaks the seed, structured data, PWA precache, and tests simultaneously — they are updated atomically in Phase 4.

### 2.8 Brand Code Pipeline

| Component | Path | Notes |
|-----------|------|-------|
| Logo component | `frontend/src/brand/Logo.tsx` | rebrand in Phase 3 |
| Mark geometry | `frontend/src/brand/mark.ts` | new قوس تادمورا geometry |
| Lockups | `frontend/src/brand/lockups.ts` | regenerated |
| Generated wordmark | `frontend/src/brand/wordmark.generated.ts` | regenerated from new wordmark |
| Mobile brand | `apps/mobile/src/brand/mark.ts`, `apps/mobile/src/brand/Logo.tsx`, `apps/mobile/src/brand/wordmark.generated.ts`, `apps/mobile/src/brand/lockups.ts` | kept in sync |
| Shared mark | `shared/brand/mark.svg` | regenerated |
| Wordmark generator | `scripts/r323/wordmark-build-r323.mjs` | harfbuzzjs + IBM Plex Sans Arabic 600 + clipper union — reused for تادمورا |
| Static asset rasterizer | `scripts/r323/brand-assets.mjs` | Playwright-based — Chromium (chromium-1200) cached on host |
| Mobile icon builder | `scripts/brand/build-app-icons.mjs` | regenerates `apps/mobile/assets/images/*` |

### 2.9 Seed / Demo Data

| Surface | Old value | Where |
|---------|-----------|-------|
| Demo university name | «جامعة مدارك التجريبية» | `backend/prisma/seed.ts` |
| Demo tenant slug / test-account context | `madarek-demo` | `backend/prisma/seed.ts` (+ test accounts panel refs) |
| Demo domain | `demo.madarek.ly` | seed + mail tests |

### 2.10 Misc Identifiers

| Surface | Old value | Where |
|---------|-----------|-------|
| PWA manifest name | مدارك | `frontend/public/manifest.webmanifest` |
| Structured-data `alternateName` | `Madarek` | `frontend/index.html` |
| README title | مدارك / Madarek | `README.md` |
| Render blueprint | `madarek` service naming | `render.yaml` |
| Test accounts slug | `madarek-demo` | seed + frontend test-accounts panel |
| Logger name | `madarek` | backend logger initialization |
| Auth constant | `madarek-timing-equalizer-no-account` | backend auth module |

## 3. Rename Mapping (old → new)

The mapping is case- and script-preserving — each Latin case form maps to its TADMORA equivalent, the Arabic brand maps to تادمورا, and the `mdrk` identifier prefix maps to `tdmr`:

| # | Old | New | Applies to |
|---|-----|-----|------------|
| 1 | `madarek` | `tadmora` | URLs, slugs, package names, storage keys, cache names, filenames, class names, constants |
| 2 | `Madarek` | `Tadmora` | prose, titles, `alternateName`, README |
| 3 | `MADAREK` | `TADMORA` | upper-case constants (if any) |
| 4 | `مدارك` | `تادمورا` | UI strings, manifest name, seed data, app name |
| 5 | `mdrk` | `tdmr` | identifier prefixes: CSS classes (`.mdrk-*`), storage keys (`mdrk-*`), cookie `mdrk_refresh` → `tdmr_refresh`, SecureStore keys |
| 6 | `ly.madarek.mobile` | `ly.tadmora.mobile` | iOS bundleIdentifier + Android package |
| 7 | `madarek-mobile` | `tadmora-mobile` | mobile slug + package name |
| 8 | scheme `madarek` | scheme `tadmora` | deep-link scheme |
| 9 | `madarek.onrender.com` | `tadmora.onrender.com` | **new deployment** (new Render service; placeholder until provisioned) |
| 10 | `madarek.ly` | `tadmora.ly` | email domain (seed + mail tests) |
| 11 | `demo.madarek.ly` | `demo.tadmora.ly` | demo email domain |
| 12 | `madarek-mark.svg` | `tadmora-mark.svg` | file rename + **all pinned references updated atomically** (§2.7) |
| 13 | `madarek-og.jpg` | `tadmora-og.jpg` | file rename + references |
| 14 | `madarek-static-*` / `madarek-assets-*` | `tadmora-static-*` / `tadmora-assets-*` + **VERSION bump** | service-worker cache namespaces (§2.6) |

Identity constants that change by rule but are NOT simple string substitutions:

| Surface | Action |
|---------|--------|
| EAS projectId `afc4265f-664e-4325-a0ff-b621b81fe1b0` | replace with a **new** EAS project id once `EXPO_TOKEN` is available — old id must never be reused (RISK-02) |
| Old production secrets (JWT, DB, Render/Neon) | never reused; new secrets generated in Phase 6 (deployment independence) |

## 4. New Brand Summary (Phase 3 target)

- **Mark:** original «قوس تادمورا» — the Tadmora arch (Palmyra gateway concept): two pillars + semicircular arch + baseline, with **one solid orange keystone (4×4) at the arch apex**.
- **Palette preserved:** paper `#F6F6EE` / ink `#282828` / orange `#FA3600` (dark-theme accent `#FF5A1F`).
- **Fonts unchanged:** IBM Plex Sans Arabic + Geist Mono.
- **Wordmark:** regenerated through the existing pipeline (`scripts/r323/wordmark-build-r323.mjs` — harfbuzzjs + IBM Plex Sans Arabic 600 + clipper union) for the new Arabic wordmark تادمورا.

## 5. Historical Whitelist (NOT renamed)

The following paths and ref namespaces are **exempt** from the rename. They are preserved verbatim as engineering history:

| Whitelisted | Reason |
|-------------|--------|
| `docs/archive/**` | historical revision logs — evidence of past engineering states |
| `docs/redesign/**` | historical redesign records |
| `CHANGELOG.md` | the changelog describes history under the old name; rewriting it would falsify the record |
| `scripts/conformance/results/**` | recorded conformance run outputs (historical evidence) |
| Archive **tags** (the 123 transferred tags) | immutable history pointers; tags must keep pointing at their original commits |

**Rationale:** TADMORA's product surface is renamed **100%**; the engineering history is preserved **verbatim**. The brand gate (Phase 8) enforces the rename on the product surface only and treats the whitelist above as legitimate historical context. Accepted residual risk: old identity strings remain findable inside historical material (RISK-07, LOW, accepted).

## 6. Deferred / External Items (not in-tree)

| Item | Status |
|------|--------|
| `tadmora.onrender.com` deployment | planned new Render service — not yet provisioned (RISK-08) |
| `tadmora.ly` / `demo.tadmora.ly` DNS/mail | external to the repo — configured at the domain provider when the new deployment goes live |
| New EAS project | blocked on `EXPO_TOKEN` (RISK-02) |
| Store listings for `ly.tadmora.mobile` | new bundle ID requires new store listings, not an update of existing ones (RISK-09) |
