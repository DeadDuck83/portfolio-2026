import { track } from './analytics';

/**
 * EngagedSession: sent once per browser session when the visitor has been
 * actively on the page for a while AND has done something deliberate.
 * Sessions without it are the "bounced, passive or automated" pile.
 *
 * Active time only counts while the tab is visible, and only up to
 * `idleMs` after the last input: a tab left open in the background, or a
 * walk away from the desk, doesn't add up.
 */
export const ENGAGEMENT = {
  /** active, visible time needed */
  activeMs: 15_000,
  /** deliberate inputs needed (taps, clicks, keys, wheel / touch scrolls) */
  interactions: 2,
  /** time after the last input that still counts as active (reading) */
  idleMs: 30_000,
  /** inputs closer together than this count once (one flick ≠ ten interactions) */
  gapMs: 800,
};

const SENT_KEY = 'portfolio_engaged';

/** Pure engagement state, driven by timestamps (testable without a DOM). */
export class EngagementMeter {
  active = 0;
  inputs = 0;
  private lastTick: number;
  private lastInput: number;
  private lastCounted = -Infinity;
  private visible: boolean;
  private cfg: typeof ENGAGEMENT;

  constructor(now: number, visible: boolean, cfg = ENGAGEMENT) {
    this.cfg = cfg;
    this.lastTick = now;
    this.lastInput = now; // landing counts as the start of reading
    this.visible = visible;
  }

  /** Add the active time since the last tick. */
  private credit(now: number) {
    const end = Math.min(now, this.lastInput + this.cfg.idleMs);
    if (this.visible && end > this.lastTick) this.active += end - this.lastTick;
    this.lastTick = now;
  }

  input(now: number) {
    this.credit(now);
    this.lastInput = now;
    if (now - this.lastCounted >= this.cfg.gapMs) {
      this.inputs++;
      this.lastCounted = now;
    }
  }

  visibility(now: number, visible: boolean) {
    this.credit(now);
    this.visible = visible;
    if (visible) this.lastInput = now; // coming back to the tab is a fresh look
  }

  check(now: number) {
    this.credit(now);
  }

  get engaged() {
    return this.active >= this.cfg.activeMs && this.inputs >= this.cfg.interactions;
  }

  /** How long until the active-time bar could be met, if nothing else happens. */
  msToGo(now: number) {
    const left = this.cfg.activeMs - this.active;
    const window = this.lastInput + this.cfg.idleMs - now;
    return this.visible && left > 0 && window > 0 ? Math.min(left, window) : null;
  }
}

/**
 * Listen for deliberate input until the session is engaged, then send
 * EngagedSession and stop listening. Returns a cleanup function.
 */
export function startEngagementTracking(): () => void {
  try {
    if (sessionStorage.getItem(SENT_KEY)) return () => {};
  } catch {
    /* storage blocked: track per page load instead */
  }
  const meter = new EngagementMeter(performance.now(), document.visibilityState === 'visible');
  let timer = 0;
  const opts = { capture: true, passive: true } as const;

  const done = () => {
    try {
      sessionStorage.setItem(SENT_KEY, '1');
    } catch {
      /* fine */
    }
    track('EngagedSession', { activeSeconds: Math.round(meter.active / 1000), interactions: meter.inputs });
    stop();
  };
  const evaluate = () => {
    const now = performance.now();
    meter.check(now);
    if (meter.engaged) return done();
    window.clearTimeout(timer);
    const wait = meter.msToGo(now);
    if (wait !== null) timer = window.setTimeout(evaluate, wait + 50);
  };
  // only real, trusted input: scripted clicks and the avatar's own scrolling don't count
  const onInput = (e: Event) => {
    if (!e.isTrusted) return;
    meter.input(performance.now());
    evaluate();
  };
  const onVisibility = () => {
    meter.visibility(performance.now(), document.visibilityState === 'visible');
    evaluate();
  };
  const INPUTS = ['pointerdown', 'keydown', 'wheel', 'touchmove'] as const;

  function stop() {
    window.clearTimeout(timer);
    for (const t of INPUTS) window.removeEventListener(t, onInput, opts);
    document.removeEventListener('visibilitychange', onVisibility);
  }

  for (const t of INPUTS) window.addEventListener(t, onInput, opts);
  document.addEventListener('visibilitychange', onVisibility);
  evaluate();
  return stop;
}
