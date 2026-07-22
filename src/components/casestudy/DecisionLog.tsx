import { useState } from 'react';
import type { Decision } from '../../data/caseStudies/types';
import { border, colors, fonts } from '../../theme/tokens';

/**
 * The 03 Process decision log: accordion rows (numeral, serif title, rotating
 * chevron). One open at a time — opening another closes the first; clicking the
 * open one closes it. First row (index 0) is open initially. Each body is a
 * two-column "The call" / "What it cost" grid.
 */
export default function DecisionLog({ decisions }: { decisions: Decision[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div style={{ borderTop: `1px solid ${border.hairlineStrong}` }}>
      {decisions.map((d, i) => {
        const isOpen = open === i;
        return (
          <div key={d.title} style={{ borderBottom: `1px solid ${border.hairlineStrong}` }}>
            <button
              onClick={() => setOpen((cur) => (cur === i ? -1 : i))}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'baseline',
                gap: '1.2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '1.3rem 0',
                textAlign: 'left',
                color: colors.text,
                fontFamily: fonts.mono,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.accentTint)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.text)}
            >
              <span style={{ fontSize: '0.66rem', letterSpacing: '0.16em', color: colors.accentBright }}>
                {'0' + (i + 1)}
              </span>
              <span
                style={{
                  fontFamily: fonts.display,
                  fontSize: 'clamp(1.2rem, 2.4vw, 1.65rem)',
                  flex: 1,
                  lineHeight: 1.2,
                }}
              >
                {d.title}
              </span>
              <span
                style={{
                  fontFamily: fonts.display,
                  fontSize: '1.1rem',
                  color: colors.accent,
                  transform: `rotate(${isOpen ? 180 : 0}deg)`,
                  transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                ↓
              </span>
            </button>
            <div
              style={{
                overflow: 'hidden',
                maxHeight: isOpen ? 420 : 0,
                opacity: isOpen ? 1 : 0,
                transition: 'max-height 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem',
                  padding: '0.2rem 0 1.7rem',
                }}
              >
                <Column label="The call" text={d.choice} />
                <Column label="What it cost" text={d.cost} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Column({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: colors.textFaint,
          marginBottom: '0.6rem',
        }}
      >
        {label}
      </div>
      <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.7, color: colors.textBody }}>{text}</p>
    </div>
  );
}
