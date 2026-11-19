import './Button.css';

export type ButtonVariant = 'solid' | 'outline';
export type ButtonSize = 'default' | 'compact';

export interface ButtonStyleProps {
  /** `solid` for the main action (olive fill), `outline` for the rest. */
  variant?: ButtonVariant;
  /** `compact` is the smaller, accent-outlined Contact button in the headers. */
  size?: ButtonSize;
}

/**
 * The Button's class names, for elements that render their own tag
 * (EmailLink, React Router's Link). `extra` classes are added after them.
 */
export function buttonClass(
  { variant = 'outline', size = 'default' }: ButtonStyleProps = {},
  extra?: string,
): string {
  return ['ui-button', `ui-button--${variant}`, size === 'compact' && 'ui-button--compact', extra]
    .filter(Boolean)
    .join(' ');
}
