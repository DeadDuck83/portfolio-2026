/** Once-per-session PM telemetry snapshot for the secret chassis HUD. */

export type CustomEventCount = {
  name: string;
  count: number;
};

export type AnalyticsSnapshot = {
  /** ISO month label, e.g. "2026-08" */
  period: string;
  sessionsThisMonth: number;
  pageViewsThisMonth: number;
  avgEventsPerVisit: number;
  customEvents: CustomEventCount[];
  /** Where the numbers came from — mock until LogRocket proxy is wired. */
  source: 'mock' | 'logrocket';
};
