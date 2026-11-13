#!/usr/bin/env bash
#
# scripts/brand/zero-trace.sh — the ZERO-TRACE gate (2026-11-13).
#
# The retired identities may not exist ANYWHERE in the repository: not in
# file CONTENT, not in file/dir NAMES, not in the git LOG (authors,
# messages, tags). Deletion — never whitelisting — is the policy; this
# gate is the enforcement (CI-mandatory).
#
# Patterns (case-insensitive), the complete retired families:
#   tadmora · تادمورا · تدمر · tdmr        the pre-ULARA product identity
#   madarek · مدارك · mdrk                 the older retired identity
#   heron                                   the retired third-party reference
#   zawia · الزاوية · alandalus · الأندلس · andalus   retired real institutions
#   onrender · render.com                   the retired host
#
# THE ONE documented exclusion (proven, not whitewashing):
#   Lockfile `"integrity"` lines — a base64 SHA-512 digest is content-
#   derived random bytes; the official npm registry digest for
#   shebang-command@2.0.0 contains the 4-char coincidence (verified:
#   `npm view shebang-command@2.0.0 dist.integrity` returns the exact
#   string). The digest is not a name anyone chose; only integrity
#   LINES are skipped — every other line of the same lockfiles is
#   scanned.
#
# Companion: the DATABASE side of the gate rides the post-deploy smoke
# (every text column of every table + _prisma_migrations.migration_name)
# — see .github/workflows/deploy-smoke.yml.
#
# Usage:  bash scripts/brand/zero-trace.sh   (exit 0 = zero trace, 1 = leak)
#
set -euo pipefail
cd "$(dirname "$0")/../.."

PATTERNS='tadmora|تادمورا|تدمر|tdmr|madarek|مدارك|mdrk|heron|zawia|الزاوية|alandalus|الأندلس|andalus|onrender|render\.com'

# A file is clean iff no pattern matches its content; lockfiles are
# scanned WITHOUT their integrity lines (see the header).
content_leak() {
  local f="$1"
  if [[ "$f" == package-lock.json || "$f" == */package-lock.json ]]; then
    grep -viE '^\s*"integrity":' "$f" | grep -qiE "$PATTERNS" && return 0
    return 1
  fi
  grep -qiE "$PATTERNS" "$f" && return 0
  return 1
}

leaks=0

# ── 1. file CONTENT ─────────────────────────────────────────────────
mapfile -t candidates < <(git grep -IilE "$PATTERNS" -- . 2>/dev/null || true)
content_hits=()
for f in "${candidates[@]}"; do
  content_leak "$f" && content_hits+=("$f")
done
if [ ${#content_hits[@]} -gt 0 ]; then
  echo "✖ ZERO-TRACE LEAK — retired names in file content:"
  printf '    %s\n' "${content_hits[@]}"
  leaks=$((leaks + 1))
else
  echo "✔ content clean — no retired name in any tracked file"
fi

# ── 2. file/dir NAMES ───────────────────────────────────────────────
name_hits=$(git ls-files | grep -iE 'tadmora|madarek|heron|tdmr|zawia|alandalus' || true)
if [ -n "$name_hits" ]; then
  echo "✖ ZERO-TRACE LEAK — retired names in file/dir names:"
  echo "$name_hits" | sed 's/^/    /'
  leaks=$((leaks + 1))
else
  echo "✔ names clean — no retired name in any tracked path"
fi

# ── 3. git LOG (authors · messages · tags) ──────────────────────────
log_hits=$(git log --all --format='%an|%ae|%s' 2>/dev/null | grep -iE "$PATTERNS" || true)
tag_hits=$(git tag --points-at HEAD 2>/dev/null | grep -iE "$PATTERNS" || true)
if [ -n "$log_hits" ] || [ -n "$tag_hits" ]; then
  echo "✖ ZERO-TRACE LEAK — retired names in the git history:"
  [ -n "$log_hits" ] && echo "$log_hits" | head -10 | sed 's/^/    /'
  [ -n "$tag_hits" ] && echo "$tag_hits" | sed 's/^/    /'
  leaks=$((leaks + 1))
else
  echo "✔ history clean — no retired name in any author, message or tag"
fi

if [ "$leaks" -gt 0 ]; then
  echo
  echo "zero-trace: FAIL — delete the trace (whitelisting is retired with the eras)."
  exit 1
fi

echo
echo "zero-trace: PASS — the tree carries zero retired-identity trace."
