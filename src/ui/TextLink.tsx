import type { ComponentProps } from 'react';
import { textLinkClass } from './textLinkClass';

export type TextLinkProps = ComponentProps<'a'> & { href: string };

/**
 * A small uppercase text link: muted, turning accent bright on hover. Use it for the
 * quiet links in the site footer (About, Work, Contact, All work, Pause motion) and
 * the "← Gallery" link above a gallery piece. Not for the header nav, and not for
 * actions that need weight; those use Button.
 *
 * Renders an `<a>`. Styles are in TextLink.css. For React Router's Link, EmailLink or
 * MotionToggle, which render their own element, use `textLinkClass()` from
 * src/ui/textLinkClass.ts instead (EmailLink also needs `plain={false}`). Import
 * TextLink (a default export) from src/ui/TextLink with a relative path; the project
 * has no `src/` alias.
 *
 * @import import TextLink from '../ui/TextLink';
 */
export default function TextLink({ className, ...props }: TextLinkProps) {
  return <a {...props} className={textLinkClass(className)} />;
}
