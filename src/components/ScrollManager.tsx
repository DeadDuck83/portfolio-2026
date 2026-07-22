import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Handles scroll behavior across client-side navigations:
 *  - Navigating to a new page with no hash → scroll to top.
 *  - Navigating with a hash (e.g. /#work or /work/plmc#c3) → scroll the
 *    target element into view once it has mounted.
 * Anchor clicks within the same page are left to the browser's native
 * smooth-scroll (html { scroll-behavior: smooth }).
 *
 * The top-scroll runs in useLayoutEffect (before the browser paints) so a new
 * page is already at the top on its first painted frame — otherwise it would
 * paint once at the previous scroll position and visibly jump, which is
 * especially obvious mid-slide.
 *
 * It also forces `behavior: 'instant'`: the page uses `scroll-behavior: smooth`
 * (nice for anchor links), which would otherwise animate this reset as a
 * visible scroll up the outgoing content instead of a clean cut to the top.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      // Defer to allow the destination section to render/lay out first.
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView();
        else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}
