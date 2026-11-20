import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { CONTACT_EMAIL } from '../data/site';
import { track, type AnalyticsEvents } from '../lib/analytics';

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(CONTACT_EMAIL);
    return;
  } catch {
    // Clipboard API blocked (insecure context / permissions) — legacy fallback.
  }
  const ta = document.createElement('textarea');
  ta.value = CONTACT_EMAIL;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

export type EmailLinkProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  children: ReactNode;
  /** where this copy button sits, for the EmailCopied event */
  source: AnalyticsEvents['EmailCopied']['source'];
  /**
   * Draw it as plain text in the surrounding font and colour (the default).
   * Pass `plain={false}` when a class such as buttonClass() styles it, because
   * these inline styles would override the class.
   */
  plain?: boolean;
};

/**
 * The site's way to give out the contact email: a button that copies it, never a
 * mailto link (mail handlers are inconsistent). The label stays selectable, so a
 * visitor can also highlight and copy it, and "Copied!" shows for 1.6s in the same
 * space, so the button never changes size. Each use reports EmailCopied with its
 * `source`.
 *
 * Plain by default: it takes the surrounding font and colour, as the hero's "Copy
 * email" does. To look like a button or a text link, pass `plain={false}` with
 * `buttonClass()` (the Contact email, the case-study header's Contact) or
 * `textLinkClass()` (the case footer's Contact). Import EmailLink (a default export)
 * from src/ui/EmailLink with a relative path; the project has no `src/` alias.
 *
 * @import import EmailLink from '../ui/EmailLink';
 */
export default function EmailLink({
  children,
  source,
  onClick,
  style,
  plain = true,
  ...rest
}: EmailLinkProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      {...rest}
      style={{
        ...(plain ? { font: 'inherit', border: 'none', background: 'none', color: 'inherit' } : null),
        cursor: 'pointer',
        textAlign: 'inherit',
        userSelect: 'text',
        WebkitUserSelect: 'text',
        ...style,
      }}
      aria-label={copied ? 'Email copied' : `Copy ${CONTACT_EMAIL}`}
      title={copied ? 'Copied!' : `Click to copy ${CONTACT_EMAIL}`}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        track('EmailCopied', { source });
        void copyEmail().then(() => {
          setCopied(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      {/* Stack both labels in one grid cell so the button never resizes on copy. */}
      <span style={{ display: 'inline-grid' }}>
        <span style={{ gridArea: '1 / 1', visibility: copied ? 'hidden' : 'visible' }}>
          {children}
        </span>
        <span
          aria-hidden
          style={{ gridArea: '1 / 1', textAlign: 'center', visibility: copied ? 'visible' : 'hidden' }}
        >
          Copied!
        </span>
      </span>
    </button>
  );
}
