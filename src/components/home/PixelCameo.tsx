import { useEffect, useRef, useState } from 'react';

const SLIDE_TO_HALF_MS = 2600;
const HOLD_MS = 1000;
const SLIDE_TO_THREE_QUARTERS_MS = 1200;
const FLASH_MS = 140;
const EXIT_MS = 380;
/** Scare away if the pointer gets this close to the figure. */
const SCARE_PADDING_PX = 72;

/** Fully off-screen to the left (translateX of the image's own width). */
const OFF_LEFT = '-105%';
/** 50% of the image width visible in-frame. */
const PEEK_HALF = '-50%';
/** 75% of the image width visible in-frame. */
const PEEK_THREE_QUARTERS = '-25%';
/** 30% smaller than the original large cameo size. */
const FIGURE_HEIGHT = 'min(54.6vh, 504px)';
/** Fraction of figure height that sits behind the next section. */
const SUBMERGE_FACTOR = 0.4;

function wait(ms: number, signal?: { aborted: boolean }) {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => {
      if (signal?.aborted) reject(new DOMException('Aborted', 'AbortError'));
      else resolve();
    }, ms);
  });
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/**
 * Tiny camera easter egg in the hero corner. One click peeks pixel Derek in from
 * the left browser edge (50% of his width → pause → 75% → flash → exit left).
 * If the pointer moves toward him mid-sequence, he bolts left immediately.
 * Plays only once.
 */
export default function PixelCameo() {
  const [spent, setSpent] = useState(false);
  const [showFigure, setShowFigure] = useState(false);
  const [flash, setFlash] = useState(false);
  const [tx, setTx] = useState(OFF_LEFT);
  const [slideMs, setSlideMs] = useState(0);
  const [bottomPx, setBottomPx] = useState(0);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const playing = useRef(false);
  const abortRef = useRef({ aborted: false });
  const scareArmed = useRef(false);

  const placeOnHeroBottom = () => {
    const hero = document.getElementById('top');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    setBottomPx(Math.max(0, window.innerHeight - rect.bottom));
  };

  useEffect(() => {
    if (!showFigure) return;
    placeOnHeroBottom();
    window.addEventListener('resize', placeOnHeroBottom);
    window.addEventListener('scroll', placeOnHeroBottom, { passive: true });
    return () => {
      window.removeEventListener('resize', placeOnHeroBottom);
      window.removeEventListener('scroll', placeOnHeroBottom);
    };
  }, [showFigure]);

  const scareAway = () => {
    if (!playing.current || abortRef.current.aborted) return;
    abortRef.current.aborted = true;
    scareArmed.current = false;
    setFlash(false);
    setSlideMs(EXIT_MS);
    setTx(OFF_LEFT);
    window.setTimeout(() => {
      setShowFigure(false);
      playing.current = false;
    }, EXIT_MS);
  };

  useEffect(() => {
    if (!showFigure) return;

    const onMove = (e: PointerEvent) => {
      if (!scareArmed.current || abortRef.current.aborted) return;
      const el = imgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Only the top 60% is visible above #about — scare against that band.
      const visibleBottom = rect.top + rect.height * 0.6;
      const near =
        e.clientX < rect.right + SCARE_PADDING_PX &&
        e.clientX > rect.left - SCARE_PADDING_PX &&
        e.clientY > rect.top - SCARE_PADDING_PX &&
        e.clientY < visibleBottom + SCARE_PADDING_PX;
      if (near) scareAway();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [showFigure]);

  const play = async () => {
    if (spent || playing.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    playing.current = true;
    abortRef.current = { aborted: false };
    setSpent(true);
    placeOnHeroBottom();
    setShowFigure(true);
    setSlideMs(0);
    setTx(OFF_LEFT);
    await nextFrame();
    if (abortRef.current.aborted) return;

    scareArmed.current = true;

    try {
      const check = () => {
        if (abortRef.current.aborted) throw new DOMException('Aborted', 'AbortError');
      };

      setSlideMs(SLIDE_TO_HALF_MS);
      setTx(PEEK_HALF);
      await wait(SLIDE_TO_HALF_MS, abortRef.current);
      check();

      await wait(HOLD_MS, abortRef.current);
      check();

      setSlideMs(SLIDE_TO_THREE_QUARTERS_MS);
      setTx(PEEK_THREE_QUARTERS);
      await wait(SLIDE_TO_THREE_QUARTERS_MS, abortRef.current);
      check();

      setFlash(true);
      await wait(FLASH_MS, abortRef.current);
      check();
      setFlash(false);

      scareArmed.current = false;
      setSlideMs(EXIT_MS);
      setTx(OFF_LEFT);
      await wait(EXIT_MS, abortRef.current);

      setShowFigure(false);
      playing.current = false;
    } catch {
      // Aborted by scare-away — cleanup handled there.
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label={spent ? 'Photo already taken' : 'Take a photo'}
        disabled={spent}
        onClick={() => void play()}
        style={{
          position: 'absolute',
          right: 'clamp(0.75rem, 2vw, 1.5rem)',
          bottom: 'clamp(0.75rem, 2vw, 1.5rem)',
          zIndex: 2,
          margin: 0,
          padding: '0.35rem',
          border: 'none',
          background: 'transparent',
          fontSize: '1.05rem',
          lineHeight: 1,
          cursor: spent ? 'default' : 'pointer',
          opacity: spent ? 0.22 : 0.55,
          transition: 'opacity 0.35s ease, transform 0.25s ease',
          filter: spent ? 'grayscale(1)' : 'none',
        }}
        onMouseEnter={(e) => {
          if (spent) return;
          e.currentTarget.style.opacity = '0.95';
          e.currentTarget.style.transform = 'scale(1.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = spent ? '0.22' : '0.55';
          e.currentTarget.style.transform = 'none';
        }}
      >
        📷
      </button>

      {showFigure && (
        <img
          ref={imgRef}
          src="/derek-pixels.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: 'fixed',
            left: 0,
            // Sit on the hero/#about seam, then sink 40% so only the top 60% shows.
            bottom: `calc(${bottomPx}px - ${SUBMERGE_FACTOR} * ${FIGURE_HEIGHT})`,
            // Above page/brain backgrounds only — content sections stack above.
            zIndex: 0,
            height: FIGURE_HEIGHT,
            width: 'auto',
            pointerEvents: 'none',
            userSelect: 'none',
            transform: `translateX(${tx})`,
            transition:
              slideMs > 0
                ? `transform ${slideMs}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
                : 'none',
            filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.5))',
          }}
        />
      )}

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          pointerEvents: 'none',
          background: '#fff',
          opacity: flash ? 0.92 : 0,
          transition: flash ? 'opacity 40ms linear' : `opacity ${FLASH_MS}ms ease-out`,
        }}
      />
    </>
  );
}
