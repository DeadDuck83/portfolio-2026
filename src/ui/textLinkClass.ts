import './TextLink.css';

/**
 * TextLink's class names, for elements that render their own tag (React Router's
 * Link, EmailLink, MotionToggle). `extra` classes are added after them.
 */
export function textLinkClass(extra?: string): string {
  return extra ? `ui-text-link ${extra}` : 'ui-text-link';
}
