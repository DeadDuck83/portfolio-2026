import { useEffect, useRef } from 'react';

/** Visible this long before it counts (a section flashing past while scrolling doesn't). */
export const SECTION_DWELL_MS = 1000;

/** Enough of the section on screen: half of it, or half the screen for sections taller than that. */
export function sectionInView(visibleHeight: number, sectionHeight: number, viewportHeight: number) {
  if (sectionHeight <= 0 || visibleHeight <= 0) return false;
  return visibleHeight >= Math.min(sectionHeight, viewportHeight) * 0.5;
}

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/**
 * Calls `onView(id)` once per section per page visit, when the element with
 * that DOM id has been in view (see `sectionInView`) for `dwellMs`. `ids` is
 * read when `key` changes (use the route or slug), which also resets which
 * sections have been seen.
 */
export function useSectionViews<Id extends string>(
  key: string,
  ids: readonly Id[],
  onView: (id: Id) => void,
  dwellMs = SECTION_DWELL_MS,
) {
  const seen = useRef(new Set<string>());
  const seenFor = useRef(key);
  const cb = useRef(onView);
  const list = useRef(ids);
  useEffect(() => {
    cb.current = onView;
    list.current = ids;
  });

  useEffect(() => {
    // a new page: start over (but not on Strict Mode's re-run of the same one)
    if (seenFor.current !== key) {
      seenFor.current = key;
      seen.current = new Set();
    }
    if (typeof IntersectionObserver === 'undefined') return;
    const timers = new Map<Element, number>();
    const idOf = new Map<Element, Id>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = idOf.get(e.target);
          if (!id || seen.current.has(id)) continue;
          const on = e.isIntersecting && sectionInView(e.intersectionRect.height, e.boundingClientRect.height, window.innerHeight);
          if (on && !timers.has(e.target)) {
            timers.set(
              e.target,
              window.setTimeout(() => {
                timers.delete(e.target);
                if (seen.current.has(id)) return;
                seen.current.add(id);
                io.unobserve(e.target);
                cb.current(id);
              }, dwellMs),
            );
          } else if (!on && timers.has(e.target)) {
            window.clearTimeout(timers.get(e.target));
            timers.delete(e.target);
          }
        }
      },
      { threshold: THRESHOLDS },
    );
    for (const id of list.current) {
      const el = document.getElementById(id);
      if (!el || seen.current.has(id)) continue;
      idOf.set(el, id);
      io.observe(el);
    }
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [key, dwellMs]);
}
