import { lazy, Suspense, useEffect, useState } from 'react';
import { track } from '../../lib/analytics';
import { AVATAR_BASE } from './lines';
import { cornerStyle, loadCorner, saveCorner, type Corner } from './corner';
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
 * Derek's avatar guide: a FaceTime-style call card in the corner. On a first
 * visit it pops up once the avatar has loaded (never sooner than 3 s);
 * dismissing it leaves a floating button, and later visits start there.
 */
export default function AvatarGuide() {
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [minTimeUp, setMinTimeUp] = useState(false);
  const [open, setOpen] = useState(false);
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

  // first visit: pop up when loaded and at least 3 s in
  useEffect(() => {
    if (ready && minTimeUp && !dismissed) {
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

  const showFab = !open && (dismissed ? load : ready && minTimeUp);

  return (
    <>
      {load && (
        <Suspense fallback={null}>
          <AvatarCall open={open} corner={corner} onCorner={moveTo} onReady={() => setReady(true)} onClose={close} />
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
