import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import blogsData from '../data/blogs.json';

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] p-6 md:p-12 max-w-7xl mx-auto">
      <Helmet>
        <title>News & Tips | Tow Guys Gresham</title>
        <meta name="description" content="Latest news, tips, and guides from Tow Guys in Gresham, OR." />
      </Helmet>

      <div className="mb-12 pt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-[var(--blue)]"></div>
          <h1 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tight">News & Tips</h1>
        </div>
        <p className="font-mono text-sm opacity-70 max-w-2xl">
          Stay informed with the latest updates, safety tips, and guides from our expert towing and recovery team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogsData.map((blog, i) => (
          <motion.div 
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden hover:border-[var(--blue)] transition-colors duration-300 shadow-sm"
          >
            {blog.featured_image_url && (
              <div className="aspect-video overflow-hidden">
                <img 
                  src={blog.featured_image_url} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6 flex flex-col flex-1">
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-3 flex justify-between">
                <span>{new Date(blog.published_date).toLocaleDateString()}</span>
                <span>{blog.author}</span>
              </div>
              <h2 className="font-display font-bold text-xl mb-3 group-hover:text-[var(--blue)] transition-colors line-clamp-2">
                {blog.title}
              </h2>
              <p className="font-mono text-sm opacity-70 mb-6 flex-1 line-clamp-3">
                {blog.meta_description}
              </p>
              <Link 
                to={`/blog/${blog.slug}`}
                className="mt-auto inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--blue)] hover:text-[var(--orange)] transition-colors"
              >
                Read Article
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
