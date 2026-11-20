import type { Decorator } from '@storybook/react-vite';
import { layout } from '../src/theme/tokens';

/**
 * Frames for the Case study stories, so each block is as wide as it is on a case
 * study page (and wraps the same way).
 */

/** The text column each case-study section lays its blocks in: CaseStudy.tsx's `sectionInner`, without its top and bottom padding. */
export const inColumn: Decorator = (Story) => (
  <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: `0 ${layout.sidePad}` }}>{Story()}</div>
);

/** One of two columns in a page grid that has this gap, as wide as on the page. Use it inside `inColumn`. */
export const inHalfColumn =
  (gap: string): Decorator =>
  (Story) => <div style={{ maxWidth: `calc((100% - ${gap}) / 2)` }}>{Story()}</div>;
