import { afterEach, describe, expect, it, vi } from 'vitest';
import { motionOff, setMotionPaused, subscribeMotion } from './motion';

const reduce = (on: boolean) =>
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: on && query.includes('prefers-reduced-motion'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );

describe('motion', () => {
  afterEach(() => {
    setMotionPaused(false);
    vi.restoreAllMocks();
  });

  it('pauses everywhere, marks the page, and remembers it', () => {
    const heard = vi.fn();
    const off = subscribeMotion(heard);
    expect(motionOff()).toBe(false);

    setMotionPaused(true);
    expect(motionOff()).toBe(true);
    expect(document.documentElement.dataset.motion).toBe('off');
    expect(localStorage.getItem('motion_paused')).toBe('1');
    expect(heard).toHaveBeenCalledTimes(1);

    setMotionPaused(false);
    expect(motionOff()).toBe(false);
    expect(document.documentElement.dataset.motion).toBe('on');
    expect(localStorage.getItem('motion_paused')).toBeNull();
    off();
  });

  it("is off whenever the system asks for reduced motion, even if it isn't paused", () => {
    reduce(true);
    expect(motionOff()).toBe(true);
  });
});
