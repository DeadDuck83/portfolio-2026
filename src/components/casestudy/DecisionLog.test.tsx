import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DecisionLog from './DecisionLog';
import { plmc } from '../../data/caseStudies/plmc';

const decisions = plmc.process.decisions;

/** The collapsible body is the element right after each toggle button. */
function bodyFor(titleRegex: RegExp): HTMLElement {
  const btn = screen.getByRole('button', { name: titleRegex });
  return btn.nextElementSibling as HTMLElement;
}

describe('DecisionLog', () => {
  it('opens the first row by default and leaves the rest collapsed', () => {
    render(<DecisionLog decisions={decisions} />);
    expect(bodyFor(/One scroll/)).toHaveStyle({ maxHeight: '420px' });
    expect(bodyFor(/Plot ranges/)).toHaveStyle({ maxHeight: '0px' });
  });

  it('opening another row closes the first (one open at a time)', async () => {
    const user = userEvent.setup();
    render(<DecisionLog decisions={decisions} />);

    await user.click(screen.getByRole('button', { name: /Plot ranges/ }));

    expect(bodyFor(/Plot ranges/)).toHaveStyle({ maxHeight: '420px' });
    expect(bodyFor(/One scroll/)).toHaveStyle({ maxHeight: '0px' });
  });

  it('clicking the open row collapses it', async () => {
    const user = userEvent.setup();
    render(<DecisionLog decisions={decisions} />);

    // First row starts open; clicking it should close it.
    await user.click(screen.getByRole('button', { name: /One scroll/ }));

    expect(bodyFor(/One scroll/)).toHaveStyle({ maxHeight: '0px' });
  });
});
