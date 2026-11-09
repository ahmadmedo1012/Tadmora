# TADMORA — Handoff

**Date:** 2026-11-09 · **Branch:** `rebrand/tadmora-foundation` on
`ahmadmedo1012/Tadmora` (private) · **State: local rebrand COMPLETE &
PUSHED.**

---

## What is done (with evidence)

1. **Repository transfer** — `ahmadmedo1012/Tadmora` created private via
   API; `git push --mirror` from a `--mirror` clone of
   `ahmadmedo1012/madarek` (read-only source, untouched): `main` @
   `2e6e7bb158622753a15915403fa58390c587527d` byte-identical, **123 tags**,
   full history. `refs/pull/*` rejects are GitHub-expected (hidden refs).
   The rebrand branch pushed: HEAD `3ac3206d` → verify:
   `git ls-remote origin` or the branches API.
2. **The brand** — original «قوس تادمورا» mark + regenerated تادمورا
   wordmark + every asset twin (see `docs/brand/`).
3. **The sweep** — product surface 100% TADMORA; identity gate in CI
   (`npm run gate:identity`).
4. **Validation** — see `VALIDATION-REPORT.md` (tsc ×3 = 0 · vitest
   3041/3041 + 1997 · jest 1171/1171 · build green · e2e 96/96 · gate PASS).

## What is intentionally LEFT OPEN (with exact next steps)

### A. New EAS project (mobile OTA + builds) — needs the account owner
The retired pre-rebrand EAS project is NOT reused (deployment
independence). `apps/mobile/app.config.ts` + `eas.json` carry an explicit
placeholder (`00000000-…`). To finish:
```bash
cd apps/mobile
eas init          # creates the NEW project under the account
# paste the new projectId into app.config.ts (2 seats) — then:
eas update --channel production   # OTA runtime
eas build --platform android --profile production
```
Do NOT revert to the old project id — the identity gate bans it
(`afc4265f` pattern).

### B. New infrastructure (Render + Neon) — fresh credentials, never reuse
`render.yaml` already names the service `tadmora`; the planned URL
`https://tadmora.onrender.com` is seeded across configs (canonical, OG,
sitemap, mobile default API base). To provision:
1. Create the new Render web service from this repo (rootDir `.`,
   `npm ci && npm run build` per render.yaml).
2. Create a NEW Neon PostgreSQL; set `DATABASE_URL` + fresh
   `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` (generate new values —
   never copy the old deployment's secrets).
3. `npm run prisma:deploy && npm run prisma:seed` (demo tenant:
   «جامعة تادمورا التجريبية», fictional by design).
4. Update the URL everywhere if the final domain differs
   (`rg tadmora.onrender.com` → replace; then `npm run gate:identity`).

### C. First deployment checklist
- run `npm ci` at root + `apps/mobile`
- `npm run gate:identity` (must PASS)
- frontend `npm run build` + backend `npm run build`
- re-run backend integration suite against the new PG
- Lighthouse + Axe pass on the deployed origin
- `eas build` for the new mobile binary (bundle `ly.tadmora.mobile` is a
  NEW store identity — the old listing stays with the old product)

### D. Credential hygiene (recommended)
The GitHub PAT used for the transfer was shared in chat. After confirming
everything landed: **revoke/rotate it** (github.com/settings/tokens) —
the repo state no longer needs it.

## Local artifacts on this machine (if resuming here)

- `/home/z/tadmora-work/madarek.git` — the mirror clone (source of the push)
- `/home/z/tadmora-work/Tadmora` — the working clone (branch
  `rebrand/tadmora-foundation`, clean tree, origin set WITHOUT credentials)
- `/home/z/.tadmora-creds/gh_token` — the PAT, mode 600 (rotate & delete)

## Source-repo integrity statement

`ahmadmedo1012/madarek` was treated as READ-ONLY end-to-end: cloned with
`--mirror`, never pushed to (the first token physically could not), never
modified. All work happened in the new private `Tadmora` repository.
