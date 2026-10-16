#!/usr/bin/env node

/* ===========================================
   BigToolz - Sitemap Generator
   Auto-generates sitemap.xml, sitemap-blog.xml,
   and sitemap-index.xml
   =========================================== */

'use strict';

const fs = require('fs');
const path = require('path');

/* ===== CONFIG ===== */
const SITE_URL = 'https://bigtoolz.com';
const TODAY = new Date().toISOString().split('T')[0];
const SUPABASE_URL = 'https://btmeygsirnyuzsubscde.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rncmFbKPlBLxkeIEXaFxfQ_rIbjebnJ';

/* ===== STATIC PAGES ===== */
const STATIC_PAGES = [
  { url: '/',                          priority: 1.0, changefreq: 'daily' },
  { url: '/about.html',                priority: 0.6, changefreq: 'monthly' },
  { url: '/contact.html',              priority: 0.6, changefreq: 'monthly' },
  { url: '/privacy-policy.html',       priority: 0.3, changefreq: 'yearly' },
  { url: '/terms.html',                priority: 0.3, changefreq: 'yearly' },
  { url: '/disclaimer.html',           priority: 0.3, changefreq: 'yearly' },
  { url: '/tools/',                    priority: 0.9, changefreq: 'weekly' },
  { url: '/blog/',                     priority: 0.9, changefreq: 'daily' },
];

/* ===== CATEGORIES ===== */
const CATEGORIES = [
  { url: '/tools/image-tools/',        priority: 0.8, changefreq: 'weekly' },
  { url: '/tools/text-tools/',         priority: 0.8, changefreq: 'weekly' },
  { url: '/tools/developer-tools/',    priority: 0.8, changefreq: 'weekly' },
  { url: '/tools/calculator-tools/',   priority: 0.8, changefreq: 'weekly' },
  { url: '/tools/seo-tools/',          priority: 0.8, changefreq: 'weekly' },
  { url: '/tools/social-tools/',       priority: 0.8, changefreq: 'weekly' },
  { url: '/tools/utility-tools/',      priority: 0.8, changefreq: 'weekly' },
  { url: '/tools/pdf-tools/',          priority: 0.9, changefreq: 'weekly' },
  { url: '/tools/pdf-tools/convert-pdf/',    priority: 0.7, changefreq: 'weekly' },
  { url: '/tools/pdf-tools/organize-pdf/',   priority: 0.7, changefreq: 'weekly' },
  { url: '/tools/pdf-tools/security-pdf/',   priority: 0.7, changefreq: 'weekly' },
  { url: '/tools/pdf-tools/visual-pdf/',     priority: 0.7, changefreq: 'weekly' },
  { url: '/tools/pdf-tools/form-pdf/',       priority: 0.7, changefreq: 'weekly' },
  { url: '/tools/pdf-tools/advanced-pdf/',   priority: 0.7, changefreq: 'weekly' },
];

/* ===== LOAD TOOLS FROM DATABASE ===== */
function loadTools() {
  try {
    const dbPath = path.join(__dirname, '..', 'data', 'tools-database.js');
    if (!fs.existsSync(dbPath)) {
      console.warn('⚠️ tools-database.js not found — skipping tools');
      return [];
    }

    // Read and eval the file to get tools array
    const content = fs.readFileSync(dbPath, 'utf8');
    const tools = [];

    // Extract tool objects using regex (works without executing window code)
    const urlRegex = /url:\s*['"`]([^'"`]+)['"`]/g;
    const idRegex = /id:\s*(\d+)/g;

    let match;
    const urls = [];
    while ((match = urlRegex.exec(content)) !== null) {
      urls.push(match[1]);
    }

    const ids = [];
    while ((match = idRegex.exec(content)) !== null) {
      ids.push(parseInt(match[1], 10));
    }

    // Combine and deduplicate
    const seen = new Set();
    for (let i = 0; i < Math.max(urls.length, ids.length); i++) {
      const url = urls[i];
      if (url && !seen.has(url) && url.startsWith('/tools/')) {
        seen.add(url);
        tools.push({ url, priority: 0.7, changefreq: 'monthly' });
      }
    }

    console.log(`✅ Loaded ${tools.length} tools from tools-database.js`);
    return tools;
  } catch (err) {
    console.error('❌ Error loading tools:', err.message);
    return [];
  }
}

/* ===== FETCH BLOG POSTS FROM SUPABASE ===== */
async function fetchBlogPosts() {
  try {
    const url = `${SUPABASE_URL}/rest/v1/posts?select=slug,updated_at,published_at,featured_image&status=eq.published&order=published_at.desc`;

    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase HTTP ${response.status}`);
    }

    const posts = await response.json();
    console.log(`✅ Fetched ${posts.length} published blog posts from Supabase`);
    return posts;
  } catch (err) {
    console.error('⚠️ Could not fetch blog posts:', err.message);
    return [];
  }
}

/* ===== XML BUILDERS ===== */
function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrlEntry({ loc, lastmod, changefreq, priority, images }) {
  let entry = '  <url>\n';
  entry += `    <loc>${escapeXml(loc)}</loc>\n`;
  if (lastmod) entry += `    <lastmod>${lastmod}</lastmod>\n`;
  if (changefreq) entry += `    <changefreq>${changefreq}</changefreq>\n`;
  if (priority !== undefined) entry += `    <priority>${priority.toFixed(1)}</priority>\n`;

  if (images && images.length) {
    images.forEach(img => {
      entry += '    <image:image>\n';
      entry += `      <image:loc>${escapeXml(img)}</image:loc>\n`;
      entry += '    </image:image>\n';
    });
  }

  entry += '  </url>\n';
  return entry;
}

function generateMainSitemap(tools) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n';

  // Static pages
  STATIC_PAGES.forEach(page => {
    xml += buildUrlEntry({
      loc: SITE_URL + page.url,
      lastmod: TODAY,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  xml += '\n  <!-- Categories -->\n';
  CATEGORIES.forEach(cat => {
    xml += buildUrlEntry({
      loc: SITE_URL + cat.url,
      lastmod: TODAY,
      changefreq: cat.changefreq,
      priority: cat.priority
    });
  });

  xml += '\n  <!-- Tools -->\n';
  tools.forEach(tool => {
    xml += buildUrlEntry({
      loc: SITE_URL + tool.url,
      lastmod: TODAY,
      changefreq: tool.changefreq,
      priority: tool.priority
    });
  });

  xml += '\n</urlset>\n';
  return xml;
}

function generateBlogSitemap(posts) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n';

  if (posts.length === 0) {
    // Still valid — just no posts yet
    xml += '  <!-- No published blog posts yet -->\n';
  } else {
    posts.forEach(post => {
      const lastmod = (post.updated_at || post.published_at || TODAY).split('T')[0];
      const images = post.featured_image ? [post.featured_image] : [];

      xml += buildUrlEntry({
        loc: `${SITE_URL}/blog/post.html?slug=${encodeURIComponent(post.slug)}`,
        lastmod: lastmod,
        changefreq: 'monthly',
        priority: 0.7,
        images: images
      });
    });
  }

  xml += '\n</urlset>\n';
  return xml;
}

function generateSitemapIndex() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  xml += '  <sitemap>\n';
  xml += `    <loc>${SITE_URL}/sitemap.xml</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += '  </sitemap>\n';
  xml += '  <sitemap>\n';
  xml += `    <loc>${SITE_URL}/sitemap-blog.xml</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += '  </sitemap>\n';
  xml += '</sitemapindex>\n';
  return xml;
}

/* ===== MAIN ===== */
async function main() {
  console.log('🚀 BigToolz Sitemap Generator');
  console.log('==============================\n');

  const tools = loadTools();
  const posts = await fetchBlogPosts();

  const mainSitemap = generateMainSitemap(tools);
  const blogSitemap = generateBlogSitemap(posts);
  const sitemapIndex = generateSitemapIndex();

  const rootDir = path.join(__dirname, '..');
  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), mainSitemap, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'sitemap-blog.xml'), blogSitemap, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'sitemap-index.xml'), sitemapIndex, 'utf8');

  const totalUrls = STATIC_PAGES.length + CATEGORIES.length + tools.length;
  const blogUrls = posts.length;

  console.log('\n📊 Summary:');
  console.log(`  Static pages:  ${STATIC_PAGES.length}`);
  console.log(`  Categories:    ${CATEGORIES.length}`);
  console.log(`  Tools:         ${tools.length}`);
  console.log(`  Blog posts:    ${blogUrls}`);
  console.log(`  ─────────────────────`);
  console.log(`  Total URLs:    ${totalUrls + blogUrls}`);
  console.log('\n✅ Generated:');
  console.log('  - sitemap.xml');
  console.log('  - sitemap-blog.xml');
  console.log('  - sitemap-index.xml');
  console.log('\n🎉 Done!');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
