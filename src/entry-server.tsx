import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import SERVICE_AREAS from './data/serviceAreas';
import SERVICES from './data/services';

/** Every path that gets a prerendered HTML file (see scripts/prerender.mjs). */
export const ROUTES = [
  '/',
  '/blog',
  '/privacy',
  ...SERVICES.map((s) => `/services/${s.slug}`),
  ...SERVICE_AREAS.map((c) => `/towing/${c.slug}`),
];

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <HelmetProvider>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  );
}
