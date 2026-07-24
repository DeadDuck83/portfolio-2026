import { describe, it, expect, beforeEach } from 'vitest';
import {
  captureFirstTouchAttribution,
  getAttributionLabel,
  getMailtoHref,
  SOURCE_LABELS,
} from './attribution';

const STORAGE_KEY = 'portfolio_attribution_source';

describe('attribution', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('captures a bare source flag on first load', () => {
    captureFirstTouchAttribution('?linkedin');
    expect(getAttributionLabel()).toBe('LinkedIn');
  });

  it('captures utm_source values', () => {
    captureFirstTouchAttribution('?utm_source=wellfound');
    expect(getAttributionLabel()).toBe('WellFound');
  });

  it('keeps the first-touch source on later calls', () => {
    captureFirstTouchAttribution('?indeed');
    captureFirstTouchAttribution('?linkedin');
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe('indeed');
    expect(getAttributionLabel()).toBe('Indeed');
  });

  it('builds mailto with subject only when no source', () => {
    expect(getMailtoHref()).toBe(
      `mailto:moore8577@gmail.com?subject=${encodeURIComponent(
        'You are exactly who I was looking for',
      )}`,
    );
  });

  it('adds a source body when attribution is present', () => {
    captureFirstTouchAttribution('?greenhouse');
    const href = getMailtoHref();
    expect(href).toContain(encodeURIComponent('You are exactly who I was looking for'));
    expect(href).toContain(
      encodeURIComponent(`ahh, I see you found me from ${SOURCE_LABELS.greenhouse}`),
    );
  });
});
