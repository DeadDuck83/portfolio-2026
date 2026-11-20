import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import CellGrid from './CellGrid';

describe('CellGrid', () => {
  it('sets auto-fit columns from min, with the default lines', () => {
    const { container } = render(
      <CellGrid min="170px">
        <div>Role</div>
        <div>Org</div>
      </CellGrid>,
    );
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.tagName).toBe('DIV');
    expect(grid).toHaveClass('ui-cell-grid');
    expect(grid).not.toHaveClass('ui-cell-grid--faint');
    expect(grid.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(170px, 1fr))');
  });

  it('takes faint lines, a dl, a ref, and leaves columns to a class when min is left out', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <CellGrid as="dl" line="faint" className="about-rail__stats" ref={ref}>
        <div>
          <dt>10+</dt>
          <dd>Years</dd>
        </div>
      </CellGrid>,
    );
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.tagName).toBe('DL');
    expect(grid).toHaveClass('ui-cell-grid', 'ui-cell-grid--faint', 'about-rail__stats');
    expect(grid.style.gridTemplateColumns).toBe('');
    expect(ref.current).toBe(grid);
  });
});
