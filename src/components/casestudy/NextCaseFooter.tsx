import { type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { CaseStudy } from '../../data/caseStudies/types';
import { border, colors, fonts } from '../../theme/tokens';

/**
 * Full-width "Next case study" link block. Links to the next case study when
 * one exists (`nextCase.to`); otherwise renders as a non-linked "Brewing."
 * block. Hovering tints the background.
 */
export default function NextCaseFooter({ nextCase }: { nextCase: CaseStudy['nextCase'] }) {
  const onEnter = (e: MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.background = 'rgba(191,106,65,0.05)');
  const onLeave = (e: MouseEvent<HTMLElement>) => (e.currentTarget.style.background = 'transparent');

  const inner: ReactNode = (
    <div
      style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: 'clamp(3.5rem, 9vh, 6rem) clamp(1.5rem, 6vw, 6rem)',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div style={{ fontSize: '0.66rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.textMuted }}>
          Next case study
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            lineHeight: 1.05,
            marginTop: '0.8rem',
          }}
        >
          {nextCase.label}
          {nextCase.note && (
            <span style={{ fontStyle: 'italic', fontSize: '0.5em', color: colors.textFaint }}>
              {' '}
              {nextCase.note}
            </span>
          )}
        </div>
      </div>
      <span style={{ fontFamily: fonts.display, fontSize: '2rem', color: colors.accent }}>→</span>
    </div>
  );

  return (
    <section style={{ borderTop: `1px solid ${border.hairline}` }}>
      {nextCase.to ? (
        <Link to={nextCase.to} style={{ display: 'block' }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
          {inner}
        </Link>
      ) : (
        <div>{inner}</div>
      )}
    </section>
  );
}
