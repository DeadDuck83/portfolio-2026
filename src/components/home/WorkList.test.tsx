import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../test/renderWithRouter';
import WorkList from './WorkList';

// Every work card now links to an internal case study.
const CARDS = [
  { title: 'Sage Healthspan', to: '/work/sage' },
  { title: 'Bexa Suite', to: '/work/bexa' },
  { title: 'Parker & Ace', to: '/work/parker-ace' },
  { title: 'PLMC', to: '/work/plmc' },
];

describe('WorkList', () => {
  it('renders all four selected-work rows', () => {
    renderWithRouter(<WorkList />);
    for (const card of CARDS) {
      expect(screen.getByText(card.title)).toBeInTheDocument();
    }
  });

  it('links each row to its internal case study route', () => {
    renderWithRouter(<WorkList />);
    for (const card of CARDS) {
      const link = screen.getByText(card.title).closest('a');
      expect(link).toHaveAttribute('href', card.to);
      // Internal routes must not open a new tab.
      expect(link).not.toHaveAttribute('target');
    }
  });
});
