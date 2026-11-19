import type { CSSProperties } from 'react';
import { border, colors } from './tokens';

/**
 * Recurring inline-style patterns shared across home sections. Only WorkList and
 * AboutJourney use these, and nothing renders them right now. The live site uses
 * the shared components in src/ui: Button, Chip and Eyebrow.
 */

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
