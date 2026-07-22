import type { ChapterMeta } from '../../data/caseStudies/types';
import { colors, fonts } from '../../theme/tokens';

/**
 * Chapter-heading trio: big accent serif numeral, uppercase label, and an
 * italic serif subtitle — all baseline-aligned in a wrapping row.
 */
export default function ChapterHeading({ meta }: { meta: ChapterMeta }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.4rem', flexWrap: 'wrap' }}>
      <span
        style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
          lineHeight: 1,
          color: colors.accentBright,
        }}
      >
        {meta.numeral}
      </span>
      <span
        style={{
          fontSize: '0.68rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: colors.textMuted,
        }}
      >
        {meta.label}
      </span>
      <span
        style={{
          fontFamily: fonts.display,
          fontStyle: 'italic',
          fontSize: '1.05rem',
          color: colors.textFaint,
        }}
      >
        {meta.subtitle}
      </span>
    </div>
  );
}
