/* ===========================================
   BigToolz - Sitemap Generator
   Version: 2.0.0
   Last Updated: 2026-01-15
   Purpose: Auto-generate sitemap.xml from databases
   Usage: <script src="/data/sitemap-generator.js" defer></script>
   Depends on: tools-database.js, blog-database.js
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. CONFIG
     =========================================== */
  const CONFIG = {
    siteUrl: 'https://bigtoolz.com',
    defaultChangeFreq: 'monthly',
    defaultPriority: 0.5,
    maxUrlsPerSitemap: 50000,   // Google's limit
    maxSitemapSizeBytes: 50 * 1024 * 1024, // 50MB
    includeBlog: true,
    includeTools: true,
    includeCategories: true,
    includeStaticPages: true
  };

  /* ===========================================
     2. STATIC PAGES (root-level HTML files)
     =========================================== */
  const STATIC_PAGES = [
    { url: '/',                                  priority: 1.0, changefreq: 'daily' },
    { url: '/about.html',                        priority: 0.6, changefreq: 'monthly' },
    { url: '/contact.html',                      priority: 0.6, changefreq: 'monthly' },
    { url: '/privacy-policy.html',               priority: 0.3, changefreq: 'yearly' },
    { url: '/terms.html',                        priority: 0.3, changefreq: 'yearly' },
    { url: '/disclaimer.html',                   priority: 0.3, changefreq: 'yearly' },
    { url: '/tools/',                            priority: 0.9, changefreq: 'weekly' },
    { url: '/blog/',                             priority: 0.9, changefreq: 'daily' }
  ];

  /* ===========================================
     3. PRIORITY / CHANGEFREQ MAPPINGS
     =========================================== */
  const PRIORITY_MAP = {
    homepage: 1.0,
    toolsIndex: 0.9,
    blogIndex: 0.9,
    category: 0.8,
    subcategory: 0.7,
    tool: 0.7,
    blogPost: 0.7,
    staticPage: 0.5,
    legalPage: 0.3
  };

  const CHANGEFREQ_MAP = {
    homepage: 'daily',
    toolsIndex: 'weekly',
    blogIndex: 'daily',
    category: 'weekly',
    subcategory: 'weekly',
    tool: 'monthly',
    blogPost: 'monthly',
    staticPage: 'monthly',
    legalPage: 'yearly'
  };

  /* ===========================================
     4. HELPERS
     =========================================== */
  function escapeXml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  }

  function joinUrl(path) {
    if (!path) return CONFIG.siteUrl + '/';
    if (path.startsWith('http')) return path;
    if (!path.startsWith('/')) path = '/' + path;
    return CONFIG.siteUrl + path;
  }

  /* ===========================================
     5. URL COLLECTOR
     =========================================== */
  const urlEntries = [];

  /**
   * Add a URL to the sitemap
   */
  function addUrl(path, options = {}) {
    const loc = joinUrl(path);
    const priority = options.priority !== undefined ? options.priority : CONFIG.defaultPriority;
    const changefreq = options.changefreq || CONFIG.defaultChangeFreq;
    const lastmod = options.lastmod ? formatDate(options.lastmod) : formatDate(new Date());

    urlEntries.push({
      loc,
      lastmod,
      changefreq,
      priority: priority.toFixed(1)
    });
  }

  /* ===========================================
     6. COLLECT STATIC PAGES
     =========================================== */
  function collectStaticPages() {
    if (!CONFIG.includeStaticPages) return;

    STATIC_PAGES.forEach(page => {
      addUrl(page.url, {
        priority: page.priority,
        changefreq: page.changefreq,
        lastmod: new Date()
      });
    });
  }

  /* ===========================================
     7. COLLECT CATEGORIES
     =========================================== */
  function collectCategories() {
    if (!CONFIG.includeCategories) return;

    // Tool categories
    if (window.TOOLS_CATEGORIES && Array.isArray(window.TOOLS_CATEGORIES)) {
      window.TOOLS_CATEGORIES.forEach(cat => {
        addUrl(cat.url, {
          priority: PRIORITY_MAP.category,
          changefreq: CHANGEFREQ_MAP.category,
          lastmod: new Date()
        });
      });
    }

    // PDF subcategories
    if (window.PDF_SUBCATEGORIES && Array.isArray(window.PDF_SUBCATEGORIES)) {
      window.PDF_SUBCATEGORIES.forEach(sub => {
        addUrl(sub.url, {
          priority: PRIORITY_MAP.subcategory,
          changefreq: CHANGEFREQ_MAP.subcategory,
          lastmod: new Date()
        });
      });
    }

    // Blog categories
    if (window.BLOG_CATEGORIES && Array.isArray(window.BLOG_CATEGORIES)) {
      window.BLOG_CATEGORIES.forEach(cat => {
        addUrl(cat.url, {
          priority: PRIORITY_MAP.category,
          changefreq: CHANGEFREQ_MAP.category,
          lastmod: new Date()
        });
      });
    }
  }

  /* ===========================================
     8. COLLECT TOOLS
     =========================================== */
  function collectTools() {
    if (!CONFIG.includeTools) return;
    if (!window.TOOLS_DATABASE || !Array.isArray(window.TOOLS_DATABASE)) return;

    window.TOOLS_DATABASE.forEach(tool => {
      const priority = tool.trending
        ? Math.min(0.9, PRIORITY_MAP.tool + 0.1)
        : PRIORITY_MAP.tool;

      addUrl(tool.url, {
        priority: priority,
        changefreq: CHANGEFREQ_MAP.tool,
        lastmod: new Date()
      });
    });
  }

  /* ===========================================
     9. COLLECT BLOG POSTS
     =========================================== */
  function collectBlogPosts() {
    if (!CONFIG.includeBlog) return;
    if (!window.BLOG_DATABASE || !Array.isArray(window.BLOG_DATABASE)) return;

    window.BLOG_DATABASE.forEach(post => {
      const priority = post.featured
        ? 0.9
        : (post.trending ? 0.8 : PRIORITY_MAP.blogPost);

      addUrl(post.url, {
        priority: priority,
        changefreq: CHANGEFREQ_MAP.blogPost,
        lastmod: post.updatedAt || post.publishedAt || new Date()
      });
    });
  }

  /* ===========================================
     10. BUILD URLSET XML
     =========================================== */
  function buildUrlsetXml(entries) {
    const lines = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    lines.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    lines.push('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');

    entries.forEach(entry => {
      lines.push('  <url>');
      lines.push('    <loc>' + escapeXml(entry.loc) + '</loc>');
      lines.push('    <lastmod>' + entry.lastmod + '</lastmod>');
      lines.push('    <changefreq>' + entry.changefreq + '</changefreq>');
      lines.push('    <priority>' + entry.priority + '</priority>');
      lines.push('  </url>');
    });

    lines.push('</urlset>');
    return lines.join('\n');
  }

  /* ===========================================
     11. BUILD SITEMAP INDEX (for large sites)
     =========================================== */
  function buildSitemapIndex(sitemaps) {
    const lines = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    sitemaps.forEach(sm => {
      lines.push('  <sitemap>');
      lines.push('    <loc>' + escapeXml(sm.loc) + '</loc>');
      lines.push('    <lastmod>' + sm.lastmod + '</lastmod>');
      lines.push('  </sitemap>');
    });

    lines.push('</sitemapindex>');
    return lines.join('\n');
  }

  /* ===========================================
     12. MAIN GENERATOR
     =========================================== */
  function generateSitemap() {
    // Reset
    urlEntries.length = 0;

    // Collect all URLs
    collectStaticPages();
    collectCategories();
    collectTools();
    collectBlogPosts();

    // Deduplicate by loc
    const seen = new Set();
    const deduped = urlEntries.filter(entry => {
      if (seen.has(entry.loc)) return false;
      seen.add(entry.loc);
      return true;
    });

    // Sort by priority desc (higher priority first)
    deduped.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));

    // Build XML
    if (deduped.length <= CONFIG.maxUrlsPerSitemap) {
      return buildUrlsetXml(deduped);
    }

    // Large site — return sitemap index info
    return {
      index: true,
      message: 'Site exceeds ' + CONFIG.maxUrlsPerSitemap + ' URLs — sitemap index needed',
      sitemaps: splitIntoChunks(deduped)
    };
  }

  function splitIntoChunks(entries) {
    const chunks = [];
    for (let i = 0; i < entries.length; i += CONFIG.maxUrlsPerSitemap) {
      const chunk = entries.slice(i, i + CONFIG.maxUrlsPerSitemap);
      chunks.push({
        loc: CONFIG.siteUrl + '/sitemap-' + (chunks.length + 1) + '.xml',
        lastmod: formatDate(new Date()),
        xml: buildUrlsetXml(chunk),
        count: chunk.length
      });
    }
    return chunks;
  }

  /* ===========================================
     13. DOWNLOAD
     =========================================== */
  function downloadSitemap(filename = 'sitemap.xml') {
    const xml = generateSitemap();
    const content = typeof xml === 'string' ? xml : xml.sitemaps[0].xml;

    const blob = new Blob([content], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ===========================================
     14. VALIDATION
     =========================================== */
  function validateSitemap() {
    const issues = [];
    const xml = generateSitemap();

    if (typeof xml === 'string') {
      // Check XML well-formedness
      if (!xml.startsWith('<?xml')) issues.push('Missing XML declaration');
      if (!xml.includes('<urlset')) issues.push('Missing <urlset> element');
      if (!xml.includes('</urlset>')) issues.push('Missing closing </urlset>');

      // Count URLs
      const urlCount = (xml.match(/<url>/g) || []).length;
      if (urlCount === 0) issues.push('No URLs found');

      // Check for duplicate URLs
      const urls = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
      const uniqueUrls = new Set(urls);
      if (urls.length !== uniqueUrls.size) {
        issues.push((urls.length - uniqueUrls.size) + ' duplicate URLs found');
      }

      // Check for malformed URLs
      urls.forEach(u => {
        const loc = u.replace(/<\/?loc>/g, '');
        if (!loc.startsWith('https://')) {
          issues.push('Non-HTTPS URL: ' + loc);
        }
      });

      return {
        valid: issues.length === 0,
        urlCount,
        issues
      };
    }

    return { valid: true, urlCount: 'multi-sitemap', issues };
  }

  /* ===========================================
     15. STATS
     =========================================== */
  function getStats() {
    urlEntries.length = 0;
    collectStaticPages();
    collectCategories();
    collectTools();
    collectBlogPosts();

    const seen = new Set();
    const deduped = urlEntries.filter(entry => {
      if (seen.has(entry.loc)) return false;
      seen.add(entry.loc);
      return true;
    });

    const byType = {
      static: 0,
      category: 0,
      subcategory: 0,
      tool: 0,
      blogPost: 0
    };

    deduped.forEach(entry => {
      if (entry.loc.includes('/tools/') && !entry.loc.match(/\/tools\/[^\/]+\/$/)) {
        byType.tool++;
      } else if (entry.loc.includes('/blog/posts/')) {
        byType.blogPost++;
      } else if (entry.loc.match(/\/tools\/pdf-tools\/[^\/]+\/$/)) {
        byType.subcategory++;
      } else if (entry.loc.match(/\/tools\/[^\/]+\/$/) || entry.loc.match(/\/blog\/categories\//)) {
        byType.category++;
      } else {
        byType.static++;
      }
    });

    return {
      total: deduped.length,
      byType,
      lastGenerated: new Date().toISOString()
    };
  }

  /* ===========================================
     16. RENDER ADMIN PANEL
     =========================================== */
  function renderAdminPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stats = getStats();
    const validation = validateSitemap();

    container.innerHTML = `
      <div style="font-family:system-ui;padding:24px;max-width:900px;margin:0 auto;">
        <h1 style="font-size:24px;margin-bottom:8px;">🗺 Sitemap Generator</h1>
        <p style="color:#6b7280;margin-bottom:24px;">Auto-generated from tools + blog databases</p>

        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;">
          <div style="background:#eff6ff;padding:16px;border-radius:12px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#2563eb;">${stats.total}</div>
            <div style="font-size:12px;color:#6b7280;">Total URLs</div>
          </div>
          <div style="background:#d1fae5;padding:16px;border-radius:12px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#10b981;">${stats.byType.tool}</div>
            <div style="font-size:12px;color:#6b7280;">Tools</div>
          </div>
          <div style="background:#ede9fe;padding:16px;border-radius:12px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#8b5cf6;">${stats.byType.blogPost}</div>
            <div style="font-size:12px;color:#6b7280;">Blog Posts</div>
          </div>
          <div style="background:#fef3c7;padding:16px;border-radius:12px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#f59e0b;">${stats.byType.category + stats.byType.subcategory}</div>
            <div style="font-size:12px;color:#6b7280;">Categories</div>
          </div>
        </div>

        <div style="background:${validation.valid ? '#d1fae5' : '#fee2e2'};padding:16px;border-radius:12px;margin-bottom:24px;">
          <strong>${validation.valid ? '✅ Sitemap is valid' : '❌ Issues found'}</strong>
          ${validation.issues.length ? '<ul style="margin-top:8px;">' + validation.issues.map(i => '<li>' + i + '</li>').join('') + '</ul>' : ''}
        </div>

        <button id="downloadSitemapBtn" style="background:#2563eb;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">
          ⬇ Download sitemap.xml
        </button>
      </div>
    `;

    document.getElementById('downloadSitemapBtn')?.addEventListener('click', () => {
      downloadSitemap();
    });
  }

  /* ===========================================
     17. PUBLIC API
     =========================================== */
  const SitemapGenerator = {
    generate: generateSitemap,
    download: downloadSitemap,
    validate: validateSitemap,
    getStats,
    renderAdmin: renderAdminPanel,
    addUrl,
    buildUrlset: buildUrlsetXml,
    buildIndex: buildSitemapIndex,
    getConfig: () => ({ ...CONFIG }),
    setConfig(newConfig) {
      Object.assign(CONFIG, newConfig);
    }
  };

  /* ===========================================
     18. EXPORT
     =========================================== */
  window.SitemapGenerator = SitemapGenerator;
  window.BigToolzSitemap = SitemapGenerator;

  /* ===========================================
     19. AUTO-LOG (dev)
     =========================================== */
  if (typeof console !== 'undefined') {
    console.log('%c🗺 Sitemap Generator loaded', 'color:#f59e0b;font-weight:bold;font-size:14px;');
    console.log('%c✓ API: SitemapGenerator.generate(), .download(), .validate(), .getStats()', 'color:#10b981;');
  }

})();