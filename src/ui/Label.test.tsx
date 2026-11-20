import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Label from './Label';

describe('Label', () => {
  it('is a green div by default', () => {
    render(<Label>What I learned</Label>);
    const label = screen.getByText('What I learned');
    expect(label.tagName).toBe('DIV');
    expect(label).toHaveClass('ui-label');
    expect(label).not.toHaveClass('ui-label--muted');
  });

  it('takes the muted grey tone, a span, and extra classes and styles', () => {
    render(
      <Label tone="muted" as="span" className="extra" style={{ marginBottom: '0.6rem' }}>
        Role
      </Label>,
    );
    const label = screen.getByText('Role');
    expect(label.tagName).toBe('SPAN');
    expect(label).toHaveClass('ui-label', 'ui-label--muted', 'extra');
    expect(label.style.marginBottom).toBe('0.6rem');
  });
});
