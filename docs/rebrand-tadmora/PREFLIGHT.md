# TADMORA Rebrand — Phase 0: Preflight Report

![phase](https://img.shields.io/badge/phase-0-preflight-blue) ![status](https://img.shields.io/badge/status-COMPLETE-brightgreen) ![date](https://img.shields.io/badge/date-2026--11--09-informational) ![owner](https://img.shields.io/badge/owner-ahmadmedo1012-blue)

**Project:** TADMORA (تادمورا) — transformation of **Madarek** (مدارك) into an independent product identity.
**Positioning:** University Operating System — «نظام تشغيل الجامعة», an Arabic-first, RTL-first integrated academic management & learning platform.
**Transfer path:** `ahmadmedo1012/madarek` (public source) → `ahmadmedo1012/Tadmora` (new private repo), implementation branch `rebrand/tadmora-foundation`.

This document records every preflight verification performed on **2026-11-09** before any rebrand work began. It is an evidence document: every value below was observed live, not assumed.

---

## 1. Purpose

Phase 0 answers four questions before any mutation happens:

1. Can we authenticate to GitHub as the expected account with sufficient quota?
2. Is the source repository in a known, stable, unambiguous state (one HEAD, one branch, full tag set)?
3. Is the target repository name free (no clobber risk)?
4. Does the local machine have the toolchain required for a byte-exact mirror transfer and subsequent local rebrand work?

---

## 2. Verification Matrix

| # | Check | Method | Observed result | Verdict |
|---|-------|--------|-----------------|---------|
| 1 | GitHub authentication | Fine-grained PAT via API | Authenticates as user **`ahmadmedo1012`** (id `220099349`), Free plan | PASS |
| 2 | Private repository quota | API | `private_repos` quota **10,000** — creation of 1 private repo is well within limits | PASS |
| 3 | Source repo: identity | `GET /repos/ahmadmedo1012/madarek` | `ahmadmedo1012/madarek`, **public**, **not a fork**, **not archived**, primary language **TypeScript** | PASS |
| 4 | Source repo: default branch | API | `main` (1 branch total) | PASS |
| 5 | Source repo: HEAD SHA | API | `2e6e7bb158622753a15915403fa58390c587527d` | PASS |
| 6 | Source repo: tags | API | **123 tags** present | PASS |
| 7 | Source repo: size | API | **472,703 KB** (~462 MB) — large repo, mirror strategy mandatory | PASS |
| 8 | Target repo availability | `GET /repos/ahmadmedo1012/Tadmora` | **404 — does not exist**; name is free; no clobber risk | PASS |
| 9 | Toolchain availability | `--version` probes on host | `git 2.47.3`, `node v24.22.2`, `bun 1.3.14`, `python3 3.12.16`, `curl` — all present | PASS |
| 10 | Toolchain gaps | Host probe | **NOT available:** `gh` CLI, `docker`, `git-lfs` | NOTED |
| 11 | Playwright browsers | Host cache | Chromium cached (**chromium-1200**) — asset-generation scripts (`scripts/r323/brand-assets.mjs`, `scripts/brand/build-app-icons.mjs`) remain runnable | PASS |
| 12 | Local mirror clone | `git clone --mirror` | Completed successfully: **464 MB** bare repo, **1** head ref, **123** tag refs; local HEAD equals API HEAD SHA | PASS |

---

## 3. Dynamic HEAD Evidence

The preflight captured the live HEAD of the source repository at transfer-planning time:

| Field | Value |
|-------|-------|
| Repository | `ahmadmedo1012/madarek` |
| Default branch | `main` |
| HEAD SHA | `2e6e7bb158622753a15915403fa58390c587527d` |
| HEAD commit subject | `docs(r344): the honest REPORT (§9 table) + HANDOFF + RESUME at the budget stop` |
| HEAD commit date | `2026-11-09T08:44:27Z` |
| Branches | 1 (`main`) |
| Tags | 123 |
| Size | 472,703 KB |

The locally mirrored bare repository (`/home/z/tadmora-work/madarek.git`) reports the same HEAD SHA as the GitHub API — this is the pin value used for all later integrity comparisons (see `REPOSITORY-TRANSFER.md`, post-push verification checklist).

Because HEAD is dynamic (the source repo can receive new commits at any time), the rebrand procedure treats `2e6e7bb158622753a15915403fa58390c587527d` as the **verified transfer baseline**. The mirror already contains this commit; any newer source commits that may appear later are out of scope for the rebrand baseline.

---

## 4. Git LFS Determination

| Question | Answer |
|----------|--------|
| Is `git-lfs` installed on the host? | No |
| Does the source repository use LFS? | No |
| Evidence | The repository contains **no `.gitattributes`** file → no LFS pointer rules can exist → **there are zero LFS objects** in the repository |
| Consequence | A plain `git clone --mirror` captures **100% of repository content**. LFS absence removes the single most common cause of incomplete mirrors. No LFS workaround is required. |

---

## 5. Toolchain Inventory

| Tool | Version | Status | Role in the rebrand |
|------|---------|--------|---------------------|
| git | 2.47.3 | available | mirror clone/push, branch work |
| node | v24.22.2 | available | workspace scripts, brand code pipeline |
| bun | 1.3.14 | available | package management / script runner |
| python3 | 3.12.16 | available | auxiliary tooling |
| curl | present | available | GitHub API verification calls |
| gh CLI | — | NOT available | all GitHub operations go through `git` + `curl` + PAT |
| docker | — | NOT available | not required for Phases 0–4; CI/build independence handled elsewhere |
| git-lfs | — | NOT available | not required (no LFS objects, see §4) |
| Playwright Chromium | chromium-1200 (cached) | available | static brand-asset rasterization (Phase 3) |

---

## 6. Go / No-Go Decision

**Decision: GO for all local work; NO-GO for remote mutation with the current credential.**

- **GO (local):** authentication, quota, source-state knowledge, target-name availability, toolchain, and mirror integrity are all verified. Local rebrand work (identity audit, brand regeneration, systematic rename, validation) proceeds on the working clone at `/home/z/tadmora-work/Tadmora`.
- **NO-GO (remote, current PAT):** the provided fine-grained PAT proved to be **read-only** for repository creation and push operations. Details, evidence, and remediation are documented in `REPOSITORY-TRANSFER.md` §4–§6. This is a credential-scope issue, not a plan defect: all remote steps are prepared as ready-to-run commands.

## 7. Credential-Scope Caveat (discovered during preflight execution)

Two findings qualify the GO decision:

1. **Repository creation denied.** `POST /user/repos` with the provided PAT returns `403 "Resource not accessible by personal access token"`. Creating `ahmadmedo1012/Tadmora` requires a fine-grained PAT with **Administration: Read and write** (account permission) plus **repository creation**, or **Contents: Read and write** on the new repository.
2. **Push denied.** A dry-run push test against the source remote returned `403 "Permission to ahmadmedo1012/madarek.git denied"` — the token cannot write to any repository, confirming the read-only scope.

Related credential gap (mobile pipeline): **`EXPO_TOKEN` is not available in this session**, so a new EAS project cannot be created. The old EAS project id `afc4265f-664e-4325-a0ff-b621b81fe1b0` **must NOT be reused** (deployment-independence rule); it remains in `apps/mobile/app.config.ts` as a documented placeholder pending replacement. Tracked in `RISK-REGISTER.md` (RISK-02).

## 8. Artifacts Produced in Phase 0

| Artifact | Location | Notes |
|----------|----------|-------|
| Bare mirror of source repo | `/home/z/tadmora-work/madarek.git` | 464 MB, 1 head ref + 123 tag refs, HEAD verified |
| Working clone (rebrand workspace) | `/home/z/tadmora-work/Tadmora` | branch `rebrand/tadmora-foundation` |
| This report | `docs/rebrand-tadmora/PREFLIGHT.md` | Phase 0 evidence |

## 9. Next Steps

- Phase 1 (repository transfer): execute as soon as a write-capable credential or a manually created empty `Tadmora` repo is available — see `REPOSITORY-TRANSFER.md`.
- Phase 2 (identity audit): performed locally on the working clone — see `IDENTITY-INVENTORY.md`.
- Full phase plan and current status: `MIGRATION-PLAN.md`. Open risks: `RISK-REGISTER.md`.
