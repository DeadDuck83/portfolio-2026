/**
 * The levers, their relative weights, and the five plain-language steps each
 * slider moves through.
 *
 * Weights are ordinal, reflecting the relative strength of the epidemiological
 * evidence rather than any single effect size — and they are normalised in
 * `compositeScore`, so only the ratios between them matter. Movement, sleep,
 * diet and substance use carry the most; supplementation the least.
 */

export type LeverId =
  | 'cardio'
  | 'strength'
  | 'sleep'
  | 'stress'
  | 'social'
  | 'diet'
  | 'bodyComposition'
  | 'substances'
  | 'supplements'
  | 'testing';

export type LeverGroup =
  | 'Movement'
  | 'Recovery & mind'
  | 'Fuel'
  | 'Prevention';

/** Exactly five steps, worst to best. */
export type Descriptors = readonly [string, string, string, string, string];

export interface Lever {
  readonly id: LeverId;
  readonly label: string;
  readonly group: LeverGroup;
  readonly weight: number;
  readonly descriptors: Descriptors;
}

export type LeverValues = Record<LeverId, number>;

/** Where the dashed population-average reference curve sits. */
export const BASELINE_VALUE = 45;

export const PRESETS = {
  'Worst case': 5,
  Average: BASELINE_VALUE,
  Optimized: 92,
} as const satisfies Record<string, number>;

export const LEVERS: readonly Lever[] = [
  {
    id: 'cardio',
    label: 'Cardiorespiratory fitness',
    group: 'Movement',
    weight: 94,
    descriptors: [
      'Sedentary — no deliberate cardio',
      'Occasional walks, nothing structured',
      'Around 150 min/week, moderate',
      'Zone 2 base plus weekly intervals',
      'Top-decile VO₂max for your age',
    ],
  },
  {
    id: 'strength',
    label: 'Resistance training',
    group: 'Movement',
    weight: 86,
    descriptors: [
      'None',
      'Occasional, unstructured',
      'Once a week',
      '2–3×/week, progressive overload',
      '3–4×/week plus power and grip work',
    ],
  },
  {
    id: 'sleep',
    label: 'Sleep',
    group: 'Recovery & mind',
    weight: 90,
    descriptors: [
      'Under 5 hrs, erratic schedule',
      '5–6 hrs, frequently disrupted',
      '6–7 hrs, variable',
      '7–8 hrs, consistent timing',
      '7–9 hrs, consistent, high quality',
    ],
  },
  {
    id: 'stress',
    label: 'Stress load',
    group: 'Recovery & mind',
    weight: 56,
    descriptors: [
      'Chronic and unmanaged',
      'High, with little recovery',
      'Moderate, occasionally managed',
      'Managed — regular downshift',
      'Low load plus a daily practice',
    ],
  },
  {
    id: 'social',
    label: 'Social connection',
    group: 'Recovery & mind',
    weight: 50,
    descriptors: [
      'Isolated most of the time',
      'A few weak ties',
      'Some regular contact',
      'Strong, frequent, reciprocal',
      'Deep daily connection and purpose',
    ],
  },
  {
    id: 'diet',
    label: 'Diet quality',
    group: 'Fuel',
    weight: 80,
    descriptors: [
      'Mostly ultra-processed',
      'Frequently processed, low fiber',
      'Mixed — some whole food',
      'Whole-food majority, protein adequate',
      'Whole-food, protein and fiber targets met',
    ],
  },
  {
    id: 'bodyComposition',
    label: 'Body composition',
    group: 'Fuel',
    weight: 76,
    descriptors: [
      'High visceral fat, low muscle',
      'Above healthy range',
      'Near healthy range',
      'Healthy range with good muscle mass',
      'Lean with high muscle mass',
    ],
  },
  {
    id: 'substances',
    label: 'Alcohol & nicotine',
    group: 'Fuel',
    weight: 80,
    descriptors: [
      'Daily heavy drinking and smoking',
      'Heavy drinking or smoking',
      'Moderate, social',
      'Occasional, well under guidelines',
      'None',
    ],
  },
  {
    id: 'supplements',
    label: 'Supplement protocol',
    group: 'Prevention',
    weight: 38,
    descriptors: [
      'None',
      'Random and inconsistent',
      'A general multivitamin',
      'Targeted to known gaps',
      'Targeted and dosed to your biomarkers',
    ],
  },
  {
    id: 'testing',
    label: 'Biomarker testing & screening',
    group: 'Prevention',
    weight: 42,
    descriptors: [
      'Never tested',
      'Only when something is wrong',
      'Annual physical',
      'Annual full panel, acted on',
      'Twice-yearly panel plus age-appropriate screening',
    ],
  },
];

/** Levers in source order, bucketed by group heading. */
export const LEVER_GROUPS: readonly {
  group: LeverGroup;
  levers: readonly Lever[];
}[] = LEVERS.reduce<{ group: LeverGroup; levers: Lever[] }[]>(
  (groups, lever) => {
    const last = groups.length > 0 ? groups[groups.length - 1] : undefined;
    if (last && last.group === lever.group) last.levers.push(lever);
    else groups.push({ group: lever.group, levers: [lever] });
    return groups;
  },
  [],
);

export function makeValues(value: number): LeverValues {
  return Object.fromEntries(
    LEVERS.map((lever) => [lever.id, value]),
  ) as LeverValues;
}

/** Which of the five descriptors a slider position maps onto. */
export function descriptorFor(lever: Lever, value: number): string {
  const index = Math.min(
    lever.descriptors.length - 1,
    Math.floor((value / 100) * lever.descriptors.length),
  );
  return lever.descriptors[index];
}
