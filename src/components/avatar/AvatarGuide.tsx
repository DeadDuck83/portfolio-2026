import { lazy, Suspense, useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { track } from '../../lib/analytics';
import { AVATAR_BASE } from './lines';
import { cornerStyle, loadCorner, saveCorner, type Corner } from './corner';
import { AVATAR_OPEN_EVENT, dockMounted, dockVisible, setCallOpen, subscribeDock } from './dock';
import styles from './avatarGuide.module.css';

// The call (Rive runtime + avatar, ~2.5 MB) loads only after the page has.
const AvatarCall = lazy(() => import('./AvatarCall'));

const DISMISSED_KEY = 'avatar_dismissed';
const MIN_DELAY_MS = 3000;

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Derek's avatar guide: a FaceTime-style call card in the corner, no Connect
 * step. On the home page the hero's live avatar tile is the way in: a click
 * opens the call out of that tile, with sound. Pages without the tile open
 * the call by themselves on a first visit (once loaded, never sooner than
 * 3 s); that greeting is captioned and muted, because browsers block sound
 * until the visitor clicks. Closing leaves the tile / floating button, and
 * later visits start closed.
 */
export default function AvatarGuide() {
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [minTimeUp, setMinTimeUp] = useState(false);
  const [open, setOpen] = useState(false);
  /** The card opened by itself (no click yet), so it greets silently. */
  const [auto, setAuto] = useState(false);
  const [dismissed] = useState(wasDismissed);
  const [corner, setCorner] = useState<Corner>(loadCorner);
  const moveTo = (c: Corner) => {
    setCorner(c);
    saveCorner(c);
    track('Avatar moved', { corner: `${c.v}-${c.h}` });
  };

  useEffect(() => {
    const start = () => setLoad(true);
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    const t = window.setTimeout(() => setMinTimeUp(true), MIN_DELAY_MS);
    return () => {
      window.removeEventListener('load', start);
      window.clearTimeout(t);
    };
  }, []);

  // The hero's docked invite (dock.ts) can open the card directly.
  useEffect(() => {
    const onOpen = (e: Event) => {
      setLoad(true);
      setAuto(false);
      setOpen(true);
      track('Avatar opened', { from: (e as CustomEvent<{ source?: string }>).detail?.source ?? 'dock' });
    };
    window.addEventListener(AVATAR_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(AVATAR_OPEN_EVENT, onOpen);
  }, []);

  const docked = useSyncExternalStore(subscribeDock, dockVisible, () => false);

  // layout effect: the hero tile reappears in the same frame the card hides
  useLayoutEffect(() => setCallOpen(open), [open]);

  // first visit: open on the call when loaded and at least 3 s in, unless the
  // hero's live tile is on the page (it's the invitation there)
  useEffect(() => {
    if (ready && minTimeUp && !dismissed && !dockMounted()) {
      setAuto(true);
      setOpen(true);
      track('Avatar popped up');
    }
  }, [ready, minTimeUp, dismissed]);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      /* private mode */
    }
  };

  const showFab = !open && !docked && (dismissed ? load : ready && minTimeUp);

  return (
    <>
      {load && (
        <Suspense fallback={null}>
          <AvatarCall open={open} auto={auto} corner={corner} onCorner={moveTo} onReady={() => setReady(true)} onClose={close} />
        </Suspense>
      )}
      {showFab && (
        <button
          className={styles.fab}
          style={cornerStyle(corner)}
          onClick={() => {
            setOpen(true);
            track('Avatar reopened');
          }}
          aria-label="Talk to Derek's avatar"
        >
          <img src={`${AVATAR_BASE}/face.webp`} alt="" width={64} height={64} />
        </button>
      )}
    </>
  );
}
