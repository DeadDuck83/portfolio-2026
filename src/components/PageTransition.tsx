import type { ReactNode } from 'react';
import { useLocation } from 'react-router';

/** Page-slide timing. Tweak these to change the transition feel. */
const DURATION = '0.5s';
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Directional page slide. Keying the inner wrapper on `pathname` remounts the
 * routed page on navigation; it then slides into place — from the right when
 * moving into a work / case-study page, from the left when returning home — so
 * forward/back reads as spatial movement instead of a same-page scroll jump.
 *
 * The outer wrapper uses `overflow-x: clip` to hide the horizontal travel.
 * `clip` (unlike `hidden`) does NOT create a scroll container, so sticky
 * headers inside the page keep sticking to the viewport.
 *
 * Hash-only changes keep the same pathname, so on-page anchor clicks
 * (About / Work / Contact, chapter nav) don't retrigger the slide.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const enterFrom = pathname.startsWith('/work') ? 'slideInRight' : 'slideInLeft';
  return (
    <div style={{ overflowX: 'clip' }}>
      {/*
        `backwards` (not `forwards`/`both`) so no `transform` lingers after the
        slide — a retained transform would establish a containing block and
        break the page's `position: fixed` chrome (progress bar, grain overlay).
      */}
      <div key={pathname} style={{ animation: `${enterFrom} ${DURATION} ${EASING} backwards` }}>
        {children}
      </div>
    </div>
  );
}
