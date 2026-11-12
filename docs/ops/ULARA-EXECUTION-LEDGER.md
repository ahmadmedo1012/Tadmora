# ULARA — Execution Ledger (the takeover)

Append-only progress + evidence record. Owner directive: the ULARA total
takeover. Coordination spec: docs/ops/ULARA-CODEMOD-SPEC.md.

## Cycle 1 — 2026-11-12 (the takeover execution)

**Baseline revalidated (Phase A):** repo main at `01a0b476` (newer than the
directive's `17b62163` — PRs #20–#22 landed after it was written). Production
serving buildId `730b639` (the #22 merge was docs-only → no deploy trigger —
correct). Neon production DB: PostgreSQL 16.15, 90 tables, 43 users, all
active; owner account `owner@tadmora.ly` provisioned 2026-11-09 via the
audited operator script (AuditLog OWNER_PROVISION) and logged in
successfully 4× (2026-11-09 17:32–17:33) — **owner login works**; demo
passwords deliberately rotated (repo secrets) — the old published
`12345678` failing on production is hardening, not a defect. One migration
pending in production: `20261111000000_r_omega_demo_neutralization`.
Health: warm ~463 ms DB ping (serverless connect + pooler), cold ~1.1 s
(Neon compute resume) — the honest explanation of the transient
DB-unavailable observation. Neon API (`api.neon.tech`) unreachable from
this sandbox (DNS) — direct DB + all other APIs reachable.

**Android forensics (run 43257920033):** the Maestro PATH fix WORKS — the
five-role journey RAN for the first time. App healthy: zero crash
signatures, JS running, RTL controlled reload at +2 s. Failure: Welcome
CTA «ابدأ الآن» never became visible in 30 s — the Welcome is a ScrollView
whose CTA stack sits at `marginTop:auto`; on the default AVD profile the
content exceeds the viewport → CTA below the fold; the flow's
`extendedWaitUntil` never scrolls. Fix: `scrollUntilVisible` (smoke-role
steps 1+8) + Maestro debug output (screenshots + hierarchy) added to the
forensics artifact.

**The transformation (branch `ula/total-takeover`):** four parallel
workstreams (A web+brand, B backend+data, C mobile, D CI+gates+docs) in
isolated worktrees, merged clean (disjoint ownership):
- Brand core: ULARA «Parchment & Sienna» palette (paper #F5F1E8 · ink
  #262019 · sienna #C43E16 · ember #FF6B3D — every seat contrast-verified:
  ink 14.3:1, sienna 4.60:1 on paper, white-on-accent 5.19:1); the
  U-vessel mark (M/L/Q only + one cornerstone — the arch is structurally
  impossible); wordmarks «أُلارا» (Plex Sans Arabic 600, lam-alef ligature
  + damma) + ULARA (Geist Mono 500) regenerated through the opentype/
  harfbuzz/clipper pipeline; tokens regenerated; all icon sets rebuilt.
- Web: full sweep (title «أُلارا · نظام تشغيل الجامعة», OG/JSON-LD, legal
  pages, footer, consent, all UI copy), storage keys → ula-family with
  one-time read-shims (no forced logouts/theme resets), CSP pins
  refreshed (app.ts + vercel.json + check gate), hermetic fixtures
  re-fabricated.
- Backend: refresh cookie → `ulara_refresh` (dual-read transition, logout
  clears both), CORS default + updateUrl → ulara.vercel.app, ULARA_ env
  prefixes, mail templates, seed → `ulara-demo` / «مساحة عمل أُلارا
  التجريبية», OpenAPI regenerated, NEW dual-guarded migration
  `20261112000000_ulara_rebrand` (validated on a throwaway embedded PG:
  idempotent, heals both pre-Ω and post-Ω states).
- Mobile: «أُلارا» / slug ulara / scheme ulara:// / ly.ulara.app, icons
  regenerated, storage shims, eas profiles → ulara.vercel.app, maestro
  flows re-identified + the below-the-fold fix, bundle 7.5 MB ≤ 8.
- CI/docs: forensics upgrade, ulara.apk release channel, ULARA_* envs,
  embedded PG → ulara scheme, the Render falsehoods in AGENTS.md/
  06-configuration fixed (Vercel reality), active runbooks rebranded,
  scorecard measures the retired identity.
- Gates v2: identity-gate (tadmora/تادمورا/tdmr + madarek set; principled
  whitelist: history dirs, specs, migrations, instrumentation, LEGACY
  transition seats) — **PASS, product surface 100% ULARA**. logo-gate
  (arch signature globally forbidden, U-vessel seats sanctioned) — PASS.

**Integration verification:** frontend tsc ✅ + 3,039 tests ✅; backend
tsc (src+tests) ✅ + 2,012 tests ✅ (cross-branch pins reconciled: db-ops
backup path, deploy-smoke URL, mail palette, r177 transition seats →
exact ULARA pins per their own integration TODO); tokens:check ✅,
csp-hash ✅, size-gate ✅.

**Blocked-owner items carried forward:** ULARA_OWNER_EMAIL/PASSWORD not
supplied — the existing active owner account (owner@tadmora.ly, working
credentials per login history) stays; email change is the owner's own
action. Mail provider credentials absent — recovery email delivery stays
honestly off (MAIL_PROVIDER=none; the mechanism itself works). PAT
rotation (exposed in chat) — owner action. WIPO/domain registration —
owner action. EAS project — owner action (zero-placeholder + S3 guard
preserved).

## Next
- PR → CI (all 10 jobs + mobile gates + android-smoke on the renamed app)
- Production sequencing: apply both pending migrations → rename Vercel
  project → merge → deploy → verify → rename GitHub repo → ulara.apk →
  Neon rename (or exact owner instructions if still DNS-blocked)
