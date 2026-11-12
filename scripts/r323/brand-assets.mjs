#!/usr/bin/env node
/**
 * brand-assets.mjs — R323 §A1 — regenerates EVERY static brand asset from
 * the ONE geometry (frontend/src/brand/mark.ts + the generated wordmark
 * sheets) so the product component, the favicon, the PWA icons, the OG
 * card and the e-mail/pdf twins can never diverge again:
 *
 *   frontend/public/brand/ulara-mark.svg     (component twin, 32-grid)
 *   frontend/public/brand/lockup.svg          (RTL lockup: mark right,
 *       «أُلارا» left — same composition as <Logo variant="lockup">)
 *   frontend/public/brand/lockup-stacked.svg  (mark / أُلارا / ULARA)
 *   frontend/public/favicon.svg               (thicker 16 px ratios — the
 *       ONLY sanctioned stroke deviation, BRAND.md §min-sizes)
 *   frontend/public/brand/icon-180|192|512.png (maskable, paper ground)
 *   frontend/public/brand/ulara-og.jpg        (1200×630 social card)
 *
 * The mark is the ULARA U-vessel: ONE ink stroke (round caps + joins)
 * + the sienna cornerstone — the same constants frontend/src/brand/mark.ts
 * owns (the unit belt pins the two together).
 *
 * Colours ONLY paper #F5F1E8 · ink #262019 · sienna #C43E16 — the
 * Parchment & Sienna palette (shared/brand.json). Hairline strokes,
 * radius 0, no gradients, ONE sienna accent.
 *
 * The OG card follows the kit source shared/brand/ulara/og-1200x630.svg
 * (same translate/scale/anchor geometry) with the kit's staged system
 * font stack REPLACED by the build-time brand typography (IBM Plex
 * Sans Arabic 600 via a data-URI @font-face — the R344 rule: the card
 * must render identically on any machine, and the kit's own note
 * defers its typography to build time). sharp alone cannot guarantee
 * that (no brand font lives in the system fontconfig), so the card
 * rasterizes through the same Playwright/Chromium seat as the icons.
 *
 * Why a browser renderer: the worktree ships Playwright + Chromium (the
 * app's own rasterizer) — the PNGs/JPG are pixel-faithful to the
 * product's rendering (the r320 precedent). Deterministic: same inputs
 * ⇒ same bytes (verified by the unit belt).
 *
 * Run AFTER scripts/r323/wordmark-build-r323.mjs (reads
 * frontend/src/brand/wordmark.generated.ts for the path data):
 *   node scripts/r323/brand-assets.mjs
 */
import { chromium } from 'playwright';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BRAND_DIR = path.join(ROOT, 'frontend', 'public', 'brand');
const GEN_TS = path.join(ROOT, 'frontend', 'src', 'brand', 'wordmark.generated.ts');
const OG_KIT = path.join(ROOT, 'shared', 'brand', 'ulara', 'og-1200x630.svg');

const PAPER = '#F5F1E8';
const INK = '#262019';
const SIENNA = '#C43E16';

/* mark geometry — keep in sync with frontend/src/brand/mark.ts (the unit
 * belt pins the two together) */
const MARK = {
  viewBox: '0 0 32 32',
  vessel: 'M9 7L9 19Q9 27 16 27Q23 27 23 19L23 7',
  cornerstone: { x: 21, y: 3, size: 4 },
};
/* lockup composition — keep in sync with frontend/src/brand/lockups.ts
 * (derives from the generated wordmark metrics; MARK_INK.x = 9) */
const LOCKUP_CANVAS = { w: 42.13, h: 32 };
const STACKED_CANVAS = { w: 32, h: 62.61 };

/* ── read the generated wordmark sheets ─────────────────────────────── */
if (!existsSync(GEN_TS)) {
  console.error('[brand-assets] missing frontend/src/brand/wordmark.generated.ts — run scripts/r323/wordmark-build-r323.mjs first');
  process.exit(1);
}
function parseSheet(name) {
  const block = readFileSync(GEN_TS, 'utf8').split(`export const ${name} = `)[1] ?? '';
  const viewBox = block.match(/viewBox: '([^']+)'/)?.[1];
  const d = block.match(/\n  d: '([^']+)'/)?.[1];
  const ink = block.match(/ink: \{ w: ([\d.]+), h: ([\d.]+) \}/);
  if (!viewBox || !d || !ink) {
    console.error(`[brand-assets] cannot parse ${name} from wordmark.generated.ts`);
    process.exit(1);
  }
  return { viewBox, d, inkW: Number(ink[1]), inkH: Number(ink[2]) };
}
const AR = parseSheet('WORDMARK_AR');
const LAT = parseSheet('WORDMARK_LATIN');
const AR_MARGIN = 6;

/* place(): identical math to frontend/src/brand/lockups.ts */
function place(sheetInkH, inkH, inkX, inkY) {
  const scale = inkH / sheetInkH;
  return {
    scale: +scale.toFixed(5),
    x: +(inkX - AR_MARGIN * scale).toFixed(3),
    y: +(inkY - AR_MARGIN * scale).toFixed(3),
  };
}
const LOCKUP_AR_INK_H = 11;
const lockupAr = place(AR.inkH, LOCKUP_AR_INK_H, 5, (32 - LOCKUP_AR_INK_H) / 2);
const lockupArInkW = +(AR.inkW * lockupAr.scale).toFixed(3);
const lockupMarkX = +(5 + lockupArInkW + 5 - 9).toFixed(3);
if (Math.abs(lockupMarkX + 32 - LOCKUP_CANVAS.w) > 0.05) {
  console.error(`[brand-assets] lockup composition drifted from lockups.ts (${lockupMarkX + 32} ≠ ${LOCKUP_CANVAS.w})`);
  process.exit(1);
}
const STACKED_AR_INK_H = 14;
const STACKED_AR_ASPECT = AR.inkW / AR.inkH;
const STACKED_LATIN_ASPECT = LAT.inkW / LAT.inkH;
const STACKED_LATIN_INK_H = +((STACKED_AR_INK_H * STACKED_AR_ASPECT) / STACKED_LATIN_ASPECT).toFixed(3);
const stackedAr = place(AR.inkH, STACKED_AR_INK_H, (32 - AR.inkW * (STACKED_AR_INK_H / AR.inkH)) / 2, 37);
const stackedArInkW = +(AR.inkW * stackedAr.scale).toFixed(3);
const stackedLatin = place(LAT.inkH, STACKED_LATIN_INK_H, (32 - LAT.inkW * (STACKED_LATIN_INK_H / LAT.inkH)) / 2, 37 + STACKED_AR_INK_H + 4);
const stackedH = +(32 + 5 + STACKED_AR_INK_H + 4 + STACKED_LATIN_INK_H + 5).toFixed(2);
if (Math.abs(stackedH - STACKED_CANVAS.h) > 0.05) {
  console.error(`[brand-assets] stacked composition drifted from lockups.ts (${stackedH} ≠ ${STACKED_CANVAS.h})`);
  process.exit(1);
}

/* ── svg fragments ──────────────────────────────────────────────────── */
const markGroup = (strokeWidth) => `<g fill="none" stroke="${INK}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${MARK.vessel}"/>
  </g>
  <rect x="${MARK.cornerstone.x}" y="${MARK.cornerstone.y}" width="${MARK.cornerstone.size}" height="${MARK.cornerstone.size}" fill="${SIENNA}"/>`;

const HEADER_COMMENT = `<!-- ULARA brand system — GENERATED by scripts/r323/brand-assets.mjs — do not edit by hand.
     Geometry source: frontend/src/brand/mark.ts (+ lockups.ts, wordmark.generated.ts).
     Colours: paper ${PAPER} · ink ${INK} · sienna ${SIENNA}. Hairline strokes, round caps/joins
     on the vessel, radius 0, no gradients. Regenerate: node scripts/r323/brand-assets.mjs -->`;

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK.viewBox}" width="64" height="64" role="img" aria-label="شعار أُلارا">
  ${HEADER_COMMENT}
  <title>أُلارا</title>
  ${markGroup(1.5)}
</svg>
`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK.viewBox}">
  ${HEADER_COMMENT}
  <!-- the favicon seat: same geometry, thicker PROPORTIONAL stroke ratio
       (2.25/32) for 16 px legibility — the only sanctioned deviation
       (docs/redesign/r323/brand/BRAND.md §min-sizes). -->
  ${markGroup(2.25)}
</svg>
`;

const wordStroke = `fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="miter"`;
const lockupSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOCKUP_CANVAS.w} ${LOCKUP_CANVAS.h}" role="img" aria-label="أُلارا">
  ${HEADER_COMMENT}
  <title>أُلارا</title>
  <g transform="translate(${lockupAr.x} ${lockupAr.y}) scale(${lockupAr.scale})"><path d="${AR.d}" ${wordStroke}/></g>
  <g transform="translate(${lockupMarkX} 0)">
  ${markGroup(1.5)}
  </g>
</svg>
`;
const lockupStackedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STACKED_CANVAS.w} ${STACKED_CANVAS.h}" role="img" aria-label="أُلارا">
  ${HEADER_COMMENT}
  <title>أُلارا</title>
  <g transform="translate(0 0)">
  ${markGroup(1.5)}
  </g>
  <g transform="translate(${stackedAr.x} ${stackedAr.y}) scale(${stackedAr.scale})"><path d="${AR.d}" ${wordStroke}/></g>
  <g transform="translate(${stackedLatin.x} ${stackedLatin.y}) scale(${stackedLatin.scale})"><path d="${LAT.d}" fill="${INK}"/></g>
</svg>
`;

writeFileSync(path.join(BRAND_DIR, 'ulara-mark.svg'), markSvg);
writeFileSync(path.join(BRAND_DIR, 'lockup.svg'), lockupSvg);
writeFileSync(path.join(BRAND_DIR, 'lockup-stacked.svg'), lockupStackedSvg);
writeFileSync(path.join(ROOT, 'frontend', 'public', 'favicon.svg'), faviconSvg);
console.log('[brand-assets] ✓ ulara-mark.svg · lockup.svg · lockup-stacked.svg · favicon.svg');

/* ── raster: PWA icons + the OG card (Playwright/Chromium) ──────────── */
const EXECUTABLE = process.env.ULARA_E2E_EXECUTABLE
  ?? '/home/z/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome';

function pngIhdrSize(buf) {
  if (buf.length < 24) throw new Error('PNG too short for an IHDR');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const FAVICON = readFileSync(path.join(ROOT, 'frontend', 'public', 'favicon.svg'), 'utf8');

/* the build-time brand typography: the self-hosted IBM Plex Sans Arabic
 * 600 (arabic + latin subsets) rides data URIs (the R344 rule — the
 * card renders via page.setContent, an about:blank context, where every
 * file:// subresource is cross-origin-blocked). */
const plexArabicUrl = `data:font/woff2;base64,${readFileSync(path.join(ROOT, 'frontend/public/fonts/plex-sans-arabic-600-normal-arabic.woff2')).toString('base64')}`;
const plexLatinUrl = `data:font/woff2;base64,${readFileSync(path.join(ROOT, 'frontend/public/fonts/plex-sans-arabic-600-normal-latin.woff2')).toString('base64')}`;

const browser = await chromium.launch({ executablePath: EXECUTABLE });
try {
  /* PWA icons — the maskable recipe (r320 precedent): full-bleed paper
   * tile, the favicon geometry (thicker ratios) centred at 62% — inside
   * the central-80% safe zone. */
  for (const size of [180, 192, 512]) {
    const mark = Math.round(size * 0.62);
    const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
  html, body { margin: 0; padding: 0; }
  body { width: ${size}px; height: ${size}px; background: ${PAPER}; display: grid; place-items: center; overflow: hidden; }
  svg { display: block; width: ${mark}px; height: ${mark}px; }
</style></head>
<body>${FAVICON}</body></html>`;
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: size, height: size } });
    await page.close();
    const ihdr = pngIhdrSize(png);
    if (ihdr.width !== size || ihdr.height !== size) {
      throw new Error(`icon-${size}: IHDR ${ihdr.width}x${ihdr.height} ≠ ${size}x${size}`);
    }
    writeFileSync(path.join(BRAND_DIR, `icon-${size}.png`), png);
    console.log(`[brand-assets] ✓ icon-${size}.png — IHDR ${ihdr.width}x${ihdr.height}, ${(png.length / 1024).toFixed(1)}KB`);
  }

  /* the OG card — 1200×630 paper plate built from the kit source
   * shared/brand/ulara/og-1200x630.svg: the SAME geometry (the mark at
   * translate(960 238) scale(5), أُلارا right-anchored at x=900 y=353,
   * the «نظام تشغيل الجامعة» descriptor at y=433) with the staged
   * system font stack overridden by the brand's own IBM Plex Sans
   * Arabic 600 — the kit's own note defers its typography to build
   * time, and this rasterizer is that build time. */
  const kit = readFileSync(OG_KIT, 'utf8');
  const W = 1200;
  const H = 630;
  const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
  @font-face { font-family: 'ula-og-brand'; src: url('${plexArabicUrl}') format('woff2'); font-weight: 600; font-display: block; }
  @font-face { font-family: 'ula-og-brand-lt'; src: url('${plexLatinUrl}') format('woff2'); font-weight: 600; font-display: block; }
  html, body { margin: 0; padding: 0; }
  body { width: ${W}px; height: ${H}px; overflow: hidden; }
  svg { display: block; }
  /* the build-time typography substitution — every <text> in the kit
     source resolves to the self-hosted brand faces. */
  svg text { font-family: 'ula-og-brand', 'ula-og-brand-lt', sans-serif !important; font-weight: 600; }
</style></head>
<body>${kit}</body></html>`;
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120); /* font raster settle */
  const jpg = await page.screenshot({ type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: W, height: H } });
  await page.close();
  writeFileSync(path.join(BRAND_DIR, 'ulara-og.jpg'), jpg);
  console.log(`[brand-assets] ✓ ulara-og.jpg — ${W}×${H}, ${(jpg.length / 1024).toFixed(1)}KB`);
} finally {
  await browser.close();
}

/* ── manifest consistency check (the manifest's icon paths + the paper
 * theme must match the regenerated system) ─────────────────────────── */
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'frontend', 'public', 'manifest.webmanifest'), 'utf8'));
for (const icon of manifest.icons) {
  const p = path.join(ROOT, 'frontend', 'public', icon.src.replace(/^\//, ''));
  if (!existsSync(p)) {
    console.error(`[brand-assets] manifest icon missing on disk: ${icon.src}`);
    process.exit(1);
  }
}
if (manifest.theme_color !== PAPER || manifest.background_color !== PAPER) {
  console.error('[brand-assets] manifest theme/background drifted from paper');
  process.exit(1);
}
console.log('[brand-assets] ✓ manifest.webmanifest consistent (icons on disk, paper theme)');
