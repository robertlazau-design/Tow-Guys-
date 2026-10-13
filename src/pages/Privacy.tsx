import React from 'react';
import { Helmet } from 'react-helmet-async';

const UPDATED = 'October 13, 2026';

const SECTIONS: { heading: string; body: React.ReactNode }[] = [
  {
    heading: 'What this site collects',
    body: (
      <>
        This website has no accounts and no forms that store your information. We only
        receive information you choose to send us by calling or texting{' '}
        <a href="tel:9712227994">(971) 222-7994</a>.
      </>
    ),
  },
  {
    heading: '"Text My Location"',
    body: (
      <>
        When you tap "Text My Location," your browser asks for permission to read your
        device's location. If you allow it, the site uses that location only to fill in a
        Google Maps link in a new text message on your phone. Nothing is sent until you
        press send in your messaging app, and the website itself does not store your
        location. If you decline, the button calls us instead.
      </>
    ),
  },
  {
    heading: 'Calls and texts',
    body: (
      <>
        When you call or text us, including the junk-car photo quote, we use your phone
        number, messages, photos, and location to dispatch help, give you a quote, and
        follow up on your service. We don't sell this information or use it for
        unrelated marketing.
      </>
    ),
  },
  {
    heading: 'Analytics',
    body: (
      <>
        We use Vercel Web Analytics to count page views and see which pages are useful.
        It doesn't use cookies, and it doesn't identify individual visitors.
      </>
    ),
  },
  {
    heading: 'Other services',
    body: (
      <>
        Our News &amp; Tips articles are delivered by Soro, and fonts load from Google
        Fonts. The Uber, Lyft, Google Maps, Facebook, and Instagram links take you to those
        services, whose own privacy policies apply once you're there.
      </>
    ),
  },
  {
    heading: 'Questions',
    body: (
      <>
        Call or text <a href="tel:9712227994">(971) 222-7994</a>, or visit us at 28901 SE
        Dodge Park Blvd, Gresham, OR 97080.
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Helmet>
        <title>Privacy Policy | Tow Guys Gresham</title>
        <meta name="description" content="How the Tow Guys LLC website handles your location, calls, texts, and analytics." />
        <link rel="canonical" href="https://www.towguysgresham.com/privacy" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-[var(--blue)]" />
          <h1 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tight">
            Privacy Policy
          </h1>
        </div>
        <p className="font-mono text-xs opacity-60 uppercase tracking-widest mb-12">
          Tow Guys LLC · Last updated {UPDATED}
        </p>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-3">
                {section.heading}
              </h2>
              <p className="font-mono text-sm opacity-80 leading-relaxed [&_a]:text-[var(--blue)] [&_a]:underline">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
