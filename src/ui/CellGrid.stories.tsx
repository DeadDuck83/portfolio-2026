import type { Meta, StoryObj } from '@storybook/react-vite';
import { caseStudies } from '../data/caseStudies';
import CellGrid from './CellGrid';
import Label from '../ui/Label';

const meta = {
  title: 'UI/CellGrid',
  component: CellGrid,
  subcomponents: { Label },
  argTypes: { line: { control: 'inline-radio', options: ['default', 'faint'] } },
} satisfies Meta<typeof CellGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The row under a case study's hero (PLMC): each cell is at least 170px wide before the row wraps. */
export const MetaRow: Story = {
  args: {
    min: '170px',
    children: (['role', 'org', 'timeline', 'scope'] as const).map((field) => (
      <div key={field} style={{ background: 'var(--color-bg)', padding: '1.2rem' }}>
        <Label tone="muted">{field}</Label>
        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{caseStudies.plmc.meta[field]}</div>
      </div>
    )),
  },
};

/** Fainter lines, as StatBand draws them on the alternate background (Bexa's numbers). */
export const FaintLines: Story = {
  args: {
    min: '200px',
    line: 'faint',
    children: (caseStudies.bexa.outcome.stats ?? []).map((s) => (
      <div key={s.label} style={{ background: 'var(--color-bg-alt)', padding: '1.6rem 1.4rem' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.4rem', color: 'var(--color-accent-bright)' }}>
          {s.kind === 'static' ? s.display : `${s.to}${s.suffix ?? ''}`}
        </div>
        <div style={{ fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          {s.label}
        </div>
      </div>
    )),
  },
};
