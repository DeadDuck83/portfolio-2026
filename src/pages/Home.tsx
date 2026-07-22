import { useEffect } from 'react';
import Grain from '../components/Grain';
import SiteHeader from '../components/home/SiteHeader';
import Hero from '../components/home/Hero';
import CareerSlider from '../components/home/CareerSlider';
import WorkList from '../components/home/WorkList';
import ContactSection from '../components/home/ContactSection';
import SiteFooter from '../components/SiteFooter';
import { colors, fonts } from '../theme/tokens';

/**
 * Home page: hero → career journey → selected work → contact → footer.
 * Content toggles (openToWork, showResume, grain) live here as simple flags —
 * flip them to hide the "open to work" pill, the résumé button, or the grain.
 */
export default function Home() {
  useEffect(() => {
    document.title = 'Derek Moore — Product Manager';
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
      <Hero openToWork />
      <CareerSlider />
      <WorkList />
      <ContactSection showResume />
      <SiteFooter variant="home" />
    </div>
  );
}
