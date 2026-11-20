import type { Meta, StoryObj } from '@storybook/react-vite';
import Wordmark from './Wordmark';

const meta = {
  title: 'UI/Wordmark',
  component: Wordmark,
  argTypes: { size: { control: { type: 'number', step: 0.05 } } },
} satisfies Meta<typeof Wordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The home header's wordmark, at the default size (1.6). */
export const HomeHeader: Story = {
  args: { size: 1.6 },
};

/** The footer's wordmark, the smallest on the site (1.3). */
export const Footer: Story = {
  args: { size: 1.3 },
};

/** Every size the site uses, largest first: home header, case-study header, Gallery, footer. */
export const SizesInUse: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.2rem', justifyItems: 'start' }}>
      <Wordmark size={1.6} />
      <Wordmark size={1.5} />
      <Wordmark size={1.35} />
      <Wordmark size={1.3} />
    </div>
  ),
};
