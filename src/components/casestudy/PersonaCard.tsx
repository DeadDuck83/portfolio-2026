import type { Persona } from '../../data/caseStudies/types';
import { colors, fonts } from '../../theme/tokens';

/**
 * A persona cell in the 02 Users grid: label, serif name, italic subtitle, and
 * three em-dash needs. Rendered inside a 1px-gap grid that draws its own lines.
 */
export default function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <div style={{ background: colors.bg, padding: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
      <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.accentBright }}>
        {persona.label}
      </div>
      <div style={{ fontFamily: fonts.display, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginTop: '0.9rem' }}>
        {persona.name}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontStyle: 'italic',
          fontSize: '1rem',
          color: colors.textFaint,
          marginTop: '0.3rem',
        }}
      >
        {persona.subtitle}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem' }}>
        {persona.needs.map((need) => (
          <div
            key={need}
            style={{ display: 'flex', gap: '0.8rem', fontSize: '0.8rem', lineHeight: 1.6, color: colors.textBody }}
          >
            <span style={{ color: colors.accent }}>—</span>
            <span>{need}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
