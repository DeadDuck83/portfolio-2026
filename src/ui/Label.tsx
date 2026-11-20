import type { HTMLAttributes } from 'react';
import './Label.css';

export type LabelProps = HTMLAttributes<HTMLElement> & {
  /** `accent` is the green (`colors.accentBright`); `muted` is the grey (`colors.textMuted`). */
  tone?: 'accent' | 'muted';
  /** `span` where it sits inline or beside other text (a callout's label); `div` otherwise. */
  as?: 'div' | 'span';
};

/**
 * The small uppercase label that names a field, a panel or a short aside: Role, Org
 * and Timeline under a case study's hero, TL;DR, What I learned, User 01, The call.
 * Green (`accent`, the default) for labels that lead into something, grey (`muted`)
 * for field and panel names. Not for a section's or headline's label (that's
 * Eyebrow), nav links, or counters such as figure tags and step numbers. Spacing
 * around it (a margin, `white-space`) stays with the caller. Not a form `<label>`.
 * Styles are in Label.css. Import Label (a default export) from src/ui/Label with a
 * relative path; the project has no `src/` alias.
 *
 * @import import Label from '../ui/Label';
 */
export default function Label({ tone = 'accent', as: Tag = 'div', className, ...props }: LabelProps) {
  const cls = ['ui-label', tone === 'muted' && 'ui-label--muted', className].filter(Boolean).join(' ');
  return <Tag {...props} className={cls} />;
}
