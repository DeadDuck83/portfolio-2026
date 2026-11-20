import type { ChapterMeta } from '../../data/caseStudies/types';
import { colors, fonts } from '../../theme/tokens';
import Eyebrow from '../../ui/Eyebrow';

/**
 * The heading at the top of each chapter of a case study: the chapter's name as an
 * Eyebrow, and an italic subtitle on the same baseline, in a row that wraps on a
 * narrow screen. No numerals: the order speaks for itself. Use it once per chapter,
 * first thing in the section. Data: a `ChapterMeta` (`label`, `subtitle`), such as
 * `caseStudy.process.chapter`.
 *
 * @import import ChapterHeading from '../components/casestudy/ChapterHeading';
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
          color: colors.textMuted,
        }}
      >
        {meta.subtitle}
      </span>
    </div>
  );
}
