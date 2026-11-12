/**
 * Tiny shared state between the hero's live avatar tile and the global
 * AvatarGuide:
 * - `visible`: the tile is on screen, so the guide hides its floating button
 *   (the tile is the way in).
 * - `callOpen`: the call card is open, so the tile steps aside.
 * - the tile's element, so the call card can grow out of it and shrink back
 *   into it.
 * - the card's audio unlock, so the tap that opens it can unlock his voice.
 */
type Listener = () => void;

let visible = false;
let open = false;
let slot: HTMLElement | null = null;
let unlock: (() => void) | null = null;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());

export const AVATAR_OPEN_EVENT = 'avatar:open';

export function setDockVisible(v: boolean) {
  if (v === visible) return;
  visible = v;
  emit();
}
export const dockVisible = () => visible;

export function setCallOpen(v: boolean) {
  if (v === open) return;
  open = v;
  emit();
}
export const callOpen = () => open;

export function subscribeDock(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** The hero tile registers itself while mounted (null on unmount). */
export function registerDockSlot(el: HTMLElement | null) {
  slot = el;
}
/** True while a hero tile is on the page (it replaces the auto-open). */
export const dockMounted = () => slot !== null;

/** The tile's box, if it's on screen: where the call card grows from and returns to. */
export function dockSlotRect(): DOMRect | null {
  if (!slot) return null;
  const r = slot.getBoundingClientRect();
  if (r.width === 0 || r.bottom <= 0 || r.top >= window.innerHeight) return null;
  return r;
}

/** The call card hands over its audio unlock (see AvatarController.unlock). */
export function registerAudioUnlock(fn: (() => void) | null) {
  unlock = fn;
}
/** Call from a tap that opens the card, so his greeting can have sound. */
export function unlockAvatarAudio() {
  unlock?.();
}

/** Ask the guide to open its call card. Call from the tap itself. */
export function openAvatar(source: string) {
  unlockAvatarAudio();
  window.dispatchEvent(new CustomEvent(AVATAR_OPEN_EVENT, { detail: { source } }));
}
