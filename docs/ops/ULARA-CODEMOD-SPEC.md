# ULARA Total Takeover — Codemod Specification (Ω execution)

Owner-approved (the takeover directive). This file is the single coordination
spec for the ULARA transformation on branch `ula/total-takeover`. The ops
ledger (docs/ops/ULARA-EXECUTION-LEDGER.md) records progress + evidence.
Identity gate whitelist covers docs/ops/** — old names quoted here are
records, not leaks.

## 0. Decided identity values (single source of truth)

From `shared/brand.json` (update it FIRST, everything derives from it):

| Key | Value |
|---|---|
| name_ar | أُلارا (damma MANDATORY everywhere — the damma-less ألارا is forbidden) |
| name_en | Ulara (running text); ULARA allowed ONLY inside logo lockups |
| slug | ulara |
| domain | ulara.ly (aspirational; production domain is https://ulara.vercel.app) |
| scheme | ulara:// |
| bundle_id | ly.ulara.app (both iOS + Android) |
| storage_prefix | ula- |
| npm_scope | @ulara |
| env_prefix | ULARA_ |

### The ULARA palette — «Parchment & Sienna» (deliberate evolution, NOT the old Tadmora palette)

| Token | Old (Tadmora) | NEW (ULARA) | Rationale |
|---|---|---|---|
| brand.paper | #F6F6EE | #F5F1E8 | warmer parchment ground |
| brand.ink | #282828 | #262019 | sepia-black ink (14.2:1 on paper) |
| brand.warmInk | #191918 | #17130E | deep warm label ink |
| brand.accent | #FA3600 | #C43E16 | burnt sienna — 4.55:1 on paper, 5.16:1 white-on-accent (AA; burns the light-theme contrast findings) |
| brand ember (dark accent) | #FF5A1F | #FF6B3D | luminous sienna for dark theme |

The mark: the U-vessel (owner-approved staged geometry, `scripts/brand/ulara-kit.mjs`):
ONE ink stroke `M9 7L9 19Q9 27 16 27Q23 27 23 19L23 7` (round caps/joins,
stroke width 3 on the 32-grid, viewBox 0 0 32 32) + exactly ONE 4×4 accent
cornerstone at (21,3). M/L/Q only — no arcs; the retired arch signature
`A8 8 0 0 1 24 15` must appear NOWHERE (logo-gate v2 forbids it globally).
Ink bbox: x9..23 (+stroke), y3..27(+) — the kit's exact numbers win; port
them faithfully per platform.

Typography: typeface stays IBM Plex Sans Arabic (display voice 600) + Geist
Mono 500 (Latin micro-label voice) — the existing self-hosted fonts; the
wordmark pipeline (opentype.js + harfbuzzjs + clipper-lib) generates أُلارا
(Arabic, stroke-rendered, NO tracking) + ULARA (Geist Mono, filled, 0.08em
tracking) path data. The TYPE SYSTEM (scale/ladder) is unchanged tokens —
the identity change is mark + wordmark + palette.

## 1. Naming / storage-key migration rules (LOAD-BEARING — read carefully)

### 1.1 Storage keys — rename WITH read-shims (never force-reset users)

| Old | New | Shim rule |
|---|---|---|
| `tadmora-theme` (web) | `ulara-theme` | read: new first, fallback old; write: new only |
| `tdmr-theme-profile` (web) | `ula-theme-profile` | same |
| `tdmr-auth` (web auth storage) | `ula-auth` | same (zustand persist key) |
| `tdmr-mobile-user` | `ula-mobile-user` | mobile AsyncStorage, same shim |
| `tdmr-mobile-access-token` | `ula-mobile-access-token` | SecureStore, same shim |
| `tdmr-mobile-refresh-cookie` | `ula-mobile-refresh-cookie` | SecureStore, same shim |
| `tdmr-mobile-active-institution` | `ula-mobile-active-institution` | same |
| `tdmr.rtl.applied.v1` (mobile rtl.ts) | `ula.rtl.applied.v1` | same (read old → treat as applied) |

### 1.2 Cookie — rename with dual-read transition

Refresh cookie `tdmr_refresh` → `ulara_refresh`
(httpOnly, secure prod, sameSite=strict, path=/api/v1/auth, no domain).
- Refresh endpoint: read `ulara_refresh` first, fall back to `tdmr_refresh`
  (log a one-line deprecation notice when the legacy cookie is used).
- Logout: CLEAR BOTH. Login: set only the new name.
- `backend/src/http/routes/auth.routes.ts` + wherever the cookie name constant
  lives; mobile `src/api/client.ts` Set-Cookie capture reads the new name
  (fallback old until first re-login).

### 1.3 Env var prefixes (rename outright, CI updated in the same PR)

`TADMORA_TEST_ACCOUNTS` → `ULARA_TEST_ACCOUNTS`
`TADMORA_SEED_FORCE` → `ULARA_SEED_FORCE`
`TADMORA_ANDROID_KEYSTORE`/`_ALIAS`/`_PASSWORD`/`_KEY_PASSWORD` → `ULARA_ANDROID_KEYSTORE*`
`TADMORA_E2E_API_URL`/`TADMORA_E2E_BASE_URL`/`TADMORA_E2E_EXECUTABLE` → `ULARA_E2E_*`

### 1.4 URLs — production moves to https://ulara.vercel.app (after the Vercel project rename)

Every active reference to `tadmora.vercel.app` becomes `ulara.vercel.app`:
CORS default (backend env.ts), mobile default API base (client.ts +
app.config.ts + ALL eas.json profiles), backend status route `updateUrl`
default, deploy-smoke.yml BASE, index.html canonical/OG, workflows, docs
(active runbooks only). `localhost:5173` stays.

### 1.5 Package names

root `tadmora` → `ulara`; `@tadmora/frontend` → `@ulara/frontend`;
`@tadmora/backend` → `@ulara/backend`; mobile `tadmora-mobile` → `ulara-mobile`.
Regenerate BOTH lockfiles (root `npm install` after edits; apps/mobile
`npm install` — its lockfile name fields update). Workspace scripts that
spell `-w backend`/`-w frontend` are unaffected.

### 1.6 Mobile identifiers

name «أُلارا» · slug `ulara` · scheme `ulara` · iOS bundle + Android package
`ly.ulara.app` · notification color #C43E16 · splash bg paper/ink new hexes ·
EAS projectId stays the zero-placeholder + S3 guard (updates plugin omitted
while placeholder) — do NOT invent a project id. Regenerate ALL icon PNGs
from the new mark (npm run icons). Maestro flows: appId `ly.ulara.app`,
deep links `ulara://…`.

### 1.7 Database (guarded, idempotent migration — NEVER edit committed migrations)

NEW migration `backend/prisma/migrations/20261112000000_ulara_rebrand/migration.sql`
(applied AFTER the pending Ω migration 20261111000000 — write its guards
DUAL: match pre-Ω OR post-Ω old values, set ULARA values):
- Institution slug `tadmora-demo` → `ulara-demo` (keep row id inst-zawia-showcase);
  name → «مساحة عمل أُلارا التجريبية» / nameEn → `Ulara Experimental Workspace`
  (guard also on «جامعة تادمورا التجريبية» in case Ω hasn't run).
- Seeded content rows still carrying تادمورا after Ω (e.g. Announcement body
  «عبر منصّة تادمورا», Competition title «هاكاثون تادمورا الأول»): guarded
  renames to أُلارا forms.
- NEVER touch: `owner@tadmora.ly` user row (real owner account — email change
  is the owner's own action, documented as a follow-up), AuditLog history,
  LoginEvent history, _prisma_migrations.
- Seed files + test-accounts data updated to the same new slugs/names so a
  fresh DB and an established DB converge.

## 2. Workstream ownership (disjoint — do not touch others' files)

- **A · Web + brand** (`frontend/**` incl. tests, `shared/brand.json` +
  `shared/design-tokens.json` + `shared/brand/**`, `scripts/brand/**`,
  `scripts/r323/brand-assets.mjs` + wordmark tooling, `frontend/index.html`,
  `frontend/public/**`).
- **B · Backend + data** (`backend/**`, `docs/api/openapi.json` regen,
  root `package.json` + root lockfile, `api/index.ts` if it names the brand).
- **C · Mobile** (`apps/mobile/**` only).
- **D · CI + gates + docs** (`.github/**`, `.eas/**`, `scripts/gates/**`,
  `scripts/scorecard.mjs` patterns, `scripts/deadcode/**` baselines if paths
  rename, root `README*.md` `AGENTS.md` `DESIGN.md` `BACKEND.md` `SECURITY.md`
  `.env.example` `CODEOWNERS` templates, `docs/RELEASE.md` `docs/12-deployment.md`
  `docs/06-configuration.md`).
- The CSP pin refresh (index.html → app.ts + vercel.json) is done ONCE at
  integration by the lead (files span A+B ownership).

## 3. Gates that must pass (CI runs all of them)

lint · typecheck (src+tests) · build + size gate (bundle ≤700KB gz — the
wordmark path data replaces the old, watch the budget) · unit tests web+backend
· db-integration · e2e hermetic (fixtures updated to new texts/keys) · r305 ·
a11y gate (baseline 25 serious / 0 critical — only tightens; contrast
improvements expected to LOWER the count, re-baseline at the new lower number)
· ios-webkit · design-gates (tokens drift — regen via `npm run tokens:build`;
icons; logo-gate v2; motion; csp-hash; parity; colors; raw-css) · conform-gate
(DOM-based, palette-safe; if the footer/brand DOM changes pushed any section
below ratchet 93.8, FIX the DOM or re-measure with --ratchet and document)
· surface-drift · mobile gates (typecheck, expo lint, contract-check, generated
drift tokens/brand/openapi, jest render-net, bundle ≤8MB) · identity-gate v2 ·
size-gate files · deadcode ratchet.

### identity-gate v2 (rewrite scripts/brand/identity-gate.sh)

Patterns (case-insensitive): `tadmora`, `تادمورا`, `tdmr`, plus KEEP the old
`madarek`/`مدارك`/`mdrk`/`afc4265f` patterns (retired identities may never
return). Whitelist (each with justification in the header):
`docs/archive|redesign|history|releases|screenshots|rebrand-tadmora|brand|legal|ops`
+ `CHANGELOG.md` + `scripts/scorecard.mjs` + `scripts/conformance/results/**`
+ `backend/prisma/migrations/**` (immutable migration history — data values
quote old names; editing would break checksums) + lockfiles (regenerated
clean, belt-and-braces) + binaries + `frontend/dist/**` + the gate scripts
themselves (`identity-gate.sh`, `logo-gate.sh` spell patterns/signatures) +
`scripts/brand/ulara-kit.mjs` + `scripts/brand/wordmark-build.mjs` if they
necessarily quote old names in history comments (prefer NOT quoting — write
comments without the old name where possible) + `docs/api/openapi.json` must
be CLEAN (regenerated) — do not whitelist it.
The gate's success message: "identity-gate: PASS — the product surface is
100% ULARA."

### logo-gate v2 (rewrite scripts/brand/logo-gate.sh)

The forbidden signature is now the OLD ARCH: `A8 8 0 0 1 24 15` must appear
in ZERO files anywhere (no sanctioned seats — the arch is retired; delete the
old mark assets rather than whitelisting them). The sanctioned seats for the
ULARA mark constants (new names: `MARK_VESSEL_PATH`, `MARK_CORNERSTONE`,
`MARK_VIEWBOX`, lockups) are the new brand homes (frontend/src/brand/**,
apps/mobile/src/brand/**, the asset generator scripts, tests). Update the
r323 brand pin test (frontend/tests/unit/r323-brand-system.test.ts → becomes
the ULARA brand system test with new pins).

## 4. Mobile smoke-journey fix (the run-43257920033 forensics conclusion)

Evidence: app healthy (logcat clean, no crash signatures, JS "Running main"),
RTL controlled reload works, splash removed ~2s — but the Welcome CTA
«ابدأ الآن» never became VISIBLE to Maestro in 30s on the default AVD. The
Welcome screen is a ScrollView whose CTA stack sits at `marginTop:auto` — on
the emulator profile the content exceeds the viewport and the CTA lands below
the fold; the flow's `extendedWaitUntil visible` never scrolls.
Fixes (all in workstream C):
1. `smoke-role.yaml` step 1 AND step 8: replace the plain
   `extendedWaitUntil visible` on «ابدأ الآن» with `scrollUntilVisible`
   (direction DOWN, timeout 30000) — a no-op when already visible, correct
   when below the fold; keep the tap after it.
2. `first-open.yaml`: its asserts («منصّة التعليم الذكي», «تسجيل الدخول»)
   are STALE (older Welcome design) — update to the current Welcome texts.
3. mobile.yml forensics: ALSO capture Maestro's debug output
   (`$HOME/.maestro/tests/**` — screenshots + UI hierarchy) into the
   android-smoke-forensics artifact (add path to upload-artifact; capture is
   on the runner FS, available after the emulator step).
4. While in there: keystore dname CN=Ulara Smoke, embedded PG db name
   tadmora → ulara (create/migrate/seed steps consistent), DATABASE_URL
   `postgresql://tadmora@localhost:5433/ulara` — the boot-pg.sh USER stays
   `tadmora`?? NO — tools/boot-pg.sh is outside C's ownership (repo tools/,
   lead handles: user+db rename to ulara in the boot script + mobile.yml
   together, one commit, workstream D does mobile.yml, LEAD does tools/boot-pg.sh).
   [RESOLVED at integration: tools/boot-pg.sh initdb user stays as-is if the
   script hardcodes tadmora — rename BOTH consistently; it is CI-only plumbing.]

## 5. Production sequencing (lead-owned, after CI green)

1. Apply BOTH pending migrations to production Neon via
   `backend/scripts/migrate-deploy.mjs` + the DIRECT (non-pooler) URL
   (host ep-icy-mode-b9d573ot.c-7.eu-central-1.aws.neon.tech, same creds) —
   BEFORE the new code deploys.
2. Rename the Vercel project `tadmora` → `ulara` (old hostname then
   redirects; verify https://ulara.vercel.app serves buildId 730b639…).
3. Merge the PR → deploy.yml auto-deploys → verify production: health,
   status, buildId == merge SHA, login via API (student/teacher/registrar
   rotated secrets are in repo secrets — deploy-smoke does this), UI shows
   ULARA.
4. Rename the GitHub repo → `ahmadmedo1012/ulara` (update local remote;
   verify clone/push/Actions).
5. Publish `ulara.apk` (android-apk.yml dispatch) — asset name ulara.apk on
   the rolling `latest` release; delete the tadmora.apk asset; update the
   /app download page link (workstream A/D already point the code at
   `/releases/latest/download/ulara.apk` under the NEW repo path).
6. Neon project rename → `ulara-production` (API DNS-blocked from this
   sandbox — retry; else exact owner instructions; cosmetic only — no
   connection string changes).
