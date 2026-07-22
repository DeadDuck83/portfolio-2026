import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PixelCameo from './PixelCameo';

/** Force a specific reduced-motion answer from matchMedia. */
function setReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? reduce : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('PixelCameo', () => {
  it('renders the camera trigger, ready to fire', () => {
    render(<PixelCameo />);
    const btn = screen.getByRole('button', { name: /take a photo/i });
    expect(btn).toBeEnabled();
  });

  it('does not spawn the cameo when the user prefers reduced motion', async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    render(<PixelCameo />);

    await user.click(screen.getByRole('button', { name: /take a photo/i }));

    // Guarded out before it marks itself spent — trigger stays live, no figure.
    expect(screen.getByRole('button', { name: /take a photo/i })).toBeEnabled();
  });
});
