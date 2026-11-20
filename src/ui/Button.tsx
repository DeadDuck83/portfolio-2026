import type { ComponentProps } from 'react';
import { buttonClass, type ButtonStyleProps } from './buttonClass';

type LinkButtonProps = ButtonStyleProps & ComponentProps<'a'> & { href: string };
type NativeButtonProps = ButtonStyleProps & ComponentProps<'button'> & { href?: never };
export type ButtonProps = LinkButtonProps | NativeButtonProps;

/**
 * The site's one button, for actions and calls to action. Use `solid` for the one
 * main action in a section (Get in touch, the contact email) and `outline` for the
 * actions beside it (About me, LinkedIn, View my skills). Use the `compact` size only
 * for the Contact button in the site and case-study headers.
 *
 * Renders an `<a>` when given `href`, otherwise a `<button type="button">`. Styles are in
 * Button.css. For EmailLink or React Router's Link, which render their own element,
 * use `buttonClass()` from src/ui/buttonClass.ts instead. Import Button (a default
 * export) from src/ui/Button with a relative path; the project has no `src/` alias.
 *
 * @import import Button from '../ui/Button';
 */
export default function Button({ variant, size, className, ...props }: ButtonProps) {
  const cls = buttonClass({ variant, size }, className);
  if (props.href !== undefined) {
    return <a {...(props as ComponentProps<'a'>)} className={cls} />;
  }
  return <button type="button" {...(props as ComponentProps<'button'>)} className={cls} />;
}
