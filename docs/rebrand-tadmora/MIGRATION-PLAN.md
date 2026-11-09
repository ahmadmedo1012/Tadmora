# TADMORA Rebrand — Migration Plan (8 Phases)

![doc](https://img.shields.io/badge/doc-migration--plan-blue) ![status](https://img.shields.io/badge/status-SNAPSHOT%202026--11--09-yellow) ![baseline](https://img.shields.io/badge/baseline-2e6e7bb1-informational)

**Product:** TADMORA (تادمورا) — «نظام تشغيل الجامعة» — Arabic-first, RTL-first University Operating System, rebranded from Madarek (مدارك).
**Repo:** `ahmadmedo1012/madarek` → `ahmadmedo1012/Tadmora` (private), branch `rebrand/tadmora-foundation`, baseline `2e6e7bb158622753a15915403fa58390c587527d`.

> **This is a status snapshot taken 2026-11-09 at document-writing time.** Phases 0–2 are complete with evidence; Phases 3–4 are in progress; Phases 5–8 are planned and not yet started. No future-phase results are claimed.

---

## 0. Phase Overview and Current Status

| Phase | Name | Status | Evidence / next action |
|-------|------|--------|------------------------|
| 0 | Preflight verification | ✅ **COMPLETE** | `PREFLIGHT.md` — all 12 checks recorded |
| 1 | Repository transfer | ⚠️ **COMPLETE (local) · BLOCKED (remote)** | `REPOSITORY-TRANSFER.md` — mirror verified; push blocked by read-only PAT, ready-to-run commands prepared |
| 2 | Identity audit | ✅ **COMPLETE** | `IDENTITY-INVENTORY.md` — 600 files / 2,380 Latin hits, 274 files / 781 Arabic hits, 123 `mdrk` files |
| 3 | Brand identity | 🔶 **IN PROGRESS** | new mark قوس تادمورا defined; asset regeneration through existing pipeline underway |
| 4 | Systematic rename | 🔶 **IN PROGRESS** | mapping table locked (IDENTITY-INVENTORY §3); product-surface rename being applied |
| 5 | UX review | ⏳ **PLANNED** | after Phases 3–4 land |
| 6 | Security & deployment independence | ⏳ **PLANNED** | new Render/Neon/JWT secrets, new EAS project — never reuse old production credentials |
| 7 | Local validation | ⏳ **PLANNED** | `npm ci`, typecheck, unit tests, build |
| 8 | Brand identity gates | ⏳ **PLANNED** | automated check script + whitelist enforcement |

---

## Phase 0 — Preflight

**Status: ✅ COMPLETE** (evidence: `PREFLIGHT.md`)

Verified before any work started:

- GitHub auth: fine-grained PAT → user `ahmadmedo1012` (id 220099349, Free plan, private_repos quota 10,000).
- Source `ahmadmedo1012/madarek`: public, 1 branch (`main`), 123 tags, HEAD `2e6e7bb158622753a15915403fa58390c587527d` (commit "docs(r344): the honest REPORT (§9 table) + HANDOFF + RESUME at the budget stop", 2026-11-09T08:44:27Z), size 472,703 KB, TypeScript, not a fork, not archived.
- Target `ahmadmedo1012/Tadmora`: 404 — free to create, zero clobber risk.
- Toolchain: git 2.47.3, node v24.22.2, bun 1.3.14, python3 3.12.16, curl; Playwright Chromium (chromium-1200) cached; gh CLI / docker / git-lfs absent — LFS moot because the repo has no `.gitattributes` (zero LFS objects).
- Decision: **GO local / NO-GO remote** with the read-only PAT (caveat documented in `PREFLIGHT.md` §7).

## Phase 1 — Repository Transfer

**Status: ⚠️ LOCAL COMPLETE · REMOTE BLOCKED (credential)** (evidence: `REPOSITORY-TRANSFER.md`)

- Strategy: `git clone --mirror` → `git push --mirror` — preserves all refs, all 123 tags, full history, byte-exactly.
- Executed: mirror clone succeeded (464 MB bare repo, 1 head ref, 123 tag refs, HEAD verified identical to API). Working clone + branch `rebrand/tadmora-foundation` created for all rebrand work.
- **Blocker:** provided PAT is read-only — `POST /user/repos` → 403 "Resource not accessible by personal access token"; push dry-run → 403 "Permission to ahmadmedo1012/madarek.git denied". Repo creation, mirror push, and branch push are all blocked with the current credential.
- Prepared remediation (owner actions): (1) create **empty** private repo `Tadmora` at github.com/new — no README/license/gitignore; (2) upgrade PAT with "Administration: Read and write" or issue a new PAT with repo-creation + Contents:Read/write on `Tadmora`. Then run the ready-to-run commands in `REPOSITORY-TRANSFER.md` §5.2 and the V1–V7 verification checklist (§6).
- Also blocked in this session: `EXPO_TOKEN` absent → new EAS project cannot be created; old EAS id `afc4265f-664e-4325-a0ff-b621b81fe1b0` must NOT be reused (placeholder pending, RISK-02).

## Phase 2 — Identity Audit

**Status: ✅ COMPLETE** (evidence: `IDENTITY-INVENTORY.md`)

Full-tree audit (excluding `.git`):

- Latin `madarek` (any case): **600 files / 2,380 occurrences**.
- Arabic `مدارك`: **274 files / 781 occurrences**.
- `mdrk`-prefixed identifiers: **123 files**.

Categorized inventory covers: production URL `https://madarek.onrender.com` (canonical, OG, sitemap, mobile default, eas.json, .env.example, docs); email domains `madarek.ly` / `demo.madarek.ly`; package names (`madarek`, `@madarek/frontend`, `@madarek/backend`, `madarek-mobile`); mobile identity (slug, scheme, `ly.madarek.mobile`, app name مدارك, EAS id); cookie `mdrk_refresh`; storage keys (`madarek-theme`, `mdrk-theme-profile`, `madarek-intro-seen`, `mdrk-mobile-*`); CSS (`.mdrk-boot-plate`, `.mdrk-logo`, `.mdrk-grain`, `madarek-overlay-out` family); SW caches (`madarek-static-/assets-r327-e2-1`); brand assets (`madarek-mark.svg` — filename pinned by `backend/prisma/seed.ts`, `frontend/index.html`, `sw.js`, tests — plus `madarek-og.jpg` and the rest of `frontend/public/brand/`); brand code pipeline (`frontend/src/brand/*`, `apps/mobile/src/brand/*`, `shared/brand/mark.svg`, `scripts/r323/wordmark-build-r323.mjs`, `scripts/r323/brand-assets.mjs`, `scripts/brand/build-app-icons.mjs`); seed/demo data («جامعة مدارك التجريبية», slug `madarek-demo`); misc (manifest name, `alternateName`, README title, `render.yaml`, logger name, `madarek-timing-equalizer-no-account`).

Rename mapping locked in `IDENTITY-INVENTORY.md` §3; historical whitelist in §5.

## Phase 3 — Brand Identity

**Status: 🔶 IN PROGRESS** (at snapshot time)

Goal: an original TADMORA identity — not a modified Madarek logo.

- **New mark — «قوس تادمورا» (the Tadmora arch):** Palmyra gateway concept: two pillars + semicircular arch + baseline, with **one solid orange keystone (4×4) at the arch apex**.
- **Palette preserved:** paper `#F6F6EE` / ink `#282828` / orange `#FA3600`; dark-theme accent `#FF5A1F`.
- **Fonts unchanged:** IBM Plex Sans Arabic + Geist Mono.
- **Execution:** geometry authored in `frontend/src/brand/mark.ts` (+ mobile `apps/mobile/src/brand/mark.ts`, shared `shared/brand/mark.svg`); wordmark regenerated via `scripts/r323/wordmark-build-r323.mjs` (harfbuzzjs + IBM Plex Sans Arabic 600 + clipper union) into `wordmark.generated.ts`; static assets re-rasterized via `scripts/r323/brand-assets.mjs` (Playwright); mobile icons via `scripts/brand/build-app-icons.mjs`.
- Remaining at snapshot: regenerate all raster assets (`frontend/public/brand/*`, favicon, mobile icons), verify lockup/wordmark rendering at all sizes.

## Phase 4 — Systematic Rename

**Status: 🔶 IN PROGRESS** (at snapshot time)

Apply the locked mapping (`IDENTITY-INVENTORY.md` §3) across the product surface:

- `madarek→tadmora`, `Madarek→Tadmora`, `MADAREK→TADMORA`, `مدارك→تادمورا`, `mdrk→tdmr` (CSS classes, storage keys, cookie `mdrk_refresh`→`tdmr_refresh`).
- Mobile: `ly.madarek.mobile`→`ly.tadmora.mobile`; `madarek-mobile`→`tadmora-mobile` (slug + package); scheme `madarek`→`tadmora`; app name → تادمورا.
- Deployment URL: `madarek.onrender.com`→`tadmora.onrender.com` (**planned new Render service** — deployment independence).
- Domains: `madarek.ly`→`tadmora.ly`, `demo.madarek.ly`→`demo.tadmora.ly` (seed demo data).
- Filenames: `madarek-mark.svg`→`tadmora-mark.svg`, `madarek-og.jpg`→`tadmora-og.jpg` — **all pinned references updated together** (seed, schema.org, sw precache, tests, mobile content listing).
- SW caches: `tadmora-static-` / `tadmora-assets-` + **VERSION bump** (no stale-cache identity mix).
- **Tests that pin old strings are updated in the same commit** as the rename (RISK-03 mitigation).
- Historical whitelist (`docs/archive/**`, `docs/redesign/**`, `CHANGELOG.md`, `scripts/conformance/results/**`, archive tags) is **not** renamed.

## Phase 5 — UX Review

**Status: ⏳ PLANNED** (starts after Phases 3–4 land)

- Full RTL pass of brand surfaces: boot plate, loader, logo lockups, OG card, PWA manifest, offline page, mobile splash/icons.
- Contrast checks against the preserved palette in both themes (light paper/ink/orange, dark with accent `#FF5A1F`).
- Review of user-visible Arabic copy for identity coherence with the «نظام تشغيل الجامعة» positioning.

## Phase 6 — Security & Deployment Independence

**Status: ⏳ PLANNED**

Rule: **TADMORA never reuses old production credentials or services.**

- New Render service for `tadmora.onrender.com` (new deploy, new env vars — not a rename of the Madarek service).
- New Neon database / connection secrets for the new deployment.
- New JWT signing secrets — old tokens must not validate against the new deployment.
- New EAS project for the mobile app (old project id `afc4265f-664e-4325-a0ff-b621b81fe1b0` never reused) — pending `EXPO_TOKEN` availability (RISK-02).
- Secret rotation recommendation for any credential exposed during the transfer workflow (RISK-10).

## Phase 7 — Local Validation

**Status: ⏳ PLANNED** (no results claimed yet)

Sequence on the working clone:

1. `npm ci` — clean dependency install.
2. Typecheck across workspaces.
3. Unit test suites (frontend, backend, mobile).
4. Production build(s).
5. Fix fallout, re-run until green — rename-related test failures are expected and resolved by updating the pinned strings (same-commit rule, RISK-03).

## Phase 8 — Brand Identity Gates

**Status: ⏳ PLANNED**

- Automated check script that scans the product surface for any residual `madarek` / `مدارك` / `mdrk` occurrences.
- The script enforces the **historical whitelist** (`docs/archive/**`, `docs/redesign/**`, `CHANGELOG.md`, `scripts/conformance/results/**`) — whitelist paths are legitimate history; everything else must be 100% renamed.
- Gate runs as part of validation so identity regressions cannot re-enter the tree silently.

---

## Dependency Notes

- Phases 3→4→5→7→8 are sequential on the working clone; Phase 6 provisioning can proceed in parallel once credentials/external accounts are available.
- The only cross-phase hard blocker is the **credential scope** for the remote transfer (Phase 1 remote half) and the **EAS project creation** (Phase 6 mobile half). All local phases proceed regardless.
- Open risks and their status: see `RISK-REGISTER.md`.
