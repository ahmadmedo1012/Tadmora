/**
 * Logo.tsx — the TADMORA <Logo> implementation (the public barrel ./index
 * re-exports it under the frozen contract).
 *
 * ONE logo for the whole product (the R323 brief retired the six
 * competing variants; the TADMORA rebrand re-seats the same system):
 *   · mark      — the 32-grid hairline Tadmora arch + the orange keystone
 *   · lockup    — horizontal, RTL: mark right, «تادمورا» left (default)
 *   · stacked   — mark / «تادمورا» / TADMORA, the full vertical identity
 *   · wordmark  — the outlined word alone (size = its ink height)
 *
 * Everything is inline SVG (no <img>), inherits currentColor, and the
 * orange keystone rides var(--accent) — the seat tokens.css re-keys per
 * theme (#FA3600 light · luminous ember #FF5A1F dark) — so the mark
 * themes without props. The root svg carries data-logo (the
 * loader-orchestrator tests count them) and role="img" + <title>.
 *
 * `animated` draws the construction in 600–900 ms — the hairline gateway
 * first, the orange keystone LAST (a base-visible CSS draw: under
 * prefers-reduced-motion the animation never applies and the logo is
 * simply there, complete).
 */
import { useId } from 'react';
import type React from 'react';
import {
  MARK_ARCH_PATH,
  MARK_KEYSTONE,
  MARK_VIEWBOX,
  markStrokePx,
} from './mark';
import { LOCKUP, STACKED, WORDMARK_STROKE_SHEET } from './lockups';
import { WORDMARK_AR, WORDMARK_LATIN } from './wordmark.generated';

export type LogoVariant = 'lockup' | 'mark' | 'wordmark' | 'stacked';
export type LogoTone = 'auto' | 'ink' | 'paper' | 'orange';

export function Logo(props: {
  /** default 'lockup' (horizontal, RTL order: mark right, wordmark left) */
  variant?: LogoVariant;
  /** mark height in px; lockup/stacked scale from it. In the 'wordmark'
   * variant it is the wordmark's ink height in px. */
  size?: number;
  /** 'auto' = currentColor + var(--accent) for the orange keystone;
   * 'ink'/'paper'/'orange' are literal one-colour settings for fixed
   * backgrounds (paper #F6F6EE, ink #282828, orange #FA3600). */
  tone?: LogoTone;
  className?: string;
  /** stroke-draw 600–900 ms, orange keystone LAST */
  animated?: boolean;
}): React.JSX.Element {
  const {
    variant = 'lockup',
    size = 32,
    tone = 'auto',
    className,
    animated = false,
  } = props;

  /* the ink slot (strokes + wordmark) and the keystone slot, per tone:
   * 'auto' inherits (currentColor + var(--accent)); 'ink'/'paper'/
   * 'orange' pin BOTH slots to the literal brand colour for fixed
   * grounds (documented in BRAND.md §tones). */
  const ink =
    tone === 'paper'
      ? '#F6F6EE'
      : tone === 'orange'
        ? '#FA3600'
        : tone === 'ink'
          ? '#282828'
          : 'currentColor';
  const keystone = tone === 'auto' ? 'var(--accent)' : ink;

  /* unique keyframe names per instance (multiple Logos per page) */
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const kfArch = `tdmrA${uid}`;
  const kfWord = `tdmrW${uid}`;
  const kfKey = `tdmrK${uid}`;

  const draw = (name: string, durationVar: string, delay: number): React.CSSProperties | undefined =>
    animated
      ? { strokeDasharray: 1, animation: `${name} var(${durationVar}) var(--brand-draw-ease) ${delay}ms both` }
      : undefined;
  const pop = (): React.CSSProperties | undefined =>
    animated ? { animation: `${kfKey} var(--motion-duration-brand-pop) var(--ease-linear) 750ms both` } : undefined;

  const styleTag = animated ? (
    <style>{`@keyframes ${kfArch}{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}@keyframes ${kfWord}{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}@keyframes ${kfKey}{from{opacity:0}to{opacity:1}}@media (prefers-reduced-motion:reduce){.tdmr-logo *{animation:none !important}}`}</style>
  ) : null;

  /* ── the mark (shared by mark/lockup/stacked) ───────────────────────
   * The hairline rides the optical-size ramp (X11): markStrokePx tapers
   * the non-scaling stroke below the 32-grid design size so the small
   * seats (12/14/16/22/24/26 px) keep the designed weight instead of
   * bloating to 2.7× the ratio. The gateway draws as ONE stroke —
   * pillars, arch, baseline — then the keystone pops LAST. */
  const markShape = (
    <g stroke={ink} fill="none" strokeWidth={markStrokePx(size)} strokeLinejoin="miter">
      <path
        d={MARK_ARCH_PATH}
        pathLength={1}
        vectorEffect="non-scaling-stroke"
        style={draw(kfArch, '--motion-duration-brand-draw-arch', 0)}
      />
      <rect x={MARK_KEYSTONE.x} y={MARK_KEYSTONE.y} width={MARK_KEYSTONE.size} height={MARK_KEYSTONE.size} fill={keystone} stroke="none" style={pop()} />
    </g>
  );

  /* ── the wordmark sheet (stroke-only outlined connected letterforms) ─ */
  const wordPath = (transform: string, name: string): React.JSX.Element => (
    <path
      d={WORDMARK_AR.d}
      transform={transform}
      fill="none"
      stroke={ink}
      strokeWidth={WORDMARK_STROKE_SHEET}
      strokeLinejoin="miter"
      pathLength={1}
      style={draw(name, '--motion-duration-brand-draw-word', 200)}
    />
  );
  const latinPath = (transform: string): React.JSX.Element => (
    <path d={WORDMARK_LATIN.d} transform={transform} fill={ink} stroke="none" />
  );

  /* ── variant canvases (size = mark height; wordmark: ink height) ──── */
  let viewBox: string;
  let width: number;
  let height: number;
  let body: React.JSX.Element;

  if (variant === 'mark') {
    viewBox = MARK_VIEWBOX;
    width = size;
    height = size;
    body = markShape;
  } else if (variant === 'wordmark') {
    viewBox = WORDMARK_AR.viewBox;
    width = +((size * WORDMARK_AR.ink.w) / WORDMARK_AR.ink.h).toFixed(2);
    height = size;
    body = wordPath('', kfWord);
  } else if (variant === 'stacked') {
    viewBox = STACKED.viewBox;
    width = size;
    height = +((size * STACKED.h) / 32).toFixed(2);
    body = (
      <>
        <g transform={`translate(${STACKED.mark.x} ${STACKED.mark.y})`}>{markShape}</g>
        {wordPath(`translate(${STACKED.ar.x} ${STACKED.ar.y}) scale(${STACKED.ar.scale})`, kfWord)}
        {latinPath(`translate(${STACKED.latin.x} ${STACKED.latin.y}) scale(${STACKED.latin.scale})`)}
      </>
    );
  } else {
    viewBox = LOCKUP.viewBox;
    width = +((size * LOCKUP.w) / 32).toFixed(2);
    height = size;
    body = (
      <>
        {wordPath(`translate(${LOCKUP.ar.x} ${LOCKUP.ar.y}) scale(${LOCKUP.ar.scale})`, kfWord)}
        <g transform={`translate(${LOCKUP.mark.x} ${LOCKUP.mark.y})`}>{markShape}</g>
      </>
    );
  }

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={className ? `tdmr-logo ${className}` : 'tdmr-logo'}
      role="img"
      data-logo={variant}
      focusable="false"
      style={{ display: 'block' }}
      aria-label="تادمورا"
    >
      <title>تادمورا</title>
      {styleTag}
      {body}
    </svg>
  );
}
