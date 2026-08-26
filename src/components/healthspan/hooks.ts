import { useEffect, useReducer, useRef, useState } from 'react';

/**
 * Width of an element, tracked with ResizeObserver.
 *
 * Uses a callback ref rather than `useRef`, so the observer is re-attached if
 * React ever swaps the node — a plain ref plus a mount-only effect would go on
 * observing a detached element. Width is 0 until the first observation, which
 * is the chart's signal to reserve space instead of drawing at the wrong size.
 */
export function useElementWidth<T extends HTMLElement>(): [
  (node: T | null) => void,
  number,
] {
  const [element, setElement] = useState<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!element) return;

    if (typeof ResizeObserver === 'undefined') {
      const onResize = () => setWidth(element.clientWidth);
      onResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [setElement, width];
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Ease a record of numbers toward a target on every animation frame.
 *
 * The curve's shape is driven by continuous values, so tweening the numbers
 * and rebuilding the path each frame is smoother — and far simpler — than
 * trying to interpolate SVG path strings. Honours prefers-reduced-motion by
 * snapping straight to the target.
 */
export function useTween<T extends Record<string, number>>(
  target: T,
  factor = 0.18,
): T {
  const reduced = usePrefersReducedMotion();
  const currentRef = useRef<T>(target);
  const frameRef = useRef<number | null>(null);
  const [, forceRender] = useReducer((tick: number) => tick + 1, 0);

  useEffect(() => {
    if (reduced) {
      currentRef.current = target;
      forceRender();
      return;
    }

    const step = () => {
      const current = currentRef.current;
      const next = { ...current } as Record<string, number>;
      let settled = true;

      for (const key of Object.keys(target)) {
        const delta = target[key] - current[key];
        if (Math.abs(delta) > 0.0005) {
          next[key] = current[key] + delta * factor;
          settled = false;
        } else {
          next[key] = target[key];
        }
      }

      currentRef.current = next as T;
      forceRender();
      frameRef.current = settled ? null : requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, factor, reduced]);

  return currentRef.current;
}
