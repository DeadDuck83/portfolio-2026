import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motionOff } from '../../lib/motion';
import SkillsShare from './SkillsShare';
import { cascadeCues, cueMoments } from './skills';

const LEAVE_MS = 450; // matches the share's fade-out

/**
 * "View my skills": the avatar's skills screen share, without the avatar. All
 * of it comes up on a quick cascade and stays until it's closed. Steers clear
 * of the call card if it's open, as the spoken one does.
 */
export default function SkillsView({ onClose }: { onClose: () => void }) {
  const cues = useMemo(() => cascadeCues(), []);
  const [t, setT] = useState(-1);
  const [leaving, setLeaving] = useState(false);
  const card = useRef<HTMLElement | null>(document.querySelector<HTMLElement>('[data-avatar-card]'));
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const end = Math.max(...cueMoments(cues));
    if (motionOff()) {
      setT(Infinity);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const s = (now - t0) / 1000;
      if (s > end) return setT(Infinity);
      setT(s);
      raf = requestAnimationFrame(tick);
    };
    // one frame at "nothing yet", so every panel transitions in
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [cues]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const close = useCallback(() => {
    setLeaving(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(onClose, LEAVE_MS);
  }, [onClose]);

  return createPortal(<SkillsShare cues={cues} t={t} leaving={leaving} card={card} onClose={close} />, document.body);
}
