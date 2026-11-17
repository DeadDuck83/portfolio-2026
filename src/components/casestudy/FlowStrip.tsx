import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type { ProductFlow } from '../../data/caseStudies/types';
import { colors, fonts, weights } from '../../theme/tokens';
import styles from './flowStrip.module.css';

const num = (i: number) => String(i + 1).padStart(2, '0');

/**
 * The finished product, first: one card per flow on a strip that runs off the
 * right edge. Scroll it sideways (trackpad or touch); click a card to see every
 * screen in that flow.
 */
export default function FlowStrip({ flows }: { flows: ProductFlow[] }) {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => {
    setOpen((i) => {
      if (i !== null) requestAnimationFrame(() => cardRefs.current[i]?.focus());
      return null;
    });
  }, []);

  return (
    <div className={styles.strip}>
      <ol className={styles.track} aria-label="The finished product">
        {flows.map((f, i) => {
          const cover = f.screens[f.cover ?? 0] ?? f.screens[0];
          return (
            <li key={f.title} className={styles.item}>
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
                  <img className={styles.screen} src={cover.src} alt="" loading={i < 3 ? 'eager' : 'lazy'} draggable={false} />
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
          <span className={styles.eyebrow}>
            Flow {num(index)} / {num(last)}
          </span>
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
        style={{ '--n': f.screens.length, ...(room ? { '--room': `${room}px` } : {}) } as CSSProperties}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {f.screens.map((s, i) => (
          <li key={s.src} className={styles.step}>
            <div className={styles.phone} data-scroll tabIndex={0} role="region" aria-label={s.label}>
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
