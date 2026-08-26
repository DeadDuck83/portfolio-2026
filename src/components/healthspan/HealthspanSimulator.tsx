import { useCallback, useMemo, useState, type CSSProperties, type ReactNode } from 'react';

import { HealthspanChart } from './HealthspanChart';
import { useTween } from './hooks';
import {
  BASELINE_VALUE,
  descriptorFor,
  LEVER_GROUPS,
  LEVERS,
  makeValues,
  PRESETS,
  type LeverId,
  type LeverValues,
} from './levers';
import {
  DEFAULT_PARAMS,
  marginalYears,
  solveFor,
  type ModelParams,
} from './model';
import { darkPalette, paletteVars, type Palette } from './theme';
import styles from './HealthspanSimulator.module.css';

export interface HealthspanSimulatorProps {
  /** Starting slider position, 0–100. Defaults to the population average. */
  readonly initialValue?: number;
  readonly params?: ModelParams;
  readonly palette?: Palette;
  readonly heading?: ReactNode;
  readonly subheading?: ReactNode;
  readonly className?: string;
}

function formatDelta(value: number): string {
  return `${value > 0 ? '+' : '−'}${Math.abs(value).toFixed(1)}`;
}

interface StatProps {
  readonly label: string;
  readonly value: string;
  readonly caption: ReactNode;
  readonly delta: number;
  /** When true, a negative delta is the good outcome. */
  readonly lowerIsBetter?: boolean;
  readonly swatch?: string;
}

function Stat({
  label,
  value,
  caption,
  delta,
  lowerIsBetter = false,
  swatch,
}: StatProps) {
  const isNeutral = Math.abs(delta) < 0.05;
  const isGood = lowerIsBetter ? delta < 0 : delta > 0;

  return (
    <div className={styles.stat}>
      <div className={styles.statLabel}>
        {swatch && <span className={styles.dot} style={{ background: swatch }} />}
        {label}
      </div>
      <div className={styles.statValue}>
        {value}
        <small>yrs</small>
      </div>
      <div className={styles.statCaption}>{caption}</div>
      <div
        className={[
          styles.statDelta,
          isNeutral ? '' : isGood ? styles.deltaUp : styles.deltaDown,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isNeutral ? (
          'same as average'
        ) : (
          <>
            <b>{formatDelta(delta)}</b> vs. average
          </>
        )}
      </div>
    </div>
  );
}

export function HealthspanSimulator({
  initialValue = BASELINE_VALUE,
  params = DEFAULT_PARAMS,
  palette = darkPalette,
  heading = (
    <>
      How long you live is one number. How long you live <em>well</em> is
      another.
    </>
  ),
  subheading = 'Pull the levers. Watch the curve square off — quality of life held high, decline compressed into a shorter window at the very end.',
  className,
}: HealthspanSimulatorProps) {
  const [values, setValues] = useState<LeverValues>(() =>
    makeValues(initialValue),
  );

  const baseline = useMemo(
    () => solveFor(makeValues(BASELINE_VALUE), LEVERS, params),
    [params],
  );
  const outcome = useMemo(
    () => solveFor(values, LEVERS, params),
    [values, params],
  );

  /** Only the numbers the curve is drawn from need to animate. */
  const tweenTarget = useMemo(
    () => ({
      lifespan: outcome.lifespan,
      squareness: outcome.squareness,
      healthspan: outcome.healthspan,
    }),
    [outcome],
  );
  const shown = useTween(tweenTarget);

  const worth = useMemo(
    () =>
      Object.fromEntries(
        LEVERS.map((lever) => [
          lever.id,
          marginalYears(lever.id, values, LEVERS, BASELINE_VALUE, params),
        ]),
      ) as Record<LeverId, number>,
    [values, params],
  );

  const setLever = useCallback((id: LeverId, value: number) => {
    setValues((previous) => ({ ...previous, [id]: value }));
  }, []);

  const applyPreset = useCallback((value: number) => {
    setValues(makeValues(value));
  }, []);

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={paletteVars(palette)}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Healthspan vs. Lifespan</p>
          <h2 className={styles.title}>{heading}</h2>
          <p className={styles.subtitle}>{subheading}</p>
        </header>

        <div className={styles.card}>
          <div className={styles.stats} aria-live="polite">
            <Stat
              label="Healthspan"
              swatch={palette.you}
              value={String(Math.round(outcome.healthspan))}
              caption={
                <>
                  lived in{' '}
                  <span style={{ color: palette.good }}>good health</span>
                </>
              }
              delta={outcome.healthspan - baseline.healthspan}
            />
            <Stat
              label="Lifespan"
              value={String(Math.round(outcome.lifespan))}
              caption="lived in total"
              delta={outcome.lifespan - baseline.lifespan}
            />
            <Stat
              label="Years in decline"
              value={outcome.declineYears.toFixed(1)}
              caption={
                <>
                  in <span style={{ color: palette.fair }}>fair</span> or{' '}
                  <span style={{ color: palette.poor }}>poor</span> health
                </>
              }
              delta={outcome.declineYears - baseline.declineYears}
              lowerIsBetter
            />
          </div>

          <HealthspanChart
            outcome={{ ...outcome, ...shown }}
            baseline={baseline}
            params={params}
            palette={palette}
          />

          <div className={styles.legend}>
            <span className={styles.legendKey}>
              <span
                className={styles.swatch}
                style={{ borderTopColor: palette.you }}
              />
              Your curve
            </span>
            <span className={styles.legendKey}>
              <span
                className={styles.swatch}
                style={{
                  borderTopColor: palette.average,
                  borderTopStyle: 'dashed',
                }}
              />
              Population average
            </span>
            <span
              className={styles.legendKey}
              style={{ color: palette.inkSubtle }}
            >
              Healthspan ends where the curve leaves{' '}
              <span style={{ color: palette.good, marginLeft: 4 }}>
                Good Health
              </span>
            </span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.panel}`}>
          <div className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>Your levers</h3>
              <p className={styles.panelNote}>
                The number beside each one is what it is worth to you right now,
                in years of good health.
              </p>
            </div>
            <div className={styles.presets}>
              {Object.entries(PRESETS).map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  className={styles.button}
                  onClick={() => applyPreset(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {LEVER_GROUPS.map(({ group, levers }) => (
            <div key={group} className={styles.group}>
              <h4 className={styles.groupLabel}>{group}</h4>
              <div className={styles.groupItems}>
                {levers.map((lever) => {
                  const value = values[lever.id];
                  const descriptor = descriptorFor(lever, value);
                  const years = worth[lever.id];

                  return (
                    <div key={lever.id} className={styles.lever}>
                      <div className={styles.leverTop}>
                        <label
                          className={styles.leverName}
                          htmlFor={`hsx-${lever.id}`}
                        >
                          {lever.label}
                        </label>
                        <span
                          className={[
                            styles.leverWorth,
                            years >= 0.05 ? styles.leverWorthActive : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {years >= 0.05 ? '+' : years <= -0.05 ? '' : '±'}
                          {years.toFixed(1)} yrs
                        </span>
                      </div>
                      <input
                        id={`hsx-${lever.id}`}
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={value}
                        aria-valuetext={descriptor}
                        style={
                          { '--hsx-fill': `${value}%` } as CSSProperties
                        }
                        onChange={(event) =>
                          setLever(lever.id, Number(event.target.value))
                        }
                      />
                      <p className={styles.leverDescriptor}>{descriptor}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <p className={styles.footnote}>
          <b>About this model.</b> An illustrative simulation, not a medical
          prediction, describing populations rather than individuals. Curve
          shape is a superellipse whose exponent is driven by a weighted
          composite of the levers; weights reflect the relative strength of the
          epidemiological evidence. Lifestyle evidence supports compressing
          decline far more strongly than it supports extending maximum lifespan,
          so the levers move the shape of the curve much more than they move the
          endpoint.
        </p>
      </div>
    </section>
  );
}
