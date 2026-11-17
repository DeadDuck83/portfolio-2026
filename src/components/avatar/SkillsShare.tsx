import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { colors, fonts, weights } from '../../theme/tokens';
import SkillIcon from './SkillIcon';
import { SKILL_GROUPS, type SkillCues } from './skills';
import styles from './skillsShare.module.css';

/** `align`: content sits on the side away from the card, so it stays put when the card grows or shrinks. */
type Box = { top: number; left: number; width: number; height: number; align: 'flex-start' | 'center' | 'flex-end' };

const GAP = 16;
const ORIGIN = { 'flex-start': 'top center', center: 'center', 'flex-end': 'bottom center' } as const;

/**
 * The share area: the middle 80% of the screen, both ways, minus the call
 * card where they overlap, so nothing he "shares" lands under his own face.
 */
function frame(card: HTMLElement | null): Box {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const left = W * 0.1;
  const right = W * 0.9;
  let top = H * 0.1;
  let bottom = H * 0.9;
  const r = card && !card.hidden ? card.getBoundingClientRect() : null;
  if (!r || r.width === 0) return { top, left, width: right - left, height: bottom - top, align: 'center' };
  const low = r.top + r.height / 2 > H / 2;
  if (r.left < right && r.right > left && r.top < bottom && r.bottom > top) {
    if (low) bottom = Math.min(bottom, r.top - GAP);
    else top = Math.max(top, r.bottom + GAP);
  }
  return { top, left, width: right - left, height: Math.max(0, bottom - top), align: low ? 'flex-start' : 'flex-end' };
}

const same = (a: Box, b: Box) =>
  a.align === b.align &&
  Math.abs(a.top - b.top) < 1 &&
  Math.abs(a.left - b.left) < 1 &&
  Math.abs(a.width - b.width) < 1 &&
  Math.abs(a.height - b.height) < 1;

/**
 * Derek "shares his screen" while he lists his skills: an invisible layer over
 * the page where each section title and tool appears as he names it. It never
 * takes clicks or moves the page; it clears when he's done or you ask
 * something else.
 */
export default function SkillsShare({
  cues,
  t,
  leaving,
  card,
}: {
  cues: SkillCues;
  /** seconds into the line; Infinity shows everything */
  t: number;
  leaving?: boolean;
  card: RefObject<HTMLElement | null>;
}) {
  const [box, setBox] = useState<Box>(() => frame(card.current));
  const gridRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);

  // short screens (a phone with the card open, a landscape tablet): shrink the
  // whole share to fit rather than spill under the card. Hidden items already
  // hold their space, so the natural size never changes mid-answer.
  useLayoutEffect(() => {
    const g = gridRef.current;
    if (!g) return;
    setFit(Math.min(1, box.height / g.scrollHeight, box.width / g.scrollWidth));
  }, [box]);

  // the card can grow, shrink to its idle size or be dragged to another corner
  useEffect(() => {
    const update = () => setBox((prev) => {
      const next = frame(card.current);
      return same(prev, next) ? prev : next;
    });
    update();
    const id = window.setInterval(update, 300);
    window.addEventListener('resize', update);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('resize', update);
    };
  }, [card]);

  return (
    <div
      className={`${styles.share} ${leaving ? styles.leaving : ''}`}
      style={{ top: box.top, left: box.left, width: box.width, height: box.height, alignItems: box.align }}
      aria-hidden="true"
    >
      <div
        ref={gridRef}
        className={styles.grid}
        style={fit < 1 ? { transform: `scale(${fit})`, transformOrigin: ORIGIN[box.align] } : undefined}
      >
        {SKILL_GROUPS.map((g, gi) => (
          <div
            key={g.title}
            className={`${styles.group} ${t >= cues.groups[gi] ? styles.on : ''} ${g.soft ? styles.soft : ''}`}
          >
            <div className={styles.title} style={{ fontFamily: fonts.display, fontWeight: weights.display }}>
              {g.title}
              <span style={{ color: colors.accent }}>.</span>
            </div>
            <ul className={styles.items}>
              {g.items.map((it, ii) => (
                <li key={it.icon} className={`${styles.item} ${t >= cues.items[gi][ii] ? styles.on : ''}`}>
                  <SkillIcon id={it.icon} className={styles.icon} />
                  <span className={styles.label}>{it.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
