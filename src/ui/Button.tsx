import type { ComponentProps } from 'react';
import { buttonClass, type ButtonStyleProps } from './buttonClass';

type LinkButtonProps = ButtonStyleProps & ComponentProps<'a'> & { href: string };
type NativeButtonProps = ButtonStyleProps & ComponentProps<'button'> & { href?: never };
export type ButtonProps = LinkButtonProps | NativeButtonProps;

/**
 * The site's button: an <a> when given `href`, otherwise a <button type="button">.
 * Styles are in Button.css. For EmailLink or React Router's Link, use
 * `buttonClass()` instead.
 */
export default function Button({ variant, size, className, ...props }: ButtonProps) {
  const cls = buttonClass({ variant, size }, className);
  if (props.href !== undefined) {
    return <a {...(props as ComponentProps<'a'>)} className={cls} />;
  }
  return <button type="button" {...(props as ComponentProps<'button'>)} className={cls} />;
}
