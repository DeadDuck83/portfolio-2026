/** Which screen corner the guide is anchored to (draggable; remembered). */
export type Corner = { h: 'left' | 'right'; v: 'top' | 'bottom' };

const KEY = 'avatar_corner';
export const DEFAULT_CORNER: Corner = { h: 'right', v: 'bottom' };

export function loadCorner(): Corner {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Corner | null;
    if (c && (c.h === 'left' || c.h === 'right') && (c.v === 'top' || c.v === 'bottom')) return c;
  } catch {
    /* ignore */
  }
  return DEFAULT_CORNER;
}

export function saveCorner(c: Corner) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* private mode */
  }
}

/** The corner nearest to a point (e.g. the card's centre on release). */
export function nearestCorner(x: number, y: number, w: number, h: number): Corner {
  return { h: x < w / 2 ? 'left' : 'right', v: y < h / 2 ? 'top' : 'bottom' };
}

/** Inline position for an element anchored to `c` (the gap comes from CSS). */
export function cornerStyle(c: Corner): React.CSSProperties {
  return { [c.h]: 'var(--edge)', [c.v]: 'var(--edge)' } as React.CSSProperties;
}
