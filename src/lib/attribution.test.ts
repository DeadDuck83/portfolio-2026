import { describe, it, expect, beforeEach } from 'vitest';
import {
  captureFirstTouchAttribution,
  getAttributionLabel,
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

  it('maps every known source key to a label', () => {
    for (const [key, label] of Object.entries(SOURCE_LABELS)) {
      sessionStorage.clear();
      captureFirstTouchAttribution(`?${key}`);
      expect(getAttributionLabel()).toBe(label);
    }
  });
});
