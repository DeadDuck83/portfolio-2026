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
    expect(bodyFor(/Five functions/)).toHaveStyle({ maxHeight: '900px' });
    expect(bodyFor(/Let them watch/)).toHaveStyle({ maxHeight: '0px' });
  });

  it('opening another row closes the first (one open at a time)', async () => {
    const user = userEvent.setup();
    render(<DecisionLog decisions={decisions} />);

    await user.click(screen.getByRole('button', { name: /Let them watch/ }));

    expect(bodyFor(/Let them watch/)).toHaveStyle({ maxHeight: '900px' });
    expect(bodyFor(/Five functions/)).toHaveStyle({ maxHeight: '0px' });
  });

  it('says which row is open, and hides closed rows from screen readers', async () => {
    const user = userEvent.setup();
    render(<DecisionLog decisions={decisions} />);
    const first = screen.getByRole('button', { name: /Five functions/ });
    const second = screen.getByRole('button', { name: /Let them watch/ });

    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveAttribute('aria-expanded', 'false');
    // each row's button controls the body under it
    expect(first).toHaveAttribute('aria-controls', bodyFor(/Five functions/).id);
    expect(bodyFor(/Five functions/)).toHaveAttribute('aria-hidden', 'false');
    expect(bodyFor(/Let them watch/)).toHaveAttribute('aria-hidden', 'true');

    await user.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(bodyFor(/Let them watch/)).toHaveAttribute('aria-hidden', 'false');
  });

  it('clicking the open row collapses it', async () => {
    const user = userEvent.setup();
    render(<DecisionLog decisions={decisions} />);

    // First row starts open; clicking it should close it.
    await user.click(screen.getByRole('button', { name: /Five functions/ }));

    expect(bodyFor(/Five functions/)).toHaveStyle({ maxHeight: '0px' });
  });
});
