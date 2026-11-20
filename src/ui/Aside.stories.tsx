import type { Meta, StoryObj } from '@storybook/react-vite';
import { caseStudies } from '../data/caseStudies';
import Aside from './Aside';
import Label from '../ui/Label';

const meta = {
  title: 'UI/Aside',
  component: Aside,
  subcomponents: { Label },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}>{Story()}</div>],
} satisfies Meta<typeof Aside>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A lesson under "What I learned": a title and a sentence (Sage). */
export const Lesson: Story = {
  args: {
    children: (
      <>
        <div style={{ fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.35, color: 'var(--color-text)' }}>{caseStudies.sage.outcome.lessons?.[0]?.title}</div>
        <p style={{ margin: '0.55rem 0 0', color: 'var(--color-text-body)', lineHeight: 1.7 }}>{caseStudies.sage.outcome.lessons?.[0]?.text}</p>
      </>
    ),
  },
};

/** A Label and a sentence: PLMC's "If I did it again". */
export const WithLabel: Story = {
  args: {
    children: (
      <>
        <Label>If I did it again</Label>
        <p style={{ margin: '0.8rem 0 0', color: 'var(--color-text-body)', lineHeight: 1.7 }}>{caseStudies.plmc.outcome.ifIDidItAgain}</p>
      </>
    ),
  },
};
