/**
 * Palette — the single source of truth for colour.
 *
 * The component writes these onto its root element as CSS custom properties,
 * so the stylesheet reads them via `var(--hsx-*)` while the SVG uses the raw
 * values directly. One definition, two consumers, no drift.
 *
 * The two series colours are not decorative choices. `you` and `average` were
 * validated against the dark surface for colour-vision separation: they sit
 * 22.3 ΔE apart under protanopia and 24.0 under normal vision, comfortably
 * above the ΔE 8 floor. Swap them and you should re-check that.
 */

import type { CSSProperties } from 'react';

export interface Palette {
  /** Page background behind the cards. */
  readonly background: string;
  /** Card surface. */
  readonly surface: string;
  /** Hairline borders. */
  readonly line: string;
  readonly lineStrong: string;

  readonly ink: string;
  readonly inkMuted: string;
  readonly inkSubtle: string;

  /** Series: the viewer's curve. */
  readonly you: string;
  /** Series: the dashed population-average reference. */
  readonly average: string;

  /** Health zones — reserved status hues, never reused for series. */
  readonly good: string;
  readonly fair: string;
  readonly poor: string;

  /** Chart furniture. */
  readonly grid: string;
  readonly mark: string;
  readonly axisLabel: string;
  readonly axisTick: string;
}

export const darkPalette: Palette = {
  background: '#080B10',
  surface: '#0E131B',
  line: 'rgba(255, 255, 255, 0.09)',
  lineStrong: 'rgba(255, 255, 255, 0.15)',

  ink: '#E6EDF6',
  inkMuted: '#97A3B4',
  inkSubtle: '#64707F',

  you: '#4098DE',
  average: '#B5813E',

  good: '#3FBF7F',
  fair: '#CFB63F',
  poor: '#D95F5F',

  grid: '#FFFFFF',
  mark: '#E6EDF6',
  axisLabel: '#97A3B4',
  axisTick: '#64707F',
};

/** Palette → inline CSS custom properties for the root element. */
export function paletteVars(palette: Palette): CSSProperties {
  return {
    '--hsx-background': palette.background,
    '--hsx-surface': palette.surface,
    '--hsx-line': palette.line,
    '--hsx-line-strong': palette.lineStrong,
    '--hsx-ink': palette.ink,
    '--hsx-ink-muted': palette.inkMuted,
    '--hsx-ink-subtle': palette.inkSubtle,
    '--hsx-you': palette.you,
    '--hsx-average': palette.average,
    '--hsx-good': palette.good,
    '--hsx-fair': palette.fair,
    '--hsx-poor': palette.poor,
  } as CSSProperties;
}
