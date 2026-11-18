import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlowStrip from './FlowStrip';
import { sage } from '../../data/caseStudies/sage';
import { bexa } from '../../data/caseStudies/bexa';

const flows = sage.flows!;
const apps = bexa.flows!;

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

  it('shows each Bexa app on its device, and opens every screen', async () => {
    const user = userEvent.setup();
    const { container } = render(<FlowStrip flows={apps} />);
    expect(apps.map((f) => f.device)).toEqual(['monitor', 'phone', 'tablet', 'laptop']);
    // the device frame is decoration: the card itself is named by the app
    expect(container.querySelectorAll('img[src*="/frames/"]')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: /^BexaQuality: open all/ }));
    const dialog = screen.getByRole('dialog', { name: /BexaQuality/ });
    expect(within(dialog).getAllByRole('img')).toHaveLength(apps[3].screens.length);
  });

  it('every screen has alt text and a label', () => {
    for (const f of [...flows, ...apps]) {
      for (const s of f.screens) {
        expect(s.alt.length).toBeGreaterThan(10);
        expect(s.label.length).toBeGreaterThan(0);
      }
    }
  });
});
