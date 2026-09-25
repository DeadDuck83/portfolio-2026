/**
 * Pure math behind the pinned About journey — scroll timeline, easing and the
 * dark ↔ light theme blend. No DOM access, so it can be unit-tested directly.
 */

import { border, colors, paper } from '../../theme/tokens';

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const smoothstep = (v: number) => {
  const c = clamp01(v);
  return c * c * (3 - 2 * c);
};

/** Smoothstepped 0 → 1 as `q` moves from `s0` to `s1`. */
export const ramp = (q: number, s0: number, s1: number) => smoothstep((q - s0) / (s1 - s0));

type Rgba = [number, number, number, number];

export const dark = {
  paper: colors.bg,
  card: colors.cardActive,
  ink: colors.text,
  'ink-2': colors.textBody,
  'ink-3': colors.textMuted,
  em: colors.accentBright,
  rule: border.chip,
  edge: border.hairlineStronger,
  tag: border.chip,
};

const light = {
  paper: paper.bg,
  card: paper.card,
  ink: paper.text,
  'ink-2': paper.textBody,
  'ink-3': paper.textMuted,
  em: paper.accentBright,
  rule: paper.rule,
  edge: paper.edge,
  tag: paper.chip,
};

/** Text colors flip inside the opacity dip rather than crossfading through grey. */
const INK_KEYS = new Set(['ink', 'ink-2', 'ink-3', 'em']);

function parse(c: string): Rgba {
  if (c[0] === '#') {
    return [
      parseInt(c.slice(1, 3), 16),
      parseInt(c.slice(3, 5), 16),
      parseInt(c.slice(5, 7), 16),
      1,
    ];
  }
  const m = c.slice(c.indexOf('(') + 1, -1).split(',').map(Number);
  return [m[0], m[1], m[2], m.length > 3 ? m[3] : 1];
}

const pairs = (Object.keys(dark) as (keyof typeof dark)[]).map(
  (k) => [k, parse(dark[k]), parse(light[k])] as const,
);

export interface ThemeFrame {
  /** Eased theme position: 0 = dark (site default), 1 = light. */
  t: number;
  /** Content opacity multiplier — dips to 0 at the midpoint while ink flips. */
  dip: number;
  /** `--ab-*` custom property values. */
  vars: Record<string, string>;
}

export function themeAt(raw: number): ThemeFrame {
  const t = smoothstep(raw);
  const tInk = ramp(t, 0.4, 0.6);
  const vars: Record<string, string> = {};
  for (const [k, d, l] of pairs) {
    const w = INK_KEYS.has(k) ? tInk : t;
    const c = d.map((v, i) => v + (l[i] - v) * w);
    vars[`--ab-${k}`] =
      `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${c[3].toFixed(3)})`;
  }
  return { t, dip: smoothstep(Math.abs(2 * t - 1)), vars };
}

export type SegmentKind = 'in' | 'step' | 'out';

export interface Segment {
  kind: SegmentKind;
  start: number;
  len: number;
  /** Scroll distance spent moving; the remainder of `len` holds still. */
  travel: number;
  x0: number;
  x1: number;
  /** Chapter index for `step` segments (0 = first chapter). */
  i?: number;
}

export interface TimelineConfig {
  vh: number;
  /** Horizontal distance between chapter centres (px). */
  spacing: number;
  count: number;
  /** Scroll px per px of horizontal travel. */
  pace: number;
  /** Scroll px each chapter holds in focus. */
  dwell: number;
  /** Include the dark → light entry segment. */
  themeShift: boolean;
}

/**
 * in (theme shift) → one step per chapter (travel, then hold) → out (chapters
 * slide away, Today rises). Chapter i is centred at x = (i + 1) * spacing.
 */
export function buildTimeline(cfg: TimelineConfig): { segs: Segment[]; total: number } {
  const segs: Segment[] = [];
  let total = 0;
  const push = (kind: SegmentKind, travel: number, hold: number, x0: number, x1: number, i?: number) => {
    const t = Math.max(0, Math.round(travel));
    const len = t + Math.max(0, Math.round(hold));
    segs.push({ kind, start: total, len, travel: t, x0, x1, i });
    total += len;
  };
  const move = cfg.spacing * cfg.pace;
  if (cfg.themeShift) push('in', cfg.vh * 0.22, 0, 0, 0);
  for (let i = 0; i < cfg.count; i++) {
    push('step', move, cfg.dwell, i * cfg.spacing, (i + 1) * cfg.spacing, i);
  }
  push('out', move + cfg.dwell + cfg.vh * 0.15, 0, cfg.count * cfg.spacing, (cfg.count + 1) * cfg.spacing);
  return { segs, total };
}

/** Linear progress through a segment (0–1), zero-length segments snap. */
export function segmentProgress(seg: Segment, y: number) {
  if (seg.len <= 0) return y >= seg.start ? 1 : 0;
  return clamp01((y - seg.start) / seg.len);
}

export function locate(segs: Segment[], y: number) {
  let seg = segs[segs.length - 1];
  for (const sg of segs) {
    if (y <= sg.start + sg.len) {
      seg = sg;
      break;
    }
  }
  const u = segmentProgress(seg, y);
  const moved = seg.travel > 0 ? clamp01((y - seg.start) / seg.travel) : 1;
  const x = seg.x0 + (seg.x1 - seg.x0) * smoothstep(moved);
  return { seg, u, x, moved };
}

/**
 * Fraction of a chapter's travel after which it counts as "in focus". Lower =
 * the chapter (and its Rive pose) locks in as you approach it, so you don't
 * have to land dead-centre for the right chapter to show. Tune to taste.
 */
export const LOCK_AT = 0.5;

/**
 * Chapter to report for Rive / analytics. A chapter takes focus once it is
 * `lockAt` of the way into its travel; before chapter 1 does, we are still on
 * the Intro (chapter 0). Deeper chapters return `null` — "keep whatever is
 * already locked" — so the value stays put through each chapter's hold.
 */
export function lockedChapter(
  seg: Segment,
  moved: number,
  todayShown: boolean,
  count: number,
  lockAt: number = LOCK_AT,
): number | null {
  if (todayShown) return count + 1;
  if (seg.kind === 'in') return 0;
  if (seg.kind === 'step') {
    if (moved >= lockAt) return (seg.i ?? 0) + 1;
    return seg.i === 0 ? 0 : null;
  }
  return null;
}

/**
 * Rive fade. The figure is fully on by the time the paper is light and chapter
 * 1 begins its travel, then stays on through every chapter. Reaching full
 * before the chapter-1 approach — rather than during it — means the Intro pose
 * is visible for the whole approach in *both* directions: on the way in, and
 * on the way back up as the figure morphs from chapter 1 back to the Intro.
 * (The end-of-section fade-out is applied separately by the caller.)
 */
export function riveOpacityAt(y: number, first: Segment | undefined, themeShift: boolean) {
  if (!first) return 1;
  const full = themeShift ? first.start : Math.max(1, first.travel * 0.3);
  const startFade = themeShift ? first.start * 0.7 : 0;
  return ramp(y, startFade, full);
}
