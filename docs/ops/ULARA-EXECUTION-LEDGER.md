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

## Cycle 2 — 2026-11-12 (production: ULARA is live)

**CI:** PR #23 (656 files, +5,147/−3,758) fully green across 3 fix
iterations — all 11 CI jobs + size gate + deadcode (regression paid
down: legacyThemeProfileKey; two metrics re-pinned on the sanctioned
--update path) + mobile gates (typecheck · lint · contract · jest
1,174/1,174 · icons · tokens · export 7.5 MB ≤ 8).

**The parity/conformance/e2e reconciliation:** the parity pin table
(200 seats) re-keyed to Parchment & Sienna; the four reference-measured
scoped seats stay on the frozen Heron values (the instrument measures
them); the conformance ratchet re-pinned 93.8 → 92.2 per the documented
re-measure precedent (owner-directed redesign geometry: y:331 h:143
w:131 x-mirror:128 bg:51); the r319 shell/ios e2e PAPER rgb pins
followed the new grounds.

**The mobile invisible-Welcome root cause (fixed):** the first-ever-
launch `Updates.reloadAsync()` (the r326 RTL dance) WEDGES Reanimated
entering animations on Android release — every entering-wrapped
container (60 seats / 18 files) stays at opacity-0 while core-Animated
+ SVG render. Evidence: the new maestro-debug forensics (screenshots +
UI hierarchy: the Welcome's plan drawing visible, ALL text absent,
zero text nodes; VLM-verified). Fix: the reload is retired (rtl.ts) —
the direction applies on the next natural launch; a mirrored first
session beats an invisible one. After the fix, run 43298175196's
registrar journey completed: Welcome CTA → login form → credentials →
«دخول» → the dashboard region — the app's login journey PROVEN on the
emulator. The remaining journey failures (incl. the 6adeb601 main run)
are the CI emulator's rendering flakiness (swiftshader "Failed to find
ColorBuffer" errors) — the instrument, not the app. The android-smoke
acceptance bar (3 consecutive green runs) remains OPEN pending a more
stable emulator profile (a follow-up: pin a hardware-GPU runner or a
larger AVD).

**Production sequencing (executed in order):**
1. Both pending migrations applied to Neon production via
   migrate-deploy + the direct URL — 32 migrations total; verified:
   `ulara-demo` / «مساحة عمل أُلارا التجريبية» / "Ulara Experimental
   Workspace", both workspaces neutralized, content rebranded
   («هاكاثون أُلارا الأول»), owner accounts + all user data intact.
2. Vercel project renamed `tadmora` → `ulara` (same project ID
   prj_0im1cuV1Gpv4sHXqRbaAxpuspxZs, GitHub link intact); the new
   ulara.vercel.app domain added + serving; the old tadmora.vercel.app
   remains serving during the transition window (old APK clients keep
   working; all canonical URLs point to ulara).
3. PR #23 merged (6adeb601) → deploy.yml green → production deployment
   READY at buildId 6adeb6018ef0 (SHA match verified).
4. **deploy-smoke: SUCCESS on 6adeb6018e** — buildId==SHA poll, three
   real logins (student/teacher/registrar, rotated production
   passwords), dashboard 200s, OpenAPI additive check.
5. Production UI verified: title «أُلارا · نظام تشغيل الجامعة»,
   canonical https://ulara.vercel.app/, OG أُلارا, manifest أُلارا
   (#F5F1E8), status.updateUrl https://ulara.vercel.app/app, health
   green (DB ping ~460-550 ms warm — the serverless connect + Neon
   pooler pattern; cold ~1.1 s).
6. GitHub repository renamed `ahmadmedo1012/Tadmora` →
   `ahmadmedo1012/ulara` (history/issues/releases/permissions
   preserved; local remote updated; fetch/push verified); description
   + homepage + topics updated (the retired topic removed).
7. `ulara.apk` published on the rolling `latest` release («أُلارا —
   أندرويد v1.0.0», 113.8 MB) — the old tadmora.apk asset replaced;
   the old Tadmora.ipa SideStore asset deleted; the download URL
   verified (200, filename=ulara.apk).

**Neon rename — BLOCKED from this sandbox:** api.neon.tech does not
resolve here (verified repeatedly; DoH resolvers also blocked). The
rename is cosmetic metadata (no connection string, branch, or data
change). Owner instructions in docs/ops/ULARA-NEON-RENAME.md.

**Remaining owner actions (carried):** rotate the exposed GitHub PAT;
WIPO trademark check + domain registration (ulara.ly etc.); the real
owner-account email decision (owner@tadmora.ly works — 4 successful
logins on record; renaming it is the owner's own action); mail
provider credentials if recovery email delivery is wanted; EAS project
+ EXPO_TOKEN if OTA is wanted.
