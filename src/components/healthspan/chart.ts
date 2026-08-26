/**
 * Chart geometry — scales, path building and text metrics.
 *
 * The chart lays itself out in real pixels rather than scaling a fixed
 * viewBox. A viewBox that scales would shrink 12px labels to 5px on a phone;
 * measuring the container and recomputing means type stays the size it was
 * designed to be at every width.
 */

import { MAX_AGE, qualityOfLife, type ModelParams } from './model';

export interface Margins {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface ChartGeometry {
  readonly width: number;
  readonly height: number;
  readonly margins: Margins;
  readonly plotWidth: number;
  readonly plotHeight: number;
  /** Age → x pixel. */
  readonly x: (age: number) => number;
  /** Quality of life (0–1) → y pixel. */
  readonly y: (quality: number) => number;
  /** x pixel → age. */
  readonly ageAt: (px: number) => number;
  /** Below this the band labels move inside and stage names are dropped. */
  readonly isNarrow: boolean;
  /** Below this the y-axis title is dropped and age ticks thin out. */
  readonly isTiny: boolean;
}

export function createGeometry(containerWidth: number): ChartGeometry {
  const width = Math.max(300, containerWidth - 12);
  const isNarrow = width < 620;
  const isTiny = width < 430;

  const height = isTiny
    ? 320
    : isNarrow
      ? 370
      : Math.round(Math.min(460, Math.max(380, width * 0.4)));

  const margins: Margins = {
    top: 54,
    right: isNarrow ? 14 : 116,
    bottom: isNarrow ? 44 : 56,
    left: isTiny ? 34 : 46,
  };

  const plotWidth = width - margins.left - margins.right;
  const plotHeight = height - margins.top - margins.bottom;

  return {
    width,
    height,
    margins,
    plotWidth,
    plotHeight,
    isNarrow,
    isTiny,
    x: (age) => margins.left + (age / MAX_AGE) * plotWidth,
    y: (quality) => margins.top + (1 - quality) * plotHeight,
    ageAt: (px) => ((px - margins.left) / plotWidth) * MAX_AGE,
  };
}

/** SVG path for one quality-of-life curve. `close` fills it to the baseline. */
export function buildCurvePath(
  lifespan: number,
  squareness: number,
  geometry: ChartGeometry,
  params: ModelParams,
  close = false,
): string {
  const { x, y } = geometry;
  const step = 0.5;
  let d = '';

  for (let age = 0; age <= lifespan; age += step) {
    const quality = qualityOfLife(age, lifespan, squareness, params);
    d += `${d === '' ? 'M' : 'L'}${x(age).toFixed(2)} ${y(quality).toFixed(2)}`;
  }
  d += `L${x(lifespan).toFixed(2)} ${y(0).toFixed(2)}`;
  if (close) d += `L${x(0).toFixed(2)} ${y(0).toFixed(2)}Z`;

  return d;
}

export interface HealthBand {
  readonly low: number;
  readonly high: number;
  readonly colorKey: 'good' | 'fair' | 'poor';
  readonly label: string;
  readonly fillOpacity: number;
}

export function healthBands(params: ModelParams): readonly HealthBand[] {
  return [
    {
      low: params.goodThreshold,
      high: 1,
      colorKey: 'good',
      label: 'Good Health',
      fillOpacity: 0.085,
    },
    {
      low: params.fairThreshold,
      high: params.goodThreshold,
      colorKey: 'fair',
      label: 'Fair Health',
      fillOpacity: 0.07,
    },
    {
      low: 0,
      high: params.fairThreshold,
      colorKey: 'poor',
      label: 'Poor Health',
      fillOpacity: 0.055,
    },
  ];
}

export const LIFE_STAGES = [
  { from: 0, to: 20, label: 'Juvenile' },
  { from: 20, to: 40, label: 'Young Adult' },
  { from: 40, to: 60, label: 'Mature Adult' },
  { from: 60, to: 80, label: 'Senior' },
  { from: 80, to: 100, label: 'Aged' },
] as const;

/**
 * Measure text without touching the DOM tree.
 *
 * The two chart labels ("Good health until 85" / "Life ends at 92") collide
 * when the healthspan gap is small, and they need to stack. Measuring with a
 * ref would cost a second render pass every frame of the animation; a shared
 * offscreen canvas gives an exact width synchronously, during the same render.
 */
const measureCanvas: HTMLCanvasElement | null =
  typeof document === 'undefined' ? null : document.createElement('canvas');
const measureContext = measureCanvas?.getContext('2d') ?? null;

export function measureText(text: string, font: string): number {
  if (!measureContext) return text.length * 6.4; // SSR / jsdom fallback
  measureContext.font = font;
  return measureContext.measureText(text).width;
}

export function labelFont(fontSize: number, weight = 600): string {
  return `${weight} ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif`;
}
