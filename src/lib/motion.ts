import { useSyncExternalStore } from 'react';

/**
 * Motion, on or off, for the whole site. It's off when the visitor pauses it
 * (the Pause motion control, remembered in this browser) or when their system
 * asks for reduced motion. Everything that moves by itself follows this: the
 * cover videos, the Rive animations, the case-study loops, and every CSS
 * animation (through `<html data-motion="off">`, see global.css).
 *
 * WCAG 2.2.2 Pause, Stop, Hide: anything that moves by itself for more than
 * five seconds needs a way to stop it on the page itself; the system setting
 * alone doesn't count.
 */

const KEY = 'motion_paused';
const QUERY = '(prefers-reduced-motion: reduce)';

function readPaused(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

let paused = typeof window !== 'undefined' && readPaused();
const listeners = new Set<() => void>();

/** The visitor's system asks for reduced motion. */
export function systemReducesMotion(): boolean {
  return typeof window !== 'undefined' && Boolean(window.matchMedia?.(QUERY).matches);
}

/** Nothing should move by itself: paused here, or reduced by the system. */
export function motionOff(): boolean {
  return paused || systemReducesMotion();
}

/** Pause (or resume) motion everywhere, and remember it in this browser. */
export function setMotionPaused(next: boolean): void {
  paused = next;
  try {
    if (next) localStorage.setItem(KEY, '1');
    else localStorage.removeItem(KEY);
  } catch {
    // storage blocked: the choice lasts for this page only
  }
  emit();
}

function reflect() {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.motion = motionOff() ? 'off' : 'on';
}

function emit() {
  reflect();
  listeners.forEach((fn) => fn());
}

export function subscribeMotion(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Call once at startup: marks the page before it first paints, and follows the system setting. */
export function initMotion(): void {
  reflect();
  window.matchMedia?.(QUERY).addEventListener?.('change', emit);
}

/** True while motion is off (paused or system-reduced); re-renders when that changes. */
export function useMotionOff(): boolean {
  return useSyncExternalStore(subscribeMotion, motionOff, () => false);
}

/** True while the system asks for reduced motion. */
export function useSystemReducesMotion(): boolean {
  return useSyncExternalStore(subscribeMotion, systemReducesMotion, () => false);
}
