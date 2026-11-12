import { fonts, colors, weights } from '../theme/tokens';

/**
 * "Derek Moore" wordmark + olive dot, in the display face. Shared across
 * headers and footers; `size` sets the font-size and the dot scales with it.
 */
export default function Wordmark({ size = 1.6 }: { size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: fonts.display,
        fontWeight: weights.display,
        fontSize: `${(size * 1.1).toFixed(3)}rem`,
        letterSpacing: '-0.005em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      Derek Moore
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '0.15em',
          height: '0.15em',
          marginLeft: '0.05em',
          borderRadius: '50%',
          background: colors.accentBright,
        }}
      />
    </span>
  );
}
