import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { CONTACT_EMAIL } from '../data/site';

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

/**
 * Copies the contact email on click. Label stays selectable so visitors can
 * also highlight and copy manually — avoids inconsistent mailto handlers.
 */
export default function EmailLink({
  children,
  onClick,
  style,
  ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      {...rest}
      style={{
        font: 'inherit',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        color: 'inherit',
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
        void copyEmail().then(() => {
          setCopied(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      {copied ? 'Copied!' : children}
    </button>
  );
}
