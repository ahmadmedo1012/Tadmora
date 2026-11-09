# TADMORA Rebrand — Risk Register

![doc](https://img.shields.io/badge/doc-risk--register-blue) ![date](https://img.shields.io/badge/date-2026--11--09-informational) ![open--risks](https://img.shields.io/badge/open%20risks-4-red)

**Scope:** risks to the TADMORA (تادمورا) rebrand of the Madarek (مدارك) platform — repository transfer (`ahmadmedo1012/madarek` → `ahmadmedo1012/Tadmora`, branch `rebrand/tadmora-foundation`) and product-identity migration.

**Status snapshot: 2026-11-09.** Severity = impact if it materializes; Likelihood = probability it will; Status is the honest current state (not the hoped-for state).

---

## 1. Register

| ID | Risk | Severity | Likelihood | Mitigation / handling | Status |
|----|------|----------|------------|------------------------|--------|
| **RISK-01** | **Credential scope blocker:** the provided fine-grained PAT is read-only — `POST /user/repos` returns 403 "Resource not accessible by personal access token"; push dry-run returns 403 "Permission to ahmadmedo1012/madarek.git denied". Repo creation, mirror push, and branch push are all blocked. | **HIGH** | **Certain** (observed) | (a) Owner manually creates **empty** private repo `Tadmora` at github.com/new (no README/license/gitignore); (b) owner upgrades the PAT with **"Administration: Read and write"** or issues a new PAT with repo creation + Contents:Read/write on the new repo; (c) then run the prepared commands: `cd /home/z/tadmora-work/madarek.git && git push --mirror https://github.com/ahmadmedo1012/Tadmora.git` and `cd /home/z/tadmora-work/Tadmora && git push -u origin rebrand/tadmora-foundation`; (d) run verification checklist V1–V7 in `REPOSITORY-TRANSFER.md` §6. All local rebrand work proceeds unblocked in the meantime. | **OPEN** |
| **RISK-02** | **EXPO_TOKEN absent in this session** → a new EAS project cannot be created. The old EAS project id `afc4265f-664e-4325-a0ff-b621b81fe1b0` must NOT be reused (deployment independence), so it remains in `apps/mobile/app.config.ts` as a documented placeholder. | MEDIUM | High (until token provided) | Document the placeholder explicitly; create a new EAS project as soon as `EXPO_TOKEN` is available and replace the id in `apps/mobile/app.config.ts` before any mobile build/submit. No build may ship with the old project id. | **OPEN** |
| **RISK-03** | **Renamed identifiers break tests that pin old strings** — e.g. `frontend/tests/e2e/lecture-poster-geometry.e2e.ts` pins `/brand/madarek-mark.svg`; brand-integrity and SW tests (`frontend/tests/unit/r188-brand-integrity.test.ts`, `frontend/tests/unit/r323-brand-system.test.ts`, `frontend/tests/unit/r327-pwa-sw.test.ts`) pin cache names/assets; unit tests pin storage keys and slugs. | MEDIUM | High | **Same-commit rule:** every rename commit also updates the tests that pin the renamed strings — test and product code never diverge on identity. Phase 7 local validation (typecheck + unit tests + build) verifies before anything is pushed. | MITIGATED (in effect; validated in Phase 7) |
| **RISK-04** | **localStorage key rename logs out existing users / resets theme prefs** — `madarek-theme` → `tadmora-theme`, `mdrk-theme-profile` → `tdmr-theme-profile`, `madarek-intro-seen` → `tadmora-intro-seen`; mobile SecureStore `mdrk-mobile-*` → `tdmr-mobile-*`. Stored sessions and preferences under old keys are invisible to the new build. | LOW–MEDIUM | Certain (technical consequence) | **Accepted for product relaunch:** TADMORA is a new independent product; a clean first-run state is acceptable and even desirable. Documented migration note: no legacy-key migration shim is planned; users of the old product simply sign in again. | ACCEPTED (documented) |
| **RISK-05** | **Cookie rename invalidates sessions** — refresh cookie `mdrk_refresh` → `tdmr_refresh` (`backend/src/http/routes/auth.routes.ts`); browsers holding the old cookie won't refresh sessions against the new deployment. | LOW | Certain (technical consequence) | **Relaunch resets sessions by design.** Combined with Phase 6 (new JWT secrets on the new deployment), all old tokens are invalid anyway — the cookie rename adds no additional user impact beyond the relaunch boundary. | ACCEPTED (relaunch resets) |
| **RISK-06** | **Stale-cache identity mix in installed PWAs** — service-worker caches `madarek-static-r327-e2-1` / `madarek-assets-r327-e2-1` could keep serving old-brand assets after the rename. | LOW | Prevented | **Handled by design:** caches are renamed to `tadmora-static-*` / `tadmora-assets-*` **and** the `VERSION` constant is bumped, so the SW installs a fresh cache namespace and never mixes old/new identity assets. Verified by the SW unit tests after the rename (same-commit rule). | HANDLED |
| **RISK-07** | **Historical whitelist leaks old identity in search** — `docs/archive/**`, `docs/redesign/**`, `CHANGELOG.md`, `scripts/conformance/results/**`, and archive tags retain `madarek`/`مدارك` strings verbatim. | LOW | Certain (by design) | **Accepted:** these are engineering history; rewriting them would falsify the record. The Phase 8 brand gate scans the **product surface only** and enforces 100% rename there; the whitelist is explicit and auditable. Users searching the repo may find historical mentions — this is intentional and documented in `IDENTITY-INVENTORY.md` §5. | ACCEPTED (engineering history) |
| **RISK-08** | **New deployment URL not yet provisioned** — `tadmora.onrender.com` is a planned **new** Render service (per deployment-independence rule); until it exists, references to it are placeholders. The old `madarek.onrender.com` service stays untouched and is never renamed/reused. | MEDIUM | High (until provisioned) | Provision the new Render service + new Neon DB + new env secrets in Phase 6; update DNS/hosting when live. The URL placeholder is centralized in configuration (`apps/mobile/app.config.ts` default, `.env.example`, eas.json, canonical/OG/sitemap) and is covered by the rename mapping so the switch is a config change, not a code hunt. | **OPEN** |
| **RISK-09** | **Bundle ID change requires new store listings** — `ly.madarek.mobile` → `ly.tadmora.mobile` (iOS bundleIdentifier + Android package). App stores treat this as a **new app**, not an update: existing listings cannot be migrated to a new bundle ID. | MEDIUM | Certain (if mobile ships) | **Documented:** new store listings must be created for `ly.tadmora.mobile`; the old app's listing remains under the old identity and is not updated. Combined with RISK-02 (new EAS project) this is consistent with the new-independent-product positioning. Store assets regenerated by `scripts/brand/build-app-icons.mjs`. | DOCUMENTED (new listings required) |
| **RISK-10** | **Secrets exposure — token appeared in chat** during the transfer workflow. Any credential transmitted through a conversational channel should be treated as potentially exposed. | HIGH (as a recommendation) | Treated as exposed | **Rotation recommended immediately after the transfer completes:** revoke/regenerate the PAT used for the transfer once the mirror push and branch push are verified (checklist V1–V7). Do not store tokens in the repo; never reuse old production secrets (Phase 6 rule). | **OPEN — rotation recommended** |

---

## 2. Open Items Requiring Owner Action

| # | Action | Unblocks |
|---|--------|----------|
| 1 | Create **empty private repo** `ahmadmedo1012/Tadmora` at github.com/new (no README/license/gitignore) | RISK-01 (remote transfer) |
| 2 | Upgrade PAT ("Administration: Read and write") or provide new PAT (repo creation + Contents:Read/write on `Tadmora`) | RISK-01 (remote transfer) |
| 3 | Provide `EXPO_TOKEN` for a **new** EAS project (old id `afc4265f-664e-4325-a0ff-b621b81fe1b0` never reused) | RISK-02 (mobile pipeline) |
| 4 | Rotate the PAT after the transfer is verified | RISK-10 |

## 3. Monitoring Triggers (re-assess register when…)

- The mirror push completes → run V1–V7, then close RISK-01 and execute the RISK-10 rotation.
- Any Phase 7 validation failure mentions an identity string → verify the same-commit rule (RISK-03) wasn't violated.
- New external accounts (Render/Neon/EAS/stores) are provisioned → update RISK-08 / RISK-02 / RISK-09 statuses.
- Phase 8 gate is implemented → RISK-03 and RISK-07 become continuously enforced rather than convention-based.
