import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';
import { buttonClass } from './buttonClass';
import EmailLink from '../components/EmailLink';

describe('Button', () => {
  it('renders a link when given href', () => {
    render(
      <Button variant="solid" href="#contact">
        Get in touch
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Get in touch' });
    expect(link).toHaveAttribute('href', '#contact');
    expect(link).toHaveClass('ui-button', 'ui-button--solid');
  });

  it('renders a type="button" button otherwise, and passes the ref through', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>View my skills</Button>);
    const button = screen.getByRole('button', { name: 'View my skills' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('ui-button', 'ui-button--outline');
    expect(ref.current).toBe(button);
  });

  it('keeps extra classes alongside its own', () => {
    render(
      <Button size="compact" className="about-rail__btn">
        Contact
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('ui-button--compact', 'about-rail__btn');
  });
});

describe('buttonClass', () => {
  it('defaults to an outline button at the default size', () => {
    expect(buttonClass()).toBe('ui-button ui-button--outline');
  });

  it('adds compact and extra classes', () => {
    expect(buttonClass({ variant: 'outline', size: 'compact' }, 'cs-head__cta')).toBe(
      'ui-button ui-button--outline ui-button--compact cs-head__cta',
    );
  });

  it('lets EmailLink take the button styling when plain is off', () => {
    render(
      <EmailLink source="contact" plain={false} className={buttonClass({ variant: 'solid' })}>
        Email
      </EmailLink>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-button--solid');
    // the plain-text reset would override the class's border, background and colour
    expect(button.style.border).toBe('');
    expect(button.style.background).toBe('');
    expect(button.style.color).toBe('');
  });
});
