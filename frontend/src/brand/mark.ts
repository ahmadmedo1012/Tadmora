/**
 * mark.ts — the TADMORA mark «قوس تادمورا» — the single source of the
 * mark's GEOMETRY (the <Logo> component in ./Logo.tsx renders it;
 * scripts/r323/brand-assets.mjs re-states the same numbers for the static
 * twins, scripts/brand/build-app-icons.mjs parses this file for the mobile
 * asset set, and frontend/tests/unit/r323-brand-system.test.ts pins them
 * together — never edit one without the other).
 *
 * CONSTRUCTION (32-unit grid, viewBox 0 0 32 32):
 *  · the Palmyra gateway idea: TWO hairline pillars carry a semicircular
 *    arch over a baseline — the colonnade of Tadmor (تدمر), the university
 *    as the gateway of knowledge;
 *  · the pillars stand at x=8 and x=24, rising from the baseline y=27 to
 *    the arch spring y=15 — every anchor ON a grid intersection;
 *  · the arch: radius 8, centre (16,15) — springs (8,15) and (24,15), the
 *    apex at the grid intersection (16,7); ONE closed path
 *    M8 27 L8 15 A8 8 0 0 1 24 15 L24 27 Z (the Z draws the baseline
 *    back to the first pillar — the stylobate of the colonnade);
 *  · ONE solid orange square — the KEYSTONE — seated exactly at the arch's
 *    apex: a 4×4 square at x=14..18, y=5..9, centred (16,7), interrupting
 *    the arch line like a true keystone. The keystone is the person —
 *    student, teacher, researcher — at the apex of the system: the
 *    University Operating System is built around its people
 *    («الجامعة في منظومة واحدة»);
 *  · the ink lands x=8..24, y=5..27 — perfectly centred in the 32-grid
 *    (8-unit side margins, 5-unit top/bottom margins);
 *  · hairline ink strokes, UNIFORM weight, MITER joins (never round),
 *    radius 0, no fills except the keystone, no gradients, no shadows.
 *
 * COLOURS (the only three): paper #F6F6EE · ink #282828 · orange #FA3600.
 * In the app the ink rides currentColor and the orange rides var(--accent)
 * (tokens.css re-keys that shared seat per theme: #FA3600 on light, the
 * luminous ember #FF5A1F on dark — the sanctioned dark-theme swap, one
 * var() and the mark themes without props).
 */

/** The mark's own viewBox (the 32-unit grid). */
export const MARK_VIEWBOX = '0 0 32 32';

/** The gateway as ONE closed path: left pillar up, the arch over the top,
 * right pillar down, the baseline back — miter joins at every corner. */
export const MARK_ARCH_PATH = 'M8 27L8 15A8 8 0 0 1 24 15L24 27Z';

/** The orange keystone: 4×4 square centred on the arch's apex (16,7). */
export const MARK_KEYSTONE = { x: 14, y: 5, size: 4 } as const;

/** The mark's ink bbox inside the 32 viewBox (x8..24, y5..27). */
export const MARK_INK = { x: 8, y: 5, w: 16, h: 22 } as const;

/** The grid intersections the construction is judged on. */
export const MARK_GRID_POINTS: readonly (readonly [number, number])[] = [
  [8, 15], [24, 15], /* the arch springs */
  [16, 7],           /* the apex — the keystone's seat */
  [8, 27], [24, 27], /* the baseline corners */
  [14, 5], [18, 5], [14, 9], [18, 9], /* the keystone's corners */
];

/** Static stroke ratios. The component renders the mark with a
 * non-scaling uniform hairline (vector-effect), the favicon carries a
 * thicker PROPORTIONAL ratio for 16 px legibility — the only sanctioned
 * deviation (BRAND.md §min-sizes). */
export const MARK_STROKE_COMPONENT = 1.5; /* px, non-scaling */
export const MARK_STROKE_FAVICON = 2.25;  /* viewBox units, proportional */

/** The optical-size ramp (R324/X11). A CONSTANT 1.5 px screen stroke
 * below the 32-grid design size reads progressively heavier: 12.5 % of
 * the mark's height at the 12 px EdgeTab seat (2.7× the designed 4.7 %)
 * — the small seats turn the hairline into a blob. The ramp tapers the
 * screen stroke linearly from 1.5 px @32 down to 1.125 px @16 — exactly
 * the favicon's sanctioned 2.25/32 ratio at 16 px — with a 0.9 px floor
 * so the hairline never washes sub-pixel. ≥32 stays the design 1.5 px.
 *   32→1.500 · 26→1.359 · 24→1.313 · 22→1.266 · 16→1.125 · 14→1.078 · 12→1.031 */
export function markStrokePx(size: number): number {
  if (size >= 32) return MARK_STROKE_COMPONENT;
  const tapered = MARK_STROKE_COMPONENT - (0.375 * (32 - size)) / 16;
  return Math.max(0.9, +tapered.toFixed(3));
}
