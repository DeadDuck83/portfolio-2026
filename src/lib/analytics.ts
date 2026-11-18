import LogRocket from 'logrocket';

/**
 * Analytics: LogRocket session replay plus a small, typed set of custom
 * events. Every event the site sends is listed in `AnalyticsEvents` below and
 * documented in docs/analytics-events.md.
 *
 * LogRocket already records page visits, clicks and touches, scroll depth,
 * active time and device type for every session, so those are deliberately
 * NOT duplicated as custom events. Custom events cover what LogRocket can't
 * see: which project, which avatar prompt, where a visit came from, and
 * whether the visitor actually engaged.
 *
 * Off unless all of these hold: a production build, VITE_LOGROCKET_DISABLED
 * isn't "true", and this browser hasn't opted out (?analytics=off).
 */

const APP_ID = 'hsztbz/portfolio-site-traffic';
const VISITOR_ID_KEY = 'portfolio_visitor_id';
/** Owner opt-out flag (localStorage). Set by visiting any page with ?analytics=off. */
export const OPT_OUT_KEY = 'portfolio_analytics_off';
const OPT_OUT_PARAM = 'analytics';

export type ProjectId = 'sage' | 'bexa' | 'parker-ace' | 'plmc';
/** A case study's chapters, shared by every case study (Users only exists on some). */
export type CaseSectionId = 'brief' | 'context' | 'users' | 'process' | 'solution' | 'outcome';
export type HomeSectionId = 'work' | 'about' | 'contact';
/** How the visitor got to a case study. */
export type CaseStudySource = 'work-grid' | 'next-case' | 'avatar' | 'direct' | 'other';
export type AvatarPromptKind = 'question' | 'tour' | 'case-walk' | 'keep-going' | 'shirt';

/** Every custom event the site sends, with its properties. */
export type AnalyticsEvents = {
  // discovery
  PortfolioSectionViewed: { sectionId: HomeSectionId };
  AboutChapterView: { chapter: number; name: string };
  WorkItemClick: { projectId: ProjectId; position: number; source: 'hero-grid' | 'work-list' };
  CaseStudyViewed: { projectId: ProjectId; source: CaseStudySource };
  CaseStudySectionViewed: { projectId: ProjectId; sectionId: CaseSectionId };
  // contact intent
  GetInTouchClick: { source: 'hero' | 'header' | 'menu' | 'footer' };
  EmailCopied: { source: 'hero' | 'contact' | 'footer' | 'case-header' };
  ExternalProfileClick: { profile: 'linkedin'; source: 'hero' | 'contact' };
  ResumeClick: { source: 'hero' | 'contact' };
  // avatar
  AvatarOpened: { source: 'hero-tile' | 'button' | 'auto' };
  AvatarPromptSelected: { promptId: string; kind: AvatarPromptKind };
  AvatarInteractionCompleted: { promptId: string; kind: AvatarPromptKind; durationSeconds: number };
  AvatarClosed: { durationSeconds: number; interactionCount: number };
  AvatarSettingChanged: { setting: 'camera' | 'sound'; on: boolean };
  AvatarError: { errorCategory: 'avatar-load' | 'audio-blocked' };
  SkillsViewed: { source: 'about-today' };
  // easter egg
  TelemetryBayOpened: Record<string, never>;
  // engagement and traffic quality
  EngagedSession: { activeSeconds: number; interactions: number };
  AutomatedBrowser: Record<string, never>;
};
export type AnalyticsEvent = keyof AnalyticsEvents;

let ready = false;
const logInDev = import.meta.env.DEV && import.meta.env.MODE !== 'test';

/**
 * `?analytics=off` / `?analytics=on` turns tracking off or back on for this
 * browser (localStorage, so it sticks). The param is removed from the URL
 * either way. Owner-only by obscurity, and harmless if anyone else finds it:
 * it only affects their own browser.
 */
export function applyOptOutParam(): void {
  try {
    const url = new URL(window.location.href);
    const value = url.searchParams.get(OPT_OUT_PARAM);
    if (value === null) return;
    if (value === 'off') localStorage.setItem(OPT_OUT_KEY, '1');
    else if (value === 'on') localStorage.removeItem(OPT_OUT_KEY);
    url.searchParams.delete(OPT_OUT_PARAM);
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    if (value === 'off' || value === 'on') {
      // phones have no console: confirm on screen (only ever seen by whoever used the param)
      window.alert(value === 'off' ? 'Analytics off for this browser.' : 'Analytics back on for this browser.');
    }
  } catch {
    // storage blocked: nothing to remember
  }
}

export function isOptedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

/** Should LogRocket run at all in this build and browser? */
export function analyticsAllowed(): boolean {
  if (!import.meta.env.PROD) return false; // local dev and tests
  if (import.meta.env.VITE_LOGROCKET_DISABLED === 'true') return false;
  return !isOptedOut();
}

/** Start LogRocket if allowed. Safe to call once at boot; never throws. */
export function initAnalytics(): void {
  if (!analyticsAllowed()) return;
  try {
    LogRocket.init(APP_ID);
    LogRocket.identify(getOrCreateVisitorId());
    ready = true;
  } catch {
    ready = false;
    return;
  }
  // a browser driven by automation tooling says so (Playwright, Selenium, Puppeteer)
  if (typeof navigator !== 'undefined' && navigator.webdriver) track('AutomatedBrowser', {});
}

/**
 * Stable anonymous visitor ID (localStorage). Used only to tell LogRocket
 * whether sessions belong to the same person — no name or email.
 * @see https://docs.logrocket.com/reference/identify
 */
export function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    // localStorage unavailable (private mode / SSR) — ephemeral ID for this load.
    return `ephemeral_${Date.now().toString(36)}`;
  }
}

/**
 * Send a custom event. A no-op unless LogRocket started; in local dev it
 * logs to the console instead, so events can be checked without sending.
 */
export function track<E extends AnalyticsEvent>(event: E, props: AnalyticsEvents[E]): void {
  if (logInDev) console.debug('[analytics]', event, props);
  if (!ready) return;
  try {
    if (Object.keys(props).length) LogRocket.track(event, props);
    else LogRocket.track(event);
  } catch {
    // never let analytics break the page
  }
}

/** Fire an event at most once per page load (e.g. an error that could repeat). */
const sentOnce = new Set<string>();
export function trackOnce<E extends AnalyticsEvent>(key: string, event: E, props: AnalyticsEvents[E]): void {
  if (sentOnce.has(key)) return;
  sentOnce.add(key);
  track(event, props);
}

// --- where a case-study visit came from ------------------------------------

let pendingSource: { source: CaseStudySource; at: number } | null = null;

/** Call just before navigating to a case study, so its CaseStudyViewed knows why. */
export function noteCaseStudySource(source: CaseStudySource): void {
  pendingSource = { source, at: Date.now() };
}

/**
 * The source for a case-study visit starting now: the control that sent them
 * (if it was in the last few seconds), else `direct` for the page they landed
 * on, else `other` (header link, browser back / forward).
 */
export function takeCaseStudySource(): CaseStudySource {
  const p = pendingSource;
  pendingSource = null;
  if (p && Date.now() - p.at < 4000) return p.source;
  const idx = (window.history.state as { idx?: number } | null)?.idx;
  return idx === 0 || idx === undefined ? 'direct' : 'other';
}

/** `/work/sage` → `sage`, if it's a known case study. */
export function projectIdFromPath(path: string | undefined): ProjectId | null {
  const slug = path?.match(/^\/work\/([^/?#]+)/)?.[1];
  return slug === 'sage' || slug === 'bexa' || slug === 'parker-ace' || slug === 'plmc' ? slug : null;
}
