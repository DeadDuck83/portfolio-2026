import type { HTMLAttributes } from 'react';
import './Aside.css';

/**
 * A block set off by a thin accent rule on its left: each lesson under "What I
 * learned" (a title and a sentence), and PLMC's "If I did it again" (a Label and a
 * sentence). It's only the frame; put the content inside. Use it for a reflection
 * that sits beside the main text, not for a short summary in a box (Callout). It
 * renders a `div`, not an `<aside>` element, so a case study doesn't gain a landmark
 * per lesson. Styles are in Aside.css. Import Aside (a default export) from
 * src/ui/Aside with a relative path; the project has no `src/` alias.
 *
 * @import import Aside from '../ui/Aside';
 */
export default function Aside({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={className ? `ui-aside ${className}` : 'ui-aside'} />;
}
