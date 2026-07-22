import { useEffect, useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getCaseStudy } from '../data/caseStudies';
import { border, colors, fonts, layout } from '../theme/tokens';
import { useScrollProgress } from '../hooks/useScrollProgress';
import Grain from '../components/Grain';
import SiteFooter from '../components/SiteFooter';
import PlaceholderFigure from '../components/PlaceholderFigure';
import CaseStudyHeader, { type Chapter } from '../components/casestudy/CaseStudyHeader';
import ChapterHeading from '../components/casestudy/ChapterHeading';
import ContextPanel from '../components/casestudy/ContextPanel';
import PersonaCard from '../components/casestudy/PersonaCard';
import DecisionLog from '../components/casestudy/DecisionLog';
import StatBand from '../components/casestudy/StatBand';
import NextCaseFooter from '../components/casestudy/NextCaseFooter';
import Reveal from '../components/casestudy/Reveal';

// Shared section-level style fragments.
const sectionInner = {
  maxWidth: layout.maxWidth,
  margin: '0 auto',
  padding: `clamp(3.5rem, 9vh, 6.5rem) ${layout.sidePad}`,
};
const scrollMargin = { scrollMarginTop: 130 };
const h2Style = {
  fontFamily: fonts.display,
  fontWeight: 400,
  fontSize: 'clamp(1.8rem, 3.6vw, 2.7rem)',
  lineHeight: 1.15,
  margin: 0,
};
const bodyP = { fontSize: '0.86rem', lineHeight: 1.75, color: colors.textBody };

/**
 * Data-driven case study page. Everything renders from the CaseStudy object
 * looked up by URL slug — new case studies are new data files, not new layouts.
 * Chapter flow: 00 Brief → 01 Context → 02 Users → 03 Process → 04 Solution →
 * 05 Outcome → Next-case footer.
 */
export default function CaseStudy() {
  const { slug } = useParams();
  const cs = getCaseStudy(slug);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { barRef, chapter } = useScrollProgress(rootRef);

  useEffect(() => {
    if (cs) document.title = `${cs.eyebrowRight} — Derek Moore`;
  }, [cs]);

  if (!cs) return <Navigate to="/" replace />;

  const chapters: Chapter[] = [
    { id: 'c0', label: '00 Brief' },
    { id: 'c1', label: `${cs.context.chapter.numeral} ${cs.context.chapter.label}` },
    { id: 'c2', label: `${cs.users.chapter.numeral} ${cs.users.chapter.label}` },
    { id: 'c3', label: `${cs.process.chapter.numeral} ${cs.process.chapter.label}` },
    { id: 'c4', label: `${cs.solution.chapter.numeral} ${cs.solution.chapter.label}` },
    { id: 'c5', label: `${cs.outcome.chapter.numeral} ${cs.outcome.chapter.label}` },
  ];

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: colors.bg,
        color: colors.text,
        fontFamily: fonts.mono,
        overflowX: 'hidden',
      }}
    >
      {/* Progress bar */}
      <div
        ref={barRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: colors.accent,
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          zIndex: 80,
        }}
      />

      <Grain enabled />
      <CaseStudyHeader chapters={chapters} active={chapter} />

      {/* 00 HERO / BRIEF */}
      <section id="c0" data-chapter="0" style={{ position: 'relative', ...scrollMargin }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-2rem',
            right: '-1rem',
            fontFamily: fonts.display,
            fontSize: 'clamp(14rem, 28vw, 26rem)',
            lineHeight: 1,
            color: 'rgba(236,230,218,0.045)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {cs.caseNumber}
        </div>
        <div
          style={{
            position: 'relative',
            maxWidth: layout.maxWidth,
            margin: '0 auto',
            padding: `clamp(4rem, 12vh, 8.5rem) ${layout.sidePad} clamp(3rem, 7vh, 5rem)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: 'clamp(1.6rem, 4vh, 2.6rem)',
              animation: 'floatIn 0.7s ease both',
            }}
          >
            <span style={eyebrow}>Case study {cs.caseNumber}</span>
            <span
              style={{
                flex: '0 0 46px',
                height: 1,
                background: colors.accent,
                transformOrigin: 'left',
                animation: 'hairline 0.9s 0.3s ease both',
              }}
            />
            <span style={eyebrow}>{cs.eyebrowRight}</span>
          </div>

          <h1
            style={{
              fontFamily: fonts.display,
              fontWeight: 400,
              fontSize: 'clamp(3rem, 8.5vw, 7.2rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.01em',
              margin: 0,
              maxWidth: '15ch',
              animation: 'floatIn 0.8s 0.08s ease both',
            }}
          >
            {cs.headlineLead}
            <span style={{ fontStyle: 'italic', color: colors.accentBright }}>{cs.headlineAccent}</span>
          </h1>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(2rem, 5vw, 4rem)',
              alignItems: 'end',
              marginTop: 'clamp(2rem, 5vh, 3rem)',
            }}
          >
            <p style={{ maxWidth: '52ch', margin: 0, ...bodyP, fontSize: '0.92rem', lineHeight: 1.7, animation: 'floatIn 0.8s 0.16s ease both' }}>
              {cs.intro}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'baseline',
                padding: '1.1rem 1.3rem',
                border: '1px dashed rgba(191,106,65,0.45)',
                animation: 'floatIn 0.8s 0.24s ease both',
              }}
            >
              <span
                style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: colors.accentBright,
                  whiteSpace: 'nowrap',
                }}
              >
                TL;DR
              </span>
              <p style={{ margin: 0, fontSize: '0.76rem', lineHeight: 1.7, color: colors.textBody }}>
                {cs.tldr}
              </p>
            </div>
          </div>

          {/* Meta grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 1,
              marginTop: 'clamp(2.4rem, 6vh, 3.6rem)',
              background: border.gridBg,
              border: `1px solid ${border.gridBg}`,
              animation: 'floatIn 0.8s 0.3s ease both',
            }}
          >
            <MetaCell label="Role" value={cs.meta.role} />
            <MetaCell label="Org" value={cs.meta.org} />
            <MetaCell label="Timeline" value={cs.meta.timeline} />
            <MetaCell label="Scope" value={cs.meta.scope} />
          </div>
        </div>

        {/* Full-bleed hero placeholder */}
        <Reveal style={{ padding: '0 clamp(1rem, 3vw, 2.5rem)' }}>
          <PlaceholderFigure figure={cs.heroFigure} prominent />
        </Reveal>
      </section>

      {/* 01 CONTEXT */}
      <section
        id="c1"
        data-chapter="1"
        style={{ borderTop: `1px solid ${border.hairline}`, background: colors.bgAlt, marginTop: 'clamp(3rem, 8vh, 5.5rem)', ...scrollMargin }}
      >
        <div style={sectionInner}>
          <Reveal>
            <ChapterHeading meta={cs.context.chapter} />
          </Reveal>
          <Reveal
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(2rem, 5vw, 4rem)',
              marginTop: 'clamp(1.8rem, 4vh, 2.8rem)',
              alignItems: 'start',
            }}
          >
            <div>
              <h2 style={h2Style}>{cs.context.h2}</h2>
              {cs.context.paragraphs.map((para, i) => (
                <p key={i} style={{ ...bodyP, margin: i === 0 ? '1.4rem 0 0' : '1.1rem 0 0' }}>
                  {para}
                </p>
              ))}
            </div>
            <ContextPanel
              panelLabel={cs.context.panelLabel}
              chips={cs.context.chips}
              captionBefore={cs.context.captionBefore}
              captionAfter={cs.context.captionAfter}
            />
          </Reveal>
        </div>
      </section>

      {/* 02 USERS */}
      <section id="c2" data-chapter="2" style={{ borderTop: `1px solid ${border.hairline}`, ...scrollMargin }}>
        <div style={sectionInner}>
          <Reveal>
            <ChapterHeading meta={cs.users.chapter} />
          </Reveal>
          <Reveal style={{ maxWidth: '60ch', marginTop: 'clamp(1.8rem, 4vh, 2.8rem)' }}>
            <h2 style={h2Style}>{cs.users.h2}</h2>
          </Reveal>
          <Reveal
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 1,
              marginTop: 'clamp(2.2rem, 5vh, 3.2rem)',
              background: border.gridBg,
              border: `1px solid ${border.gridBg}`,
            }}
          >
            <PersonaCard persona={cs.users.personas[0]} />
            <PersonaCard persona={cs.users.personas[1]} />
          </Reveal>
          <Reveal>
            <p
              style={{
                fontFamily: fonts.display,
                fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)',
                lineHeight: 1.4,
                color: colors.textMuted,
                margin: 'clamp(1.8rem, 4vh, 2.6rem) 0 0',
                maxWidth: '50ch',
              }}
            >
              {cs.users.pullLead}
              <span style={{ fontStyle: 'italic', color: colors.accentBright }}>{cs.users.pullAccent}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 03 PROCESS */}
      <section id="c3" data-chapter="3" style={{ borderTop: `1px solid ${border.hairline}`, background: colors.bgAlt, ...scrollMargin }}>
        <div style={sectionInner}>
          <Reveal>
            <ChapterHeading meta={cs.process.chapter} />
          </Reveal>
          <Reveal style={{ maxWidth: '62ch', marginTop: 'clamp(1.8rem, 4vh, 2.8rem)' }}>
            <h2 style={h2Style}>{cs.process.h2}</h2>
            <p style={{ ...bodyP, margin: '1.4rem 0 0' }}>{cs.process.paragraph}</p>
          </Reveal>
          <Reveal style={{ marginTop: 'clamp(2.2rem, 5vh, 3.2rem)' }}>
            <DecisionLog decisions={cs.process.decisions} />
          </Reveal>

          {/* Fig. A (prominent) */}
          <Reveal style={{ marginTop: 'clamp(2.4rem, 6vh, 3.6rem)' }}>
            <PlaceholderFigure figure={cs.process.figures[0]} prominent />
          </Reveal>
          {/* Fig. B / C */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(1.4rem, 3vw, 2.4rem)',
              marginTop: 'clamp(2rem, 5vh, 3rem)',
            }}
          >
            {cs.process.figures.slice(1).map((fig) => (
              <Reveal key={fig.placeholder}>
                <PlaceholderFigure figure={fig} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 SOLUTION */}
      <section id="c4" data-chapter="4" style={{ borderTop: `1px solid ${border.hairline}`, ...scrollMargin }}>
        <div style={sectionInner}>
          <Reveal>
            <ChapterHeading meta={cs.solution.chapter} />
          </Reveal>
          {/* Principles strip */}
          <Reveal
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 1,
              marginTop: 'clamp(2rem, 5vh, 3rem)',
              background: border.gridBg,
              border: `1px solid ${border.gridBg}`,
            }}
          >
            {cs.solution.principles.map((pr) => (
              <div key={pr.numeral} style={{ background: colors.bg, padding: '1.4rem' }}>
                <div style={{ fontFamily: fonts.display, fontSize: '1.2rem', color: colors.accentBright }}>
                  {pr.numeral}
                </div>
                <div style={{ fontSize: '0.78rem', lineHeight: 1.65, color: colors.textBody, marginTop: '0.6rem' }}>
                  {pr.text}
                </div>
              </div>
            ))}
          </Reveal>

          {/* Screen 01 (prominent) */}
          <Reveal style={{ marginTop: 'clamp(2.4rem, 6vh, 3.6rem)' }}>
            <PlaceholderFigure figure={cs.solution.figures[0]} prominent />
          </Reveal>
          {/* Screens 02 / 03 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(1.4rem, 3vw, 2.4rem)',
              marginTop: 'clamp(2.4rem, 6vh, 3.6rem)',
            }}
          >
            {cs.solution.figures.slice(1).map((fig) => (
              <Reveal key={fig.placeholder}>
                <PlaceholderFigure figure={fig} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 05 OUTCOME */}
      <section id="c5" data-chapter="5" style={{ borderTop: `1px solid ${border.hairline}`, background: colors.bgAlt, ...scrollMargin }}>
        <div style={sectionInner}>
          <Reveal>
            <ChapterHeading meta={cs.outcome.chapter} />
          </Reveal>
          <Reveal style={{ marginTop: 'clamp(1.8rem, 4vh, 2.8rem)' }}>
            <StatBand stats={cs.outcome.stats} />
          </Reveal>
          <Reveal
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(2rem, 5vw, 4rem)',
              marginTop: 'clamp(2.2rem, 5vh, 3.2rem)',
              alignItems: 'start',
            }}
          >
            <p style={{ ...bodyP, margin: 0 }}>{cs.outcome.closingParagraph}</p>
            <div style={{ borderLeft: `1px solid ${border.accentMed}`, paddingLeft: '1.4rem' }}>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.accentBright }}>
                If I did it again
              </div>
              <p style={{ ...bodyP, margin: '0.8rem 0 0' }}>{cs.outcome.ifIDidItAgain}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <NextCaseFooter nextCase={cs.nextCase} />
      <SiteFooter variant="case" />
    </div>
  );
}

const eyebrow = {
  fontSize: '0.7rem',
  letterSpacing: '0.24em',
  textTransform: 'uppercase' as const,
  color: colors.textMuted,
};

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: colors.bg, padding: '1.2rem' }}>
      <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.textFaint }}>
        {label}
      </div>
      <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{value}</div>
    </div>
  );
}
