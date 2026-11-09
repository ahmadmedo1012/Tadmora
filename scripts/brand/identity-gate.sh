#!/usr/bin/env bash
#
# scripts/brand/identity-gate.sh — the TADMORA identity gate (rebrand Phase 8).
#
# FAILS the build if any OLD-IDENTITY string survives on the PRODUCT
# surface (code, configs, docs that describe the current product, tests,
# CI). Historical engineering records are WHITELISTED — they document the
# product's Madarek era verbatim and must never be rewritten:
#
#   docs/archive/**          archived planning docs (superseded banners intact)
#   docs/redesign/**         the r3xx revision engineering logs
#   docs/history/**          the worklog and historical accounts
#   docs/releases/**         historical release notes
#   docs/screenshots/**      evidence captures of past revisions
#   docs/rebrand-tadmora/**  the rebrand's own mapping/audit documents
#   docs/brand/**            the brand bible (references the retired mark)
#   docs/legal/**            the third-party rights audit (historical names)
#   scripts/conformance/results/**  visual-conformance evidence artifacts
#   CHANGELOG.md             the project's historical changelog
#
# Usage:  bash scripts/brand/identity-gate.sh   (exit 0 = clean, 1 = leaks)
#
set -euo pipefail
cd "$(dirname "$0")/../.."

PATTERNS=(
  'madarek'         # the old Latin name, any case (-i)
  'مدارك'           # the old Arabic name
  'mdrk'            # the old short-code prefix (cookies/keys/CSS)
  'Madarek'
  'MADAREK'
  'afc4265f'        # the RETIRED EAS project id — must never return
)

# NOTE: 'mdrk' also appears inside 'madarek'? No — m-d-r-k vs m-a-d-a-r-e-k
# are disjoint; both are listed for clarity and belt-and-braces.

WHITELIST=(
  -g '!.git/**'
  -g '!node_modules/**'
  -g '!**/node_modules/**'
  -g '!CHANGELOG.md'
  -g '!docs/archive/**'
  -g '!docs/redesign/**'
  -g '!docs/history/**'
  -g '!docs/releases/**'
  -g '!docs/screenshots/**'
  -g '!docs/rebrand-tadmora/**'
  -g '!docs/brand/**'
  -g '!docs/legal/**'
  -g '!scripts/conformance/results/**'
  -g '!package-lock.json'
  -g '!**/package-lock.json'
  -g '!*.woff2' -g '!*.png' -g '!*.jpg' -g '!*.jpeg' -g '!*.webp'
  -g '!*.ttf' -g '!*.otf' -g '!*.ico' -g '!*.icns' -g '!*.pdf'
  -g '!frontend/dist/**'
  -g '!scripts/brand/identity-gate.sh'  # this gate necessarily spells its patterns
)

leaks=0
for pat in "${PATTERNS[@]}"; do
  # -i covers madarek/Madarek/MADAREK at once; harmless for the others.
  hits=$(rg -il --no-messages --max-filesize 5M "${WHITELIST[@]}" "$pat" . || true)
  if [ -n "$hits" ]; then
    echo "✖ IDENTITY LEAK — pattern '$pat' found on the product surface:"
    echo "$hits" | sed 's/^/    /'
    leaks=$((leaks + 1))
  else
    echo "✔ clean — no '$pat' outside the historical whitelist"
  fi
done

if [ "$leaks" -gt 0 ]; then
  echo
  echo "identity-gate: ${leaks} old-identity pattern(s) leaked. Fix them or extend"
  echo "the whitelist WITH a justification in this script's header."
  exit 1
fi

echo
echo "identity-gate: PASS — the product surface is 100% TADMORA."
