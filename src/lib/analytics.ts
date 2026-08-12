import LogRocket from 'logrocket';

type TrackProps = Record<string, string | number | boolean>;

const VISITOR_ID_KEY = 'portfolio_visitor_id';

/**
 * Stable anonymous visitor ID (localStorage). Used only to tell LogRocket
 * whether sessions belong to the same person — no name or email.
 * @see https://docs.logrocket.com/reference/identify
 */
export function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    // localStorage unavailable (private mode / SSR) — ephemeral ID for this load.
    return `ephemeral_${Date.now().toString(36)}`;
  }
}

/**
 * Associate this browser with a persistent anonymous UID so returning
 * visitors link across sessions. Omits name/email on purpose.
 */
export function identifyAnonymousVisitor() {
  if (!import.meta.env.PROD) return;
  LogRocket.identify(getOrCreateVisitorId());
}

/**
 * LogRocket custom events — production only (matches when LogRocket.init runs).
 * Safe no-op in dev/tests so components can call track freely.
 */
export function track(event: string, props?: TrackProps) {
  if (!import.meta.env.PROD) return;
  if (props) LogRocket.track(event, props);
  else LogRocket.track(event);
}
