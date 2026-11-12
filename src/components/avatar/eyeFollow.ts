import { useEffect, type RefObject } from 'react';
import type { AvatarController } from './controller';

/** avatar.riv artboard size. */
export const ARTBOARD = { w: 1122, h: 1402 };

/**
 * The eyes follow the mouse anywhere on the page, not just over the avatar.
 * `host` holds the Rive canvas, drawn with Fit.Cover + TopCenter. Used by the
 * hero tile and by the call card.
 */
export function useEyeFollow(
  host: RefObject<HTMLElement | null>,
  ctl: RefObject<AvatarController | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let seq = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const canvas = host.current?.querySelector('canvas');
        const c = ctl.current;
        if (!canvas || !c) return;
        const r = canvas.getBoundingClientRect();
        if (r.width === 0) return;
        // Fit.Cover + TopCenter: artboard scaled to cover, centred horizontally
        const s = Math.max(r.width / ARTBOARD.w, r.height / ARTBOARD.h);
        const ox = (r.width - ARTBOARD.w * s) / 2;
        c.set('hostCursorX', (e.clientX - r.left - ox) / s);
        c.set('hostCursorY', (e.clientY - r.top) / s);
        c.set('hostCursorSeq', ++seq);
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [active, host, ctl]);
}
