import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { caseStudies } from '../../data/caseStudies';
import FlowStrip from './FlowStrip';

const { plmc, sage } = caseStudies;

const meta = {
  title: 'Case study/FlowStrip',
  component: FlowStrip,
  // it runs the full width of the page, off its right edge
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FlowStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The Screens variant: bare phone screens rising from a line, on the product's
 * colour. Sage's five flows; no flow has a `frame`.
 */
export const Screens: Story = {
  args: { flows: sage.flows ?? [], brand: sage.brand },
};

/**
 * The Devices variant: each flow's whole device picture floating on the band, with
 * a soft glow in the product's colours. PLMC's TV and two iPads; every flow has a
 * `frame`, and `brand.highlight` lights the floor under them.
 */
export const Devices: Story = {
  args: { flows: plmc.flows ?? [], brand: plmc.brand },
};

/**
 * After clicking a card: the flow viewer, with every screen in that flow. ← → (or the
 * arrow keys) move between flows; Close, Escape or the backdrop closes it and puts
 * focus back on the card. PLMC's exam room. Focus starts on Close, which shows its
 * focus ring here, as when the viewer is opened from the keyboard.
 */
export const ViewerOpen: Story = {
  args: { flows: plmc.flows ?? [], brand: plmc.brand },
  // the viewer covers the whole window, so on the docs page it gets its own frame
  parameters: { docs: { story: { inline: false, height: '640px' } } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /^The exam room: open all 9 screens/ }));
    // the viewer opens in a portal on <body>, outside the story's root
    const page = within(canvasElement.ownerDocument.body);
    // it fades in
    await waitFor(() => expect(page.getByRole('dialog', { name: 'The exam room.' })).toBeVisible());
    await waitFor(() => expect(page.getByRole('button', { name: 'Close' })).toHaveFocus());
  },
};
