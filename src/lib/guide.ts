import { useEffect } from 'react';

/**
 * The avatar guide asks parts of the page to bring something into view
 * ("anchor on chapter 2 of the journey"). Sections opt in by listening; the
 * guide never reaches into their DOM, so either side can change freely.
 */
export type GuideFocus = { section: 'about'; step: number };

const EVENT = 'guide:focus';

export function guideFocus(focus: GuideFocus) {
  window.dispatchEvent(new CustomEvent<GuideFocus>(EVENT, { detail: focus }));
}

export function useGuideFocus(section: GuideFocus['section'], onFocus: (step: number) => void) {
  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<GuideFocus>).detail;
      if (d?.section === section) onFocus(d.step);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, [section, onFocus]);
}
