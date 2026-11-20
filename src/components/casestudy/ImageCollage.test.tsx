import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCollage from './ImageCollage';
import { plmc } from '../../data/caseStudies/plmc';
import { collectCaseStudyImages } from '../../data/caseStudies/figures';

const figures = collectCaseStudyImages(plmc);
const first = figures[0];

function renderCollage() {
  const onClose = vi.fn();
  render(
    <>
      {/* something focusable on the page behind, as the case study has */}
      <button type="button">On the page</button>
      <ImageCollage title={plmc.eyebrowRight} figures={figures} onClose={onClose} />
    </>,
  );
  return onClose;
}

describe('ImageCollage', () => {
  it('starts focus on Close', () => {
    renderCollage();
    expect(screen.getByRole('button', { name: 'Close image collage' })).toHaveFocus();
  });

  it("moves focus into the full-size view, and doesn't let it leave", async () => {
    const user = userEvent.setup();
    renderCollage();
    await user.click(screen.getByRole('button', { name: `View larger: ${first.alt}` }));

    const close = screen.getByRole('button', { name: 'Close full-size media' });
    expect(close).toHaveFocus();
    // an image's view has one control: Tab and Shift+Tab stay on it
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(close).toHaveFocus();
  });

  it('Escape closes the full-size view first, and focus goes back to the image', async () => {
    const user = userEvent.setup();
    const onClose = renderCollage();
    const image = screen.getByRole('button', { name: `View larger: ${first.alt}` });
    await user.click(image);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('button', { name: 'Close full-size media' })).toBeNull();
    expect(image).toHaveFocus();
    expect(onClose).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Close in the full-size view goes back to the image too', async () => {
    const user = userEvent.setup();
    renderCollage();
    const image = screen.getByRole('button', { name: `View larger: ${first.alt}` });
    await user.click(image);
    await user.click(screen.getByRole('button', { name: 'Close full-size media' }));
    expect(image).toHaveFocus();
  });
});
