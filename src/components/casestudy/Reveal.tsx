import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/**
 * Scroll-reveal wrapper (case study). On mount, elements that start below 88%
 * of the viewport are hidden (opacity 0, +26px) and revealed via an
 * IntersectionObserver when they scroll into view. Elements already on/above
 * the fold are never hidden — nothing above the fold flashes, and fast anchor
 * jumps past an element still reveal it (boundingClientRect.top < 0 check).
 */
export default function Reveal({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.88) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(26px)';
    el.style.transition =
      'opacity 0.9s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)';

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            el.style.opacity = '1';
            el.style.transform = 'none';
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px 12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}
