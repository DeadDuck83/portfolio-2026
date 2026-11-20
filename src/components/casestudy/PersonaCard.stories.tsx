import type { Meta, StoryObj } from '@storybook/react-vite';
import { caseStudies } from '../../data/caseStudies';
import { inColumn } from '../../../.storybook/caseStudyFrames';
import PersonaCard from './PersonaCard';
import CellGrid from '../../ui/CellGrid';

const { plmc } = caseStudies;

const meta = {
  title: 'Case study/PersonaCard',
  component: PersonaCard,
  subcomponents: { CellGrid },
  decorators: [inColumn],
} satisfies Meta<typeof PersonaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * PLMC's two users side by side, as the Users chapter lays them out: a CellGrid
 * (cells at least 300px wide) draws the lines between and around the cards.
 */
export const TwoUsers: Story = {
  args: { persona: plmc.users!.personas[0] },
  render: (args) => (
    <CellGrid min="300px">
      <PersonaCard {...args} />
      <PersonaCard persona={plmc.users!.personas[1]} />
    </CellGrid>
  ),
};
