import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import TextLink from './TextLink';

const meta = {
  title: 'UI/TextLink',
  component: TextLink,
  args: { onClick: fn() },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A footer link to a section of the home page. Hover turns it accent bright. */
export const FooterLink: Story = {
  args: { href: '#about', children: 'About' },
};

/** The home footer's three section links in their row. */
export const FooterRow: Story = {
  args: { href: '#about', children: 'About' },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem 1.6rem' }}>
      <TextLink {...args} />
      <TextLink href="#work">Work</TextLink>
      <TextLink href="#contact">Contact</TextLink>
    </div>
  ),
};

/**
 * Reached with the keyboard: Tab shows the focus ring (accent bright, 2px, 3px out,
 * the same as Button's) and Enter follows the link.
 */
export const KeyboardFocus: Story = {
  args: { href: '#work', children: 'Work' },
  play: async ({ args, canvas, userEvent }) => {
    const link = canvas.getByRole('link', { name: 'Work' });
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalled();
  },
};
