import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Eyebrow from './Eyebrow';

describe('Eyebrow', () => {
  it('renders the label in a span with its class', () => {
    render(<Eyebrow>Case study 04</Eyebrow>);
    const label = screen.getByText('Case study 04');
    expect(label.tagName).toBe('SPAN');
    expect(label).toHaveClass('ui-eyebrow');
  });

  it('keeps extra classes and props', () => {
    render(
      <Eyebrow className="extra" id="lead">
        Context
      </Eyebrow>,
    );
    const label = screen.getByText('Context');
    expect(label).toHaveClass('ui-eyebrow', 'extra');
    expect(label).toHaveAttribute('id', 'lead');
  });
});
