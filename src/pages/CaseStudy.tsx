import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { getCaseStudy } from '../data/caseStudies';
import { collectCaseStudyImages } from '../data/caseStudies/figures';
import { border, colors, fonts, layout, weights } from '../theme/tokens';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useGuideFocus } from '../lib/guide';
import { motionOff } from '../lib/motion';
import { useSectionViews } from '../hooks/useSectionViews';
import { projectIdFromPath, takeCaseStudySource, track, type CaseSectionId } from '../lib/analytics';
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
import ImageCollage from '../components/casestudy/ImageCollage';
import FlowStrip from '../components/casestudy/FlowStrip';
import Eyebrow from '../ui/Eyebrow';
import Label from '../ui/Label';
import Callout from '../ui/Callout';
import Aside from '../ui/Aside';
import CellGrid from '../ui/CellGrid';

// Shared section-level style fragments.
const sectionInner = {
  maxWidth: layout.maxWidth,
  margin: '0 auto',
  padding: `clamp(3.5rem, 9vh, 6.5rem) ${layout.sidePad}`,
};
const scrollMargin = { scrollMarginTop: 130 };
const h2Style = {
  fontFamily: fonts.display,
  fontWeight: weights.display,
  fontSize: 'clamp(1.8rem, 3.6vw, 2.7rem)',
  lineHeight: 1.15,
  margin: 0,
};
const bodyP = { fontSize: '0.86rem', lineHeight: 1.75, color: colors.textBody };

/** Chapter element id → the section name analytics uses (the same for every case study). */
const SECTION_OF: Record<string, CaseSectionId> = {
  c0: 'brief',
  c1: 'context',
  'c-users': 'users',
  'c-process': 'process',
  'c-solution': 'solution',
  'c-outcome': 'outcome',
};
const CHAPTER_IDS = Object.keys(SECTION_OF);

/**
 * Data-driven case study page. Everything renders from the CaseStudy object
 * looked up by URL slug — new case studies are new data files, not new layouts.
 * Chapter flow: 00 Brief → 01 Context → (optional Users) → Process → Solution →
 * Outcome → Next-case footer. Section order is data-driven so case studies can
 * omit chapters (e.g. no Two Sides) without breaking scroll-spy or nav.
 */
export default function CaseStudy() {
  const { slug } = useParams();
  const cs = getCaseStudy(slug);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { barRef, chapter } = useScrollProgress(rootRef);
  const [collageOpen, setCollageOpen] = useState(false);
  const closeCollage = useCallback(() => setCollageOpen(false), []);

  useEffect(() => {
    if (cs) document.title = `${cs.eyebrowRight} — Derek Moore`;
  }, [cs]);

  // once per visit (the ref skips Strict Mode's second run; each case study is a fresh mount)
  const projectId = projectIdFromPath(`/work/${slug}`);
  const viewed = useRef<string | null>(null);
  useEffect(() => {
    if (!projectId || viewed.current === projectId) return;
    viewed.current = projectId;
    track('CaseStudyViewed', { projectId, source: takeCaseStudySource() });
  }, [projectId]);
  useSectionViews(projectId ?? 'none', projectId ? CHAPTER_IDS : [], (id) => {
    if (projectId) track('CaseStudySectionViewed', { projectId, sectionId: SECTION_OF[id] });
  });

  // The avatar narrates a case study section by section: bring each one up as he starts it.
  const focusSection = useCallback((id: string) => {
    const behavior: ScrollBehavior = motionOff() ? 'auto' : 'smooth';
    if (id === 'c0') window.scrollTo({ top: 0, behavior });
    else document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
  }, []);
  useGuideFocus('case', focusSection);

  if (!cs) return <Navigate to="/" replace />;

  const collageImages = collectCaseStudyImages(cs);
  const solutionFullWidth = cs.solution.figures.filter((f, i) => i === 0 || f.fullWidth);
  const solutionCards = cs.solution.figures.filter((f, i) => i !== 0 && !f.fullWidth);

  // plain words in the nav; the numerals stay on the chapter headings
  const chapters: Chapter[] = [
    { id: 'c0', label: 'Brief' },
    { id: 'c1', label: cs.context.chapter.label },
    ...(cs.users ? [{ id: 'c-users', label: cs.users.chapter.label }] : []),
    { id: 'c-process', label: cs.process.chapter.label },
    { id: 'c-solution', label: cs.solution.chapter.label },
    { id: 'c-outcome', label: cs.outcome.chapter.label },
  ];

  const chapterIndex = (id: string) => chapters.findIndex((c) => c.id === id);

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: colors.bg,
        color: colors.text,
        fontFamily: fonts.text,
        // `clip` (not `hidden`) so this div doesn't become a scroll container
        // and steal the sticky header's viewport anchoring.
        overflowX: 'clip',
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
            fontWeight: weights.display,
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
            <Eyebrow>Case study {cs.caseNumber}</Eyebrow>
            <span
              style={{
                flex: '0 0 46px',
                height: 1,
                background: colors.accent,
                transformOrigin: 'left',
                animation: 'hairline 0.9s 0.3s ease both',
              }}
            />
            <Eyebrow>{cs.eyebrowRight}</Eyebrow>
          </div>

          <h1
            style={{
              fontFamily: fonts.display,
              fontWeight: weights.display,
              fontSize: 'clamp(3rem, 8.5vw, 7.2rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.01em',
              margin: 0,
              maxWidth: '15ch',
              animation: 'floatIn 0.8s 0.08s ease both',
            }}
          >
            {cs.headlineLead}
            <span style={{ color: colors.accentBright }}>{cs.headlineAccent}</span>
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
            <Callout
              label="TL;DR"
              link={collageImages.length > 0 ? { label: 'Show me the images →', onClick: () => setCollageOpen(true) } : undefined}
              style={{ animation: 'floatIn 0.8s 0.24s ease both' }}
            >
              {cs.tldr}
            </Callout>
          </div>

          {/* Meta grid */}
          <CellGrid min="170px" style={{ marginTop: 'clamp(2.4rem, 6vh, 3.6rem)', animation: 'floatIn 0.8s 0.3s ease both' }}>
            <MetaCell label="Role" value={cs.meta.role} />
            <MetaCell label="Org" value={cs.meta.org} />
            <MetaCell label="Timeline" value={cs.meta.timeline} />
            <MetaCell label="Scope" value={cs.meta.scope} />
          </CellGrid>
        </div>

        {/* The finished product first: a strip of flows, or the single hero figure */}
        {cs.flows?.length ? (
          <FlowStrip flows={cs.flows} brand={cs.brand} />
        ) : (
          <Reveal style={{ padding: '0 clamp(1rem, 3vw, 2.5rem)' }}>
            <PlaceholderFigure figure={cs.heroFigure} prominent />
          </Reveal>
        )}
      </section>

      {/* 01 CONTEXT */}
      <section
        id="c1"
        data-chapter={chapterIndex('c1')}
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

      {/* USERS (optional) */}
      {cs.users && (
        <section
          id="c-users"
          data-chapter={chapterIndex('c-users')}
          style={{ borderTop: `1px solid ${border.hairline}`, ...scrollMargin }}
        >
          <div style={sectionInner}>
            <Reveal>
              <ChapterHeading meta={cs.users.chapter} />
            </Reveal>
            <Reveal style={{ maxWidth: '60ch', marginTop: 'clamp(1.8rem, 4vh, 2.8rem)' }}>
              <h2 style={h2Style}>{cs.users.h2}</h2>
            </Reveal>
            <Reveal style={{ marginTop: 'clamp(2.2rem, 5vh, 3.2rem)' }}>
              <CellGrid min="300px">
                <PersonaCard persona={cs.users.personas[0]} />
                <PersonaCard persona={cs.users.personas[1]} />
              </CellGrid>
            </Reveal>
            <Reveal>
              <p
                style={{
                  fontFamily: fonts.display,
                  fontWeight: weights.display,
                  fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)',
                  lineHeight: 1.4,
                  color: colors.textMuted,
                  margin: 'clamp(1.8rem, 4vh, 2.6rem) 0 0',
                  maxWidth: '50ch',
                }}
              >
                {cs.users.pullLead}
                <span style={{ color: colors.accentBright }}>{cs.users.pullAccent}</span>
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* PROCESS */}
      <section
        id="c-process"
        data-chapter={chapterIndex('c-process')}
        style={{ borderTop: `1px solid ${border.hairline}`, background: colors.bgAlt, ...scrollMargin }}
      >        <div style={sectionInner}>
          <Reveal>
            <ChapterHeading meta={cs.process.chapter} />
          </Reveal>
          <Reveal style={{ maxWidth: '62ch', marginTop: 'clamp(1.8rem, 4vh, 2.8rem)' }}>
            <h2 style={h2Style}>{cs.process.h2}</h2>
            <p style={{ ...bodyP, margin: '1.4rem 0 0' }}>{cs.process.paragraph}</p>
          </Reveal>
          <Reveal style={{ marginTop: 'clamp(2.2rem, 5vh, 3.2rem)' }}>
            <DecisionLog
              decisions={cs.process.decisions}
              choiceLabel={cs.process.decisionChoiceLabel}
              costLabel={cs.process.decisionCostLabel}
            />
          </Reveal>

          {/* Fig. A (prominent) */}
          {cs.process.figures[0] && (
            <Reveal style={{ marginTop: 'clamp(2.4rem, 6vh, 3.6rem)' }}>
              <PlaceholderFigure figure={cs.process.figures[0]} prominent />
            </Reveal>
          )}
          {/* Fig. B / C */}
          {cs.process.figures.length > 1 && (
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
          )}
        </div>
      </section>

      {/* SOLUTION */}
      <section
        id="c-solution"
        data-chapter={chapterIndex('c-solution')}
        style={{ borderTop: `1px solid ${border.hairline}`, ...scrollMargin }}
      >        <div style={sectionInner}>
          <Reveal>
            <ChapterHeading meta={cs.solution.chapter} />
          </Reveal>
          {/* Principles strip */}
          <Reveal style={{ marginTop: 'clamp(2rem, 5vh, 3rem)' }}>
            <CellGrid min="280px">
              {cs.solution.principles.map((pr) => (
                <div key={pr.numeral} style={{ background: colors.bg, padding: '1.4rem' }}>
                  <div style={{ fontFamily: fonts.display, fontWeight: weights.display, fontSize: '1.2rem', color: colors.accentBright }}>
                    {pr.numeral}
                  </div>
                  {pr.title && (
                    <div
                      style={{
                        fontFamily: fonts.text,
                        fontWeight: 600,
                        fontSize: '1.05rem',
                        lineHeight: 1.3,
                        color: colors.text,
                        marginTop: '0.55rem',
                      }}
                    >
                      {pr.title}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: '0.78rem',
                      lineHeight: 1.65,
                      color: colors.textBody,
                      marginTop: pr.title ? '0.55rem' : '0.6rem',
                    }}
                  >
                    {pr.text}
                  </div>
                </div>
              ))}
            </CellGrid>
          </Reveal>

          {cs.solution.feature && (
            <Reveal style={{ marginTop: 'clamp(2rem, 5vh, 3rem)' }}>
              <Callout label={cs.solution.feature.label ?? 'Feature this'}>{cs.solution.feature.text}</Callout>
            </Reveal>
          )}

          {/* Solution figures: full-width leads, then optional card grid */}
          {solutionFullWidth.map((fig) => (
            <Reveal key={fig.placeholder} style={{ marginTop: 'clamp(2.4rem, 6vh, 3.6rem)' }}>
              <PlaceholderFigure figure={fig} prominent />
            </Reveal>
          ))}
          {solutionCards.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(1.4rem, 3vw, 2.4rem)',
                marginTop: 'clamp(2.4rem, 6vh, 3.6rem)',
              }}
            >
              {solutionCards.map((fig) => (
                <Reveal key={fig.placeholder}>
                  <PlaceholderFigure figure={fig} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* OUTCOME */}
      <section
        id="c-outcome"
        data-chapter={chapterIndex('c-outcome')}
        style={{ borderTop: `1px solid ${border.hairline}`, background: colors.bgAlt, ...scrollMargin }}
      >
        <div style={sectionInner}>
          <Reveal>
            <ChapterHeading meta={cs.outcome.chapter} />
          </Reveal>
          {cs.outcome.stats && cs.outcome.stats.length > 0 && (
            <Reveal style={{ marginTop: 'clamp(1.8rem, 4vh, 2.8rem)' }}>
              <StatBand stats={cs.outcome.stats} />
            </Reveal>
          )}
          {(cs.outcome.lead || (cs.outcome.paragraphs && cs.outcome.paragraphs.length > 0)) && (
            <Reveal
              style={{
                maxWidth: '62ch',
                marginTop: 'clamp(1.8rem, 4vh, 2.8rem)',
              }}
            >
              {cs.outcome.lead && <h2 style={h2Style}>{cs.outcome.lead}</h2>}
              {cs.outcome.paragraphs?.map((para, i) => (
                <p
                  key={i}
                  style={{
                    ...bodyP,
                    margin: i === 0 && cs.outcome.lead ? '1.4rem 0 0' : i === 0 ? 0 : '1.1rem 0 0',
                  }}
                >
                  {para}
                </p>
              ))}
            </Reveal>
          )}
          {cs.outcome.lessons && cs.outcome.lessons.length > 0 ? (
            <Reveal style={{ marginTop: 'clamp(2.4rem, 5vh, 3.4rem)', maxWidth: '62ch' }}>
              <Label>{cs.outcome.asideLabel ?? 'What I learned'}</Label>
              <div style={{ display: 'grid', gap: '1.6rem', marginTop: '1.2rem' }}>
                {cs.outcome.lessons.map((lesson) => (
                  <Aside key={lesson.title}>
                    <div
                      style={{
                        fontFamily: fonts.text,
                        fontWeight: 600,
                        fontSize: '1.05rem',
                        lineHeight: 1.35,
                        color: colors.text,
                      }}
                    >
                      {lesson.title}
                    </div>
                    <p style={{ ...bodyP, margin: '0.55rem 0 0' }}>{lesson.text}</p>
                  </Aside>
                ))}
              </div>
            </Reveal>
          ) : (
            cs.outcome.closingParagraph &&
            cs.outcome.ifIDidItAgain && (
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
                <Aside>
                  <Label>{cs.outcome.asideLabel ?? 'If I did it again'}</Label>
                  <p style={{ ...bodyP, margin: '0.8rem 0 0' }}>{cs.outcome.ifIDidItAgain}</p>
                </Aside>
              </Reveal>
            )
          )}
        </div>
      </section>

      <NextCaseFooter nextCase={cs.nextCase} />
      <SiteFooter variant="case" />

      {collageOpen && (
        <ImageCollage
          title={cs.eyebrowRight}
          figures={collageImages}
          onClose={closeCollage}
        />
      )}
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: colors.bg, padding: '1.2rem' }}>
      <Label tone="muted">{label}</Label>
      <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{value}</div>
    </div>
  );
}
