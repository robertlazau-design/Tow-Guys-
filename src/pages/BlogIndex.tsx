import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SORO_SCRIPT_SRC = 'https://app.trysoro.com/api/embed/bd046227-ac0a-4481-8b04-218d7f8e46d5';
const SORO_SCRIPT_ID  = 'soro-embed-script';

export default function BlogIndex() {
  useEffect(() => {
    // Guard: don't inject if already present (e.g. hot-reload)
    if (document.getElementById(SORO_SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id    = SORO_SCRIPT_ID;
    script.src   = SORO_SCRIPT_SRC;
    script.defer = true;
    document.body.appendChild(script);

    // Cleanup: remove the script when the user navigates away so a
    // fresh injection happens on the next visit without duplicates.
    return () => {
      const el = document.getElementById(SORO_SCRIPT_ID);
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Helmet>
        <title>News &amp; Tips | Tow Guys Gresham</title>
        <meta
          name="description"
          content="Latest towing tips, roadside safety guides, and local driving news from Tow Guys LLC serving Gresham, Troutdale, Portland, and the Mt. Hood Corridor."
        />
      </Helmet>

      {/* Page header */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-[var(--blue)]" />
          <h1 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tight">
            News &amp; Tips
          </h1>
        </div>
        <p className="font-mono text-sm opacity-70 max-w-2xl">
          Stay informed with the latest updates, safety tips, and guides from our
          expert towing and recovery team.
        </p>
      </div>

      {/* Soro AI blog embed — the script populates #soro-blog */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div id="soro-blog" />
      </div>
    </div>
  );
}
