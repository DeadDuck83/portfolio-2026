import type { HTMLAttributes } from 'react';
import './Eyebrow.css';

/**
 * The small uppercase label that introduces a section or headline: a case study's
 * chapter names, and the "Case study 04" line above its title. Not for nav links,
 * field labels (Role, Org, Timeline) or stat labels; those are other roles. Styles
 * are in Eyebrow.css. Import Eyebrow (a default export) from src/ui/Eyebrow with a
 * relative path; the project has no `src/` alias.
 *
 * @import import Eyebrow from 'src/ui/Eyebrow';
 */
export default function Eyebrow({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={className ? `ui-eyebrow ${className}` : 'ui-eyebrow'} />;
}
