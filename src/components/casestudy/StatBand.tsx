import type { OutcomeStat } from '../../data/caseStudies/types';
import { colors, fonts, weights } from '../../theme/tokens';
import { useCountUp } from '../../hooks/useCountUp';
import CellGrid from '../../ui/CellGrid';

/**
 * The row of big numbers in a case study's Outcome chapter, each with a small label,
 * in a CellGrid with faint lines. Numeric ("count") stats count up from 0 when the
 * band scrolls into view; "static" stats show as written. Use it only when the
 * outcome has real numbers to report; leave it out otherwise. Data: an
 * `OutcomeStat[]` (`caseStudy.outcome.stats`), usually three.
 *
 * @import import StatBand from '../components/casestudy/StatBand';
 */
export default function StatBand({ stats }: { stats: OutcomeStat[] }) {
  const { ref, p } = useCountUp();

  const render = (s: OutcomeStat) => {
    if (s.kind === 'static') return s.display ?? '';
    const value = Math.round(p * (s.to ?? 0));
    return `${value}${s.suffix ?? ''}`;
  };

  return (
    <CellGrid ref={ref} min="200px" line="faint">
      {stats.map((s) => (
        <div key={s.label} style={{ background: colors.bgAlt, padding: '1.6rem 1.4rem' }}>
          <div style={{ fontFamily: fonts.display, fontWeight: weights.display, fontSize: '2.4rem', color: colors.accentBright }}>
            {render(s)}
          </div>
          <div
            style={{
              fontSize: '0.66rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: colors.textMuted,
              marginTop: '0.5rem',
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </CellGrid>
  );
}
