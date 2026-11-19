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
