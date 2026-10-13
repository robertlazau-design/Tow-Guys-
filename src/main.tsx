import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { track } from '@vercel/analytics';
import App from './App.tsx';
import './index.css';

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Analytics />
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

// Count phone-call taps from any page, so we can see which pages bring in calls.
document.addEventListener('click', (e) => {
  const link = (e.target as Element | null)?.closest?.('a[href^="tel:"]');
  if (link) track('Call Click', { page: window.location.pathname });
});
