# RELEASE — how Ulara ships (web + app, one repo, one branch)

> R326 M0.6. One branch (`main`), one project. Every change lands on main
> in small verified commits; automation decides what deploys where.

## What triggers what

| You push to `main`… | Vercel (web) | GitHub Actions | EAS |
|---|---|---|---|
| `backend/**` | ✅ deploys (**Deploy** workflow when its secrets are set — otherwise the manual `vercel deploy` path) | CI + **deploy-smoke** (waits for buildId == SHA, then health + 3 logins + dashboard + live-vs-committed OpenAPI additive check; failure opens an issue) | — |
| `frontend/**`, `shared/**` (web side) | ✅ deploys (same as above) | CI | — (unless `apps/mobile/**`/`shared/**` also changed → see below) |
| `apps/mobile/**` or `shared/**` | ❌ never (`.vercelignore` excludes the app) | **Mobile** workflow: gates (typecheck · expo lint · contract-check · `expo export` android+ios · bundle ≤ 8 MB) · **Android APK** workflow (below) | **EAS Update** (`--auto`) to `production` **and** `preview` branches — reaches every installed build whose runtime fingerprint matches. **Currently DORMANT:** the job skips with a notice until the OTA owner steps (§OTA re-activation) are done |
| …and the change is **native-affecting** (`apps/mobile/package.json`/lock, `app.config.ts`, `eas.json`, `assets/`, or `shared/` brand assets) | ❌ | same gates + a fresh direct APK | + **EAS Build** preview profile (internal APK + iOS simulator), `--no-wait`, links in the run summary |
| `docs/**`, `audits/**`, `*.md` | ❌ | CI only | — |

Channels: `development` (dev-client) · `preview` (internal APK/simulator) ·
`production` (store). `runtimeVersion` policy = **fingerprint** — any
native dependency/plugin/config change silently produces a new fingerprint:
OTA updates then wait for the matching build (the workflow queues it
automatically).

## Neon cold start (free tier)

The web service is always-on on Vercel; the database is Neon free tier —
it scales compute to zero after idle. The first request after a pause
pays a sub-second wake (the migrate-deploy script already retries until
Neon is warm). Nothing to keep warm on the web side since the move to
Vercel.

## The direct Android channel (Phase Ω — android-apk.yml)

A REAL, signed, installable release APK — built on GitHub's own runners
(no EAS quota, no external account) and published to the rolling
**`latest`** GitHub Release. Two URLs, both always the newest build:

- `https://github.com/ahmadmedo1012/ulara/releases/latest/download/ulara.apk`
- `https://github.com/ahmadmedo1012/ulara/releases/download/latest/ulara.apk`

- **Recipe:** the repo's own `scripts/build-android-local.sh`
  (expo prebuild → key.properties + release signingConfig patch →
  `gradlew assembleRelease`) driven with repository-secret credentials.
- **Signing key:** a dedicated direct-channel keystore, stored as the
  Actions secrets `ANDROID_KEYSTORE_B64` · `ANDROID_KEYSTORE_PASSWORD` ·
  `ANDROID_KEY_ALIAS` · `ANDROID_KEY_PASSWORD`. It is deliberately
  SEPARATE from any future Play upload key (that one stays in EAS
  credentials). The stable signature means each new APK installs as an
  **update** over previous direct installs — no uninstall/reinstall.
- **Rebuild cadence:** every push touching `apps/mobile/**` or
  `shared/**` (JS changes ship a new APK too — the bundle is embedded),
  plus manual dispatch.
- **If the direct-channel key is ever lost:** a new keystore means a new
  direct-channel identity — direct installs would need one
  uninstall/reinstall. The Play channel is unaffected (separate key).
- The `/app` distribution page links the stable URL and stays the
  app-facing source (the backend serves it as `updateUrl`).

## The one-time setup that is already done

- `.vercelignore` pins the Vercel upload context to the web surface
  (backend + frontend + api adapter); mobile/docs never ship with it.
- **Deploy automation (deploy.yml):** the three repository secrets
  (`VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID`) are set and the
  workflow deploys on every `backend/**` push (evidence: Deploy run #2 at
  `be2b859` → production deployment `dpl_8fyR`, 2026-11-11).
- `app.config.ts` carries `runtimeVersion: { policy: "fingerprint" }` +
  `checkAutomatically: ON_LOAD` — the OTA client wiring is complete and
  tested; only the project id + token are pending (next section).

## OTA re-activation — honest status + the owner runbook

**Status (evidence, 2026-11-11):** the OTA channel is WIRED but DORMANT.
The `eas-ota` job in mobile.yml is fully automated, but its credential
gate reports `EXPO_TOKEN is not configured — OTA publish skipped` (Mobile
run #6 at `be2b859`), and `app.config.ts` `updates.url` /
`extra.eas.projectId` are the zero placeholder `00000000-…` because the
NEW EAS project has not been created yet (`eas init` pending). Nothing
publishes until both are done — that is why §"In-app update UX" below is
described as pending on the `/app` page.

**The owner runbook (two steps, ~5 minutes):**

1. **Create the EAS project:** from `apps/mobile` run
   `npx eas-cli init` (sign in with the Expo account that will own the
   app; answer "yes" to creating a new project). It writes the REAL
   project id into `app.config.ts` (`extra.eas.projectId` + `updates.url`)
   — commit that change and push. (Fingerprint policy means the first
   publish afterwards arms the channel for every future build of that
   fingerprint.)
2. **Set the token:** expo.dev → the account → Settings → Access tokens →
   Create (robot-style, no expiry or long), then repo → Settings →
   Secrets and variables → Actions → `EXPO_TOKEN` = the token value.
   The next push touching `apps/mobile/**` publishes the first OTA
   update automatically (mobile.yml `eas-ota`, `--auto`).

**The stranded-install truth (say it plainly):** installs built from the
OLD EAS project (the retired project slug, runtime `6288933f…`, last OTA
`b8ee635b…` @ `bcd7b736`, 2026-11-07) can never receive updates from the
NEW project — different project, and the changed `projectId` produces a
new fingerprint. Their upgrade path is the direct APK from `/app`:
Android refuses cross-signature in-place updates, so the ONE-TIME move
from an EAS-signed build to the direct channel needs a single
uninstall + reinstall. Direct→direct updates after that are in-place
(stable key). The `MIN_APP_VERSION` floor (§the min-version gate) stays
the hard catch-all for any straggler.

## R327 D2/D3 — the store-prep state of the world

**The fingerprint moved twice in R327** (C4 removed react-native-reanimated
+ worklets from the tree; C5 flipped `experiments.reactCompiler` on).
Every build before those commits is on a stale runtime fingerprint and can
never receive the current OTA updates — which is fine, none shipped. The
Mobile workflow queues fresh preview builds automatically on every
native-affecting push (see the table above), so the pipeline re-arms
itself the moment its gates are green.

**Pipeline health note (D2/Z14, honest history):** the Mobile workflow was
red from B1 through C5 (~12 runs) — `build-app-icons.mjs` resolved `sharp`
from an ambient `node_modules` that only existed in the dev sandbox, so
CI's icons gate died on every run, and because `eas-ota`/`eas-build`
declare `needs: mobile-gates`, **no OTA update and no build has actually
published since B1**. Fixed in `f242bb78` (sharp now resolves from
`apps/mobile`, and the committed favicon — which the ambient sharp had
generated — was regenerated byte-honest with the pinned toolchain).

### Android keystore (owner key, documented)

- EAS **auto-generates and stores** an upload keystore on the account's
  first `production` Android build if none exists
  (expo.dev → the NEW EAS project → Credentials → Android).
  This is the STORE key only — the direct APK channel signs with its own
  dedicated key (see §the direct Android channel above).
- **Back it up once** after that first build: Credentials → the keystore →
  download the `.jks` + note its passwords somewhere safe (password
  manager). A lost keystore means a new app identity on Play (a new
  listing) — Google does not reset upload keys for new accounts easily.
- To use an **own** keystore instead: `eas credentials -p android` →
  "Set up a new keystore" → upload the `.jks`. Either way, `eas submit`
  uses whatever is stored in EAS credentials.
- Play upload key rotation (if ever needed): Play Console → Setup →
  App signing — Google's own key handles store signing; the EAS keystore
  is only the upload key.

### iOS — everything that is already done (no Apple account needed)

- Bundle ID `ly.ulara.app`, display name «أُلارا», RTL +
  Arabic localization keys, `ITSAppUsesNonExemptEncryption: false`
  (the standard education-app exemption declaration).
- The Face ID usage prompt is **Arabic** (D3): the app-lock's permission
  string rides the `expo-local-authentication` plugin config.
- Android side: `USE_BIOMETRIC` rides the same plugin; the notification
  icon + orange status-bar tint ride `expo-notifications`' plugin config.
- Icons/splash: all 8 assets byte-verified against the one mark in CI
  (`tokens:check` → `icons:check 8/8`).
- Build numbers: `autoIncrement` on both profiles (EAS tracks them).

### iOS — the owner's Apple checklist (when the account exists)

1. Enroll in Apple Developer (the $99/yr membership).
2. EAS credentials, either path:
   - `npx eas credentials -p ios` and sign in with Apple, or
   - expo.dev → project → Credentials → App Store Connect API key
     (`ASC_KEY_ID` / `ASC_ISSUER_ID` / `ASC_KEY_CONTENT` as EAS secrets).
3. First iOS device build: `npx eas build --profile production --platform
   ios` (EAS generates the distribution certificate + provisioning
   profile, or uses "Let EAS manage" for everything).
4. TestFlight: `npx eas submit --platform ios --profile production`
   (needs the ASC API key from step 2).
5. App Store privacy questionnaire (owner answers in App Store Connect —
   the app posts crash telemetry to its own backend and uses Face ID /
   notifications; no third-party analytics).

## Owner-only steps (things automation cannot do)

1. **Rotate the GitHub PAT + Expo token if they were ever exposed** (both
   were pasted in chat during R326 setup):
   - PAT: github.com → Settings → Developer settings → Fine-grained tokens.
   - Expo: expo.dev → the account that will own the NEW project (§OTA
     re-activation) → Settings → Access tokens → then update the
     `EXPO_TOKEN` Actions secret.
2. **Apple side (iOS)**: no Apple Developer account is linked yet. To ship
   TestFlight/App Store the owner must provide an **Apple team id** + an
   **App Store Connect API key** (`eas credentials` → sign in with Apple;
   or set `ASC_KEY_ID`/`ASC_ISSUER_ID`/`ASC_KEY_CONTENT` as EAS secrets —
   expo.dev → project → Credentials). Until then iOS ships simulator
   builds (preview profile) only. `eas device:create` registers ad-hoc
   devices if internal distribution is preferred.
3. **Store submission (Android)**: `npx eas submit --platform android
   --profile production` needs the Play service-account JSON uploaded to
   EAS credentials (one-time, expo.dev → Credentials → Google Play).
4. **Device-matrix pass after the reactCompiler flip (C5)**: install the
   fresh preview APK (the workflow's run summary links it) on real
   Android hardware and walk the five roles. Anything fatal → flip
   `experiments.reactCompiler` back to `false` in `apps/mobile/app.config.ts`
   and push — that is the entire rollback.

## Manual commands (the owner's release console)

```bash
# see what's live
npx eas-cli update:list --branch production
npx eas-cli channel:view production

# roll BACK a bad OTA (users get the previous update on next launch)
npx eas-cli update:republish --branch production <update-id-of-the-good-one>
# or hard-rollback (marks everything after a point as rolled back):
npx eas-cli update:rollback --branch production

# force a store build now (native change or a release)
npx eas-cli build --profile production --platform android --non-interactive
npx eas-cli build --profile preview   --platform all --non-interactive --no-wait

# bump the minimum app version (blocks outdated installs with a blocking
# «يلزم تحديث التطبيق» screen):
#   vercel.com → ulara → Settings → Environment Variables →
#   MIN_APP_VERSION=1.1.0 (+ optional APP_DOWNLOAD_URL). The app reads
#   /api/v1/status minAppVersion on cold start.
```

## Storage & file transfer — the honest limits (Ω+2.0)

**Verified live (2026-11-11):** Vercel Functions cap any request/response
body at **4.5 MB** — a 5 MB POST to the deployed API dies at the platform
edge with an opaque 413 before the app sees a byte. The platform wall
applies to BOTH directions (upload bodies and download responses).

The product's PDF cap is therefore **host-honest** (`lib/pdf-limits.ts`):
**4 MiB on Vercel** (a deliberate margin under the wall so the APP's
Arabic 413 envelope answers, never the platform's opaque error) and the
full **20 MiB product cap on self-hosted deployments**. The effective
number is advertised at `GET /api/v1/status` → `data.maxPdfUploadBytes`,
and all three clients enforce the same value (web `pdfUpload.ts` derives
it from the same-origin host; mobile `api/pdf.ts` from its API base;
backend from the Vercel runtime detection). Serving mirrors the guard: a
plain GET of a stored file larger than the host ceiling answers the
honest Arabic 413 pointing at the in-app viewer (which ranges
automatically); RANGE requests keep slicing under the wall.

- Video (lectures) already rides the architecture-compatible path:
  presigned direct-to-S3 uploads (`POST /uploads/presign`, SigV4 +
  multipart, `storage-presign.ts`) that never pass a video byte through
  a function. It requires `STORAGE_DRIVER=s3` + the `S3_*` vars; with
  the current `postgres` driver the presign route refuses honestly
  (501).
- **Unlocking 20 MiB+ PDFs on Vercel** (owner action, ~10 min): set the
  `S3_*` vars + `STORAGE_DRIVER=s3` in the Vercel project env (an
  S3-compatible bucket — R2/MinIO/AWS), then extend the presigned flow
  to the PDF namespaces (planned Ω+2.7 work: uploads PUT directly to
  the store, downloads via short-lived signed GETs, functions only
  mint/verify). Until then every surface tells the 4 MiB truth.

## Backup & restore — the drill record

The DB backup path is a first-class release surface: `npm run db:backup` →
`db:restore` → `db:verify` (scripts/db-*.mjs, the runbook canon in
docs/12-deployment §2–3). Every drill gets a fill-in entry in
**docs/runbooks/restore-exercise-log.md** — six entries to date: two local
(r167/r169), one from real production (r183, Neon source), a re-run on r187,
an r189 secrets-rotation round, and **r327 P4e** (2026-10-31, the latest
full pass: backup 294 KB / 241 ms → restore into a scratch DB / 379 ms →
`db:verify` PASS (90 tables, 30 migrations, 42 users) → per-table row
counts identical one-to-one (1059 rows, empty diff) → live second backend
on the restored DB (health + login + dashboard 200) → scratch DB dropped.
Raw evidence: `audits/evidence/r327/p4/backup/`).

The one remaining owner act, unchanged since r183: **move dump files
off-site** (backups/ is gitignored — a dump on the same box as the DB is
not a backup). Live-DB restore is refused by default
(`--confirm-live-restore` is the conscious emergency override).

## The min-version gate

`GET /api/v1/status` → `{ minAppVersion, updateUrl }`. The native app
compares semver on cold start + foreground: below `minAppVersion` → the
blocking update screen with the `/app` download link. Unset → no gate.

## Distribution page

`/app` on the website: the direct APK (the rolling `latest` GitHub
Release — one URL, always the newest build), the releases page (history
+ checksums), «ما الجديد», iOS status. Link lives in the landing footer
+ help; the backend serves this page as `updateUrl` in `/api/v1/status`.

## In-app update UX

Cold start + foreground: `expo-updates` checks silently (ON_LOAD) →
downloads → toast «تحديث جاهز — أعد التشغيل» → reload. The feedback
payload and `/client-errors` telemetry carry the running `updateId`, so
the owner inbox shows exactly which OTA a crash came from.

**Dormant until the OTA re-activation steps above are done** — the code
path is complete and the `/app` page says «قيد التفعيل» in Arabic; the
first `eas update` after activation is what turns this section live.
