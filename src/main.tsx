import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { applyOptOutParam, initAnalytics } from './lib/analytics';
import { captureFirstTouchAttribution } from './lib/attribution';
import { startEngagementTracking } from './lib/engagement';
import './styles/global.css';

// opt-out first, so ?analytics=off stops this very visit from being recorded
applyOptOutParam();
initAnalytics();
startEngagementTracking();
captureFirstTouchAttribution();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
