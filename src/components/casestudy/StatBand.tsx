import type { OutcomeStat } from '../../data/caseStudies/types';
import { border, colors, fonts } from '../../theme/tokens';
import { useCountUp } from '../../hooks/useCountUp';

/**
 * 05 Outcome stat band. Numeric ("count") stats animate from 0 to their target
 * when the band scrolls into view; "static" stats render verbatim.
 */
export default function StatBand({ stats }: { stats: OutcomeStat[] }) {
  const { ref, p } = useCountUp();

  const render = (s: OutcomeStat) => {
    if (s.kind === 'static') return s.display ?? '';
    const value = Math.round(p * (s.to ?? 0));
    return `${value}${s.suffix ?? ''}`;
  };

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 1,
        background: border.gridBgFaint,
        border: `1px solid ${border.gridBgFaint}`,
      }}
    >
      {stats.map((s) => (
        <div key={s.label} style={{ background: colors.bgAlt, padding: '1.6rem 1.4rem' }}>
          <div style={{ fontFamily: fonts.display, fontSize: '2.4rem', color: colors.accentBright }}>
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
    </div>
  );
}
