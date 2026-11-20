import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router';
import { caseStudies } from '../../data/caseStudies';
import NextCaseFooter from './NextCaseFooter';

const meta = {
  title: 'Case study/NextCaseFooter',
  component: NextCaseFooter,
  // the linked footer is a React Router <Link>
  decorators: [(Story) => <MemoryRouter initialEntries={['/work/plmc']}>{Story()}</MemoryRouter>],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NextCaseFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Linked: PLMC's footer, pointing to Sage Healthspan. Hovering tints the whole row. */
export const Linked: Story = {
  args: { nextCase: caseStudies.plmc.nextCase },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link')).toHaveAttribute('href', '/work/sage');
  },
};

/**
 * "Brewing.": no `to`, so it isn't a link, for when the next case study isn't
 * published yet. PLMC's footer as it first shipped, before Parker & Ace's case study
 * existed (commit 2b9c515).
 */
export const Brewing: Story = {
  args: { nextCase: { label: 'Parker & Ace', note: '— the vet one. Brewing.' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('link')).toBeNull();
    await expect(canvas.getByText(/Brewing\./)).toBeVisible();
  },
};
