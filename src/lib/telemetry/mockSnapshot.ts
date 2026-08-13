import type { AnalyticsSnapshot } from './types';

/**
 * Plausible synthetic KPIs for Phase 1. Labels match real `track()` events.
 * Marked source: mock so the HUD never pretends these are live LogRocket numbers.
 */
export function getMockSnapshot(): AnalyticsSnapshot {
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return {
    period,
    sessionsThisMonth: 142,
    pageViewsThisMonth: 387,
    avgEventsPerVisit: 2.4,
    customEvents: [
      { name: 'WorkItemClick', count: 96 },
      { name: 'PathNavigate', count: 64 },
      { name: 'GetInTouchClick', count: 28 },
    ],
    source: 'mock',
  };
}
