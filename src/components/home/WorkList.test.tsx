import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../test/renderWithRouter';
import WorkList from './WorkList';

const CARDS = [
  { title: 'AI-powered healthspan insights', brand: 'Sage Healthspan', to: '/work/sage' },
  { title: 'Four systems around one exam', brand: 'Bexa Suite', to: '/work/bexa' },
  {
    title: 'Clinic and booking for neighborhood vets',
    brand: 'Parker & Ace',
    to: '/work/parker-ace',
  },
  { title: 'One patient picture for every visit', brand: 'PLMC', to: '/work/plmc' },
];

describe('WorkList', () => {
  it('renders product theses and brand labels for all four projects', () => {
    renderWithRouter(<WorkList />);
    for (const card of CARDS) {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.brand)).toBeInTheDocument();
    }
  });

  it('links each row to its internal case study route', () => {
    renderWithRouter(<WorkList />);
    for (const card of CARDS) {
      const link = screen.getByText(card.title).closest('a');
      expect(link).toHaveAttribute('href', card.to);
      expect(link).not.toHaveAttribute('target');
    }
  });
});
