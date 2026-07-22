import { useEffect, useRef, useState } from 'react';

/**
 * Count-up progress for the 05 Outcome stat band. Returns a ref to attach to
 * the stat container and a progress value `p` (0 → 1). When the container
 * scrolls to 40% visible, `p` eases from 0 to 1 over ~1.1s (cubic ease-out);
 * consumers map `p` onto their numbers (e.g. Math.round(p * 7)).
 */
export function useCountUp() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          const t0 = performance.now();
          const dur = 1100;
          const tick = (t: number) => {
            const frac = Math.min(1, (t - t0) / dur);
            setP(1 - Math.pow(1 - frac, 3));
            if (frac < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, p };
}
