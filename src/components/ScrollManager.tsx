import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Handles scroll behavior across client-side navigations:
 *  - Navigating to a new page with no hash → scroll to top.
 *  - Navigating with a hash (e.g. /#work or /work/plmc#c3) → scroll the
 *    target element into view once it has mounted.
 * Anchor clicks within the same page are left to the browser's native
 * smooth-scroll (html { scroll-behavior: smooth }).
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Defer to allow the destination section to render first.
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView();
        else window.scrollTo(0, 0);
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
