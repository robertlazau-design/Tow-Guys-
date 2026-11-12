import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { startLeadEvents } from './leadEvents';
import App from './App.tsx';
import './index.css';

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Analytics />
        <SpeedInsights />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// Pages are prerendered at build time (scripts/prerender.mjs); hydrate those.
// `npm run dev` serves the empty shell, so render from scratch there.
const root = document.getElementById('root')!;
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

// Count call, text, email and directions taps from any page (see leadEvents.ts).
startLeadEvents();
