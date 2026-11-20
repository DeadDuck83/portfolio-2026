import type { Meta, StoryObj } from '@storybook/react-vite';
import { caseStudies } from '../data/caseStudies';
import { inColumn, inHalfColumn } from '../../.storybook/caseStudyFrames';
import PlaceholderFigure from './PlaceholderFigure';

const { plmc } = caseStudies;
// PLMC's hero figure as it was before its image was added: the same data, without `src` and `alt`
const { src: _src, alt: _alt, ...heroWithoutImage } = plmc.heroFigure;

const meta = {
  title: 'Case study/PlaceholderFigure',
  component: PlaceholderFigure,
  decorators: [inColumn],
} satisfies Meta<typeof PlaceholderFigure>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * An image with a tag and a line of caption: PLMC's Fig. A, `prominent` as on the
 * page, on the Process chapter's alternate background.
 */
export const Image: Story = {
  args: { figure: plmc.process.figures[0], prominent: true },
  globals: { backgrounds: { value: 'section' } },
};

/**
 * No image yet: the grey block with its X, the "Placeholder · …" label, the size to
 * export and what goes there. PLMC's hero figure, without its `src`.
 */
export const Placeholder: Story = {
  args: { figure: heroWithoutImage, prominent: true },
};

/** A caption with a lead on its own line above the description: PLMC's Screen 01 in Solution. */
export const LeadCaption: Story = {
  args: { figure: plmc.solution.figures[0], prominent: true },
};

/**
 * A caption whose lead runs into the description (`leadInline`): PLMC's Screen 02, one
 * of the two cards under Screen 01, as wide as a card on the page.
 */
export const InlineLeadCaption: Story = {
  args: { figure: plmc.solution.figures[1] },
  decorators: [inHalfColumn('clamp(1.4rem, 3vw, 2.4rem)')],
};
