import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../test/renderWithRouter';
import WorkList from './WorkList';

describe('WorkList', () => {
  it('renders all four selected-work rows', () => {
    renderWithRouter(<WorkList />);
    expect(screen.getByText('Sage Healthspan')).toBeInTheDocument();
    expect(screen.getByText('Bexa')).toBeInTheDocument();
    expect(screen.getByText('Parker & Ace')).toBeInTheDocument();
    expect(screen.getByText('PLMC')).toBeInTheDocument();
  });

  it('links the PLMC row to its internal case study route', () => {
    renderWithRouter(<WorkList />);
    const link = screen.getByText('PLMC').closest('a');
    expect(link).toHaveAttribute('href', '/work/plmc');
    // Internal links must not open a new tab.
    expect(link).not.toHaveAttribute('target');
  });

  it('opens external work in a new tab with a safe rel', () => {
    renderWithRouter(<WorkList />);
    const link = screen.getByText('Sage Healthspan').closest('a');
    expect(link).toHaveAttribute('href', 'https://sagehealthspan.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('does not link Parker & Ace (its case study is not built yet)', () => {
    renderWithRouter(<WorkList />);
    expect(screen.getByText('Parker & Ace').closest('a')).toBeNull();
  });
});
