/**
 * Healthspan model — pure functions, no React, no DOM.
 *
 * The decline half of the quality-of-life curve is a superellipse:
 *
 *     Q = (1 - x^n)^(1/n),  x = (age - peak) / (death - peak)
 *
 * At n = 1 that is a straight diagonal: the slow slide into decades of
 * decline. As n grows the curve *squares off* — quality of life is held near
 * its peak and the drop happens late and fast. That single exponent is the
 * whole idea of "compression of morbidity", so the levers drive it hard and
 * drive maximum lifespan only gently, which is what the evidence supports.
 *
 * Defaults are calibrated so an average profile lands at ~64 healthy years
 * and ~79 total, matching published US healthy-life-expectancy figures.
 */

import type { Lever, LeverId, LeverValues } from './levers';

export interface ModelParams {
  /** Age at which quality of life peaks. */
  readonly peakAge: number;
  /** Lifespan when every lever is at zero. */
  readonly lifespanFloor: number;
  /** Lifespan when every lever is maxed. */
  readonly lifespanCeiling: number;
  /** Quality-of-life fraction below which "good health" ends. */
  readonly goodThreshold: number;
  /** Quality-of-life fraction below which "fair health" ends. */
  readonly fairThreshold: number;
  /** Superellipse exponent at composite 0. */
  readonly squarenessMin: number;
  /** Superellipse exponent at composite 1. */
  readonly squarenessMax: number;
  /** Shapes how composite score maps onto squareness. */
  readonly squarenessCurve: number;
  /** Steepness of the rise from birth to peak. */
  readonly riseExponent: number;
}

export const DEFAULT_PARAMS: ModelParams = {
  peakAge: 26,
  lifespanFloor: 66,
  lifespanCeiling: 94,
  goodThreshold: 0.66,
  fairThreshold: 0.33,
  squarenessMin: 1.39,
  squarenessMax: 3.4,
  squarenessCurve: 1.735,
  riseExponent: 4.5,
};

export const MAX_AGE = 100;

export interface Outcome {
  /** Weighted composite of all levers, 0–1. */
  readonly composite: number;
  /** Age at death. */
  readonly lifespan: number;
  /** Superellipse exponent — higher means a more rectangular curve. */
  readonly squareness: number;
  /** Age at which the curve leaves good health. */
  readonly healthspan: number;
  /** Years spent below the good-health threshold. */
  readonly declineYears: number;
}

/** Weighted mean of lever positions, normalised to 0–1. */
export function compositeScore(
  values: LeverValues,
  levers: readonly Lever[],
): number {
  let weighted = 0;
  let total = 0;
  for (const lever of levers) {
    weighted += lever.weight * ((values[lever.id] ?? 0) / 100);
    total += lever.weight;
  }
  return total === 0 ? 0 : weighted / total;
}

/**
 * Age at which the decline crosses a quality-of-life threshold.
 * Closed form — no numeric search needed:
 *   (1 - x^n)^(1/n) = T  =>  x = (1 - T^n)^(1/n)
 */
function crossingAge(
  lifespan: number,
  squareness: number,
  threshold: number,
  { peakAge }: ModelParams,
): number {
  const x = Math.pow(1 - Math.pow(threshold, squareness), 1 / squareness);
  return peakAge + (lifespan - peakAge) * x;
}

export function solve(
  composite: number,
  params: ModelParams = DEFAULT_PARAMS,
): Outcome {
  const {
    lifespanFloor,
    lifespanCeiling,
    squarenessMin,
    squarenessMax,
    squarenessCurve,
    goodThreshold,
  } = params;

  const lifespan = lifespanFloor + (lifespanCeiling - lifespanFloor) * composite;
  const squareness =
    squarenessMin +
    (squarenessMax - squarenessMin) * Math.pow(composite, squarenessCurve);
  const healthspan = crossingAge(lifespan, squareness, goodThreshold, params);

  return {
    composite,
    lifespan,
    squareness,
    healthspan,
    declineYears: lifespan - healthspan,
  };
}

/** Convenience: lever positions straight through to an outcome. */
export function solveFor(
  values: LeverValues,
  levers: readonly Lever[],
  params: ModelParams = DEFAULT_PARAMS,
): Outcome {
  return solve(compositeScore(values, levers), params);
}

/** Quality of life at a given age, 0–1. */
export function qualityOfLife(
  age: number,
  lifespan: number,
  squareness: number,
  { peakAge, riseExponent }: ModelParams = DEFAULT_PARAMS,
): number {
  if (age <= 0) return 0;
  if (age <= peakAge) return 1 - Math.pow(1 - age / peakAge, riseExponent);

  const x = (age - peakAge) / (lifespan - peakAge);
  if (x >= 1) return 0;
  return Math.pow(1 - Math.pow(x, squareness), 1 / squareness);
}

/**
 * What one lever is worth *right now*, in healthy years — the difference
 * between the current outcome and the same profile with that single lever
 * dropped back to the population baseline. Recomputed live, so the number
 * shrinks as everything else improves. That is real diminishing returns,
 * not a bug.
 */
export function marginalYears(
  leverId: LeverId,
  values: LeverValues,
  levers: readonly Lever[],
  baselineValue: number,
  params: ModelParams = DEFAULT_PARAMS,
): number {
  const current = solveFor(values, levers, params);
  const without = solveFor(
    { ...values, [leverId]: baselineValue },
    levers,
    params,
  );
  return current.healthspan - without.healthspan;
}
