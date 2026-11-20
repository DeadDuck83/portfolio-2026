import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import { caseStudies } from '../../data/caseStudies';
import { collectCaseStudyImages } from '../../data/caseStudies/figures';
import ImageCollage from './ImageCollage';

const { plmc } = caseStudies;
const images = collectCaseStudyImages(plmc);

const meta = {
  title: 'Case study/ImageCollage',
  component: ImageCollage,
  parameters: {
    layout: 'fullscreen',
    // it covers the whole window, so on the docs page each story gets its own frame
    docs: { story: { inline: false, height: '640px' } },
  },
  args: { title: plmc.eyebrowRight, figures: images, onClose: fn() },
} satisfies Meta<typeof ImageCollage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * PLMC's collage, as "Show me the images →" opens it: every figure that has an image
 * (the hero, Process, Solution and the gallery), with their captions. Focus starts on
 * Close, so it shows Button's focus ring here, as when the collage is opened from the
 * keyboard (opened with a mouse, it has none). Close, Escape or a click on the
 * backdrop calls `onClose`.
 */
export const Collage: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const close = canvas.getByRole('button', { name: 'Close image collage' });
    await expect(close).toHaveFocus();
    await userEvent.click(close);
    await expect(args.onClose).toHaveBeenCalled();
  },
};

/**
 * After clicking an image: the full-size view, over the collage. Escape or Close goes
 * back to the collage. Known gap (GAPS.md): focus stays on the collage's Close behind
 * it instead of moving to this view's Close.
 */
export const FullSizeView: Story = {
  play: async ({ canvas, userEvent }) => {
    const first = images[0];
    await userEvent.click(canvas.getByRole('button', { name: `View larger: ${first.alt}` }));
    await waitFor(() => expect(canvas.getByRole('dialog', { name: first.alt })).toBeVisible());
    await expect(canvas.getByRole('button', { name: 'Close full-size media' })).toBeVisible();
  },
};
