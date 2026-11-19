import './Button.css';

// The allowed values are written out here (not as aliases) so Storybook's docs
// and its MCP server show them to whoever reads the component.
export interface ButtonStyleProps {
  /** `solid` for the main action (olive fill), `outline` for the rest. */
  variant?: 'solid' | 'outline';
  /** `compact` is the smaller, accent-outlined Contact button in the headers. */
  size?: 'default' | 'compact';
}

export type ButtonVariant = NonNullable<ButtonStyleProps['variant']>;
export type ButtonSize = NonNullable<ButtonStyleProps['size']>;

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
