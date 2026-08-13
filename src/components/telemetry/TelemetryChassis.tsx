import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { AnalyticsSnapshot } from '../../lib/telemetry/types';
import { fonts } from '../../theme/tokens';
import '../../styles/telemetry.css';

/** Proof-of-concept bay loop under `public/background/`. */
export const BAY_VIDEO_SRC = '/background/circuit-botherboard-background.mp4';

/**
 * THESIS: Compact underfloor bay — only as tall as the instruments need.
 * OWN-WORLD: live video chassis + phosphor/amber readouts on a translucent board.
 * STORY: Lift the cover a little; PM signals sit in the gap below.
 * FIRST VIEWPORT: Video bed + KPIs + custom-event strip (content-sized).
 * FORM: Bottom underlayer section, not a full-screen takeover.
 */

type Props = {
  snapshot: AnalyticsSnapshot | null;
  active: boolean;
  /** Copper edge / shadow — wait until the cover finish lifting. */
  chromeVisible?: boolean;
  reducedMotion: boolean;
};

function formatPeriod(period: string): string {
  const [y, m] = period.split('-').map(Number);
  if (!y || !m) return period;
  return new Date(y, m - 1, 1).toLocaleString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}

function useReadout(target: number, decimals: number, active: boolean, reduced: boolean) {
  const [value, setValue] = useState(reduced || !active ? target : 0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, target]);

  if (decimals > 0) return value.toFixed(decimals);
  return String(Math.round(value));
}

function EventBars({
  events,
  active,
  reduced,
}: {
  events: AnalyticsSnapshot['customEvents'];
  active: boolean;
  reduced: boolean;
}) {
  const max = Math.max(...events.map((e) => e.count), 1);
  const [progress, setProgress] = useState(reduced || !active ? 1 : 0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    if (reduced) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 800);
      setProgress(1 - (1 - t) ** 3);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {events.map((event) => {
        const width = `${(event.count / max) * 100 * progress}%`;
        return (
          <div key={event.name}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '0.3rem',
                fontFamily: fonts.mono,
                fontSize: '0.68rem',
                letterSpacing: '0.06em',
                color: 'var(--tele-muted)',
              }}
            >
              <span>{event.name}</span>
              <span style={{ color: 'var(--tele-phosphor-dim)' }}>{event.count}</span>
            </div>
            <div
              style={{
                height: 6,
                background: 'rgba(141, 255, 184, 0.08)',
                border: '1px solid rgba(141, 255, 184, 0.12)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width,
                  background:
                    'linear-gradient(90deg, rgba(196,132,74,0.55), rgba(141,255,184,0.85))',
                  boxShadow: '0 0 12px rgba(141, 255, 184, 0.25)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Kpi({
  label,
  display,
  accent,
}: {
  label: string;
  display: string;
  accent: 'phosphor' | 'amber' | 'copper';
}) {
  const color =
    accent === 'phosphor'
      ? 'var(--tele-phosphor)'
      : accent === 'amber'
        ? 'var(--tele-amber)'
        : 'var(--tele-copper)';

  return (
    <div
      style={{
        padding: '0.85rem 0.95rem 0.95rem',
        background: 'rgba(7, 11, 9, 0.72)',
        border: '1px solid rgba(196, 132, 74, 0.32)',
        boxShadow: 'inset 0 1px 0 rgba(141,255,184,0.06), 0 8px 24px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(6px)',
        position: 'relative',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 8,
          right: 10,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${color}`,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(1.75rem, 4vw, 2.35rem)',
          lineHeight: 1,
          color,
          letterSpacing: '-0.02em',
        }}
      >
        {display}
      </div>
      <div
        style={{
          marginTop: '0.45rem',
          fontFamily: fonts.mono,
          fontSize: '0.6rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--tele-muted)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

const TelemetryChassis = forwardRef<HTMLElement, Props>(function TelemetryChassis(
  { snapshot, active, chromeVisible = false, reducedMotion },
  ref,
) {
  const titleId = useId();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sessions = useReadout(
    snapshot?.sessionsThisMonth ?? 0,
    0,
    active && !!snapshot,
    reducedMotion,
  );
  const views = useReadout(
    snapshot?.pageViewsThisMonth ?? 0,
    0,
    active && !!snapshot,
    reducedMotion,
  );
  const avg = useReadout(
    snapshot?.avgEventsPerVisit ?? 0,
    1,
    active && !!snapshot,
    reducedMotion,
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active && !reducedMotion) {
      video.play().catch(() => {
        // Autoplay can be blocked; muted + playsInline usually works.
      });
    } else {
      video.pause();
      if (!active) video.currentTime = 0;
    }
  }, [active, reducedMotion]);

  return (
    <section
      ref={ref}
      id="telemetry-bay"
      data-telemetry-bay
      aria-labelledby={titleId}
      aria-hidden={!active}
      className="telemetry-chassis"
      data-power={active && snapshot ? 'on' : 'off'}
      data-reduced={reducedMotion ? 'true' : 'false'}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        color: 'var(--tele-ink)',
        overflow: 'hidden',
        pointerEvents: active ? 'auto' : 'none',
        borderTop: chromeVisible ? '1px solid rgba(196, 132, 74, 0.35)' : '1px solid transparent',
        boxShadow: chromeVisible ? '0 -16px 48px rgba(0,0,0,0.45)' : 'none',
        // Keep closed/preview height near the instrumented layout so the lift feels stable.
        minHeight: snapshot ? undefined : 280,
      }}
    >
      <video
        ref={videoRef}
        aria-hidden
        muted
        loop
        playsInline
        preload="metadata"
        src={BAY_VIDEO_SRC}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          pointerEvents: 'none',
        }}
      />

      {/* Keep instruments readable over the plate */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(4,8,6,0.55) 0%, rgba(4,8,6,0.72) 45%, rgba(4,8,6,0.82) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="telemetry-scanline"
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, transparent, rgba(141,255,184,0.04), transparent)',
          height: '40%',
          pointerEvents: 'none',
          opacity: 0.4,
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: 920,
          margin: '0 auto',
          padding:
            '1.25rem clamp(1.2rem, 4vw, 2.2rem) clamp(1.4rem, 3vh, 1.9rem)',
        }}
      >
        <header
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '0.75rem 1.5rem',
            marginBottom: '1.1rem',
          }}
        >
          <h2
            id={titleId}
            style={{
              margin: 0,
              fontFamily: fonts.mono,
              fontSize: '0.58rem',
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--tele-copper)',
            }}
          >
            Site Analytics
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: fonts.mono,
              fontSize: '0.68rem',
              color: 'var(--tele-muted)',
              letterSpacing: '0.04em',
            }}
          >
            {snapshot
              ? `${formatPeriod(snapshot.period)}${
                  snapshot.source === 'mock' ? ' · synthetic demo feed' : ' · LogRocket snapshot'
                }`
              : 'Lift the cover to power instruments'}
          </p>
        </header>

        {snapshot ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.65rem',
                marginBottom: '1rem',
              }}
            >
              <Kpi label="Sessions this month" display={sessions} accent="phosphor" />
              <Kpi label="Page views this month" display={views} accent="amber" />
              <Kpi label="Avg events / visit" display={avg} accent="copper" />
            </div>

            <div
              style={{
                padding: '0.95rem 1rem 1.05rem',
                border: '1px solid rgba(196, 132, 74, 0.28)',
                background: 'rgba(7, 11, 9, 0.7)',
                backdropFilter: 'blur(6px)',
                boxShadow: 'inset 0 0 0 1px rgba(141,255,184,0.04)',
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: '0.58rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--tele-amber)',
                  marginBottom: '0.85rem',
                }}
              >
                Custom events
              </div>
              <EventBars
                events={snapshot.customEvents}
                active={active}
                reduced={reducedMotion}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              minHeight: 120,
              border: '1px dashed rgba(196, 132, 74, 0.28)',
              background: 'rgba(7, 11, 9, 0.45)',
            }}
          />
        )}
      </div>
    </section>
  );
});

export default TelemetryChassis;
