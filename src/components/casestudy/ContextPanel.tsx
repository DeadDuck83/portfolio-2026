import { useState } from 'react';
import { border, colors, fonts } from '../../theme/tokens';
import Button from '../../ui/Button';
import Label from '../../ui/Label';

/** Fixed scatter transforms per chip (rotation + offset), from the reference. */
const SCATTER = [
  { r: -7, x: -6, y: 8 },
  { r: 5, x: 10, y: -4 },
  { r: -3, x: 18, y: 12 },
  { r: 8, x: -4, y: -6 },
  { r: -5, x: 12, y: 14 },
  { r: 3, x: -12, y: 2 },
  { r: -8, x: 6, y: 9 },
];

/**
 * The interactive panel beside the text in a case study's Context chapter: the
 * problem's pieces as scattered tags, and a "Tidy it up →" toggle (Button, with
 * `aria-pressed`) that lines them up, turns them accent (0.8s, 60ms apart) and swaps
 * the caption. "← Scatter it again" undoes it. Use it once, to show the mess the
 * project started from. Data: from `caseStudy.context`: `panelLabel`, the `chips`
 * (up to seven have their own scatter; more repeat the pattern), `captionBefore`
 * and `captionAfter`.
 *
 * @import import ContextPanel from '../components/casestudy/ContextPanel';
 */
export default function ContextPanel({
  panelLabel,
  chips,
  captionBefore,
  captionAfter,
}: {
  panelLabel: string;
  chips: string[];
  captionBefore: string;
  captionAfter: string;
}) {
  const [herded, setHerded] = useState(false);

  return (
    <div style={{ border: `1px solid ${border.hairlineStrong}`, padding: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
      <Label tone="muted">{panelLabel}</Label>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.7rem',
          marginTop: '1.4rem',
          minHeight: 120,
          alignContent: 'flex-start',
        }}
      >
        {chips.map((label, i) => {
          const s = SCATTER[i % SCATTER.length];
          const transform = herded ? 'none' : `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`;
          return (
            <span
              key={label}
              style={{
                fontSize: '0.64rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.45rem 0.8rem',
                border: `1px solid ${herded ? border.accentStrong : border.chip}`,
                color: herded ? colors.accentTint : colors.textBody,
                transform,
                transition:
                  'transform 0.8s cubic-bezier(0.22,1,0.36,1), border-color 0.8s ease, color 0.8s ease',
                transitionDelay: `${i * 60}ms`,
              }}
            >
              {label}
            </span>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginTop: '1.6rem',
          flexWrap: 'wrap',
        }}
      >
        <Button variant="outline" size="compact" aria-pressed={herded} onClick={() => setHerded((h) => !h)}>
          {herded ? '← Scatter it again' : 'Tidy it up →'}
        </Button>
        <span
          style={{
            fontFamily: fonts.text,
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: colors.textFaint,
          }}
        >
          {herded ? captionAfter : captionBefore}
        </span>
      </div>
    </div>
  );
}
