import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CareerSlider from './CareerSlider';
import { roles } from '../../data/roles';

describe('CareerSlider', () => {
  it('renders every role card', () => {
    render(<CareerSlider />);
    for (const role of roles) {
      expect(screen.getByText(role.company)).toBeInTheDocument();
    }
  });

  it('starts on the last role, so the next arrow is disabled and prev is active', () => {
    render(<CareerSlider />);
    expect(screen.getByRole('button', { name: 'Next role' })).toHaveStyle({
      pointerEvents: 'none',
    });
    expect(screen.getByRole('button', { name: 'Previous role' })).toHaveStyle({
      pointerEvents: 'auto',
    });
  });

  it('stepping back re-enables the next arrow', async () => {
    const user = userEvent.setup();
    render(<CareerSlider />);

    await user.click(screen.getByRole('button', { name: 'Previous role' }));

    expect(screen.getByRole('button', { name: 'Next role' })).toHaveStyle({
      pointerEvents: 'auto',
    });
  });
});
