import type { HTMLAttributes, ReactNode } from 'react';
import Label from './Label';
import './Callout.css';

export type CalloutProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** The short label beside the text, shown as a green Label ("TL;DR", "Feature this"). */
  label: ReactNode;
  /** The note itself, one or two sentences. */
  children: ReactNode;
  /**
   * An optional link under the text, drawn as an italic accent link. It's a button,
   * for something that happens on the page (the TL;DR opens the image collage).
   */
  link?: { label: ReactNode; onClick: () => void };
};

/**
 * A short note in a dashed box, set off from the text around it: the TL;DR under a
 * case study's intro (with its "Show me the images →" link) and the "Feature this"
 * note in Solution. Use it for one or two sentences that sum something up, not for
 * longer asides (Aside) or headings. Styles are in Callout.css. Import Callout (a
 * default export) from src/ui/Callout with a relative path; the project has no
 * `src/` alias.
 *
 * @import import Callout from '../ui/Callout';
 */
export default function Callout({ label, children, link, className, ...props }: CalloutProps) {
  return (
    <div {...props} className={className ? `ui-callout ${className}` : 'ui-callout'}>
      <Label as="span" className="ui-callout__label">
        {label}
      </Label>
      <div className="ui-callout__body">
        <p className="ui-callout__text">{children}</p>
        {link && (
          <button type="button" className="ui-callout__link" onClick={link.onClick}>
            {link.label}
          </button>
        )}
      </div>
    </div>
  );
}
