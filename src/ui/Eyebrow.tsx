import type { HTMLAttributes } from 'react';
import './Eyebrow.css';

/**
 * The small uppercase label that introduces a section or headline: a case
 * study's chapter names, and the "Case study 04" line. Styles are in Eyebrow.css.
 */
export default function Eyebrow({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={className ? `ui-eyebrow ${className}` : 'ui-eyebrow'} />;
}
