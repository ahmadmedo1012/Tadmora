# Rebrand Changelog — TADMORA

The record of the Madarek → TADMORA transformation. (The project's full
engineering history lives in the root `CHANGELOG.md`, preserved verbatim.)

---

## 2026-11-09 — `rebrand/tadmora-foundation`

**The rebrand ships in four commits** (base `main` @ `2e6e7bb1`):

### `a7a18698` — feat(brand): the TADMORA mark
- **«قوس تادمورا» (the Tadmora arch)** — an ORIGINAL mark: two hairline
  pillars (x=8/x=24), a semicircular arch (r=8, apex (16,7)), the baseline
  (y=27), and ONE solid orange **keystone** (4×4) seated at the apex — the
  person at the centre of the University Operating System.
- Wordmark **تادمورا** regenerated deterministically (harfbuzz · IBM Plex
  Sans Arabic 600 · clipper-joined تـا + مـو); **TADMORA** Latin sheet
  (Geist Mono 500, 0.08em).
- Every static twin + PWA icons + OG card + mobile icon set rebuilt from
  the one geometry. Retired files removed (`madarek-mark.svg`,
  `madarek-og.jpg`) → `tadmora-mark.svg`, `tadmora-og.jpg`.
- `<Logo>` (web + mobile) redrawn: one-path gateway draw, keystone LAST.

### `df56405f` — feat(rebrand): the identity sweep
- 617+ files / 2,834 replacements on the product surface:
  `madarek→tadmora` · `مدارك→تادمورا` · `mdrk→tdmr` (cookie `tdmr_refresh`,
  storage keys, CSS) · `MDRK-→TDMR-` sheet codes.
- Positioning: **«نظام تشغيل الجامعة»** (University Operating System) on
  titles, OG/Twitter, manifest, shell titles, seed, mobile, READMEs, LICENSE.
- URLs/domains → `tadmora.onrender.com` (planned new deployment) ·
  `tadmora.ly` demo tenant. Packages → `tadmora` / `@tadmora/*` /
  `tadmora-mobile`. Bundle → `ly.tadmora.mobile`. Scheme → `tadmora`.
- Service-worker caches renamed + VERSION bumped (`tadmora-1`) — every
  old-brand cache flushes on first activate.
- EAS: retired project id replaced by an explicit placeholder (deployment
  independence; new project pending `eas init`).
- Historical records preserved verbatim (archive / redesign / history /
  releases / CHANGELOG).

### `1b5bf011` — docs(rebrand): the dossier
- `docs/rebrand-tadmora/` — PREFLIGHT · REPOSITORY-TRANSFER ·
  IDENTITY-INVENTORY · MIGRATION-PLAN · RISK-REGISTER · VALIDATION-REPORT ·
  HANDOFF · this changelog.
- `docs/brand/` — BRAND · DESIGN-SYSTEM · LOGO-GUIDELINES · ASSET-MANIFEST.
- `docs/legal/THIRD_PARTY-RIGHTS.md`.

### `3ac3206d` — chore(rebrand): the identity gate
- `scripts/brand/identity-gate.sh` (`npm run gate:identity`) — fails on any
  old-identity token outside the documented historical whitelist.
- Root manifest reseated (name, description, workspaces, gate wiring);
  lockfiles reconciled.

### Validation snapshot
frontend `tsc` 0 · vitest **3041/3041** · backend vitest **1997** green ·
mobile `tsc` 0 · jest **1171/1171** · `vite build` green · e2e **96/96** ·
identity gate **PASS** — full evidence: `VALIDATION-REPORT.md`.

### Repository transfer (same day)
- `ahmadmedo1012/Tadmora` created (**private**, non-fork).
- Mirror pushed: `main` @ `2e6e7bb1` (byte-identical HEAD to source) +
  **123 tags** + full history.
- `rebrand/tadmora-foundation` pushed with the four commits above.
- Source `ahmadmedo1012/madarek` untouched (read-only throughout).
