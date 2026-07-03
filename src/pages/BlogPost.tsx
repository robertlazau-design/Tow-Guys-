import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import blogsData from '../data/blogs.json';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogsData.find((b: any) => b.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const siteUrl = 'https://towguysgresham.com'; // Use actual domain in production
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "headline": post.title,
    "description": post.meta_description,
    "image": post.featured_image_url || `${siteUrl}/logo.png`,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Tow Guys",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "datePublished": post.published_date,
    "dateModified": post.published_date
  };

  return (
    <article className="min-h-screen bg-[var(--bg)] text-[var(--fg)] pb-24">
      <Helmet>
        <title>{post.title} | Tow Guys</title>
        <meta name="description" content={post.meta_description} />
        
        {/* Open Graph / Social */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        {post.featured_image_url && <meta property="og:image" content={post.featured_image_url} />}
        
        {/* Canonical */}
        <link rel="canonical" href={postUrl} />
        
        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* Header Image */}
      {post.featured_image_url ? (
        <div className="w-full h-[40vh] md:h-[50vh] relative">
          <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent"></div>
        </div>
      ) : (
        <div className="w-full h-[20vh] bg-black/5 dark:bg-white/5"></div>
      )}

      <div className={`max-w-3xl mx-auto px-6 relative z-10 ${post.featured_image_url ? '-mt-16 md:-mt-32' : '-mt-10'}`}>
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest mb-8 text-[var(--fg)] opacity-70 hover:opacity-100 hover:text-[var(--blue)] transition-colors bg-[var(--bg)] p-2 pr-4 rounded-full border border-[var(--border)] shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Tips
        </Link>

        <div className="bg-[var(--bg)] rounded-3xl p-6 md:p-12 border border-[var(--border)] shadow-xl relative overflow-hidden">
          {/* Subtle noise over the article card */}
          <div className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest opacity-60 mb-3">
              <time dateTime={post.published_date}>{new Date(post.published_date).toLocaleDateString()}</time>
              <span>•</span>
              <span>{post.author}</span>
            </div>
            
            <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-6">
              {post.title}
            </h1>

            <div 
              className="blog-content prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-img:rounded-2xl prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:font-normal prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
