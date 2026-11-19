import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Chip from './Chip';

describe('Chip', () => {
  it('renders a span by default', () => {
    render(<Chip>Design systems</Chip>);
    const chip = screen.getByText('Design systems');
    expect(chip.tagName).toBe('SPAN');
    expect(chip).toHaveClass('ui-chip');
  });

  it('renders list items for a list of chips, keeping extra classes', () => {
    render(
      <ul aria-label="Skills">
        <Chip as="li" className="extra">
          Research
        </Chip>
      </ul>,
    );
    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('Research');
    expect(item).toHaveClass('ui-chip', 'extra');
  });
});
