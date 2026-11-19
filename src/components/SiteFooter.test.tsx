import { afterEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import SiteFooter from './SiteFooter';
import { renderWithRouter } from '../test/renderWithRouter';
import { setMotionPaused } from '../lib/motion';

describe('SiteFooter', () => {
  afterEach(() => setMotionPaused(false));

  it.each(['home', 'case'] as const)('holds the Pause motion control (%s)', (variant) => {
    renderWithRouter(<SiteFooter variant={variant} />);
    expect(screen.getByRole('contentinfo')).toContainElement(
      screen.getByRole('button', { name: 'Pause motion' }),
    );
  });
});
