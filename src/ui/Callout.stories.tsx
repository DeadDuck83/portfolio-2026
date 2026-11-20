import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { caseStudies } from '../data/caseStudies';
import Callout from './Callout';

const meta = {
  title: 'UI/Callout',
  component: Callout,
  decorators: [(Story) => <div style={{ maxWidth: 560 }}>{Story()}</div>],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Without a link: Bexa's "Feature this" note in Solution. */
export const WithoutLink: Story = {
  args: {
    label: caseStudies.bexa.solution.feature?.label ?? 'Feature this',
    children: caseStudies.bexa.solution.feature?.text,
  },
};

/** With a link: Sage's TL;DR, whose link opens the image collage. */
export const WithLink: Story = {
  args: {
    label: 'TL;DR',
    children: caseStudies.sage.tldr,
    link: { label: 'Show me the images →', onClick: fn() },
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show me the images →' }));
    await expect(args.link?.onClick).toHaveBeenCalled();
  },
};
