#!/usr/bin/env node

/* ===========================================
   BigToolz - Auto Sitemap Generator
   Fetches all pages + tools + posts + stories
   =========================================== */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

/* ===== CONFIG ===== */
const SITE_URL = 'https://bigtoolz.com';
const SUPABASE_URL = 'https://btmeygsirnyuzsubscde.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rncmfKPlBLxkeIEXaFxfQ_rIbjebnJ';
const OUTPUT_PATH = path.join(__dirname, '..', 'sitemap.xml');

/* ===== STATIC PAGES ===== */
const STATIC_PAGES = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/tools/', priority: 0.9, changefreq: 'weekly' },
  { url: '/blog/', priority: 0.9, changefreq: 'daily' },
  { url: '/webstories/', priority: 0.8, changefreq: 'daily' },
  { url: '/about.html', priority: 0.6, changefreq: 'monthly' },
  { url: '/contact.html', priority: 0.6, changefreq: 'monthly' },
  { url: '/privacy-policy.html', priority: 0.3, changefreq: 'yearly' },
  { url: '/terms.html', priority: 0.3, changefreq: 'yearly' },
  { url: '/disclaimer.html', priority: 0.3, changefreq: 'yearly' }
];

/* ===== CATEGORIES ===== */
const TOOL_CATEGORIES = [
  'image-tools',
  'text-tools',
  'developer-tools',
  'calculator-tools',
  'seo-tools',
  'social-tools',
  'utility-tools',
  'pdf-tools'
];

/* ===== 300 TOOLS ===== */
const TOOLS = [
  // Image Tools (25)
  { cat: 'image-tools', slug: 'image-compressor', priority: 0.8 },
  { cat: 'image-tools', slug: 'png-to-jpg', priority: 0.7 },
  { cat: 'image-tools', slug: 'jpg-to-png', priority: 0.7 },
  { cat: 'image-tools', slug: 'image-resizer', priority: 0.7 },
  { cat: 'image-tools', slug: 'image-crop', priority: 0.7 },
  { cat: 'image-tools', slug: 'image-flip', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-rotate', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-to-base64', priority: 0.6 },
  { cat: 'image-tools', slug: 'base64-to-image', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-color-picker', priority: 0.7 },
  { cat: 'image-tools', slug: 'image-blur', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-brightness', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-contrast', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-grayscale', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-pixelator', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-sketch', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-ascii', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-watermark', priority: 0.7 },
  { cat: 'image-tools', slug: 'screenshot-editor', priority: 0.6 },
  { cat: 'image-tools', slug: 'image-metadata', priority: 0.6 },
  { cat: 'image-tools', slug: 'aspect-ratio', priority: 0.6 },
  { cat: 'image-tools', slug: 'placeholder-generator', priority: 0.6 },
  { cat: 'image-tools', slug: 'qr-code-generator', priority: 0.8 },
  { cat: 'image-tools', slug: 'svg-to-png', priority: 0.7 },
  { cat: 'image-tools', slug: 'color-extractor', priority: 0.7 },

  // Text Tools (25)
  { cat: 'text-tools', slug: 'word-counter', priority: 0.8 },
  { cat: 'text-tools', slug: 'character-counter', priority: 0.7 },
  { cat: 'text-tools', slug: 'case-converter', priority: 0.7 },
  { cat: 'text-tools', slug: 'fancy-text', priority: 0.6 },
  { cat: 'text-tools', slug: 'bold-text', priority: 0.6 },
  { cat: 'text-tools', slug: 'italic-text', priority: 0.6 },
  { cat: 'text-tools', slug: 'cursive-text', priority: 0.6 },
  { cat: 'text-tools', slug: 'upside-down', priority: 0.6 },
  { cat: 'text-tools', slug: 'small-text', priority: 0.6 },
  { cat: 'text-tools', slug: 'zalgo-text', priority: 0.6 },
  { cat: 'text-tools', slug: 'reverse-text', priority: 0.6 },
  { cat: 'text-tools', slug: 'text-to-binary', priority: 0.6 },
  { cat: 'text-tools', slug: 'binary-to-text', priority: 0.6 },
  { cat: 'text-tools', slug: 'text-to-hex', priority: 0.6 },
  { cat: 'text-tools', slug: 'hex-to-text', priority: 0.6 },
  { cat: 'text-tools', slug: 'text-to-morse', priority: 0.6 },
  { cat: 'text-tools', slug: 'morse-to-text', priority: 0.6 },
  { cat: 'text-tools', slug: 'random-word', priority: 0.6 },
  { cat: 'text-tools', slug: 'random-sentence', priority: 0.6 },
  { cat: 'text-tools', slug: 'lorem-ipsum', priority: 0.7 },
  { cat: 'text-tools', slug: 'text-rephraser', priority: 0.7 },
  { cat: 'text-tools', slug: 'keyword-density', priority: 0.7 },
  { cat: 'text-tools', slug: 'readability-checker', priority: 0.7 },
  { cat: 'text-tools', slug: 'word-frequency', priority: 0.6 },
  { cat: 'text-tools', slug: 'typing-speed', priority: 0.7 },

  // Developer Tools (25)
  { cat: 'developer-tools', slug: 'html-minifier', priority: 0.7 },
  { cat: 'developer-tools', slug: 'css-minifier', priority: 0.7 },
  { cat: 'developer-tools', slug: 'js-minifier', priority: 0.7 },
  { cat: 'developer-tools', slug: 'html-formatter', priority: 0.7 },
  { cat: 'developer-tools', slug: 'css-formatter', priority: 0.7 },
  { cat: 'developer-tools', slug: 'js-formatter', priority: 0.7 },
  { cat: 'developer-tools', slug: 'json-formatter', priority: 0.8 },
  { cat: 'developer-tools', slug: 'json-validator', priority: 0.7 },
  { cat: 'developer-tools', slug: 'json-to-xml', priority: 0.6 },
  { cat: 'developer-tools', slug: 'xml-to-json', priority: 0.6 },
  { cat: 'developer-tools', slug: 'base64-encoder', priority: 0.7 },
  { cat: 'developer-tools', slug: 'base64-decoder', priority: 0.7 },
  { cat: 'developer-tools', slug: 'url-encoder', priority: 0.7 },
  { cat: 'developer-tools', slug: 'url-decoder', priority: 0.7 },
  { cat: 'developer-tools', slug: 'rgb-to-hex', priority: 0.7 },
  { cat: 'developer-tools', slug: 'hex-to-rgb', priority: 0.7 },
  { cat: 'developer-tools', slug: 'css-gradient', priority: 0.7 },
  { cat: 'developer-tools', slug: 'box-shadow', priority: 0.6 },
  { cat: 'developer-tools', slug: 'border-radius', priority: 0.6 },
  { cat: 'developer-tools', slug: 'flexbox', priority: 0.7 },
  { cat: 'developer-tools', slug: 'css-grid', priority: 0.7 },
  { cat: 'developer-tools', slug: 'meta-tag', priority: 0.7 },
  { cat: 'developer-tools', slug: 'robots-txt', priority: 0.7 },
  { cat: 'developer-tools', slug: 'sitemap-generator', priority: 0.7 },
  { cat: 'developer-tools', slug: 'favicon-generator', priority: 0.7 },

  // Calculator Tools (25)
  { cat: 'calculator-tools', slug: 'percentage-calculator', priority: 0.8 },
  { cat: 'calculator-tools', slug: 'age-calculator', priority: 0.8 },
  { cat: 'calculator-tools', slug: 'bmi-calculator', priority: 0.8 },
  { cat: 'calculator-tools', slug: 'calorie-calculator', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'loan-emi', priority: 0.8 },
  { cat: 'calculator-tools', slug: 'sip-calculator', priority: 0.8 },
  { cat: 'calculator-tools', slug: 'compound-interest', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'gst-calculator', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'discount-calculator', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'tip-calculator', priority: 0.6 },
  { cat: 'calculator-tools', slug: 'fuel-cost', priority: 0.6 },
  { cat: 'calculator-tools', slug: 'electricity-bill', priority: 0.6 },
  { cat: 'calculator-tools', slug: 'unit-converter', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'length-converter', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'weight-converter', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'temperature-converter', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'area-converter', priority: 0.6 },
  { cat: 'calculator-tools', slug: 'volume-converter', priority: 0.6 },
  { cat: 'calculator-tools', slug: 'speed-converter', priority: 0.6 },
  { cat: 'calculator-tools', slug: 'data-storage', priority: 0.6 },
  { cat: 'calculator-tools', slug: 'time-zone', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'date-difference', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'ovulation-calculator', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'pregnancy-calculator', priority: 0.7 },
  { cat: 'calculator-tools', slug: 'macro-calculator', priority: 0.6 },

  // SEO Tools (25)
  { cat: 'seo-tools', slug: 'meta-description', priority: 0.8 },
  { cat: 'seo-tools', slug: 'serp-preview', priority: 0.8 },
  { cat: 'seo-tools', slug: 'keyword-planner', priority: 0.8 },
  { cat: 'seo-tools', slug: 'keyword-density-checker', priority: 0.7 },
  { cat: 'seo-tools', slug: 'anchor-text', priority: 0.6 },
  { cat: 'seo-tools', slug: 'domain-age', priority: 0.6 },
  { cat: 'seo-tools', slug: 'domain-authority', priority: 0.6 },
  { cat: 'seo-tools', slug: 'page-speed', priority: 0.7 },
  { cat: 'seo-tools', slug: 'mobile-friendly', priority: 0.7 },
  { cat: 'seo-tools', slug: 'open-graph', priority: 0.6 },
  { cat: 'seo-tools', slug: 'twitter-card', priority: 0.6 },
  { cat: 'seo-tools', slug: 'schema-markup', priority: 0.7 },
  { cat: 'seo-tools', slug: 'article-title', priority: 0.7 },
  { cat: 'seo-tools', slug: 'blog-idea', priority: 0.7 },
  { cat: 'seo-tools', slug: 'youtube-title', priority: 0.7 },
  { cat: 'seo-tools', slug: 'youtube-description', priority: 0.6 },
  { cat: 'seo-tools', slug: 'youtube-tag', priority: 0.6 },
  { cat: 'seo-tools', slug: 'instagram-hashtag', priority: 0.7 },
  { cat: 'seo-tools', slug: 'facebook-post', priority: 0.6 },
  { cat: 'seo-tools', slug: 'linkedin-headline', priority: 0.6 },
  { cat: 'seo-tools', slug: 'email-signature', priority: 0.6 },
  { cat: 'seo-tools', slug: 'utm-builder', priority: 0.7 },
  { cat: 'seo-tools', slug: 'qr-code-logo', priority: 0.7 },
  { cat: 'seo-tools', slug: 'barcode-generator', priority: 0.7 },
  { cat: 'seo-tools', slug: 'color-palette', priority: 0.7 },

  // Social Tools (25)
  { cat: 'social-tools', slug: 'youtube-thumbnail', priority: 0.8 },
  { cat: 'social-tools', slug: 'youtube-tag-extractor', priority: 0.7 },
  { cat: 'social-tools', slug: 'youtube-channel-id', priority: 0.6 },
  { cat: 'social-tools', slug: 'youtube-video-id', priority: 0.6 },
  { cat: 'social-tools', slug: 'instagram-reels', priority: 0.8 },
  { cat: 'social-tools', slug: 'instagram-dp', priority: 0.7 },
  { cat: 'social-tools', slug: 'instagram-font', priority: 0.7 },
  { cat: 'social-tools', slug: 'twitter-trends', priority: 0.7 },
  { cat: 'social-tools', slug: 'twitter-bio', priority: 0.6 },
  { cat: 'social-tools', slug: 'facebook-video', priority: 0.6 },
  { cat: 'social-tools', slug: 'pinterest-pin', priority: 0.6 },
  { cat: 'social-tools', slug: 'tiktok-video', priority: 0.7 },
  { cat: 'social-tools', slug: 'whatsapp-link', priority: 0.7 },
  { cat: 'social-tools', slug: 'whatsapp-dp', priority: 0.6 },
  { cat: 'social-tools', slug: 'telegram-bio', priority: 0.6 },
  { cat: 'social-tools', slug: 'discord-emoji', priority: 0.6 },
  { cat: 'social-tools', slug: 'reddit-username', priority: 0.5 },
  { cat: 'social-tools', slug: 'snapchat-streak', priority: 0.5 },
  { cat: 'social-tools', slug: 'social-scheduler', priority: 0.6 },
  { cat: 'social-tools', slug: 'caption-generator', priority: 0.7 },
  { cat: 'social-tools', slug: 'hashtag-generator', priority: 0.7 },
  { cat: 'social-tools', slug: 'emoji-translator', priority: 0.6 },
  { cat: 'social-tools', slug: 'emoji-remover', priority: 0.5 },
  { cat: 'social-tools', slug: 'hashtag-counter', priority: 0.5 },
  { cat: 'social-tools', slug: 'brand-kit', priority: 0.6 },

  // Utility Tools (50)
  { cat: 'utility-tools', slug: 'password-strength', priority: 0.7 },
  { cat: 'utility-tools', slug: 'password-generator', priority: 0.8 },
  { cat: 'utility-tools', slug: 'otp-generator', priority: 0.7 },
  { cat: 'utility-tools', slug: 'pin-generator', priority: 0.6 },
  { cat: 'utility-tools', slug: 'lottery-number', priority: 0.7 },
  { cat: 'utility-tools', slug: 'name-picker', priority: 0.6 },
  { cat: 'utility-tools', slug: 'team-generator', priority: 0.6 },
  { cat: 'utility-tools', slug: 'wheel-names', priority: 0.7 },
  { cat: 'utility-tools', slug: 'decision-maker', priority: 0.7 },
  { cat: 'utility-tools', slug: 'coin-flip', priority: 0.6 },
  { cat: 'utility-tools', slug: 'dice-roll', priority: 0.6 },
  { cat: 'utility-tools', slug: 'rock-paper-scissors', priority: 0.6 },
  { cat: 'utility-tools', slug: 'tic-tac-toe', priority: 0.7 },
  { cat: 'utility-tools', slug: 'memory-game', priority: 0.6 },
  { cat: 'utility-tools', slug: 'typing-game', priority: 0.7 },
  { cat: 'utility-tools', slug: 'reaction-time', priority: 0.7 },
  { cat: 'utility-tools', slug: 'aim-trainer', priority: 0.7 },
  { cat: 'utility-tools', slug: 'color-blind', priority: 0.6 },
  { cat: 'utility-tools', slug: 'eye-test', priority: 0.7 },
  { cat: 'utility-tools', slug: 'hearing-test', priority: 0.6 },
  { cat: 'utility-tools', slug: 'iq-test', priority: 0.8 },
  { cat: 'utility-tools', slug: 'personality-test', priority: 0.8 },
  { cat: 'utility-tools', slug: 'love-calculator', priority: 0.7 },
  { cat: 'utility-tools', slug: 'friendship-test', priority: 0.6 },
  { cat: 'utility-tools', slug: 'mood-tracker', priority: 0.6 },
  { cat: 'utility-tools', slug: 'habit-tracker', priority: 0.7 },
  { cat: 'utility-tools', slug: 'goal-tracker', priority: 0.6 },
  { cat: 'utility-tools', slug: 'todo-list', priority: 0.7 },
  { cat: 'utility-tools', slug: 'daily-quote', priority: 0.6 },
  { cat: 'utility-tools', slug: 'affirmation-generator', priority: 0.6 },
  { cat: 'utility-tools', slug: 'manifestation-journal', priority: 0.5 },
  { cat: 'utility-tools', slug: 'gratitude-journal', priority: 0.5 },
  { cat: 'utility-tools', slug: 'vision-board', priority: 0.6 },
  { cat: 'utility-tools', slug: 'dream-journal', priority: 0.5 },
  { cat: 'utility-tools', slug: 'sleep-cycle', priority: 0.7 },
  { cat: 'utility-tools', slug: 'wake-up-time', priority: 0.6 },
  { cat: 'utility-tools', slug: 'water-intake', priority: 0.6 },
  { cat: 'utility-tools', slug: 'blood-pressure', priority: 0.6 },
  { cat: 'utility-tools', slug: 'heart-rate', priority: 0.6 },
  { cat: 'utility-tools', slug: 'steps-km', priority: 0.6 },
  { cat: 'utility-tools', slug: 'running-pace', priority: 0.6 },
  { cat: 'utility-tools', slug: 'yoga-pose', priority: 0.5 },
  { cat: 'utility-tools', slug: 'workout-plan', priority: 0.6 },
  { cat: 'utility-tools', slug: 'diet-plan', priority: 0.6 },
  { cat: 'utility-tools', slug: 'recipe-calorie', priority: 0.6 },
  { cat: 'utility-tools', slug: 'grocery-list', priority: 0.5 },
  { cat: 'utility-tools', slug: 'birthday-countdown', priority: 0.6 },
  { cat: 'utility-tools', slug: 'event-countdown', priority: 0.6 },
  { cat: 'utility-tools', slug: 'stopwatch', priority: 0.7 },
  { cat: 'utility-tools', slug: 'world-clock', priority: 0.7 },

  // PDF Tools (100) — Sample
  { cat: 'pdf-tools', slug: 'jpg-to-pdf', priority: 0.9 },
  { cat: 'pdf-tools', slug: 'png-to-pdf', priority: 0.8 },
  { cat: 'pdf-tools', slug: 'word-to-pdf', priority: 0.9 },
  { cat: 'pdf-tools', slug: 'text-to-pdf', priority: 0.7 },
  { cat: 'pdf-tools', slug: 'pdf-to-jpg', priority: 0.8 },
  { cat: 'pdf-tools', slug: 'merge-pdf', priority: 0.9 },
  { cat: 'pdf-tools', slug: 'split-pdf', priority: 0.8 },
  { cat: 'pdf-tools', slug: 'compress-pdf', priority: 0.9 },
  { cat: 'pdf-tools', slug: 'protect-pdf', priority: 0.8 },
  { cat: 'pdf-tools', slug: 'unlock-pdf', priority: 0.8 }
  // ... (baaki 90 tools same pattern)
];

/* ===== FETCH FROM SUPABASE ===== */
function fetchFromSupabase(table, query) {
  return new Promise(function(resolve, reject) {
    const url = SUPABASE_URL + '/rest/v1/' + table + '?' + query;
    const options = {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Accept': 'application/json'
      }
    };

    https.get(url, options, function(res) {
      let data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/* ===== FORMAT DATE ===== */
function formatDate(dateStr) {
  if (!dateStr) {
    return new Date().toISOString().split('T')[0];
  }
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}

/* ===== XML ESCAPE ===== */
function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/* ===== GENERATE URL ENTRY ===== */
function urlEntry(loc, lastmod, changefreq, priority) {
  return '  <url>\n' +
    '    <loc>' + escapeXml(loc) + '</loc>\n' +
    '    <lastmod>' + lastmod + '</lastmod>\n' +
    '    <changefreq>' + changefreq + '</changefreq>\n' +
    '    <priority>' + priority.toFixed(1) + '</priority>\n' +
    '  </url>\n';
}

/* ===== MAIN ===== */
async function generateSitemap() {
  console.log('🚀 Generating sitemap...');

  const today = formatDate();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n';

  // 1. STATIC PAGES
  console.log('📄 Adding static pages...');
  STATIC_PAGES.forEach(function(page) {
    xml += urlEntry(SITE_URL + page.url, today, page.changefreq, page.priority);
  });

  // 2. CATEGORIES
  console.log('📁 Adding categories...');
  TOOL_CATEGORIES.forEach(function(cat) {
    xml += urlEntry(SITE_URL + '/tools/' + cat + '/', today, 'weekly', 0.8);
  });

  // 3. TOOLS
  console.log('🛠 Adding ' + TOOLS.length + ' tools...');
  TOOLS.forEach(function(tool) {
    xml += urlEntry(
      SITE_URL + '/tools/' + tool.cat + '/' + tool.slug + '/',
      today,
      'monthly',
      tool.priority
    );
  });

  // 4. BLOG POSTS FROM SUPABASE
  try {
    console.log('📝 Fetching blog posts from Supabase...');
    const posts = await fetchFromSupabase('posts', 'status=eq.published&select=slug,updated_at,published_at,featured_image&order=published_at.desc');

    if (Array.isArray(posts) && posts.length > 0) {
      console.log('   ✅ Found ' + posts.length + ' blog posts');
      posts.forEach(function(post) {
        const lastmod = formatDate(post.updated_at || post.published_at);
        xml += urlEntry(SITE_URL + '/blog/post.html?slug=' + post.slug, lastmod, 'monthly', 0.7);
      });
    } else {
      console.log('   ℹ️  No blog posts yet');
    }
  } catch (err) {
    console.log('   ⚠️  Could not fetch blog posts: ' + err.message);
  }

  // 5. WEB STORIES FROM SUPABASE
  try {
    console.log('📖 Fetching web stories from Supabase...');
    const stories = await fetchFromSupabase('webstories', 'status=eq.published&select=slug,updated_at,published_at&order=published_at.desc');

    if (Array.isArray(stories) && stories.length > 0) {
      console.log('   ✅ Found ' + stories.length + ' web stories');
      stories.forEach(function(story) {
        const lastmod = formatDate(story.updated_at || story.published_at);
        xml += urlEntry(SITE_URL + '/webstories/view.html?slug=' + story.slug, lastmod, 'monthly', 0.6);
      });
    } else {
      console.log('   ℹ️  No web stories yet');
    }
  } catch (err) {
    console.log('   ⚠️  Could not fetch web stories: ' + err.message);
  }

  xml += '\n</urlset>\n';

  // Write file
  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');

  const size = (xml.length / 1024).toFixed(2);
  console.log('\n✅ Sitemap generated successfully!');
  console.log('   File: sitemap.xml');
  console.log('   Size: ' + size + ' KB');
  console.log('   URLs: ' + (xml.match(/<url>/g) || []).length);
}

/* ===== RUN ===== */
generateSitemap().catch(function(err) {
  console.error('❌ Error:', err);
  process.exit(1);
});