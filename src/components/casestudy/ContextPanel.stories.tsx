import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { caseStudies } from '../../data/caseStudies';
import { inColumn, inHalfColumn } from '../../../.storybook/caseStudyFrames';
import ContextPanel from './ContextPanel';

const { plmc } = caseStudies;

const meta = {
  title: 'Case study/ContextPanel',
  component: ContextPanel,
  // the right half of the Context chapter's two-column grid, on its alternate background
  decorators: [inHalfColumn('clamp(2rem, 5vw, 4rem)'), inColumn],
  globals: { backgrounds: { value: 'section' } },
  args: {
    panelLabel: plmc.context.panelLabel,
    chips: plmc.context.chips,
    captionBefore: plmc.context.captionBefore,
    captionAfter: plmc.context.captionAfter,
  },
} satisfies Meta<typeof ContextPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** PLMC's seven data sources, scattered: how the panel first shows. */
export const Scattered: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Tidy it up →' })).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByText(plmc.context.captionBefore)).toBeVisible();
  },
};

/** After "Tidy it up →": the tags line up and turn accent, and the caption and button swap. */
export const Tidied: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Tidy it up →' }));
    const toggle = canvas.getByRole('button', { name: '← Scatter it again' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(canvas.getByText(plmc.context.captionAfter)).toBeVisible());
    // at rest, as a mouse click leaves it: no focus ring (a test click would leave one)
    toggle.blur();
  },
};
