import type { Meta, StoryObj } from '@storybook/react-vite';
import Label from './Label';

const meta = {
  title: 'UI/Label',
  component: Label,
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'muted'] },
    as: { control: 'inline-radio', options: ['div', 'span'] },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Green: a label that leads into something, like the lessons at the end of a case study. */
export const Accent: Story = {
  args: { children: 'What I learned' },
};

/** Grey: a field or panel name, like Role under a case study's hero. */
export const Muted: Story = {
  args: { tone: 'muted', children: 'Role' },
};
