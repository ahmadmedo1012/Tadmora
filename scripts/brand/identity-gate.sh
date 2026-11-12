#!/usr/bin/env bash
#
# scripts/brand/identity-gate.sh — identity-gate v2 (the ULARA total
# takeover, spec §3 — docs/ops/ULARA-CODEMOD-SPEC.md).
#
# FAILS the build if any RETIRED-IDENTITY string survives on the PRODUCT
# surface (code, configs, active docs, tests, CI). Historical engineering
# records stay WHITELISTED — they document the product's retired eras
# (Madarek, then the pre-ULARA name) verbatim and must never be rewritten.
#
# Patterns (case-insensitive): the retired pre-ULARA identity — its Latin
# name, its Arabic name, its short-code prefix — PLUS the older retired
# Madarek identity, which may never return either:
#   tadmora · تادمورا · tdmr · madarek · مدارك · mdrk · afc4265f
#
# WHITELIST (each seat with its justification):
#   docs/archive|redesign|history|releases|screenshots/**
#                             archived planning docs, r3xx engineering
#                             logs, worklogs, release notes, evidence
#                             captures — history, not surface
#   docs/rebrand-tadmora/**   the FIRST rebrand's own mapping/audit docs
#   docs/brand/**             the brand bible (documents retired marks)
#   docs/legal/**             the third-party rights audit (historical)
#   docs/ops/**               the ops ledger + takeover spec — the
#                             append-only record (old names quoted there
#                             are records, not leaks)
#   CHANGELOG.md              the project's historical changelog
#   scripts/scorecard.mjs     its no-trace row SPELLS the patterns it
#                             measures; instrumentation, not surface
#   scripts/conformance/results/**   visual-conformance evidence artifacts
#   backend/prisma/migrations/**     immutable migration history — data
#                             values quote old names; editing would break
#                             checksums (spec §1.7)
#   lockfiles                 regenerated clean; belt-and-braces
#   binaries (fonts/images)   never textual identity
#   frontend/dist/**          build output (never committed decisions)
#   scripts/brand/identity-gate.sh + logo-gate.sh
#                             the gate scripts themselves spell the
#                             patterns/signatures they enforce
#
# DELIBERATE TRANSITION/DATA SEATS (documented, each with its reason):
#   backend/src/http/routes/auth.routes.ts :: 'tdmr_refresh'
#                             the LEGACY_REFRESH_COOKIE read-only fallback
#                             of the spec §1.2 dual-read transition (login
#                             sets only ulara_refresh; refresh reads the
#                             new name first, falls back to the retired
#                             one; logout clears both) — the LITERAL is
#                             sanctioned, any other old-name match in
#                             that file still fails
#   backend/prisma/seed.ts · seed-pilot.ts · seed-demo-r330.ts ·
#   backend/src/http/routes/users.routes.ts ·
#   backend/src/modules/users/demo-cohort.ts ·
#   backend/src/lib/zu-sync/static-source.ts :: '@demo.tadmora.ly'
#                             the demo email DOMAIN is DATA, not brand:
#                             the seeded demo cohort's real User rows
#                             carry @demo.tadmora.ly addresses and the
#                             registrar-sweep deletes them by a WHERE
#                             email-domain key — renaming the domain
#                             would orphan those rows (only the literal
#                             is sanctioned; brand copy in the same
#                             files still fails)
#   apps/mobile storage-shim homes (session/rtl/biometric/haptics/
#   theme/numerals/queue/query-cache/persistence + the cookie fallback
#   senders): the spec §1.1/§1.2 LEGACY_* read-only fallback literals —
#                             the same one-time-migration class as the
#                             web's lib/legacy-storage.ts (read new
#                             first, adopt the retired row once, never
#                             write it again); these are storage modules
#                             whose remaining old-name content is exactly
#                             that fallback class
#
# Usage:  bash scripts/brand/identity-gate.sh   (exit 0 = clean, 1 = leaks)
#
set -euo pipefail
cd "$(dirname "$0")/../.."

PATTERNS=(
  'tadmora'         # the retired Latin name, any case (-i)
  'تادمورا'          # the retired Arabic name
  'tdmr'            # the retired short-code prefix (cookies/keys/CSS/DOM ids)
  'madarek'         # the older retired identity — may never return either
  'مدارك'            #   its Arabic name
  'mdrk'            #   its short-code prefix
  'afc4265f'        # the RETIRED EAS project id — must never return
)

WHITELIST=(
  -g '!.git/**'
  -g '!node_modules/**'
  -g '!**/node_modules/**'
  # historical engineering records
  -g '!CHANGELOG.md'
  -g '!docs/archive/**'
  -g '!docs/redesign/**'
  -g '!docs/history/**'
  -g '!docs/releases/**'
  -g '!docs/screenshots/**'
  -g '!docs/rebrand-tadmora/**'
  -g '!docs/brand/**'
  -g '!docs/legal/**'
  -g '!docs/ops/**'
  -g '!scripts/scorecard.mjs'
  # one-shot measurement harnesses from the r325/r329–r332 rounds —
  # instrumentation quoting the retired name in evidence/probe strings
  # (the same class as scorecard.mjs); superseded by scripts/conformance/
  # the SpeckKit planning specs (rounds 001–012) — historical engineering
  # records of past work packages, same class as docs/history
  -g '!specs/**'
  -g '!scripts/r325/**'
  -g '!scripts/twin/**'
  -g '!scripts/fidelity/**'
  -g '!scripts/conformance/results/**'
  # immutable migration history (spec §1.7)
  -g '!backend/prisma/migrations/**'
  # lockfiles (regenerated clean; belt-and-braces)
  -g '!package-lock.json'
  -g '!**/package-lock.json'
  -g '!**/yarn.lock'
  -g '!**/pnpm-lock.yaml'
  # binaries
  -g '!*.woff2' -g '!*.png' -g '!*.jpg' -g '!*.jpeg' -g '!*.webp'
  -g '!*.ttf' -g '!*.otf' -g '!*.ico' -g '!*.icns' -g '!*.pdf'
  # build output
  -g '!frontend/dist/**'
  # the gate scripts themselves
  -g '!scripts/brand/identity-gate.sh'
  -g '!scripts/brand/logo-gate.sh'
  # apps/mobile LEGACY_* storage-shim homes (spec §1.1/§1.2 transition
  # class — see the header): storage modules whose old-name content is
  # exactly the read-only fallback literals
  -g '!apps/mobile/src/auth/session.ts'          # session + the SecureStore/AsyncStorage key family
  -g '!apps/mobile/src/lib/rtl.ts'               # the rtl applied flag
  -g '!apps/mobile/src/lib/biometric.tsx'        # the biometric-lock flag
  -g '!apps/mobile/src/haptics.ts'               # the haptics-enabled flag
  -g '!apps/mobile/src/design/theme.tsx'         # the theme store key
  -g '!apps/mobile/src/lib/format.ts'            # the numerals preference key
  -g '!apps/mobile/src/lib/resilience/queue.ts'  # the exam answer-queue key
  -g '!apps/mobile/src/lib/resilience/persistence.ts'  # the query-cache key
  -g '!apps/mobile/src/api/client.ts'            # the refresh-cookie fallback capture
  -g '!apps/mobile/src/features/ai/stream.ts'    # sends the same refresh cookie
)

# LITERAL seats — "<file>::<sanctioned literal>": the file may carry the
# literal (a documented transition fallback or a data key on real rows);
# EVERY OTHER old-name match in the same file still fails.
LITERAL_SEATS=(
  'backend/src/http/routes/auth.routes.ts::tdmr_refresh'
  'backend/prisma/seed.ts::demo.tadmora.ly'
  'backend/prisma/seed-pilot.ts::demo.tadmora.ly'
  'backend/prisma/seed-demo-r330.ts::demo.tadmora.ly'
  'backend/src/http/routes/users.routes.ts::demo.tadmora.ly'
  'backend/src/modules/users/demo-cohort.ts::demo.tadmora.ly'
  'backend/src/lib/zu-sync/static-source.ts::demo.tadmora.ly'
)

# Does <file> match <pattern> anywhere OUTSIDE its sanctioned literal?
# (empty output = the file is clean for this pattern)
seat_violations() {
  local file="$1" pat="$2" literal="$3"
  rg -i --no-messages --max-filesize 5M "$pat" "$file" 2>/dev/null \
    | rg -viF "$literal" 2>/dev/null \
    || true
}

leaks=0
for pat in "${PATTERNS[@]}"; do
  hits=$(rg -il --no-messages --max-filesize 5M "${WHITELIST[@]}" "$pat" . || true)
  # apply the literal seats: a seat file passes THIS pattern iff its only
  # matches are the sanctioned literal
  for seat in "${LITERAL_SEATS[@]}"; do
    file="${seat%%::*}"
    literal="${seat##*::}"
    if [ -n "$hits" ] && printf '%s\n' "$hits" | grep -qxF "./$file"; then
      if [ -z "$(seat_violations "$file" "$pat" "$literal")" ]; then
        hits=$(printf '%s\n' "$hits" | grep -vxF "./$file" || true)
      fi
    fi
  done
  if [ -n "$hits" ]; then
    echo "✖ IDENTITY LEAK — pattern '$pat' found on the product surface:"
    echo "$hits" | sed 's/^/    /'
    leaks=$((leaks + 1))
  else
    echo "✔ clean — no '$pat' outside the historical whitelist + documented seats"
  fi
done

if [ "$leaks" -gt 0 ]; then
  echo
  echo "identity-gate: ${leaks} retired-identity pattern(s) leaked. Fix them or extend"
  echo "the whitelist WITH a justification in this script's header."
  exit 1
fi

echo
echo "identity-gate: PASS — the product surface is 100% ULARA."
