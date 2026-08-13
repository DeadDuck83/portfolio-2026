import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { track } from '../../lib/analytics';
import { getAnalyticsSnapshot } from '../../lib/telemetry/getAnalyticsSnapshot';
import type { AnalyticsSnapshot } from '../../lib/telemetry/types';
import { colors } from '../../theme/tokens';
import TelemetryChassis from './TelemetryChassis';
import '../../styles/telemetry.css';

/** Intentional pull — accidental scrolls should not open the bay. */
const OPEN_THRESHOLD_PX = 120;
/** Fallback bay height before ResizeObserver measures content. */
const FALLBACK_BAY_PX = 360;
/** Viewport-bottom fallback for edge grabs. */
const EDGE_ZONE_PX = 28;
/** Ignore tiny jitter before treating as a pull. */
const ARM_PX = 8;
/** Seam handle height when bay is open. */
const SEAM_PX = 28;

type DragMode = 'open' | 'close';

type DragState = {
  pointerId: number;
  startY: number;
  mode: DragMode;
  maxPull: number;
  maxPush: number;
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isHandle(target: EventTarget | null, attr: string): boolean {
  return target instanceof Element && Boolean(target.closest(`[${attr}]`));
}

/**
 * Lifts the site cover only as far as the telemetry bay needs —
 * bay stays content-sized at the bottom with a video bed underneath.
 */
export default function ChassisReveal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [lift, setLift] = useState(0);
  const [bayHeight, setBayHeight] = useState(FALLBACK_BAY_PX);
  const [dragging, setDragging] = useState(false);
  const [slamming, setSlamming] = useState(false);
  const [coverSettled, setCoverSettled] = useState(true);
  const [busy, setBusy] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const openingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const liftRef = useRef(0);
  const bayRef = useRef<HTMLElement | null>(null);
  const bayHeightRef = useRef(FALLBACK_BAY_PX);
  const openRef = useRef(false);

  useEffect(() => {
    liftRef.current = lift;
  }, [lift]);

  useEffect(() => {
    bayHeightRef.current = bayHeight;
  }, [bayHeight]);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const el = bayRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const measure = () => {
      const next = Math.ceil(el.getBoundingClientRect().height);
      if (next > 0) setBayHeight(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [snapshot, open]);

  const settleClosed = useCallback(() => {
    setOpen(false);
    setLift(0);
    setDragging(false);
    setSlamming(false);
    setCoverSettled(true);
  }, []);

  const slamClose = useCallback(() => {
    if (!openRef.current || slamming) return;
    setDragging(false);
    dragRef.current = null;
    document.documentElement.style.cursor = '';

    if (prefersReducedMotion()) {
      settleClosed();
      return;
    }

    // Freeze current lift into the CSS var the slam keyframes read.
    setSlamming(true);
  }, [slamming, settleClosed]);

  const settleOpen = useCallback((data: AnalyticsSnapshot) => {
    setSnapshot(data);
    setOpen(true);
    setLift(bayHeightRef.current || FALLBACK_BAY_PX);
    setDragging(false);
    setSlamming(false);
    // Copper chrome waits until the cover transform finishes.
    setCoverSettled(prefersReducedMotion());
  }, []);

  // Keep lift matched to bay once instruments mount / resize.
  useEffect(() => {
    if (!open || dragging || slamming) return;
    setLift(bayHeight);
  }, [open, bayHeight, dragging, slamming]);

  // Fallback if transform transitionend never fires (already at target lift).
  useEffect(() => {
    if (!open || slamming || coverSettled) return;
    const id = window.setTimeout(() => setCoverSettled(true), 560);
    return () => window.clearTimeout(id);
  }, [open, slamming, coverSettled]);

  const tryOpen = useCallback(async () => {
    if (openingRef.current || open) return;
    openingRef.current = true;
    setBusy(true);
    try {
      const data = await getAnalyticsSnapshot();
      settleOpen(data);
      track('TelemetryOpened', { source: data.source });
    } catch {
      setSnapshot(null);
      settleClosed();
    } finally {
      setBusy(false);
      openingRef.current = false;
    }
  }, [open, settleClosed, settleOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') slamClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, slamClose]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (busy || openingRef.current || slamming) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      const maxLift = bayHeightRef.current || FALLBACK_BAY_PX;

      if (open) {
        // Click/drag on the bay itself — leave it alone.
        if (isHandle(e.target, 'data-telemetry-bay')) return;

        const fromSeam = isHandle(e.target, 'data-chassis-cover');
        const seamTop = window.innerHeight - maxLift - SEAM_PX;
        const nearSeam =
          e.clientY >= seamTop && e.clientY <= seamTop + SEAM_PX + 20;

        if (fromSeam || nearSeam) {
          dragRef.current = {
            pointerId: e.pointerId,
            startY: e.clientY,
            mode: 'close',
            maxPull: 0,
            maxPush: 0,
          };
          setDragging(true);
          document.documentElement.style.cursor = 'grabbing';
          if (e.target instanceof Element) {
            try {
              e.target.setPointerCapture(e.pointerId);
            } catch {
              // window listeners still track the gesture
            }
          }
          return;
        }

        // Pointer down on the lifted site cover (outside the bay) → slam shut on click.
        // Track it; if they barely move, finish() treats it as an outside click.
        dragRef.current = {
          pointerId: e.pointerId,
          startY: e.clientY,
          mode: 'close',
          maxPull: 0,
          maxPush: 0,
        };
        return;
      }

      const fromHandle = isHandle(e.target, 'data-chassis-handle');
      const fromBottom = window.innerHeight - e.clientY <= EDGE_ZONE_PX;
      if (!fromHandle && !fromBottom) return;
      dragRef.current = {
        pointerId: e.pointerId,
        startY: e.clientY,
        mode: 'open',
        maxPull: 0,
        maxPush: 0,
      };

      setDragging(true);
      document.documentElement.style.cursor = 'grabbing';
      if (e.target instanceof Element) {
        try {
          e.target.setPointerCapture(e.pointerId);
        } catch {
          // window listeners still track the gesture
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId || slamming) return;
      const maxLift = bayHeightRef.current || FALLBACK_BAY_PX;

      if (drag.mode === 'open') {
        const upward = Math.max(0, drag.startY - e.clientY);
        drag.maxPull = Math.max(drag.maxPull, upward);
        if (upward >= ARM_PX) {
          suppressClickRef.current = true;
          setLift(Math.min(upward, maxLift));
          e.preventDefault();
        }
        return;
      }

      const downward = Math.max(0, e.clientY - drag.startY);
      drag.maxPush = Math.max(drag.maxPush, downward);
      if (downward >= ARM_PX) {
        suppressClickRef.current = true;
        if (!dragging) setDragging(true);
        setLift(Math.max(0, maxLift - downward));
        e.preventDefault();
      }
    };

    const finish = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      dragRef.current = null;
      document.documentElement.style.cursor = '';
      setDragging(false);
      const maxLift = bayHeightRef.current || FALLBACK_BAY_PX;

      if (drag.mode === 'open') {
        if (drag.maxPull >= OPEN_THRESHOLD_PX) {
          suppressClickRef.current = true;
          void tryOpen();
        } else {
          setLift(0);
          if (drag.maxPull < ARM_PX) suppressClickRef.current = false;
        }
        return;
      }

      // Outside click (no real drag) or a committed drag-down → slam shut.
      const outsideClick = drag.maxPush < ARM_PX;
      const dragClosed =
        drag.maxPush >= OPEN_THRESHOLD_PX || liftRef.current < maxLift * 0.55;

      if (outsideClick || dragClosed) {
        suppressClickRef.current = true;
        slamClose();
      } else {
        setLift(maxLift);
        if (drag.maxPush < ARM_PX) suppressClickRef.current = false;
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClickRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    window.addEventListener('click', onClickCapture, true);

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      window.removeEventListener('click', onClickCapture, true);
    };
  }, [open, busy, slamming, dragging, tryOpen, slamClose]);

  const reduced = prefersReducedMotion();
  const revealing = lift > 0 || open;
  const coverLift = slamming ? bayHeight : lift;
  const chromeVisible = open && !slamming && coverSettled;

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <TelemetryChassis
        ref={bayRef}
        snapshot={snapshot}
        active={open && !slamming}
        chromeVisible={chromeVisible}
        reducedMotion={reduced}
      />

      {/* Seam between cover and bay — drag down to close */}
      {chromeVisible ? (
        <div
          data-chassis-cover
          title="Drag down to close"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: bayHeight,
            height: SEAM_PX,
            zIndex: 130,
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(180deg, rgba(26,23,18,0.2), ${colors.bg})`,
            borderBottom: '1px solid rgba(196, 132, 74, 0.35)',
          }}
        >
          <div
            aria-hidden
            style={{
              width: 48,
              height: 4,
              borderRadius: 2,
              background: 'rgba(236, 230, 218, 0.28)',
            }}
          />
        </div>
      ) : null}

      <div
        className={slamming ? 'chassis-cover--slam' : undefined}
        style={
          {
            ['--chassis-lift' as string]: `${coverLift}px`,
            position: 'relative',
            zIndex: 1,
            minHeight: '100%',
            background: colors.bg,
            transform: slamming ? undefined : `translate3d(0, ${-lift}px, 0)`,
            transition:
              dragging || slamming || reduced
                ? 'none'
                : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: revealing && !slamming
              ? '0 24px 60px rgba(0,0,0,0.55), 0 1px 0 rgba(141,255,184,0.12)'
              : 'none',
            willChange: dragging || slamming ? 'transform' : undefined,
          } as CSSProperties
        }
        onTransitionEnd={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.propertyName !== 'transform') return;
          if (open && !slamming && !dragging) setCoverSettled(true);
        }}
        onAnimationEnd={(e) => {
          if (e.animationName !== 'chassis-slam-shut') return;
          settleClosed();
        }}
      >
        {children}
      </div>
    </div>
  );
}
