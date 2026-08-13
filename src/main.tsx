import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import LogRocket from 'logrocket';
import App from './App.tsx';
import { identifyAnonymousVisitor } from './lib/analytics';
import { captureFirstTouchAttribution } from './lib/attribution';
import './styles/global.css';

if (import.meta.env.PROD) {
  LogRocket.init('hsztbz/portfolio-site-traffic');
  identifyAnonymousVisitor();
}

captureFirstTouchAttribution();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
