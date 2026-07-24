import type { MouseEvent } from 'react';
import { colors } from '../theme/tokens';

/**
 * Inline-style hover helpers matching the reference's JS hover handlers.
 * The design mutates element styles directly on hover (the source of truth is
 * inline styles, which CSS :hover can't override), so we replicate that here.
 */

/** Link that shifts to the bright accent on hover and back to `rest`. */
export function accentLinkHover(rest: string) {
  return {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      e.currentTarget.style.color = colors.accentBright;
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      e.currentTarget.style.color = rest;
    },
  };
}

/** Outlined CTA: tinted background + accent-tint text on hover. */
export const outlinedCtaHover = {
  onMouseEnter: (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = 'rgba(132,137,69,0.14)';
    e.currentTarget.style.color = colors.accentTint;
  },
  onMouseLeave: (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = 'none';
    e.currentTarget.style.color = colors.textBody;
  },
};

/** Solid accent CTA: brightens on hover. */
export const solidCtaHover = {
  onMouseEnter: (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = colors.accentBright;
  },
  onMouseLeave: (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = colors.accent;
  },
};
