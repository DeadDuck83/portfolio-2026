import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import EmailLink from './EmailLink';
import { buttonClass } from '../ui/buttonClass';
import { textLinkClass } from '../ui/textLinkClass';

const meta = {
  title: 'UI/EmailLink',
  component: EmailLink,
  argTypes: {
    source: { control: 'inline-radio', options: ['hero', 'contact', 'footer', 'case-header'] },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof EmailLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Plain, in the surrounding font and colour: the hero's "Copy email". */
export const Plain: Story = {
  args: { source: 'hero', children: 'Copy email' },
};

/** Styled as a Button with `plain={false}` and `buttonClass()`: the case-study header's Contact. */
export const AsButton: Story = {
  args: {
    source: 'case-header',
    plain: false,
    className: buttonClass({ variant: 'outline', size: 'compact' }),
    children: 'Contact',
  },
};

/** Styled as a TextLink with `plain={false}` and `textLinkClass()`: the case footer's Contact. */
export const AsTextLink: Story = {
  args: { source: 'footer', plain: false, className: textLinkClass(), children: 'Contact' },
};

/**
 * After a click: the email is copied and "Copied!" shows in the same space for 1.6s,
 * so the button keeps its size.
 */
export const Copied: Story = {
  args: { source: 'case-header', plain: false, className: buttonClass({ variant: 'outline', size: 'compact' }), children: 'Contact' },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    // measure in the site's font, not the fallback it shows while the font loads
    await canvasElement.ownerDocument.fonts.ready;
    const button = canvas.getByRole('button');
    const width = button.getBoundingClientRect().width;
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
    await waitFor(() => expect(button).toHaveAccessibleName('Email copied'));
    await expect(canvas.getByText('Copied!')).toBeVisible();
    await expect(button.getBoundingClientRect().width).toBe(width);
  },
};
