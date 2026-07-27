const STORAGE_KEY = 'portfolio_attribution_source';

/** First-touch acquisition flags → display label. */
export const SOURCE_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  wellfound: 'WellFound',
  greenhouse: 'Greenhouse',
  indeed: 'Indeed',
};

/**
 * On first load of a session, remember how the visitor arrived
 * (`?linkedin`, `?utm_source=linkedin`, etc.). Later navigations keep the
 * original source for analytics / future personalization.
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
