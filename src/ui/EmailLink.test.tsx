import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailLink from './EmailLink';
import { buttonClass } from './buttonClass';
import { CONTACT_EMAIL } from '../data/site';

describe('EmailLink', () => {
  // userEvent.setup() gives each test its own empty clipboard, read back below.
  it('is a type="button" button that says what it copies', () => {
    render(<EmailLink source="hero">Copy email</EmailLink>);
    const button = screen.getByRole('button', { name: `Copy ${CONTACT_EMAIL}` });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('Copy email');
  });

  it('draws as plain text by default, and leaves styling to a class when plain is off', () => {
    const { rerender } = render(<EmailLink source="hero">Copy email</EmailLink>);
    expect(screen.getByRole('button').style.background).not.toBe('');
    rerender(
      <EmailLink source="contact" plain={false} className={buttonClass({ variant: 'solid' })}>
        Email
      </EmailLink>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-button--solid');
    expect(button.style.background).toBe('');
    expect(button.style.color).toBe('');
  });

  it('copies the email and says so, then goes back', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmailLink source="footer" onClick={onClick}>
        Contact
      </EmailLink>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
    expect(await screen.findByRole('button', { name: 'Email copied' })).toBeInTheDocument();
    expect(await navigator.clipboard.readText()).toBe(CONTACT_EMAIL);
    expect(await screen.findByRole('button', { name: `Copy ${CONTACT_EMAIL}` }, { timeout: 2500 })).toBeInTheDocument();
  });

  it("doesn't copy when its onClick prevents the default", async () => {
    const user = userEvent.setup();
    render(
      <EmailLink source="footer" onClick={(e) => e.preventDefault()}>
        Contact
      </EmailLink>,
    );
    await user.click(screen.getByRole('button'));
    expect(await navigator.clipboard.readText()).toBe('');
    expect(screen.getByRole('button', { name: `Copy ${CONTACT_EMAIL}` })).toBeInTheDocument();
  });
});
