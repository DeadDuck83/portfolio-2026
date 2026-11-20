import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Callout from './Callout';

describe('Callout', () => {
  it('shows its label and text, with no link by default', () => {
    render(<Callout label="Feature this">It all traces to one finding.</Callout>);
    expect(screen.getByText('Feature this')).toHaveClass('ui-label', 'ui-callout__label');
    expect(screen.getByText('It all traces to one finding.')).toHaveClass('ui-callout__text');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('adds a link that calls back when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Callout label="TL;DR" link={{ label: 'Show me the images →', onClick }}>
        Scan old lab results.
      </Callout>,
    );
    const link = screen.getByRole('button', { name: 'Show me the images →' });
    expect(link).toHaveAttribute('type', 'button');
    await user.click(link);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('passes className and style through to the box', () => {
    const { container } = render(
      <Callout label="TL;DR" className="extra" style={{ marginTop: '2rem' }}>
        Text
      </Callout>,
    );
    const box = container.firstElementChild as HTMLElement;
    expect(box).toHaveClass('ui-callout', 'extra');
    expect(box.style.marginTop).toBe('2rem');
  });
});
