import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { getMailtoHref } from '../lib/attribution';

/**
 * Mailto CTA with the personalized subject/body from first-touch attribution.
 * Uses a normal mailto anchor so the OS default mail app handles it — do not
 * assign window.location to mailto (Chrome often intercepts that as a tab open).
 */
export default function EmailLink({
  children,
  ...rest
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { children: ReactNode }) {
  return (
    <a href={getMailtoHref()} {...rest}>
      {children}
    </a>
  );
}
