import type { Meta, StoryObj } from '@storybook/react-vite';
import { caseStudies } from '../../data/caseStudies';
import { inColumn } from '../../../.storybook/caseStudyFrames';
import ChapterHeading from './ChapterHeading';

const meta = {
  title: 'Case study/ChapterHeading',
  component: ChapterHeading,
  decorators: [inColumn],
} satisfies Meta<typeof ChapterHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** PLMC's Process chapter, on the alternate background its section has (as do Context and Outcome). */
export const Process: Story = {
  args: { meta: caseStudies.plmc.process.chapter },
  globals: { backgrounds: { value: 'section' } },
};

/** PLMC's Solution chapter, on the page background (as is Users). */
export const OnPageBackground: Story = {
  args: { meta: caseStudies.plmc.solution.chapter },
};
