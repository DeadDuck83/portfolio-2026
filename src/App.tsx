import { Routes, Route, Navigate } from 'react-router';
import ScrollManager from './components/ScrollManager';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';

/**
 * Top-level router.
 *  /              → Home (hero, career slider, selected work, contact)
 *  /work/:slug    → data-driven case study (plmc, parker-ace, bexa, sage)
 *  *              → back to Home
 */
export default function App() {
  return (
    <>
      <ScrollManager />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </>
  );
}
