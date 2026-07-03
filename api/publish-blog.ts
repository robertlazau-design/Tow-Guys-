import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  // Use an environment variable in production. For this mock, checking against a hardcoded string or simple env logic.
  const expectedSecret = process.env.SEONA_SECRET_KEY || 'mock-secret-key-123';
  
  if (authHeader !== `Bearer ${expectedSecret}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }

  try {
    const { title, slug, content, meta_description, author, featured_image_url } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Missing required fields: title, slug, content' });
    }

    const newPost = {
      id: Date.now().toString(),
      title,
      slug,
      content,
      meta_description: meta_description || '',
      author: author || 'AI Author',
      published_date: new Date().toISOString(),
      featured_image_url: featured_image_url || ''
    };

    // In a real Vercel app, this file write won't persist.
    // However, it works perfectly for local dev mocking or when running Vite server.
    const blogsFilePath = path.join(process.cwd(), 'src', 'data', 'blogs.json');
    let blogs = [];
    
    if (fs.existsSync(blogsFilePath)) {
      const fileData = fs.readFileSync(blogsFilePath, 'utf8');
      blogs = JSON.parse(fileData);
    }
    
    blogs.unshift(newPost); // add to top
    
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));

    return res.status(200).json({ success: true, post: newPost });
  } catch (err) {
    console.error('Failed to publish blog post:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
