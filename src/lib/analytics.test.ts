import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  analyticsAllowed,
  applyOptOutParam,
  isOptedOut,
  noteCaseStudySource,
  OPT_OUT_KEY,
  projectIdFromPath,
  takeCaseStudySource,
  track,
} from './analytics';

describe('owner opt-out', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, '', '/');
  });

  it('?analytics=off remembers the opt-out and strips only that param', () => {
    window.history.replaceState(null, '', '/work/sage?linkedin&analytics=off#c1');
    applyOptOutParam();
    expect(isOptedOut()).toBe(true);
    expect(localStorage.getItem(OPT_OUT_KEY)).toBe('1');
    expect(window.location.pathname + window.location.search + window.location.hash).toBe('/work/sage?linkedin=#c1');
    expect(window.alert).toHaveBeenCalledOnce();
  });

  it('?analytics=on turns it back on', () => {
    localStorage.setItem(OPT_OUT_KEY, '1');
    window.history.replaceState(null, '', '/?analytics=on');
    applyOptOutParam();
    expect(isOptedOut()).toBe(false);
    expect(window.location.search).toBe('');
  });

  it('ignores pages without the param', () => {
    window.history.replaceState(null, '', '/?utm_source=linkedin');
    applyOptOutParam();
    expect(isOptedOut()).toBe(false);
    expect(window.location.search).toBe('?utm_source=linkedin');
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('never runs outside a production build', () => {
    expect(analyticsAllowed()).toBe(false);
    expect(() => track('EngagedSession', { activeSeconds: 20, interactions: 3 })).not.toThrow();
  });
});

describe('case study source', () => {
  afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState(null, '', '/');
  });

  it('uses the control that sent them, once', () => {
    window.history.replaceState({ idx: 3 }, '', '/');
    noteCaseStudySource('next-case');
    expect(takeCaseStudySource()).toBe('next-case');
    expect(takeCaseStudySource()).toBe('other');
  });

  it('forgets a stale source', () => {
    vi.useFakeTimers();
    window.history.replaceState({ idx: 2 }, '', '/');
    noteCaseStudySource('work-grid');
    vi.advanceTimersByTime(5000);
    expect(takeCaseStudySource()).toBe('other');
  });

  it('calls the landing page direct', () => {
    window.history.replaceState({ idx: 0 }, '', '/work/bexa');
    expect(takeCaseStudySource()).toBe('direct');
  });
});

describe('projectIdFromPath', () => {
  it('maps case study routes to stable ids', () => {
    expect(projectIdFromPath('/work/parker-ace')).toBe('parker-ace');
    expect(projectIdFromPath('/work/sage#c1')).toBe('sage');
    expect(projectIdFromPath('/work/unknown')).toBeNull();
    expect(projectIdFromPath('/gallery')).toBeNull();
    expect(projectIdFromPath(undefined)).toBeNull();
  });
});
