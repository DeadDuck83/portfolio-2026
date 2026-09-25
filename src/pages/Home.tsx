import { useEffect } from 'react';
import Grain from '../components/Grain';
import SiteHeader from '../components/home/SiteHeader';
import Hero from '../components/home/Hero';
import AboutJourney from '../components/home/AboutJourney';
import WorkList from '../components/home/WorkList';
import ContactSection from '../components/home/ContactSection';
import SiteFooter from '../components/SiteFooter';
import { colors, fonts } from '../theme/tokens';

/**
 * Home page: hero → about journey → selected work → contact → footer.
 * Content toggles (showResume, grain) live here as simple flags —
 * flip them to hide the résumé button or the grain.
 * Résumé URL lives in `src/data/site.ts`.
 */
export default function Home() {
  useEffect(() => {
    document.title = 'Derek Moore — Product Design Portfolio';
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: colors.bg,
        color: colors.text,
        fontFamily: fonts.mono,
        // `clip` (not `hidden`) so this div doesn't become a scroll container
        // and steal the sticky header's viewport anchoring.
        overflowX: 'clip',
      }}
    >
      <Grain enabled />
      <SiteHeader />
      <Hero />
      <AboutJourney />
      <WorkList />
      <ContactSection showResume />
      <SiteFooter variant="home" />
    </div>
  );
}
