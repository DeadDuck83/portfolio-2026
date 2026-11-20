import type { HTMLAttributes } from 'react';
import './Chip.css';

export type ChipProps = HTMLAttributes<HTMLElement> & {
  /** `li` when the chips are a list (the About rail's skills). */
  as?: 'span' | 'li';
};

/**
 * A small outlined label for a skill or tag. It labels; it is never a button or a
 * link. Use `as="li"` when the chips are a list, as the skills under each About
 * chapter are. Styles are in Chip.css. Import Chip (a default export) from
 * src/ui/Chip with a relative path; the project has no `src/` alias.
 *
 * @import import Chip from '../ui/Chip';
 */
export default function Chip({ as: Tag = 'span', className, ...props }: ChipProps) {
  return <Tag {...props} className={className ? `ui-chip ${className}` : 'ui-chip'} />;
}
