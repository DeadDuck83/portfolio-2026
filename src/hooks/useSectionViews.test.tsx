import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sectionInView, useSectionViews } from './useSectionViews';

describe('sectionInView', () => {
  it('needs half the section, or half the screen for tall ones', () => {
    expect(sectionInView(200, 400, 800)).toBe(true);
    expect(sectionInView(199, 400, 800)).toBe(false);
    expect(sectionInView(400, 3000, 800)).toBe(true); // tall: half the screen is enough
    expect(sectionInView(300, 3000, 800)).toBe(false);
    expect(sectionInView(0, 0, 800)).toBe(false);
  });
});

/** A controllable IntersectionObserver: tests push visibility changes through it. */
let observers: FakeIO[] = [];
class FakeIO {
  targets = new Set<Element>();
  disconnected = false;
  constructor(private cb: IntersectionObserverCallback) {
    observers.push(this);
  }
  observe(el: Element) {
    this.targets.add(el);
  }
  unobserve(el: Element) {
    this.targets.delete(el);
  }
  disconnect() {
    this.disconnected = true;
    this.targets.clear();
  }
  takeRecords() {
    return [];
  }
  show(el: Element, visible: number, height: number) {
    this.cb(
      [
        {
          target: el,
          isIntersecting: visible > 0,
          intersectionRect: { height: visible },
          boundingClientRect: { height },
        } as unknown as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }
}

function Page({ onView, k = 'home' }: { onView: (id: string) => void; k?: string }) {
  useSectionViews(k, ['about', 'contact'], onView);
  return (
    <>
      <section id="about" />
      <section id="contact" />
    </>
  );
}

describe('useSectionViews', () => {
  beforeEach(() => {
    observers = [];
    vi.useFakeTimers();
    vi.stubGlobal('IntersectionObserver', FakeIO);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('fires once, only after the section stays in view', () => {
    const onView = vi.fn();
    render(<Page onView={onView} />);
    const io = observers.at(-1)!;
    const about = document.getElementById('about')!;

    act(() => io.show(about, 500, 600));
    act(() => vi.advanceTimersByTime(600));
    act(() => io.show(about, 50, 600)); // scrolled past before the dwell
    act(() => vi.advanceTimersByTime(1000));
    expect(onView).not.toHaveBeenCalled();

    act(() => io.show(about, 500, 600));
    act(() => vi.advanceTimersByTime(1000));
    expect(onView).toHaveBeenCalledExactlyOnceWith('about');

    act(() => io.show(about, 500, 600)); // seen already: ignored
    act(() => vi.advanceTimersByTime(2000));
    expect(onView).toHaveBeenCalledOnce();
  });

  it('cleans up its observer and pending timers on unmount', () => {
    const onView = vi.fn();
    const { unmount } = render(<Page onView={onView} />);
    const io = observers.at(-1)!;
    act(() => io.show(document.getElementById('contact')!, 500, 600));
    unmount();
    act(() => vi.advanceTimersByTime(2000));
    expect(io.disconnected).toBe(true);
    expect(onView).not.toHaveBeenCalled();
  });
});
