import { getMockSnapshot } from './mockSnapshot';
import type { AnalyticsSnapshot } from './types';

const CACHE_KEY = 'portfolio_telemetry_snapshot';

/**
 * When true, client fetches `/api/telemetry` (server holds LOGROCKET_API_KEY).
 * Failure ⇒ reject ⇒ ChassisReveal will not open (no mock fallback).
 * Phase 1 default: false (mock provider).
 */
function useRemoteTelemetry(): boolean {
  return import.meta.env.VITE_TELEMETRY_REMOTE === 'true';
}

function readCache(): AnalyticsSnapshot | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AnalyticsSnapshot;
  } catch {
    return null;
  }
}

function writeCache(snapshot: AnalyticsSnapshot) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
  } catch {
    // sessionStorage unavailable — still return the in-flight snapshot.
  }
}

async function loadRemoteSnapshot(): Promise<AnalyticsSnapshot> {
  const res = await fetch('/api/telemetry');
  if (!res.ok) {
    throw new Error(`telemetry unavailable (${res.status})`);
  }
  const data = (await res.json()) as AnalyticsSnapshot;
  if (
    typeof data.sessionsThisMonth !== 'number' ||
    typeof data.pageViewsThisMonth !== 'number' ||
    !Array.isArray(data.customEvents)
  ) {
    throw new Error('telemetry payload invalid');
  }
  return { ...data, source: data.source ?? 'logrocket' };
}

/**
 * One successful snapshot per browser session, then reuse.
 * Rejects on remote failure — callers must not open the HUD.
 */
export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const cached = readCache();
  if (cached) return cached;

  const snapshot = useRemoteTelemetry()
    ? await loadRemoteSnapshot()
    : getMockSnapshot();

  writeCache(snapshot);
  return snapshot;
}

/** Test helper — clears the once-per-session cache. */
export function clearAnalyticsSnapshotCache() {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}
