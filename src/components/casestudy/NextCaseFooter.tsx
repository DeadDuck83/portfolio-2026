import { type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { CaseStudy } from '../../data/caseStudies/types';
import { noteCaseStudySource } from '../../lib/analytics';
import { border, colors, fonts, weights } from '../../theme/tokens';

/**
 * The full-width "Next case study" row at the end of a case study, above the
 * footer. With a route (`nextCase.to`) the whole row links to that case study, and
 * hovering tints it; without one it's the same row with no link, for a case study
 * that isn't published yet (the "Brewing." state). Use it once, last thing on a case
 * study page. Data: `caseStudy.nextCase` (`label`, an optional italic `note`, and
 * `to`). Needs React Router around it, for the link.
 *
 * @import import NextCaseFooter from '../components/casestudy/NextCaseFooter';
 */
export default function NextCaseFooter({ nextCase }: { nextCase: CaseStudy['nextCase'] }) {
  const onEnter = (e: MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.background = 'rgba(132,137,69,0.05)');
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
            fontWeight: weights.display,
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            lineHeight: 1.05,
            marginTop: '0.8rem',
          }}
        >
          {nextCase.label}
          {nextCase.note && (
            <span style={{ fontFamily: fonts.text, fontWeight: 400, fontStyle: 'italic', fontSize: '0.5em', color: colors.textFaint }}>
              {' '}
              {nextCase.note}
            </span>
          )}
        </div>
      </div>
      <span style={{ fontFamily: fonts.text, fontSize: '2rem', color: colors.accent }}>→</span>
    </div>
  );

  return (
    <section style={{ borderTop: `1px solid ${border.hairline}` }}>
      {nextCase.to ? (
        <Link
          to={nextCase.to}
          style={{ display: 'block' }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onClick={() => noteCaseStudySource('next-case')}
        >
          {inner}
        </Link>
      ) : (
        <div>{inner}</div>
      )}
    </section>
  );
}
