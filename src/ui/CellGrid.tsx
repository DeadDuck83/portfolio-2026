import type { HTMLAttributes, Ref } from 'react';
import './CellGrid.css';

export type CellGridProps = HTMLAttributes<HTMLElement> & {
  /**
   * The narrowest a column gets before the grid wraps: columns are
   * `repeat(auto-fit, minmax(min, 1fr))`. Leave it out to set the columns with a
   * class instead (the About rail's two fixed columns).
   */
  min?: string;
  /** `faint` for the lighter lines (StatBand); `default` otherwise. */
  line?: 'default' | 'faint';
  /** `dl` when the cells are terms and values (the About rail's stats). */
  as?: 'div' | 'dl';
  ref?: Ref<HTMLElement>;
};

/**
 * Cells in a grid with 1px lines between and around them: Role / Org / Timeline /
 * Scope under a case study's hero, the personas, the principles, StatBand's numbers
 * and the About rail's stats. Each cell sets its own background (the page's, so the
 * lines show between them) and padding. Styles are in CellGrid.css. Import CellGrid
 * (a default export) from src/ui/CellGrid with a relative path; the project has no
 * `src/` alias.
 *
 * @import import CellGrid from '../ui/CellGrid';
 */
export default function CellGrid({ min, line = 'default', as = 'div', className, style, ref, ...props }: CellGridProps) {
  const cls = ['ui-cell-grid', line === 'faint' && 'ui-cell-grid--faint', className].filter(Boolean).join(' ');
  const columns = min ? { gridTemplateColumns: `repeat(auto-fit, minmax(${min}, 1fr))` } : null;
  // div and dl take the same attributes here; one element type keeps the ref typed
  const El = as as 'div';
  return <El {...props} ref={ref as Ref<HTMLDivElement>} className={cls} style={{ ...columns, ...style }} />;
}
