import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import Button from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline'] },
    size: { control: 'inline-radio', options: ['default', 'compact'] },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The main action in a section. One per section, like the hero's "Get in touch". */
export const Solid: Story = {
  args: { variant: 'solid', children: 'Get in touch' },
};

/** Every other action beside the main one, like the hero's "About me". */
export const Outline: Story = {
  args: { variant: 'outline', children: 'About me' },
};

/** The smaller, accent-outlined Contact button in the site and case-study headers. */
export const Compact: Story = {
  args: { variant: 'outline', size: 'compact', children: 'Contact' },
};

/**
 * Reached with the keyboard: Tab shows the focus ring (accent bright, 2px, 3px out)
 * and Enter activates it.
 */
export const KeyboardFocus: Story = {
  args: { variant: 'solid', children: 'Get in touch' },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Get in touch' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalled();
  },
};
