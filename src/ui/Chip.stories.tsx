import type { Meta, StoryObj } from '@storybook/react-vite';
import { aboutChapters } from '../data/aboutJourney';
import Chip from './Chip';

const meta = {
  title: 'UI/Chip',
  component: Chip,
  argTypes: {
    as: { control: 'inline-radio', options: ['span', 'li'] },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One tag on its own. */
export const Default: Story = {
  args: { children: aboutChapters[0].tags[0] },
};

/** A chapter's skills, as the About rail lists them: list items in a wrapping row. */
export const SkillList: Story = {
  args: { as: 'li' },
  render: (args) => (
    <ul
      aria-label="Skills"
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: 0, padding: 0, listStyle: 'none' }}
    >
      {aboutChapters[0].tags.map((tag) => (
        <Chip key={tag} {...args}>
          {tag}
        </Chip>
      ))}
    </ul>
  ),
};
