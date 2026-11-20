import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type { Brand, FlowDevice, ProductFlow } from '../../data/caseStudies/types';
import { motionOff } from '../../lib/motion';
import { colors, fonts, weights } from '../../theme/tokens';
import styles from './flowStrip.module.css';
import Label from '../../ui/Label';

const num = (i: number) => String(i + 1).padStart(2, '0');

/** Screen shape (width / height) per device; a bare screen is a phone. */
const SCREEN_AR: Record<FlowDevice, number> = {
  phone: 393 / 852,
  tablet: 4402 / 2982,
  ipad: 1024 / 1366,
  laptop: 1512 / 982,
  monitor: 16 / 10,
  tv: 16 / 9,
};

/**
 * The finished product, first: one card per flow on a full-width band in the
 * product's colour, running off the right edge. Scroll it sideways (trackpad, touch
 * or the ← → buttons); click a card to see every screen in that flow. Two variants,
 * picked by the data: Screens (bare phone screens rising from a line) when no flow
 * has a `frame`, and Devices (each flow's whole device picture floating on the band,
 * with a soft glow) when they do. Use it at the end of a case study's hero, in place
 * of the hero figure. Data: `caseStudy.flows` (`ProductFlow[]`) and
 * `caseStudy.brand`; without a brand the band is the portfolio's olive.
 *
 * @import import FlowStrip from '../components/casestudy/FlowStrip';
 */
export default function FlowStrip({ flows, brand }: { flows: ProductFlow[]; brand?: Brand }) {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const trackRef = useRef<HTMLOListElement | null>(null);
  const trackId = useId();
  const [edges, setEdges] = useState({ back: false, more: false });

  // Is there more of the strip either side? The next card doesn't always
  // peek in, and a mouse wheel can't scroll sideways, so ← → say so.
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const measure = () => {
      const max = t.scrollWidth - t.clientWidth;
      const back = t.scrollLeft > 2;
      const more = t.scrollLeft < max - 2;
      setEdges((e) => (e.back === back && e.more === more ? e : { back, more }));
    };
    measure();
    t.addEventListener('scroll', measure, { passive: true });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    ro?.observe(t);
    return () => {
      t.removeEventListener('scroll', measure);
      ro?.disconnect();
    };
  }, []);

  // one card at a time: the next (or previous) card lines up on the text column
  const step = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const line = t.getBoundingClientRect().left + (parseFloat(getComputedStyle(t).paddingLeft) || 0);
    const offsets = Array.from(t.children, (li) => li.getBoundingClientRect().left - line);
    const by = dir > 0 ? offsets.find((o) => o > 2) : offsets.reverse().find((o) => o < -2);
    if (by !== undefined) t.scrollBy({ left: by, behavior: motionOff() ? 'auto' : 'smooth' });
  };

  const close = useCallback(() => {
    setOpen((i) => {
      if (i !== null) requestAnimationFrame(() => cardRefs.current[i]?.focus());
      return null;
    });
  }, []);

  // device pictures share one scale: the tallest fills the strip's height,
  // and on a narrow screen the widest fits it
  const frames = flows.flatMap((f) => (f.frame ? [f.frame] : []));
  const trackStyle = frames.length
    ? ({
        '--tallest': Math.max(...frames.map((fr) => fr.size[1])),
        '--widest': Math.max(...frames.map((fr) => fr.size[0])),
        // the whole row of devices, for the floor light under it
        '--sumw': frames.reduce((sum, fr) => sum + fr.size[0], 0),
        '--n': frames.length,
      } as CSSProperties)
    : undefined;

  return (
    <div
      className={styles.strip}
      data-frames={frames.length > 0 || undefined}
      data-highlight={(frames.length > 0 && brand?.highlight) || undefined}
      style={brand ? ({ '--band': brand.color, '--ink': brand.ink, '--hl': brand.highlight } as CSSProperties) : undefined}
    >
      <ol
        ref={trackRef}
        id={trackId}
        className={styles.track}
        aria-label="The finished product"
        data-frames={frames.length > 0 || undefined}
        style={trackStyle}
      >
        {flows.map((f, i) => {
          const cover = f.screens[f.cover ?? 0] ?? f.screens[0];
          const loading = i < 3 ? 'eager' : 'lazy';
          const fr = f.frame;
          const img = (
            <img className={fr ? styles.shot : styles.screen} src={cover.src} alt="" loading={loading} draggable={false} />
          );
          const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
          return (
            <li
              key={f.title}
              className={styles.item}
              data-frame={fr ? '' : undefined}
              style={fr ? ({ '--iw': fr.size[0], '--ih': fr.size[1], '--i': i } as CSSProperties) : undefined}
            >
              {fr && f.glow && (
                <span className={styles.glow} aria-hidden="true">
                  {f.glow.map((c, j) => (
                    <span key={j} className={styles.blob} style={{ '--c': c } as CSSProperties}>
                      <span />
                    </span>
                  ))}
                </span>
              )}
              <button
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                className={styles.card}
                onClick={() => setOpen(i)}
                aria-label={`${f.title}: open all ${f.screens.length} screens`}
              >
                <span className={styles.plate}>
                  {fr ? (
                    <span
                      className={styles.device}
                      style={
                        {
                          '--sl': pct(fr.screen[0]),
                          '--st': pct(fr.screen[1]),
                          '--sw': pct(fr.screen[2]),
                          '--sh': pct(fr.screen[3]),
                          '--sy': fr.align === 'center' ? '50%' : undefined,
                        } as CSSProperties
                      }
                    >
                      {img}
                      <img className={styles.shell} src={fr.src} alt="" loading={loading} draggable={false} />
                    </span>
                  ) : (
                    img
                  )}
                </span>
                <span className={styles.caption}>
                  <span className={styles.title} style={{ fontFamily: fonts.display, fontWeight: weights.display }}>
                    {f.title}.
                  </span>
                  <span className={styles.line}>{f.line}</span>
                  <span className={styles.more}>
                    {f.screens.length} screens <span aria-hidden="true">→</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {(edges.back || edges.more) && (
        <div className={styles.stripNav}>
          <button
            type="button"
            className={styles.stripArrow}
            aria-label="Previous"
            aria-controls={trackId}
            aria-disabled={!edges.back}
            onClick={() => edges.back && step(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className={styles.stripArrow}
            aria-label="Next"
            aria-controls={trackId}
            aria-disabled={!edges.more}
            onClick={() => edges.more && step(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {open !== null &&
        createPortal(
          <FlowViewer flows={flows} index={open} onIndex={setOpen} onClose={close} />,
          document.body,
        )}
    </div>
  );
}

/**
 * One flow, open: every screen side by side at a readable size. Tall screens
 * scroll inside their own frame, like on the phone. ←/→ move between flows,
 * Escape (or the backdrop) closes.
 */
function FlowViewer({
  flows,
  index,
  onIndex,
  onClose,
}: {
  flows: ProductFlow[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const rowRef = useRef<HTMLOListElement>(null);
  const f = flows[index];
  const last = flows.length - 1;
  const ar = SCREEN_AR[f.device ?? 'phone'];
  // the height left for the screens once the header has laid out, so they
  // size to the real space on every device instead of a guess
  const [room, setRoom] = useState<number | null>(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const measure = () => setRoom(row.clientHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' && index < last) onIndex(index + 1);
      else if (e.key === 'ArrowLeft' && index > 0) onIndex(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, last, onIndex, onClose]);

  // a new flow starts at its first screen
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollLeft = 0;
    row.querySelectorAll('[data-scroll]').forEach((el) => {
      el.scrollTop = 0;
    });
  }, [index]);

  return (
    <div
      className={styles.viewer}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.bar}>
        <div className={styles.barText}>
          {/* .counter: hidden on very short screens (flowStrip.module.css) */}
          <Label tone="muted" as="span" className={styles.counter}>
            Flow {num(index)} / {num(last)}
          </Label>
          <h2 id={titleId} className={styles.viewTitle} style={{ fontFamily: fonts.display, fontWeight: weights.display }}>
            {f.title}
            <span style={{ color: colors.accent }}>.</span>
          </h2>
          <p className={styles.viewLine}>{f.line}</p>
        </div>
        <div className={styles.barActions}>
          <button type="button" className={styles.arrow} onClick={() => onIndex(index - 1)} disabled={index === 0} aria-label="Previous flow">
            ←
          </button>
          <button type="button" className={styles.arrow} onClick={() => onIndex(index + 1)} disabled={index === last} aria-label="Next flow">
            →
          </button>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <ol
        ref={rowRef}
        className={styles.row}
        data-wide={ar > 1 || undefined}
        data-device={f.device ?? 'phone'}
        style={{ '--n': f.screens.length, '--ar': ar, ...(room ? { '--room': `${room}px` } : {}) } as CSSProperties}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {f.screens.map((s, i) => (
          <li key={s.src} className={styles.step}>
            <div className={styles.frame} data-scroll tabIndex={0} role="region" aria-label={s.label}>
              <img src={s.src} alt={s.alt} draggable={false} />
            </div>
            <span className={styles.stepLabel}>
              <span className={styles.stepNum}>{num(i)}</span> {s.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
