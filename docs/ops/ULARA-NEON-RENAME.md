# Neon project rename — exact owner instructions

The takeover directive asks for the Neon project display name
`tadmora-production` → `ulara-production`. The Neon API
(api.neon.tech) is not resolvable from the execution sandbox (verified
repeatedly across the session), so this cosmetic rename could not be
executed remotely. It changes NO connection string, branch, endpoint,
role, or data — only the project's display name.

## Option A — Console (30 seconds)
1. Open https://console.neon.tech → the project currently named
   `tadmora-production` (org ahmadmedo1012's account, region
   eu-central-1, PostgreSQL 16, the `neondb` database).
2. Project Settings (the ⚙ on the project card or the project's
   Settings tab) → rename → `ulara-production` → Save.

## Option B — API (one call, if you have any machine with normal DNS)
```bash
curl -X PATCH https://api.neon.tech/api/v2/projects/<PROJECT_ID> \
  -H "Authorization: Bearer <NEON_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"name": "ulara-production"}'
```
Find `<PROJECT_ID>` in the console URL or: `curl -H "Authorization:
Bearer <NEON_API_KEY>" https://api.neon.tech/api/v2/projects`.

## What must NOT change (verified state to preserve)
- Project ID, branch IDs (main + development), endpoints
  (ep-icy-mode-b9d573ot + its -pooler), the `neondb` database, roles,
  all 32 applied migrations, all user + academic records.
- The Vercel env DATABASE_URLs (pooled + direct) — a rename does not
  touch them; if Neon ever shows new connection strings after the
  rename, they are cosmetic aliases — the existing URLs keep working.
