/**
 * His voice plays through one shared audio element. Safari (and every browser
 * on iOS) only lets an audio element make sound once a tap has started it;
 * after that, the same element can play later lines on its own. So the tap
 * that opens the card starts this element, even if the avatar itself hasn't
 * finished loading yet. Kept free of the Rive code so the page can call it
 * before any of that loads.
 */

/** A silent clip to start the element with from a tap. */
export const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

let el: HTMLAudioElement | null = null;

/** The one element every line plays through. */
export function voiceElement(): HTMLAudioElement {
  if (!el) {
    el = new Audio();
    el.preload = 'auto';
  }
  return el;
}

/** Call straight from a tap: start the element (silently) so his lines can have sound. */
export function primeVoice() {
  const a = voiceElement();
  if (!a.paused) return; // already playing, so already allowed
  a.src = SILENCE;
  a.play().catch(() => {});
}
