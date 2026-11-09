# TADMORA Rebrand — Phase 1: Repository Transfer Report

![phase](https://img.shields.io/badge/phase-1-repository--transfer-blue) ![status](https://img.shields.io/badge/status-LOCAL%20COMPLETE%20%C2%B7%20REMOTE%20BLOCKED%20(credential)-critical) ![date](https://img.shields.io/badge/date-2026--11--09-informational)

**Transfer:** `ahmadmedo1012/madarek` → `ahmadmedo1012/Tadmora` (new private repo)
**Implementation branch:** `rebrand/tadmora-foundation`
**Baseline HEAD:** `2e6e7bb158622753a15915403fa58390c587527d` (see `PREFLIGHT.md` §3)

> **Honest status summary:** every local step of the transfer (mirror clone, integrity verification) completed successfully. The remote steps (repo creation, mirror push, branch push) are **BLOCKED** because the provided PAT is read-only. Exact evidence, remediation, and ready-to-run commands are in §4–§6 below. Nothing was silently skipped or faked.

---

## 1. Objective

Move the complete Madarek repository — every branch head, all 123 tags, and the full commit history — into a new, empty, **private** repository `ahmadmedo1012/Tadmora`, byte-exactly, with no data loss and no history rewrite. The new repository is the permanent home of the TADMORA product; the rebrand work proceeds on branch `rebrand/tadmora-foundation`.

## 2. Mirror Strategy and Rationale

**Chosen method:** `git clone --mirror` from the source, then `git push --mirror` to the target.

Why a mirror (and not `git clone` + `git push origin main`):

| Requirement | Plain clone/push | Mirror clone/push |
|-------------|------------------|-------------------|
| Commit history preserved | yes (current branch only) | yes |
| **All 123 tags** transferred | no (needs extra `--tags` push) | **yes, automatically** |
| All refs (heads + tags + notes + replace) transferred | no | **yes** |
| Ref namespace layout identical | no | **yes** |
| Risk of forgetting a ref class | real | none |

Supporting facts from preflight (see `PREFLIGHT.md`):

- Source has **1 branch** and **123 tags** — tags are a first-class deliverable here (archive tags are explicitly part of the engineering history whitelist, see `IDENTITY-INVENTORY.md` §6).
- **No `.gitattributes` → no LFS objects** — a plain mirror is guaranteed complete; `git-lfs` being absent from the host is harmless.
- Repo size 472,703 KB (API) / 464 MB on disk (bare clone) — large but fully transferable with `git push --mirror` in a single operation.

## 3. Executed Steps and Evidence

| Step | Command / Method | Result | Evidence |
|------|------------------|--------|----------|
| 3.1 Verify target name is free | `GET /repos/ahmadmedo1012/Tadmora` | **404** — target does not exist; safe to create, zero clobber risk | API response 404 |
| 3.2 Mirror clone | `git clone --mirror https://github.com/ahmadmedo1012/madarek.git` (into `/home/z/tadmora-work/madarek.git`) | **Success** — bare repository, **464 MB** on disk | clone completed without errors |
| 3.3 Count head refs in mirror | ref listing in bare repo | **1 head ref** (`refs/heads/main`) | matches API branch count (1) |
| 3.4 Count tag refs in mirror | ref listing in bare repo | **123 tag refs** | matches API tag count (123) |
| 3.5 Verify mirror HEAD | local rev-parse of `main` in the bare repo | **`2e6e7bb158622753a15915403fa58390c587527d`** | **identical to GitHub API HEAD SHA** |
| 3.6 Working clone for rebrand work | clone into `/home/z/tadmora-work/Tadmora`, branch `rebrand/tadmora-foundation` created from baseline | Success — all local rebrand work (Phases 2–4) happens here | working tree present |

**Integrity conclusion (local):** the mirror at `/home/z/tadmora-work/madarek.git` is a complete, verified snapshot of `ahmadmedo1012/madarek` at baseline `2e6e7bb1…`: same HEAD SHA, same branch count, same tag count.

## 4. THE BLOCKER — Read-Only Personal Access Token

> **This is the single critical blocker of Phase 1. It is a credential-scope problem, not a repository or plan problem.**

Two independent probes, both run on 2026-11-09:

| Probe | API call | Response | Meaning |
|-------|----------|----------|---------|
| Repo creation test | `POST /user/repos` (create `Tadmora`) | **403 — "Resource not accessible by personal access token"** | The fine-grained PAT lacks repository-creation capability. Creating a repo requires the **Administration: Read and write** account permission (plus repository creation rights), or an equivalent new PAT. |
| Push dry-run test | push attempt against `ahmadmedo1012/madarek.git` | **403 — "Permission to ahmadmedo1012/madarek.git denied"** | The token has no write scope on **any** repository — confirmed read-only. |

**Direct consequences (all remote steps are BLOCKED with the current credential):**

1. ❌ Creating `ahmadmedo1012/Tadmora` via API — blocked.
2. ❌ `git push --mirror` of the verified 464 MB mirror — blocked.
3. ❌ `git push -u origin rebrand/tadmora-foundation` (the rebrand branch) — blocked.

**What still proceeded:** all local rebrand work on the working clone (`/home/z/tadmora-work/Tadmora`) is unaffected. The remote transfer is fully prepared and reduces to running the commands in §6 once credentials allow.

Related credential gap: **`EXPO_TOKEN` is not available in this session**, so the new EAS project cannot be created either. The old EAS project id `afc4265f-664e-4325-a0ff-b621b81fe1b0` must **not** be reused; it stays as a documented placeholder in `apps/mobile/app.config.ts` pending replacement (see `RISK-REGISTER.md` RISK-02).

## 5. Remediation — Exact Steps

### 5.1 By the repository owner (manual, ~2 minutes)

1. **Create the empty private repo manually:** open **github.com/new** and create a repository named exactly **`Tadmora`**, owned by `ahmadmedo1012`, visibility **Private**.
   - ⚠️ **It must be completely EMPTY**: do **not** add a README, a license, or a `.gitignore`. Any initial commit changes the remote HEAD and forces history reconciliation instead of a clean mirror push.
2. **Fix the credential**, one of:
   - **Option A (upgrade the current PAT):** edit the fine-grained PAT and add the account permission **"Administration: Read and write"** (this unlocks repository creation), or
   - **Option B (new PAT):** create a new fine-grained PAT with **repository creation** rights and **Contents: Read and write** on the new `Tadmora` repository.

### 5.2 Then run the transfer (ready-to-run commands)

**Step 1 — mirror push (transfers all branches, all 123 tags, full history):**

```bash
cd /home/z/tadmora-work/madarek.git && git push --mirror https://github.com/ahmadmedo1012/Tadmora.git
```

(Use the credential via the git credential helper / URL-embedded PAT / `git config credential.helper` as appropriate for the session — the command itself is final.)

**Step 2 — push the rebrand branch from the working clone:**

```bash
cd /home/z/tadmora-work/Tadmora && git push -u origin rebrand/tadmora-foundation
```

**Notes:**

- Step 2 requires the working clone's `origin` to point at the new repo (or use the full URL: `git push -u https://github.com/ahmadmedo1012/Tadmora.git rebrand/tadmora-foundation`).
- Do not run `--mirror` from the working clone: only the bare mirror has the complete ref namespace. The working clone push (Step 2) adds exactly one ref — the rebrand branch.

## 6. Post-Push Verification Checklist

Run every item after §5.2 and record results. All comparisons use the baseline values pinned in `PREFLIGHT.md` §3.

| # | Verification | Method | Expected value | Status |
|---|--------------|--------|----------------|--------|
| V1 | New repo exists and is private | `GET /repos/ahmadmedo1012/Tadmora` | `200`, `"private": true` | ☐ pending |
| V2 | Default branch HEAD SHA matches baseline | API `GET /repos/ahmadmedo1012/Tadmora/commits/main` (or `git ls-remote`) | `2e6e7bb158622753a15915403fa58390c587527d` | ☐ pending |
| V3 | Branch count matches source at baseline | API branches listing | **1** (`main`) — plus `rebrand/tadmora-foundation` after Step 2 | ☐ pending |
| V4 | Tag count matches source | API tags listing | **123** | ☐ pending |
| V5 | Tag SHAs spot-check (first / last / a few random) | compare `git rev-parse <tag>` in mirror vs API tag object SHAs | identical | ☐ pending |
| V6 | Rebrand branch pushed and tracked | `git ls-remote origin rebrand/tadmora-foundation` | present; HEAD = local `rebrand/tadmora-foundation` HEAD | ☐ pending |
| V7 | Old repo untouched | `GET /repos/ahmadmedo1012/madarek` | still public, HEAD unchanged from baseline at time of mirror | ☐ pending |

If any check fails: **do not force anything.** Re-run the mirror comparison (`git ls-remote` on both remotes) and reconcile before proceeding.

## 7. Phase 1 Status

| Item | Status |
|------|--------|
| Target name availability verified | ✅ done (404 = free) |
| Mirror clone + integrity verification | ✅ done (464 MB, 1 head, 123 tags, HEAD = `2e6e7bb1…`) |
| Repo creation (API or manual) | ⛔ blocked by read-only PAT → owner manual step (`PREFLIGHT`/§5.1) |
| `git push --mirror` | ⛔ blocked → ready-to-run command in §5.2 |
| Rebrand branch push | ⛔ blocked → ready-to-run command in §5.2 |
| Post-push verification (V1–V7) | ⏳ pending push |

Owner actions required: §5.1 (create empty private repo `Tadmora`; upgrade/replace PAT). Everything else is prepared.
