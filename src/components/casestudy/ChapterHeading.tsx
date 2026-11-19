import type { ChapterMeta } from '../../data/caseStudies/types';
import { colors, fonts } from '../../theme/tokens';
import Eyebrow from '../../ui/Eyebrow';

/**
 * Chapter heading: uppercase label and an italic subtitle, baseline-aligned in
 * a wrapping row. No numerals: the order speaks for itself.
 */
export default function ChapterHeading({ meta }: { meta: ChapterMeta }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.4rem', flexWrap: 'wrap' }}>
      <Eyebrow>{meta.label}</Eyebrow>
      <span
        style={{
          fontFamily: fonts.text,
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
