import type { HTMLAttributes } from 'react';
import './Chip.css';

export type ChipProps = HTMLAttributes<HTMLElement> & {
  /** `li` when the chips are a list (the About rail's skills). */
  as?: 'span' | 'li';
};

/** A small outlined label for a skill or tag. Styles are in Chip.css. */
export default function Chip({ as: Tag = 'span', className, ...props }: ChipProps) {
  return <Tag {...props} className={className ? `ui-chip ${className}` : 'ui-chip'} />;
}
