import { useId, useMemo, useState, type PointerEvent } from 'react';

import {
  buildCurvePath,
  createGeometry,
  healthBands,
  labelFont,
  LIFE_STAGES,
  measureText,
  type ChartGeometry,
} from './chart';
import { useElementWidth } from './hooks';
import { MAX_AGE, qualityOfLife, type ModelParams, type Outcome } from './model';
import type { Palette } from './theme';
import styles from './HealthspanSimulator.module.css';

interface HealthspanChartProps {
  /** Tweened outcome — what is drawn this frame. */
  readonly outcome: Outcome;
  /** Population-average reference. */
  readonly baseline: Outcome;
  readonly params: ModelParams;
  readonly palette: Palette;
}

type Anchor = 'start' | 'end';

interface PlacedLabel {
  readonly text: string;
  readonly x: number;
  readonly anchor: Anchor;
  readonly left: number;
  readonly right: number;
}

/** Place a label beside its guide line, flipping it inward at the edges. */
function placeLabel(
  text: string,
  guideX: number,
  prefer: Anchor,
  geometry: ChartGeometry,
  font: string,
): PlacedLabel {
  const width = measureText(text, font);
  const gap = 7;

  let anchor = prefer;
  let x = prefer === 'end' ? guideX - gap : guideX + gap;
  let left = anchor === 'end' ? x - width : x;

  if (left < 2) {
    anchor = 'start';
    x = guideX + gap;
    left = x;
  } else if (left + width > geometry.width - 2) {
    anchor = 'end';
    x = guideX - gap;
    left = x - width;
  }

  return { text, x, anchor, left, right: left + width };
}

export function HealthspanChart({
  outcome,
  baseline,
  params,
  palette,
}: HealthspanChartProps) {
  const [containerRef, containerWidth] = useElementWidth<HTMLDivElement>();
  const [hoverAge, setHoverAge] = useState<number | null>(null);
  const gradientId = useId();

  const geometry = useMemo(
    () => (containerWidth > 0 ? createGeometry(containerWidth) : null),
    [containerWidth],
  );

  const paths = useMemo(() => {
    if (!geometry) return null;
    return {
      area: buildCurvePath(
        outcome.lifespan,
        outcome.squareness,
        geometry,
        params,
        true,
      ),
      you: buildCurvePath(
        outcome.lifespan,
        outcome.squareness,
        geometry,
        params,
      ),
      average: buildCurvePath(
        baseline.lifespan,
        baseline.squareness,
        geometry,
        params,
      ),
    };
  }, [geometry, outcome, baseline, params]);

  if (!geometry) {
    // First paint: reserve height so the layout does not jump once measured.
    return <div ref={containerRef} className={styles.chart} style={{ height: 420 }} />;
  }

  const { x, y, margins, plotWidth, plotHeight, isNarrow, isTiny } = geometry;
  const bands = healthBands(params);

  const healthspanX = x(outcome.healthspan);
  const lifespanX = x(outcome.lifespan);
  const baselineX = x(baseline.healthspan);
  const goodY = y(params.goodThreshold);
  const zeroY = y(0);

  // ---- labels, de-collided by stacking onto a second row -------------------
  const labelSize = isTiny ? 10.5 : 12;
  const font = labelFont(labelSize, 650);
  const rowA = margins.top - 13;
  const rowB = margins.top - 31;

  const healthLabel = placeLabel(
    `${isTiny ? 'Good health to' : 'Good health until'} ${Math.round(outcome.healthspan)}`,
    healthspanX,
    'end',
    geometry,
    font,
  );
  const lifeLabel = placeLabel(
    `${isTiny ? 'Life ends' : 'Life ends at'} ${Math.round(outcome.lifespan)}`,
    lifespanX,
    'start',
    geometry,
    font,
  );
  const labelsCollide =
    healthLabel.right + 8 > lifeLabel.left && lifeLabel.right + 8 > healthLabel.left;

  // ---- healthspan-vs-average annotation ------------------------------------
  const delta = outcome.healthspan - baseline.healthspan;
  const showAnnotation =
    Math.abs(delta) > 0.35 && Math.abs(healthspanX - baselineX) > 26;
  const annotationY = goodY + (isTiny ? 20 : 26);
  const direction = delta > 0 ? 1 : -1;
  const annotationText = `${delta > 0 ? '+' : '−'}${Math.abs(delta).toFixed(1)}${
    isTiny ? ' yrs' : ' yrs of good health'
  }`;
  const annotationWidth = measureText(annotationText, labelFont(labelSize, 650));
  const annotationMid = (baselineX + healthspanX) / 2;

  const ageTicks = isTiny ? [0, 40, 80] : [0, 20, 40, 60, 80, 100];

  const hoverQuality =
    hoverAge === null
      ? null
      : {
          you: qualityOfLife(hoverAge, outcome.lifespan, outcome.squareness, params),
          average: qualityOfLife(
            hoverAge,
            baseline.lifespan,
            baseline.squareness,
            params,
          ),
        };

  const handlePointer = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const age = geometry.ageAt(event.clientX - bounds.left - 6);
    setHoverAge(age < 0 || age > MAX_AGE ? null : age);
  };

  return (
    <div
      ref={containerRef}
      className={styles.chart}
      onPointerMove={handlePointer}
      onPointerLeave={() => setHoverAge(null)}
    >
      <svg
        width={geometry.width}
        height={geometry.height}
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        role="img"
        aria-labelledby={`${gradientId}-title ${gradientId}-desc`}
      >
        <title id={`${gradientId}-title`}>
          Quality of life across a lifetime
        </title>
        <desc id={`${gradientId}-desc`}>
          Your curve holds good health until age {Math.round(outcome.healthspan)}{' '}
          and ends at {Math.round(outcome.lifespan)}, against a population
          average of {Math.round(baseline.healthspan)} and{' '}
          {Math.round(baseline.lifespan)}.
        </desc>

        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.you} stopOpacity={0.3} />
            <stop offset="100%" stopColor={palette.you} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* health zones */}
        {bands.map((band) => {
          const top = y(band.high);
          const bottom = y(band.low);
          return (
            <g key={band.label}>
              <rect
                x={margins.left}
                y={top}
                width={plotWidth}
                height={bottom - top}
                fill={palette[band.colorKey]}
                fillOpacity={band.fillOpacity}
              />
              {band.low > 0 && (
                <line
                  x1={margins.left}
                  x2={margins.left + plotWidth}
                  y1={bottom}
                  y2={bottom}
                  stroke={palette.grid}
                  strokeOpacity={0.07}
                />
              )}
              {isNarrow ? (
                <text
                  x={margins.left + 11}
                  y={(top + bottom) / 2 + 3.5}
                  fill={palette[band.colorKey]}
                  fillOpacity={0.8}
                  fontSize={10}
                  fontWeight={650}
                  letterSpacing="0.06em"
                >
                  {band.label.split(' ')[0].toUpperCase()}
                </text>
              ) : (
                <>
                  <rect
                    x={margins.left + plotWidth + 14}
                    y={top + 2}
                    width={3}
                    height={bottom - top - 4}
                    rx={1.5}
                    fill={palette[band.colorKey]}
                    fillOpacity={0.6}
                  />
                  <text
                    x={margins.left + plotWidth + 25}
                    y={(top + bottom) / 2 + 4}
                    fill={palette.axisLabel}
                    fontSize={12.5}
                    fontWeight={550}
                  >
                    {band.label}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* lifecycle columns */}
        {LIFE_STAGES.map((stage, index) => (
          <g key={stage.label}>
            {index > 0 && (
              <line
                x1={x(stage.from)}
                x2={x(stage.from)}
                y1={margins.top}
                y2={margins.top + plotHeight}
                stroke={palette.grid}
                strokeOpacity={0.06}
              />
            )}
            {!isNarrow && (
              <text
                x={(x(stage.from) + x(stage.to)) / 2}
                y={margins.top + plotHeight + 19}
                textAnchor="middle"
                fill={palette.axisTick}
                fontSize={11.5}
                fontWeight={550}
              >
                {stage.label}
              </text>
            )}
          </g>
        ))}

        {/* axes */}
        {[
          { quality: 1, label: '100%' },
          { quality: 0, label: '0%' },
        ].map(({ quality, label }) => (
          <text
            key={label}
            x={margins.left - 9}
            y={y(quality) + 4}
            textAnchor="end"
            fill={palette.axisTick}
            fontSize={isTiny ? 10 : 11.5}
          >
            {label}
          </text>
        ))}
        {!isTiny && (
          <text
            x={12}
            y={margins.top + plotHeight / 2}
            textAnchor="middle"
            fill={palette.axisLabel}
            fontSize={12}
            fontWeight={550}
            transform={`rotate(-90 12 ${margins.top + plotHeight / 2})`}
          >
            Quality of life
          </text>
        )}
        {ageTicks.map((tick) => (
          <text
            key={tick}
            x={x(tick)}
            y={margins.top + plotHeight + (isNarrow ? 18 : 36)}
            textAnchor={tick === 0 ? 'start' : tick === MAX_AGE ? 'end' : 'middle'}
            fill={palette.axisTick}
            fontSize={isTiny ? 10 : 11}
          >
            {tick}
          </text>
        ))}
        <text
          x={margins.left + plotWidth / 2}
          y={geometry.height - 6}
          textAnchor="middle"
          fill={palette.axisLabel}
          fontSize={isTiny ? 10.5 : 12}
          fontWeight={550}
        >
          Age
        </text>

        {/* the window spent in decline, behind the curves */}
        <rect
          x={healthspanX}
          y={margins.top}
          width={Math.max(0, lifespanX - healthspanX)}
          height={plotHeight}
          fill={palette.poor}
          fillOpacity={0.13}
        />

        <rect
          x={margins.left}
          y={margins.top}
          width={plotWidth}
          height={plotHeight}
          fill="none"
          stroke={palette.grid}
          strokeOpacity={0.14}
        />

        {/* curves */}
        {paths && (
          <>
            <path d={paths.area} fill={`url(#${gradientId})`} />
            <path
              d={paths.average}
              fill="none"
              stroke={palette.average}
              strokeWidth={2}
              strokeDasharray="6 5"
              strokeOpacity={0.9}
              strokeLinecap="round"
            />
            <path
              d={paths.you}
              fill="none"
              stroke={palette.you}
              strokeWidth={8}
              strokeOpacity={0.13}
              strokeLinecap="round"
            />
            <path
              d={paths.you}
              fill="none"
              stroke={palette.you}
              strokeWidth={2.6}
              strokeLinecap="round"
            />
          </>
        )}

        {/* guide lines */}
        {[
          { at: healthspanX, color: palette.you },
          { at: lifespanX, color: palette.mark },
        ].map(({ at, color }, index) => (
          <line
            key={index}
            x1={at}
            x2={at}
            y1={margins.top - 6}
            y2={zeroY}
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray="3 4"
            strokeOpacity={0.75}
          />
        ))}

        <text
          x={healthLabel.x}
          y={labelsCollide ? rowB : rowA}
          textAnchor={healthLabel.anchor}
          fill={palette.you}
          fontSize={labelSize}
          fontWeight={650}
        >
          {healthLabel.text}
        </text>
        <text
          x={lifeLabel.x}
          y={rowA}
          textAnchor={lifeLabel.anchor}
          fill={palette.axisLabel}
          fontSize={labelSize}
          fontWeight={600}
        >
          {lifeLabel.text}
        </text>

        {/* healthspan gained or lost versus the average */}
        {showAnnotation && (
          <g>
            <line
              x1={baselineX}
              x2={healthspanX - direction * 7}
              y1={annotationY}
              y2={annotationY}
              stroke={palette.mark}
              strokeOpacity={0.8}
              strokeWidth={1.5}
            />
            <path
              d={`M${healthspanX} ${annotationY}L${healthspanX - direction * 8} ${
                annotationY - 4.5
              }L${healthspanX - direction * 8} ${annotationY + 4.5}Z`}
              fill={palette.mark}
              fillOpacity={0.8}
            />
            <line
              x1={baselineX}
              x2={baselineX}
              y1={annotationY - 5}
              y2={annotationY + 5}
              stroke={palette.mark}
              strokeOpacity={0.55}
              strokeWidth={1.5}
            />
            <rect
              x={annotationMid - annotationWidth / 2 - 9}
              y={annotationY - (isTiny ? 27 : 29)}
              width={annotationWidth + 18}
              height={20}
              rx={10}
              fill={palette.surface}
              fillOpacity={0.92}
              stroke={palette.grid}
              strokeOpacity={0.14}
            />
            <text
              x={annotationMid}
              y={annotationY - (isTiny ? 13.5 : 15.5)}
              textAnchor="middle"
              fill={delta > 0 ? palette.good : palette.poor}
              fontSize={labelSize}
              fontWeight={650}
            >
              {annotationText}
            </text>
          </g>
        )}

        {/* crosshair */}
        {hoverAge !== null && hoverQuality && (
          <g pointerEvents="none">
            <line
              x1={x(hoverAge)}
              x2={x(hoverAge)}
              y1={margins.top}
              y2={zeroY}
              stroke={palette.grid}
              strokeOpacity={0.28}
            />
            <circle
              cx={x(hoverAge)}
              cy={y(hoverQuality.you)}
              r={4.5}
              fill={palette.you}
              stroke={palette.surface}
              strokeWidth={2}
            />
            <circle
              cx={x(hoverAge)}
              cy={y(hoverQuality.average)}
              r={4.5}
              fill={palette.average}
              stroke={palette.surface}
              strokeWidth={2}
            />
          </g>
        )}
      </svg>

      {hoverAge !== null && hoverQuality && (
        <div
          className={styles.tooltip}
          style={{
            left: Math.max(
              64,
              Math.min(geometry.width - 64, x(hoverAge) + 6),
            ),
            top: Math.max(
              60,
              y(Math.max(hoverQuality.you, hoverQuality.average)) - 14,
            ),
          }}
        >
          <div className={styles.tooltipAge}>Age {Math.round(hoverAge)}</div>
          <div className={styles.tooltipRow}>
            <span className={styles.dot} style={{ background: palette.you }} />
            You<b>{Math.round(hoverQuality.you * 100)}%</b>
          </div>
          <div className={styles.tooltipRow}>
            <span
              className={styles.dot}
              style={{ background: palette.average }}
            />
            Average<b>{Math.round(hoverQuality.average * 100)}%</b>
          </div>
        </div>
      )}
    </div>
  );
}
