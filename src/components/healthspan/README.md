# Healthspan Simulator

An interactive model of the gap between **lifespan** (how long you live) and
**healthspan** (how long you live well). Ten lifestyle levers drive a
superellipse quality-of-life curve; pulling them squares the curve off, holding
quality high and compressing decline into a shorter window at the end.

Zero runtime dependencies beyond React.

## Install

Drop the folder into `src/components/` and render it:

```tsx
import { HealthspanSimulator } from './components/healthspan';

export default function Demo() {
  return <HealthspanSimulator />;
}
```

## Files

| File | Responsibility |
|---|---|
| `model.ts` | Pure curve math. No React, no DOM — directly unit-testable. |
| `levers.ts` | Lever definitions, weights, descriptor copy. |
| `chart.ts` | Scales, path building, text metrics. |
| `theme.ts` | Palette tokens → CSS custom properties. |
| `hooks.ts` | `useElementWidth`, `useTween`, `usePrefersReducedMotion`. |
| `HealthspanChart.tsx` | The SVG. |
| `HealthspanSimulator.tsx` | State, stat tiles, lever panel. |
| `*.module.css` | Scoped styles; every colour arrives as a CSS variable. |

## Props

| Prop | Type | Default |
|---|---|---|
| `initialValue` | `number` (0–100) | `45` — the population average |
| `params` | `ModelParams` | `DEFAULT_PARAMS` |
| `palette` | `Palette` | `darkPalette` |
| `heading` | `ReactNode` | built-in headline |
| `subheading` | `ReactNode` | built-in subhead |
| `className` | `string` | — |

## The model

Decline follows a superellipse:

```
Q = (1 − x^n)^(1/n),   x = (age − peak) / (death − peak)
```

At `n = 1` that is a straight diagonal — the slow slide into decades of poor
health. As `n` grows the curve squares off. The levers drive `n` hard and
maximum lifespan only gently, which is the honest split: the evidence for
compressing morbidity is far stronger than for extending maximum lifespan.

Healthspan has a closed form, so no numeric search is needed:

```
x = (1 − T^n)^(1/n)    where T is the good-health threshold
```

Defaults are calibrated against published US figures:

| Profile | Healthspan | Lifespan | Years in decline |
|---|---|---|---|
| Worst case | 49 | 67 | 18.3 |
| **Average** | **64** | **79** | **14.4** |
| Optimized | 85 | 92 | 6.4 |
| All levers maxed | 89 | 94 | 5.4 |

The average row matching real healthy-life-expectancy data (~63–66) and life
expectancy (~78) is the calibration anchor that makes the other rows credible.

Each slider also reports its own marginal contribution — recomputed live by
re-solving with that one lever dropped to baseline. Those numbers *shrink* as
everything else improves. That is diminishing returns, and it is intentional.

## Notes

- **Colour was computed, not chosen.** The two series colours sit 22.3 ΔE apart
  under protanopia and 24.0 under normal vision. Re-validate if you change them.
- **The chart lays out in real pixels**, not a scaled `viewBox`, so 12px labels
  stay 12px on a phone instead of shrinking to 5px.
- **Labels de-collide** by measuring text on a shared offscreen canvas during
  render — exact widths with no second render pass.
- Honours `prefers-reduced-motion` by snapping to the target instead of tweening.

## Caveat

Illustrative, not diagnostic. It describes populations, not individuals, and is
not medical advice.
