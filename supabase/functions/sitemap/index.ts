// ===========================================
// BigToolz - Dynamic Sitemap Generator
// Supabase Edge Function
// ===========================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_URL = 'https://bigtoolz.com';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Static pages (jo hamesha sitemap mein rahenge)
const STATIC_PAGES = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/tools/', priority: '0.9', changefreq: 'weekly' },
  { loc: '/blog/', priority: '0.9', changefreq: 'daily' },
  { loc: '/about.html', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact.html', priority: '0.6', changefreq: 'monthly' },
  { loc: '/privacy-policy.html', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms.html', priority: '0.3', changefreq: 'yearly' },
  { loc: '/disclaimer.html', priority: '0.3', changefreq: 'yearly' },
  // Tools categories
  { loc: '/tools/image-tools/', priority: '0.8', changefreq: 'weekly' },
  { loc: '/tools/text-tools/', priority: '0.8', changefreq: 'weekly' },
  { loc: '/tools/developer-tools/', priority: '0.8', changefreq: 'weekly' },
  { loc: '/tools/calculator-tools/', priority: '0.8', changefreq: 'weekly' },
  { loc: '/tools/seo-tools/', priority: '0.8', changefreq: 'weekly' },
  { loc: '/tools/social-tools/', priority: '0.8', changefreq: 'weekly' },
  { loc: '/tools/utility-tools/', priority: '0.8', changefreq: 'weekly' },
  { loc: '/tools/pdf-tools/', priority: '0.9', changefreq: 'weekly' },
];

// Escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Format date to ISO (YYYY-MM-DD)
function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

Deno.serve(async (req) => {
  try {
    // CORS support (optional)
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Fetch all published posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at, title')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }

    const today = formatDate(new Date());

    // Build URL entries
    const urls: string[] = [];

    // Static pages
    STATIC_PAGES.forEach(page => {
      urls.push(`  <url>
    <loc>${escapeXml(SITE_URL + page.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    });

    // Dynamic blog/news/story pages
    (posts || []).forEach(post => {
      const lastmod = formatDate(post.updated_at || post.published_at || new Date());
      const loc = `${SITE_URL}/blog/post.html?slug=${encodeURIComponent(post.slug)}`;

      urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
    });

    // Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('Sitemap error:', err);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
      }
    );
  }
});
