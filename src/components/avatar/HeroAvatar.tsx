import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AVATAR_BASE } from './lines';
import { callOpen, openAvatar, registerDockSlot, setDockVisible, subscribeDock } from './dock';

// The Rive runtime + avatar load only after the page has.
const HeroAvatarLive = lazy(() => import('./HeroAvatarLive'));

/**
 * The avatar, live in the hero's name column: a lit video tile that idles
 * and watches the cursor before anyone says hello. Clicking it opens the
 * call card, which grows out of this tile and follows the visitor around;
 * the tile steps aside until the call is closed.
 */
export default function HeroAvatar() {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [inView, setInView] = useState(false);
  const [load, setLoad] = useState(false);
  const [live, setLive] = useState(false);
  const away = useSyncExternalStore(subscribeDock, callOpen, () => false);
  // reduced motion: he loads, draws one frame and holds still
  const [still] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerDockSlot(el);
    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([e]) => {
          setInView(Boolean(e?.isIntersecting));
          setDockVisible(Boolean(e?.isIntersecting) && (e?.intersectionRatio ?? 0) >= 0.5);
        },
        { threshold: [0, 0.5] },
      );
      io.observe(el);
    }
    return () => {
      io?.disconnect();
      registerDockSlot(null);
      setDockVisible(false);
    };
  }, []);

  useEffect(() => {
    const start = () => setLoad(true);
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className={`hx-avatar${live ? ' is-live' : ''}${away ? ' is-away' : ''}`}
      onClick={() => openAvatar('hero')}
      aria-hidden={away || undefined}
      tabIndex={away ? -1 : undefined}
    >
      <span className="hx-avatar__screen">
        <span className="hx-avatar__frame">
          <img
            className="hx-avatar__poster"
            src={`${AVATAR_BASE}/poster.webp`}
            alt=""
            width={440}
            height={550}
          />
          {load && (
            <Suspense fallback={null}>
              <HeroAvatarLive active={inView && !away && !still} onReady={() => setLive(true)} />
            </Suspense>
          )}
        </span>
      </span>
      <span className="hx-avatar__cap">
        <span className="hx-avatar__dot" aria-hidden="true" />
        <span className="hx-avatar__text">
          <span className="hx-avatar__title">Talk to my avatar</span>
          <span className="hx-avatar__sub">Voice or text</span>
        </span>
        <span className="hx-avatar__go" aria-hidden="true">
          →
        </span>
      </span>
    </button>
  );
}
