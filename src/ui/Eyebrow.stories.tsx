import type { Meta, StoryObj } from '@storybook/react-vite';
import { caseStudies } from '../data/caseStudies';
import Eyebrow from './Eyebrow';

const meta = {
  title: 'UI/Eyebrow',
  component: Eyebrow,
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A case-study chapter name, as ChapterHeading shows it. */
export const ChapterLabel: Story = {
  args: { children: caseStudies.plmc.context.chapter.label },
};

/** The line above a case study's title. */
export const CaseStudyLine: Story = {
  args: { children: `Case study ${caseStudies.plmc.caseNumber}` },
};
