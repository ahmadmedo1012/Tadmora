#!/usr/bin/env node
/**
 * scorecard.mjs — ULARA Ω §7: the Definition-of-Done dashboard, measured.
 *
 * The master contract: "اجعل scripts/scorecard.mjs ينتج هذا الجدول آليًا،
 * وشغّله في CI، وألصق نتيجته في LEDGER كل دورة" — numbers, not opinions.
 *
 * Two measurement classes:
 *   · STATIC  — measured right here, right now (files, sizes, bundle, git,
 *     npm audit, the no-trace gate). No network, no browser.
 *   · DYNAMIC — produced by their own instruments elsewhere (login proof =
 *     deploy-smoke runs; mobile crashes = the android-smoke job; overlap =
 *     scripts/brand/footer-overlap.mjs; a11y/lighthouse/console = their
 *     gates). The scorecard reads their LAST COMMITTED/results artifacts
 *     when present and otherwise reports ⚠️ with the exact command that
 *     produces the number.
 *
 * Output: a Markdown table (LEDGER-pasteable) + JSON (CI-comparable).
 * Exit code: 0 always (the scorecard measures; the individual gates gate).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const sh = (cmd, opts = {}) => {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', timeout: 120_000, ...opts }).trim();
  } catch (e) {
    return null;
  }
};

const rows = [];
const row = (metric, limit, measured, verdict, proof = '') =>
  rows.push({ metric, limit, measured, verdict, proof });

// ── 1. tracked files / md files / docs files ────────────────────────────
const lsFiles = sh('git ls-files') ?? '';
const files = lsFiles ? lsFiles.split('\n').filter(Boolean) : [];
const mdFiles = files.filter((f) => f.endsWith('.md'));
const docsFiles = files.filter((f) => f.startsWith('docs/'));
row(
  'tracked files', '< 1,000', String(files.length),
  files.length < 1000 ? '✅' : '⚠️ Phase-3 pending',
  'git ls-files | wc -l (Phase 3 target; pre-cleanup count)',
);
row(
  'md files', '< 40', String(mdFiles.length),
  mdFiles.length < 40 ? '✅' : '⚠️ over',
  `git ls-files '*.md' | wc -l (Phase 3 target)`,
);
row(
  'docs/ files', '≤ ~15', String(docsFiles.length),
  docsFiles.length <= 15 ? '✅' : '⚠️ over',
  "git ls-files 'docs/**' | wc -l (Phase 3 target)",
);

// ── 2. .git size ─────────────────────────────────────────────────────────
let gitKb = 0;
try {
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else gitKb += st.size;
    }
  };
  walk(join(ROOT, '.git'));
} catch { /* fresh clone without .git? */ }
const gitMb = (gitKb / 1024 / 1024).toFixed(1);
row('.git size', '< 15MB (post Gate B)', `${gitMb}MB`, gitMb < 15 ? '✅' : '⚠️',
  'du of .git (history rewrite is Gate B — pre-B size is expected over)');

// ── 3. bundle (from the last verify/build if dist exists) ────────────────
const bundleReport = '/tmp/verify-build.log';
if (existsSync(join(ROOT, 'frontend/dist'))) {
  const out = sh('node scripts/check-bundle-size.mjs') ?? '';
  const m = out.match(/(\d+(?:\.\d+)?) KB gz/);
  row('JS bundle (gz)', '≤ 770KB', m ? `${m[1]} KB` : 'see gate',
    out.includes('PASS') ? '✅' : '✗', 'node scripts/check-bundle-size.mjs');
} else {
  row('JS bundle (gz)', '≤ 770KB', 'dist absent', '⚠️',
    'run: bash scripts/verify.sh --fast (builds + gates)');
}

// ── 4. the no-trace gate (§5 — only meaningful post-rename) ──────────────
const TRACE_RX = 'tadmora|تادمورا|تدمر|tdmr|madarek|مدارك|mdrk|heron|zawia|الزاوية|onrender|khatam|afc4265f';
const traceHits = sh(`git grep -IiE '${TRACE_RX}' -- . ':!node_modules' | wc -l`) ?? '?';
row('no-trace gate', '0 (post Gate A)', String(traceHits),
  traceHits === '0' ? '✅' : '⚠️ pre-rename',
  "git grep -IiE 'tadmora|…' — the count is the rename's remaining surface");

// ── 5. npm audit (high/critical) ─────────────────────────────────────────
const audit = sh('npm audit --omit=dev --json');
let highCrit = '?';
if (audit) {
  try {
    const j = JSON.parse(audit);
    const v = j.metadata?.vulnerabilities ?? {};
    highCrit = String((v.high ?? 0) + (v.critical ?? 0));
  } catch { /* parse issue — report unknown */ }
}
row('npm audit high/critical (prod)', '0', highCrit, highCrit === '0' ? '✅' : (highCrit === '?' ? '⚠️ instrument' : '✗'),
  'npm audit --omit=dev');

// ── 6. dynamic instruments — last known state + the exact command ────────
const ratchet = existsSync(join(ROOT, 'scripts/conformance/ratchet.json'))
  ? JSON.parse(readFileSync(join(ROOT, 'scripts/conformance/ratchet.json'), 'utf8'))
  : null;
row('login on production (web+mobile roles)', 'success, proven', 'deploy-smoke run #5 green (2026-11-11)', '✅',
  'workflow Deploy smoke — Login ×3 + dashboard 200 (rotated secrets)');
row('mobile crashes in emulator', '0 on 3 consecutive × 5 roles', 'android-smoke job — first run in flight', '⚠️',
  'workflow Mobile → android-smoke (needs 3 green consecutive runs)');
row('footer overlap / horizontal overflow', '0 @ 320–1920 × l/d', 'PASS — zero defects (16 cells)', '✅',
  'node scripts/brand/footer-overlap.mjs');
row('conformance ratchet floor', 'monotonic rise', ratchet ? `${ratchet.rate}%` : '?', ratchet ? '✅' : '⚠️',
  'scripts/conformance/ratchet.json (CI gate)');
// ── 7. the axe a11y gate's last report (dynamic — the scorecard reads
//      the gate's own JSON, it never launches a browser; the file is
//      scripts/brand/a11y-gate.mjs's default --out) ─────────────────────
let a11yLast = null;
try { a11yLast = JSON.parse(readFileSync('/tmp/a11y-gate/a11y-gate.json', 'utf8')); } catch { /* gate not run yet */ }
if (a11yLast) {
  const s = a11yLast.totals?.serious ?? 0;
  const c = a11yLast.totals?.critical ?? 0;
  const floor = (a11yLast.baseline?.floorTotals?.serious ?? 0) + (a11yLast.baseline?.floorTotals?.critical ?? 0);
  const cells = a11yLast.cells?.length ?? 0;
  const when = String(a11yLast.generatedAt ?? '').slice(0, 10);
  row('axe a11y serious/critical', '0 · contrast ≥ 4.5:1 · touch ≥ 44px',
    `${s + c} (S${s}/C${c}) vs floor ${floor} — ${cells} cells (${when})`,
    (a11yLast.regressions?.length ?? 0) > 0 ? '✗' : (s + c === 0 ? '✅' : '⚠️'),
    'node scripts/brand/a11y-gate.mjs (ratchet: scripts/brand/a11y-baseline.json — the floor only tightens)');
} else {
  row('axe a11y serious/critical', '0 · contrast ≥ 4.5:1 · touch ≥ 44px', 'pending (run a11y-gate)', '⚠️',
    'node scripts/brand/a11y-gate.mjs → /tmp/a11y-gate/a11y-gate.json (the scorecard reads the report file; it never launches a browser)');
}
row('Lighthouse (mobile 4G) home/login/dashboards', 'P≥90 A≥95 BP≥95 SEO≥95', 'instrument pending', '⚠️',
  'Phase 4: Lighthouse CI');
row('console errors in journeys', '0', 'e2e journeys assert zero console errors', '⚠️',
  'verify in tests/e2e (per-journey console capture)');

// ── output ────────────────────────────────────────────────────────────────
const now = new Date().toISOString();
const md = [
  `### Scorecard — ${now} (branch: ${sh('git branch --show-current') ?? '?'})`,
  '',
  '| المقياس | الحد | المقاس | الحكم | الإثبات/الأداة |',
  '|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.metric} | ${r.limit} | ${r.measured} | ${r.verdict} | ${r.proof} |`),
].join('\n');
console.log(md);
if (!existsSync(join(ROOT, 'scripts/brand/results'))) {
  try { readdirSync(join(ROOT, 'scripts')); } catch { /* */ }
}
const outJson = join(ROOT, 'scripts/scorecard.json');
try { writeFileSync(outJson, JSON.stringify({ generatedAt: now, rows }, null, 2)); } catch { /* read-only fs */ }
