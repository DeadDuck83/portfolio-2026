import { afterEach, describe, expect, it } from 'vitest';
import {
  clearAnalyticsSnapshotCache,
  getAnalyticsSnapshot,
} from './getAnalyticsSnapshot';

describe('getAnalyticsSnapshot', () => {
  afterEach(() => {
    clearAnalyticsSnapshotCache();
  });

  it('returns a mock snapshot with real custom event names', async () => {
    const snap = await getAnalyticsSnapshot();
    expect(snap.source).toBe('mock');
    expect(snap.sessionsThisMonth).toBeGreaterThan(0);
    expect(snap.customEvents.map((e) => e.name)).toEqual(
      expect.arrayContaining(['GetInTouchClick', 'WorkItemClick', 'PathNavigate']),
    );
  });

  it('reuses the same snapshot within a session', async () => {
    const first = await getAnalyticsSnapshot();
    const second = await getAnalyticsSnapshot();
    expect(second).toEqual(first);
  });
});
