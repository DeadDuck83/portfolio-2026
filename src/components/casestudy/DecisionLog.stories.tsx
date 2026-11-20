import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { caseStudies } from '../../data/caseStudies';
import { inColumn } from '../../../.storybook/caseStudyFrames';
import DecisionLog from './DecisionLog';

const { plmc } = caseStudies;

const meta = {
  title: 'Case study/DecisionLog',
  component: DecisionLog,
  decorators: [inColumn],
  // the Process chapter's alternate background
  globals: { backgrounds: { value: 'section' } },
  args: {
    decisions: plmc.process.decisions,
    choiceLabel: plmc.process.decisionChoiceLabel,
    costLabel: plmc.process.decisionCostLabel,
  },
} satisfies Meta<typeof DecisionLog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * PLMC's three calls as the page first shows them: the first row open. PLMC names
 * the second column "The payoff" (`costLabel`); the first keeps "The call".
 */
export const FirstRowOpen: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText(plmc.process.decisions[0].choice)).toBeVisible();
    await expect(canvas.getByText(plmc.process.decisions[0].cost)).toBeVisible();
    await expect(canvas.getByText(plmc.process.decisions[1].choice)).not.toBeVisible();
    // each row says whether it's open
    await expect(canvas.getByRole('button', { name: /Five functions/ })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('button', { name: /Let them watch/ })).toHaveAttribute('aria-expanded', 'false');
  },
};

/** The first row with keyboard focus: the site's focus ring, as on Button and TextLink. */
export const KeyboardFocus: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /Five functions/ })).toHaveFocus();
  },
};

/** After clicking the second row: it opens, and the first one closes. */
export const SecondRowOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    const row = canvas.getByRole('button', { name: /Let them watch it arrive/ });
    await userEvent.click(row);
    await waitFor(() => expect(canvas.getByText(plmc.process.decisions[1].choice)).toBeVisible());
    await waitFor(() => expect(canvas.getByText(plmc.process.decisions[0].choice)).not.toBeVisible());
    // at rest, as a mouse click leaves it: the pointer moves off (the row's hover is
    // JavaScript) and there's no focus ring (a test click would leave one)
    await userEvent.unhover(row);
    row.blur();
  },
};

/** After clicking the open row again: every row is closed. */
export const AllClosed: Story = {
  play: async ({ canvas, userEvent }) => {
    const row = canvas.getByRole('button', { name: /Five functions, not fifty tests/ });
    await userEvent.click(row);
    await waitFor(() => expect(canvas.getByText(plmc.process.decisions[0].choice)).not.toBeVisible());
    await userEvent.unhover(row);
    row.blur();
  },
};
