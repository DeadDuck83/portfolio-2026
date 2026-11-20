import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Wordmark from './Wordmark';

describe('Wordmark', () => {
  it('shows the name, with the dot hidden from screen readers', () => {
    const { container } = render(<Wordmark />);
    const mark = screen.getByText('Derek Moore');
    expect(mark).toHaveClass('ui-wordmark');
    const dot = container.querySelector('.ui-wordmark__dot');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets its font size from size × 1.1rem, 1.6 by default', () => {
    const { rerender } = render(<Wordmark />);
    expect(screen.getByText('Derek Moore').style.fontSize).toBe('1.76rem');
    rerender(<Wordmark size={1.3} />);
    expect(screen.getByText('Derek Moore').style.fontSize).toBe('1.43rem');
  });
});
