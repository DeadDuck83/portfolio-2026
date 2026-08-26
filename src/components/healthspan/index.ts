export {
  HealthspanSimulator,
  type HealthspanSimulatorProps,
} from './HealthspanSimulator';
export { HealthspanChart } from './HealthspanChart';

export {
  DEFAULT_PARAMS,
  MAX_AGE,
  compositeScore,
  marginalYears,
  qualityOfLife,
  solve,
  solveFor,
  type ModelParams,
  type Outcome,
} from './model';

export {
  BASELINE_VALUE,
  LEVERS,
  LEVER_GROUPS,
  PRESETS,
  descriptorFor,
  makeValues,
  type Descriptors,
  type Lever,
  type LeverGroup,
  type LeverId,
  type LeverValues,
} from './levers';

export { darkPalette, paletteVars, type Palette } from './theme';
