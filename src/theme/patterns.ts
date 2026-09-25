import type { CSSProperties } from 'react';
import { border, colors } from './tokens';

/**
 * Recurring inline-style patterns shared across home sections. Pair `solidCta`
 * with `solidCtaHover` from `lib/hover`.
 */

/** Solid accent button (hero "Get in touch"). */
export const solidCta: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.7rem',
  background: colors.accent,
  color: colors.buttonTextOnAccent,
  fontSize: '0.74rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  fontWeight: 700,
  padding: '0.95rem 1.6rem',
};

/** Small outlined skill / tag chip. */
export const chip: CSSProperties = {
  fontSize: '0.58rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: colors.textBody,
  padding: '0.26rem 0.5rem',
  border: `1px solid ${border.chip}`,
};

/** "/ Section" label above a section headline. */
export const eyebrow: CSSProperties = {
  fontSize: '0.68rem',
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color: colors.textMuted,
};
