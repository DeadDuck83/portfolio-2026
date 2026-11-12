import { useEffect } from 'react';
import Grain from '../components/Grain';
import SiteHeader from '../components/home/SiteHeader';
import Hero from '../components/home/Hero';
// Pinned/Rive-background version preserved in ./AboutJourney for reuse; the live
// About section is now the vertical rail with the scrubbed squares animation.
import AboutRail from '../components/home/AboutRail';
// WorkList (the old "The work" rows) is retired from Home: the hero's grid is
// now the work section. Kept for reference until the redesign settles.
import ContactSection from '../components/home/ContactSection';
import SiteFooter from '../components/SiteFooter';
import { colors, fonts } from '../theme/tokens';

/**
 * Home page: hero (name column + selected work) → about rail → contact → footer.
 * Content toggles (showResume, grain) live here as simple flags —
 * flip them to hide the résumé button or the grain.
 * Résumé URL lives in `src/data/site.ts`.
 */
export default function Home() {
  useEffect(() => {
    document.title = 'Derek Moore — Product & Systems Designer';
  }, []);

  return (
    <div
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
      <Grain enabled />
      <SiteHeader />
      <Hero />
      <AboutRail />
      <ContactSection showResume />
      <SiteFooter variant="home" />
    </div>
  );
}
