import { useEffect, useRef, useState } from 'react';

/**
 * Drives the case-study top progress bar and chapter scroll-spy.
 * Returns a ref for the 2px progress bar (its scaleX = scroll fraction) and
 * the active chapter index. Reads `[data-chapter]` sections from `rootRef`;
 * the active chapter is the last one whose top has passed 35% of the viewport.
 * Scroll handling is throttled with requestAnimationFrame.
 */
export function useScrollProgress(rootRef: React.RefObject<HTMLElement | null>) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        if (barRef.current) {
          const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
          barRef.current.style.transform = `scaleX(${p})`;
        }
        const root = rootRef.current;
        if (root) {
          let active = 0;
          root.querySelectorAll<HTMLElement>('[data-chapter]').forEach((el) => {
            if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
              active = parseInt(el.dataset.chapter ?? '0', 10);
            }
          });
          setChapter((prev) => (active !== prev ? active : prev));
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rootRef]);

  return { barRef, chapter };
}
