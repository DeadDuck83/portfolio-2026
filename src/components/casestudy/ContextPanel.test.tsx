import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContextPanel from './ContextPanel';
import { plmc } from '../../data/caseStudies/plmc';

const ctx = plmc.context;

function renderPanel() {
  return render(
    <ContextPanel
      panelLabel={ctx.panelLabel}
      chips={ctx.chips}
      captionBefore={ctx.captionBefore}
      captionAfter={ctx.captionAfter}
    />,
  );
}

describe('ContextPanel', () => {
  it('renders every data-source chip', () => {
    renderPanel();
    for (const chip of ctx.chips) {
      expect(screen.getByText(chip)).toBeInTheDocument();
    }
  });

  it('starts in the scattered "before" state', () => {
    renderPanel();
    expect(screen.getByRole('button', { name: /tidy it up/i })).toBeInTheDocument();
    expect(screen.getByText(ctx.captionBefore)).toBeInTheDocument();
  });

  it('toggles to the tidied state and back', async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByRole('button', { name: /tidy it up/i }));
    expect(screen.getByRole('button', { name: /scatter it again/i })).toBeInTheDocument();
    expect(screen.getByText(ctx.captionAfter)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /scatter it again/i }));
    expect(screen.getByRole('button', { name: /tidy it up/i })).toBeInTheDocument();
    expect(screen.getByText(ctx.captionBefore)).toBeInTheDocument();
  });
});
