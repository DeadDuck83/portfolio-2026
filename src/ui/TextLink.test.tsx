import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextLink from './TextLink';
import { textLinkClass } from './textLinkClass';
import EmailLink from './EmailLink';
import MotionToggle from '../components/MotionToggle';

describe('TextLink', () => {
  it('renders a link with its class', () => {
    render(<TextLink href="#about">About</TextLink>);
    const link = screen.getByRole('link', { name: 'About' });
    expect(link).toHaveAttribute('href', '#about');
    expect(link).toHaveClass('ui-text-link');
  });

  it('keeps extra classes and passes the ref through', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <TextLink ref={ref} href="#work" className="extra">
        Work
      </TextLink>,
    );
    const link = screen.getByRole('link', { name: 'Work' });
    expect(link).toHaveClass('ui-text-link', 'extra');
    expect(ref.current).toBe(link);
  });
});

describe('textLinkClass', () => {
  it('gives the class, with any extra classes after it', () => {
    expect(textLinkClass()).toBe('ui-text-link');
    expect(textLinkClass('extra')).toBe('ui-text-link extra');
  });

  it('lets EmailLink take the link styling when plain is off', () => {
    render(
      <EmailLink source="footer" plain={false} className={textLinkClass()}>
        Contact
      </EmailLink>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-text-link');
    // the plain-text reset would override the class's colour
    expect(button.style.color).toBe('');
  });

  it('works on MotionToggle beside its own class', () => {
    render(<MotionToggle source="footer" className={textLinkClass()} />);
    expect(screen.getByRole('button', { name: /motion/i })).toHaveClass('motion-toggle', 'ui-text-link');
  });
});
