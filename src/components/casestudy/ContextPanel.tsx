import { useState } from 'react';
import { border, colors, fonts } from '../../theme/tokens';

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
 * The 01 Context interactive panel: scattered data-source chips with a
 * "Tidy it up →" button that animates them to an aligned, accent-bordered
 * state (0.8s spring, 60ms stagger) and swaps the caption. Toggles back with
 * "← Scatter it again".
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
      <div
        style={{
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: colors.textFaint,
        }}
      >
        {panelLabel}
      </div>

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
        <button
          onClick={() => setHerded((h) => !h)}
          style={{
            background: 'none',
            border: `1px solid ${border.accentStrong}`,
            color: colors.accentTint,
            fontFamily: fonts.mono,
            fontSize: '0.66rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            padding: '0.6rem 1rem',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(191,106,65,0.14)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          {herded ? '← Scatter it again' : 'Tidy it up →'}
        </button>
        <span
          style={{
            fontFamily: fonts.display,
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
