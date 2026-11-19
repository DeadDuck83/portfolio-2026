import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MotionToggle from './MotionToggle';
import { setMotionPaused } from '../lib/motion';

describe('MotionToggle', () => {
  afterEach(() => {
    setMotionPaused(false);
    vi.restoreAllMocks();
  });

  it('pauses the site and plays it again', async () => {
    const user = userEvent.setup();
    render(<MotionToggle source="footer" />);
    await user.click(screen.getByRole('button', { name: 'Pause motion' }));
    expect(document.documentElement.dataset.motion).toBe('off');
    await user.click(screen.getByRole('button', { name: 'Play motion' }));
    expect(document.documentElement.dataset.motion).toBe('on');
    expect(screen.getByRole('button', { name: 'Pause motion' })).toBeInTheDocument();
  });

  it("isn't shown when the system already reduces motion", () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    render(<MotionToggle source="footer" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
