import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

const SORO_SCRIPT_SRC = 'https://app.trysoro.com/api/embed/bd046227-ac0a-4481-8b04-218d7f8e46d5';
const SORO_SCRIPT_ID  = 'soro-embed-script';

// Server-rendered by api/blog-post.ts at the end of <body>: a post's full
// article, or (on the listing) a plain list of every post.
const SSR_POST_ID = 'soro-ssr';
const SSR_LIST_ID = 'ssr-posts';

function loadSoro() {
  // Guard: don't inject if already present (e.g. hot-reload)
  if (document.getElementById(SORO_SCRIPT_ID)) return;
  const script = document.createElement('script');
  script.id    = SORO_SCRIPT_ID;
  script.src   = SORO_SCRIPT_SRC;
  script.defer = true;
  document.body.appendChild(script);
}

export default function BlogIndex() {
  const [searchParams] = useSearchParams();
  const post = searchParams.get('post');

  // The header's look is set after mount so the prerendered /blog HTML
  // hydrates without a mismatch.
  const [isPostView, setIsPostView] = useState(false);
  useEffect(() => setIsPostView(Boolean(post)), [post]);

  const postSlot = useRef<HTMLDivElement>(null);
  const listSlot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const article = document.getElementById(SSR_POST_ID);
    if (post && article && article.dataset.slug === post) {
      // The server already sent this post with its own title, canonical and
      // schema. Show that copy and leave Soro out, so the page stays exactly
      // what the server sent (and what Google indexes).
      postSlot.current?.appendChild(article);
      return;
    }
    article?.remove();
    const list = document.getElementById(SSR_LIST_ID);
    if (list) listSlot.current?.appendChild(list);
    loadSoro();
  }, [post]);

  // Remove the script when the user navigates away so a fresh injection
  // happens on the next visit without duplicates.
  useEffect(() => () => document.getElementById(SORO_SCRIPT_ID)?.remove(), []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* A post brings its own title, description and canonical (from the server, or from Soro). */}
      {!post && (
        <Helmet>
          <title>News &amp; Tips | Tow Guys Gresham</title>
          <meta
            name="description"
            content="Latest towing tips, roadside safety guides, and local driving news from Tow Guys LLC serving Gresham, Troutdale, Portland, and the Mt. Hood Corridor."
          />
          <meta property="og:title" content="News & Tips | Tow Guys Gresham" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.towguysgresham.com/blog" />
          <meta property="og:image" content="https://www.towguysgresham.com/images/og-share.jpg" />
          <link rel="canonical" href="https://www.towguysgresham.com/blog" />
        </Helmet>
      )}

      {/* Page header (hidden on a post, which brings its own H1) */}
      <div className={`max-w-6xl mx-auto px-4 pt-10 pb-4 ${isPostView ? 'hidden' : ''}`}>
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

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* A post sent by the server lands here */}
        <div
          ref={postSlot}
          className="empty:hidden prose prose-lg dark:prose-invert max-w-3xl mx-auto prose-headings:font-display prose-a:text-[var(--blue)] prose-img:w-full"
        />

        {/* Soro AI blog embed — the script populates #soro-blog */}
        <div id="soro-blog" />

        {/* The server's list of every post lands here, under Soro's listing */}
        <div
          ref={listSlot}
          className="empty:hidden prose dark:prose-invert max-w-3xl mx-auto mt-16 prose-headings:font-display prose-a:text-[var(--blue)] prose-li:my-1"
        />
      </div>
    </div>
  );
}
