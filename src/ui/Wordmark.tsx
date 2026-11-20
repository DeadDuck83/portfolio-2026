import './Wordmark.css';

export type WordmarkProps = {
  /**
   * The size: the wordmark is `size × 1.1rem` and the dot scales with it. The site
   * uses 1.6 (home header), 1.5 (case-study header), 1.35 (Gallery) and 1.3 (footer).
   */
  size?: number;
};

/**
 * "Derek Moore" with the olive dot, in the display face: the site's name in the
 * home and case-study headers, the Gallery header and the footer. Put it inside a
 * link where it should go home; it doesn't link by itself. Styles are in
 * Wordmark.css; only the font size is set on the element, so a page can still
 * override it (the case-study header does on narrow phones). Import Wordmark (a
 * default export) from src/ui/Wordmark with a relative path; the project has no
 * `src/` alias.
 *
 * @import import Wordmark from '../ui/Wordmark';
 */
export default function Wordmark({ size = 1.6 }: WordmarkProps) {
  return (
    <span className="ui-wordmark" style={{ fontSize: `${(size * 1.1).toFixed(3)}rem` }}>
      Derek Moore
      <span className="ui-wordmark__dot" aria-hidden="true" />
    </span>
  );
}
