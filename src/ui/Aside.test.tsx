import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Aside from './Aside';

describe('Aside', () => {
  it('is a div frame around its content, keeping extra classes', () => {
    render(
      <Aside className="extra">
        <p>Bring in the front desk earlier.</p>
      </Aside>,
    );
    const frame = screen.getByText('Bring in the front desk earlier.').parentElement!;
    expect(frame.tagName).toBe('DIV');
    expect(frame).toHaveClass('ui-aside', 'extra');
  });
});
