#!/usr/bin/env bash
# logo-gate.sh — ULARA Ω 1-C: the single-source-of-truth logo gate.
#
# The mark's geometry (the Tadmora gateway arch + keystone, mark.ts) is
# ONE authored source per platform, with generated twins and documented
# re-staters. Any HAND-COPIED arch path or mark-constant import outside
# the sanctioned seats = a competing logo = CI failure. This gate pins
# the state the 1-C audit measured (zero unsanctioned copies) so a new
# one can never land silently.
#
# Sanctioned seats for the ARCH PATH SIGNATURE ('A8 8 0 0 1 24 15' —
# the arch sweep, distinctive enough to catch copies in either spacing
# variant; the full path is 'M8 27L8 15A8 8 0 0 1 24 15L24 27Z'):
#   · frontend/src/brand/            the web source (mark.ts) + renderers
#   · apps/mobile/src/brand/         the RN port (generated, tokens:check-pinned)
#   · scripts/r323/brand-assets.mjs  the documented static-twin re-stater
#   · frontend/public/brand/ + favicon.svg   generated twins (brand-assets.mjs)
#   · shared/brand/                  the ONE shared svg (build-app-icons.mjs,
#                                     byte-identical drift check via icons:check)
#   · frontend/tests/                the pin tests (r323-brand-system.test.ts)
#   · frontend/dist/                 build output (never committed decisions)
#
# Sanctioned importers of the MARK_* constants (MARK_ARCH_PATH /
# MARK_KEYSTONE / MARK_VIEWBOX / lockups):
#   · frontend/src/brand/**          the system itself
#   · frontend/src/pages/BrandPage.tsx   the /__brand spec sheet — it renders
#     the CONSTRUCTION DRAWING from the constants (consuming, not copying)
#   · frontend/tests/** · apps/mobile/src/brand/**   the pins + the port
#
# Prose (docs/**, *.md) is exempt: documentation quoting the path is not a
# renderable duplication. Generated icon PNGs are binary (never match).
set -uo pipefail
# scripts/brand/logo-gate.sh → repo root is TWO levels up (unlike the
# scripts/*.sh siblings, whose one-level ".." idiom does not apply here).
cd "$(dirname "$0")/../.."

FAIL=0
step() { printf '\n▶ %s\n' "$1"; }
ok()   { printf '✓ %s\n' "$1"; }
bad()  { printf '✗ %s\n' "$1"; FAIL=1; }

# ── 1. the arch path signature ────────────────────────────────────────────
step "arch path signature outside sanctioned seats"
SIG='A8 8 0 0 1 24 15'
VIOL=$(
  grep -rlF "$SIG" \
    --include='*.ts' --include='*.tsx' --include='*.mjs' --include='*.js' \
    --include='*.svg' --include='*.html' --include='*.css' --include='*.json' \
    frontend apps scripts shared 2>/dev/null \
  | grep -v '^frontend/dist/' \
  | grep -v '^frontend/public/brand/' \
  | grep -v '^frontend/public/favicon.svg' \
  | grep -v '^frontend/src/brand/' \
  | grep -v '^frontend/tests/' \
  | grep -v '^apps/mobile/src/brand/' \
  | grep -v '^scripts/r323/brand-assets.mjs' \
  | grep -v '^shared/brand/' \
  | grep -v 'node_modules' \
  || true
)
if [ -n "$VIOL" ]; then
  bad "the arch path signature appears in unsanctioned files (hand-copied logo?):"
  printf '    %s\n' $VIOL
else
  ok "no hand-copied arch path outside the sanctioned seats"
fi

# ── 2. the mark constants import discipline ───────────────────────────────
step "MARK_* constant consumers outside the brand system"
CONSTViol=$(
  grep -rlE 'MARK_ARCH_PATH|MARK_KEYSTONE|MARK_VIEWBOX' \
    --include='*.ts' --include='*.tsx' \
    frontend/src apps/mobile/src apps/mobile/app 2>/dev/null \
  | grep -v '^frontend/src/brand/' \
  | grep -v '^frontend/src/pages/BrandPage.tsx' \
  | grep -v '^frontend/tests/' \
  | grep -v '^apps/mobile/src/brand/' \
  | grep -v 'node_modules' \
  || true
)
if [ -n "$CONSTViol" ]; then
  bad "MARK_* constants consumed outside the sanctioned importers:"
  printf '    %s\n' $CONSTViol
else
  ok "MARK_* constants consumed only by the brand system, the spec page, and the pins"
fi

# ── verdict ───────────────────────────────────────────────────────────────
if [ "$FAIL" -eq 0 ]; then
  printf '\nlogo-gate: PASS — the mark has exactly one source per platform\n'
else
  printf '\nlogo-gate: FAIL — a competing logo copy exists (see above)\n' >&2
  exit 1
fi
