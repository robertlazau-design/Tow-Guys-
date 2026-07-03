import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'mock-api',
        configureServer(server) {
          server.middlewares.use('/api/send-release', (req, res, next) => {
            if (req.method === 'POST') {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: "Mocked email sent from Antigravity preview!" }));
            } else {
              next();
            }
          });

          server.middlewares.use('/api/publish-blog', (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk.toString(); });
              req.on('end', () => {
                try {
                  const data = JSON.parse(body);
                  const fs = require('fs');
                  const path = require('path');
                  const blogsFilePath = path.join(__dirname, 'src', 'data', 'blogs.json');
                  let blogs = [];
                  if (fs.existsSync(blogsFilePath)) {
                    blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf8'));
                  }
                  
                  const newPost = {
                    id: Date.now().toString(),
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    meta_description: data.meta_description || '',
                    author: data.author || 'AI Author',
                    published_date: new Date().toISOString(),
                    featured_image_url: data.featured_image_url || ''
                  };
                  
                  blogs.unshift(newPost);
                  fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
                  
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, post: newPost }));
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to save mock post' }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
