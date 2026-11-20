import { useId, useState } from 'react';
import type { Decision } from '../../data/caseStudies/types';
import { border, colors, fonts, weights } from '../../theme/tokens';
import Label from '../../ui/Label';
import styles from './decisionLog.module.css';

/**
 * The decision log in a case study's Process chapter: one row per call that was
 * made (numeral, title, a chevron that turns), opening to two columns: the call,
 * and what it cost or paid off. One row open at a time: opening another closes the
 * first, and clicking the open one closes it. The first row starts open. Each row
 * says whether it's open (`aria-expanded`), a closed row's text is hidden from
 * screen readers, and the rows take the site's focus ring. Use it for the few big
 * calls in a project, not a full changelog. Data: a `Decision[]`
 * (`caseStudy.process.decisions`); `choiceLabel` and `costLabel` rename the columns
 * ("The call" and "What it cost" unless the case study says otherwise).
 *
 * @import import DecisionLog from '../components/casestudy/DecisionLog';
 */
export default function DecisionLog({
  decisions,
  choiceLabel = 'The call',
  costLabel = 'What it cost',
}: {
  decisions: Decision[];
  choiceLabel?: string;
  costLabel?: string;
}) {
  const [open, setOpen] = useState(0);
  const id = useId();

  return (
    <div style={{ borderTop: `1px solid ${border.hairlineStrong}` }}>
      {decisions.map((d, i) => {
        const isOpen = open === i;
        const panelId = `${id}-${i}`;
        return (
          <div key={d.title} style={{ borderBottom: `1px solid ${border.hairlineStrong}` }}>
            <button
              className={styles.row}
              aria-expanded={isOpen}
              aria-controls={panelId}
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
                fontFamily: fonts.text,
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
                  fontWeight: weights.display,
                  fontSize: 'clamp(1.2rem, 2.4vw, 1.65rem)',
                  flex: 1,
                  lineHeight: 1.2,
                }}
              >
                {d.title}
              </span>
              <span
                style={{
                  fontFamily: fonts.text,
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
              id={panelId}
              aria-hidden={!isOpen}
              style={{
                overflow: 'hidden',
                maxHeight: isOpen ? 900 : 0,
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
                <Column label={choiceLabel} text={d.choice} />
                <Column label={costLabel} text={d.cost} />
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
      <Label tone="muted" style={{ marginBottom: '0.6rem' }}>
        {label}
      </Label>
      <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.7, color: colors.textBody }}>{text}</p>
    </div>
  );
}
