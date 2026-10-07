import { useEffect, useState } from 'react';

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

/**
 * The shirt the avatar is wearing (0 = the painted navy original). The
 * footer's pull-up panel wears the same print.
 */
const SHIRT_EVENT = 'guide:shirt';
let shirtNow = 0;

export function setGuideShirt(id: number) {
  shirtNow = id;
  window.dispatchEvent(new CustomEvent<number>(SHIRT_EVENT, { detail: id }));
}

export function useGuideShirt(): number {
  const [shirt, setShirt] = useState(shirtNow);
  useEffect(() => {
    const handler = (e: Event) => setShirt((e as CustomEvent<number>).detail);
    window.addEventListener(SHIRT_EVENT, handler);
    return () => window.removeEventListener(SHIRT_EVENT, handler);
  }, []);
  return shirt;
}

/** Something happened on the page the avatar can remark on. */
export type GuideNudge = 'footer';
const NUDGE_EVENT = 'guide:nudge';

export function guideNudge(n: GuideNudge) {
  window.dispatchEvent(new CustomEvent<GuideNudge>(NUDGE_EVENT, { detail: n }));
}

export function useGuideNudge(onNudge: (n: GuideNudge) => void) {
  useEffect(() => {
    const handler = (e: Event) => onNudge((e as CustomEvent<GuideNudge>).detail);
    window.addEventListener(NUDGE_EVENT, handler);
    return () => window.removeEventListener(NUDGE_EVENT, handler);
  }, [onNudge]);
}
