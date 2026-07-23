import LogRocket from 'logrocket';

type TrackProps = Record<string, string | number | boolean>;

/**
 * LogRocket custom events — production only (matches when LogRocket.init runs).
 * Safe no-op in dev/tests so components can call track freely.
 */
export function track(event: string, props?: TrackProps) {
  if (!import.meta.env.PROD) return;
  if (props) LogRocket.track(event, props);
  else LogRocket.track(event);
}
