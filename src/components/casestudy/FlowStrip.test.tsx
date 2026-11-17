import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlowStrip from './FlowStrip';
import { sage } from '../../data/caseStudies/sage';

const flows = sage.flows!;

describe('FlowStrip', () => {
  it('shows one card per flow, at least five', () => {
    render(<FlowStrip flows={flows} />);
    expect(flows.length).toBeGreaterThanOrEqual(5);
    for (const f of flows) {
      expect(screen.getByRole('button', { name: new RegExp(`^${f.title}: open all`) })).toBeInTheDocument();
    }
  });

  it('opens a flow with every screen, moves with the arrow keys, and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<FlowStrip flows={flows} />);
    const card = screen.getByRole('button', { name: /^See the trend: open all/ });
    await user.click(card);

    let dialog = screen.getByRole('dialog', { name: /See the trend/ });
    expect(within(dialog).getAllByRole('img')).toHaveLength(flows[1].screens.length);

    await user.keyboard('{ArrowRight}');
    dialog = screen.getByRole('dialog', { name: /Sage Insights/ });
    expect(within(dialog).getByText('Plain words, real questions')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('every screen has alt text and a label', () => {
    for (const f of flows) {
      for (const s of f.screens) {
        expect(s.alt.length).toBeGreaterThan(10);
        expect(s.label.length).toBeGreaterThan(0);
      }
    }
  });
});
