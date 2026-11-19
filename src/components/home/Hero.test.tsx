import { afterEach, describe, expect, it } from 'vitest';
import { act, screen } from '@testing-library/react';
import Hero from './Hero';
import { renderWithRouter } from '../../test/renderWithRouter';
import { setMotionPaused } from '../../lib/motion';

describe('Hero', () => {
  afterEach(() => setMotionPaused(false));

  it('has a Pause motion control, and pausing swaps the cover videos for their posters', () => {
    const { container } = renderWithRouter(<Hero />);
    expect(screen.getByRole('button', { name: 'Pause motion' })).toBeInTheDocument();
    expect(container.querySelectorAll('video').length).toBeGreaterThan(0);

    act(() => setMotionPaused(true));
    expect(container.querySelectorAll('video')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Play motion' })).toBeInTheDocument();
  });
});
