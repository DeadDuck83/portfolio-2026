import type { Persona } from '../../data/caseStudies/types';
import { colors, fonts, weights } from '../../theme/tokens';
import Label from '../../ui/Label';

/**
 * One user in a case study's Users chapter: a Label, the user's name in the display
 * face, an italic subtitle, and their needs, each after an em dash. Use two side by
 * side inside a CellGrid (`min="300px"`), which draws the lines between them; the
 * card draws none of its own. Data: a `Persona` (`label`, `name`, `subtitle`, three
 * `needs`), from `caseStudy.users.personas`.
 *
 * @import import PersonaCard from '../components/casestudy/PersonaCard';
 */
export default function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <div style={{ background: colors.bg, padding: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
      <Label>{persona.label}</Label>
      <div style={{ fontFamily: fonts.display, fontWeight: weights.display, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginTop: '0.9rem' }}>
        {persona.name}
      </div>
      <div
        style={{
          fontFamily: fonts.text,
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
