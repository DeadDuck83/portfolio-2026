const EMAIL = 'moore8577@gmail.com';
const SUBJECT = 'You are exactly who I was looking for';
const STORAGE_KEY = 'portfolio_attribution_source';

/** First-touch acquisition flags → display label in the mailto body. */
export const SOURCE_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  wellfound: 'WellFound',
  greenhouse: 'Greenhouse',
  indeed: 'Indeed',
};

/**
 * On first load of a session, remember how the visitor arrived
 * (`?linkedin`, `?utm_source=linkedin`, etc.). Later navigations keep the
 * original source so mailto personalization still works after they click around.
 */
export function captureFirstTouchAttribution(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
) {
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(search);

    for (const key of Object.keys(SOURCE_LABELS)) {
      if (params.has(key)) {
        sessionStorage.setItem(STORAGE_KEY, key);
        return;
      }
    }

    for (const param of ['utm_source', 'ref', 'source']) {
      const value = params.get(param)?.toLowerCase().trim();
      if (value && SOURCE_LABELS[value]) {
        sessionStorage.setItem(STORAGE_KEY, value);
        return;
      }
    }
  } catch {
    // sessionStorage unavailable (private mode / SSR) — skip quietly.
  }
}

export function getAttributionSource(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getAttributionLabel(): string | null {
  const key = getAttributionSource();
  return key ? (SOURCE_LABELS[key] ?? null) : null;
}

/** Shared mailto with witty subject; body only when a known source was captured. */
export function getMailtoHref(email: string = EMAIL): string {
  const parts = [`subject=${encodeURIComponent(SUBJECT)}`];
  const label = getAttributionLabel();
  if (label) {
    parts.push(
      `body=${encodeURIComponent(`ahh, I see you found me from ${label}`)}`,
    );
  }
  return `mailto:${email}?${parts.join('&')}`;
}
