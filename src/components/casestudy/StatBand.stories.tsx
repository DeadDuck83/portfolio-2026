import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { caseStudies } from '../../data/caseStudies';
import { inColumn } from '../../../.storybook/caseStudyFrames';
import StatBand from './StatBand';

const meta = {
  title: 'Case study/StatBand',
  component: StatBand,
  decorators: [inColumn],
  globals: { backgrounds: { value: 'section' } },
} satisfies Meta<typeof StatBand>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * PLMC's Outcome numbers once they've counted up: "7 → 1" and "5" count from 0 as
 * the band scrolls into view; "0 → 1" is a static stat and shows as written.
 */
export const AfterCountUp: Story = {
  args: { stats: caseStudies.plmc.outcome.stats ?? [] },
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText('7 → 1')).toBeVisible(), { timeout: 3000 });
    await expect(canvas.getByText('5')).toBeVisible();
    await expect(canvas.getByText('0 → 1')).toBeVisible();
  },
};
