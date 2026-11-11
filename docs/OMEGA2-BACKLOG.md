# Ω+2 BACKLOG — the prioritized next waves

> Written at the close of WAVE Ω+2.0 (baseline + critical production
> correctness, merged at `aa7629b`). This is the working backlog for the
> remaining Ω+2 waves — each entry names the deliverable, the evidence
> needed, and the honest blockers. Update it as waves complete; the
> inventory artifact (`docs/INVENTORY.md`, generated) and the parity
> matrix (`apps/mobile/docs/feature-parity.md`) feed it.

## WAVE Ω+2.1 — Full product visual audit (next)

Deliverable: every route screenshotted and judged, not just the landing.

- Drive the real app (local dev server against a seeded DB — the
  production demo accounts predate the current seed generation and
  their legacy passwords are unknown; do NOT reset them without the
  owner) through all 117 web pages × {light, dark} × {390px, 768px,
  1280px} + the 113 mobile routes via the RN-web capture pipeline
  (`docs/mobile/HANDOFF.md` §RN-web capture).
- Score every page against the directive's visual/UX acceptance lists
  (§22) — no clipping, no overflow, primary actions obvious, states
  present (loading/empty/error), focus visible, reduced motion honored.
- Output: `docs/phase-omega2/visual-audit.md` — per-page scores +
  defect list ranked by user impact. Fix-the-top belongs to Ω+2.2.

## WAVE Ω+2.2 — Design-system and interface improvement

- The audit's top defects first (highest-impact, evidence-ranked).
- Forms/tables/dashboards per §4.7–4.10; navigation hierarchy §4.4;
  component-state completeness (loading/empty/error/disabled for every
  data surface); motion pass §6 with the reduced-motion law.
- Preserve the Heron identity (paper/ink/orange, radius 0, IBM Plex
  Sans Arabic, Lucide-only) — no new design language.

## WAVE Ω+2.3 — Student + instructor experience

- Walk the complete journeys end-to-end (register → enroll → lecture
  checkpoints → assignment submit → grade → mastery → exam → results).
- The 4 MiB PDF ceiling UX: verify both upload modals surface the
  derived number and the compress-or-smaller-file guidance everywhere.
- Instructor: authoring loops (materials/assignments/exams/lectures),
  grading queue, analytics honesty (template-sim labels).

## WAVE Ω+2.4 — Registrar, quality, owner, multi-institution

- Permission boundaries re-verified per route (the audit's auth-matrix
  pass); cross-tenant isolation probes (two workspaces seeded locally).
- Registrar console completeness (faculties/departments/enrollments/
  invites/bulk-import); quality moderation loops; owner governance.

## WAVE Ω+2.5 — Native mobile completion

- Every native screen vs the Ω+2.1 audit's web judgment.
- RTL first-launch limitation (Android applies RTL from second start —
  documented; seek a fix), safe areas, keyboard avoidance, tap targets.
- API parity re-check via `contract-check` (keep 0 drift).
- The fresh direct APK (post-`aa7629b`) is the device-verification
  candidate: targetSdk 36 ✓, embedded vercel URL ✓, stable signature ✓.

## WAVE Ω+2.6 — AI and missing capabilities

- AI assistant: `local` provider is an honest template composer; the
  upgrade path (OpenAI-compatible provider) is env-gated and documented
  — evaluate a real provider integration behind the existing gate.
- Plagiarism/similarity: today a disclosed deterministic simulation —
  either implement honestly (e.g. text-similarity on extracted text,
  clearly scoped) or keep the label airtight.
- Remote push: backend proposal doc exists; the honest status stays 🔗
  (needs backend device-token model + expo push wiring).
- Payments/fees: stays 🚫 until a real fee entity + PSP exists.

## WAVE Ω+2.7 — Storage and operational reliability

- THE headline item: presigned direct-to-S3 for the PDF namespaces
  (uploads PUT direct, downloads via short-lived signed GETs) — the
  architecture already exists for video (`storage-presign.ts`); extend
  it, then the 20 MiB+ product cap becomes real on Vercel.
- Requires the owner's S3_* credentials (RELEASE.md §storage documents
  the unlock). Until then the 4 MiB truth stands everywhere.
- §10.2's full file-acceptance matrix (small/5MB/10MB/20MB PDFs,
  invalid/corrupted/empty/interrupted/expired/duplicate/unauthorized/
  cross-tenant/range/large) — run through the actual deployed path.
- Backup off-site move (the standing owner action since r183).

## WAVE Ω+2.8 — Performance, accessibility, code quality

- Web perf profiling (Lighthouse CI candidate; bundle already gated
  ≤8MB mobile), DB query review (N+1 pass on the hot role dashboards).
- Accessibility: the §22 checklist on the audited journeys (keyboard,
  contrast, dialogs/focus, dynamic errors, reduced motion).
- Dead code / CSS cleanup riding the existing deadcode + design gates.

## WAVE Ω+2.9 — Independent review and final corrections

- Re-review everything as a hostile outsider (§19.5), fix, repeat.

## Standing owner actions (external blockers — never disguised as done)

1. EAS project + `EXPO_TOKEN` (OTA re-activation runbook: RELEASE.md).
2. S3_* + `STORAGE_DRIVER=s3` (unlocks 20 MiB+ PDFs via Ω+2.7).
3. Apple Developer account (TestFlight path).
4. Play service account (AAB submission path).
5. Backup dumps off-site move.
6. Rotate the GitHub PAT (pasted in chat during setup).
