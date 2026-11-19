import { afterEach, describe, expect, it } from 'vitest';
import { act } from '@testing-library/react';
import Hero from './Hero';
import { renderWithRouter } from '../../test/renderWithRouter';
import { setMotionPaused } from '../../lib/motion';

describe('Hero', () => {
  afterEach(() => setMotionPaused(false));

  it('swaps the cover videos for their posters while motion is paused', () => {
    const { container } = renderWithRouter(<Hero />);
    expect(container.querySelectorAll('video').length).toBeGreaterThan(0);

    act(() => setMotionPaused(true));
    expect(container.querySelectorAll('video')).toHaveLength(0);
  });
});
