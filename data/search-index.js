/* ===========================================
   BigToolz - Search Index
   Version: 2.0.0
   Last Updated: 2026-01-15
   Purpose: Fast unified search for tools + blog posts
   Usage: <script src="/data/search-index.js" defer></script>
   Depends on: tools-database.js, blog-database.js
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. CONFIG
     =========================================== */
  const SEARCH_CONFIG = {
    maxResults: 10,
    minQueryLength: 1,
    maxQueryLength: 100,
    fuzzyThreshold: 0.65,
    enableFuzzy: true,
    // Scoring weights
    weights: {
      titleExact: 100,
      titleStartsWith: 80,
      titleContains: 60,
      keywordsExact: 50,
      keywordsContains: 40,
      categoryMatch: 30,
      descriptionContains: 20,
      tagMatch: 25,
      contentContains: 10
    }
  };

  /* ===========================================
     2. STOP WORDS (ignored in search)
     =========================================== */
  const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'of', 'at', 'by',
    'for', 'with', 'about', 'against', 'between', 'into', 'through',
    'during', 'before', 'after', 'above', 'below', 'from', 'up',
    'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'when', 'where',
    'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
    'just', 'should', 'now', 'this', 'that', 'these', 'those',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
    'has', 'had', 'do', 'does', 'did', 'would', 'could', 'should',
    'may', 'might', 'must', 'shall', 'it', 'its', 'as', 'to', 'my',
    'your', 'his', 'her', 'our', 'their', 'me', 'you', 'him',
    'us', 'them', 'what', 'which', 'who', 'whom', 'i'
  ]);

  /* ===========================================
     3. NORMALIZATION
     =========================================== */
  function normalize(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s\-\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(str) {
    return normalize(str)
      .split(' ')
      .filter(w => w.length >= 2 && !STOP_WORDS.has(w));
  }

  function stem(word) {
    // Simple suffix stripper (very lightweight)
    return word
      .replace(/(ing|ed|es|s)$/i, '')
      .replace(/(ly|ment|ness|tion)$/i, '');
  }

  /* ===========================================
     4. FUZZY MATCH (Levenshtein-based)
     =========================================== */
  function levenshtein(a, b) {
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function similarity(a, b) {
    if (!a || !b) return 0;
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - (levenshtein(a, b) / maxLen);
  }

  function fuzzyMatch(query, target) {
    if (!SEARCH_CONFIG.enableFuzzy) return false;
    if (!query || !target) return false;
    return similarity(query, target) >= SEARCH_CONFIG.fuzzyThreshold;
  }

  /* ===========================================
     5. IN-MEMORY INDEX
     =========================================== */
  const Index = {
    documents: [],       // All searchable items (tools + posts)
    invertedIndex: {},   // word -> [docIds]
    categoryIndex: {},   // categorySlug -> [docIds]
    typeIndex: {         // type -> [docIds]
      tool: [],
      post: [],
      category: []
    },
    docIdCounter: 0,
    isBuilt: false
  };

  /* ===========================================
     6. DOCUMENT BUILDERS
     =========================================== */

  /**
   * Build search document from a TOOL
   */
  function buildToolDoc(tool) {
    return {
      docId: ++Index.docIdCounter,
      type: 'tool',
      id: tool.id,
      slug: tool.slug,
      title: tool.name,
      description: tool.description,
      url: tool.url,
      icon: tool.icon || '🛠',
      color: tool.color || '#2563eb',
      category: tool.category,
      categoryName: tool.categoryName,
      subcategory: tool.subcategory || null,
      keywords: tool.keywords || [],
      tags: [],
      trending: !!tool.trending,
      searchText: [
        tool.name,
        tool.description,
        tool.categoryName,
        (tool.keywords || []).join(' ')
      ].join(' ').toLowerCase()
    };
  }

  /**
   * Build search document from a BLOG POST
   */
  function buildPostDoc(post) {
    return {
      docId: ++Index.docIdCounter,
      type: 'post',
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      url: post.url,
      icon: post.thumbEmoji || '📝',
      color: '#8b5cf6',
      category: post.category,
      categoryName: post.categoryName,
      subcategory: null,
      keywords: post.tags || [],
      tags: post.tags || [],
      trending: !!post.trending,
      publishedAt: post.publishedAt,
      author: post.author,
      readTime: post.readTime,
      searchText: [
        post.title,
        post.description,
        post.categoryName,
        (post.tags || []).join(' ')
      ].join(' ').toLowerCase()
    };
  }

  /**
   * Build search document from a CATEGORY
   */
  function buildCategoryDoc(cat) {
    return {
      docId: ++Index.docIdCounter,
      type: 'category',
      id: cat.slug,
      slug: cat.slug,
      title: cat.name,
      description: cat.description || '',
      url: cat.url,
      icon: cat.icon || '📁',
      color: cat.color || '#2563eb',
      category: cat.slug,
      categoryName: cat.name,
      subcategory: null,
      keywords: [cat.name, cat.slug],
      tags: [],
      trending: false,
      searchText: [
        cat.name,
        cat.description || '',
        cat.slug
      ].join(' ').toLowerCase()
    };
  }

  /* ===========================================
     7. INDEX BUILDING
     =========================================== */
  function addToInvertedIndex(word, docId) {
    if (!Index.invertedIndex[word]) Index.invertedIndex[word] = new Set();
    Index.invertedIndex[word].add(docId);
  }

  function indexDocument(doc) {
    Index.documents.push(doc);

    // Type index
    if (!Index.typeIndex[doc.type]) Index.typeIndex[doc.type] = [];
    Index.typeIndex[doc.type].push(doc.docId);

    // Category index
    if (doc.category) {
      if (!Index.categoryIndex[doc.category]) {
        Index.categoryIndex[doc.category] = [];
      }
      Index.categoryIndex[doc.category].push(doc.docId);
    }

    // Build inverted index from searchable text
    const tokens = tokenize(doc.searchText);
    const seen = new Set();
    tokens.forEach(token => {
      // Full token
      if (!seen.has(token)) {
        addToInvertedIndex(token, doc.docId);
        seen.add(token);
      }
      // Stemmed variant
      const stemmed = stem(token);
      if (stemmed && stemmed !== token && !seen.has(stemmed)) {
        addToInvertedIndex(stemmed, doc.docId);
        seen.add(stemmed);
      }
    });
  }

  function buildIndex() {
    if (Index.isBuilt) return;

    // Load tools
    if (window.TOOLS_DATABASE && Array.isArray(window.TOOLS_DATABASE)) {
      window.TOOLS_DATABASE.forEach(tool => {
        indexDocument(buildToolDoc(tool));
      });
    }

    // Load blog posts
    if (window.BLOG_DATABASE && Array.isArray(window.BLOG_DATABASE)) {
      window.BLOG_DATABASE.forEach(post => {
        indexDocument(buildPostDoc(post));
      });
    }

    // Load categories (both tools & blog)
    if (window.TOOLS_CATEGORIES && Array.isArray(window.TOOLS_CATEGORIES)) {
      window.TOOLS_CATEGORIES.forEach(cat => {
        indexDocument(buildCategoryDoc(cat));
      });
    }

    Index.isBuilt = true;

    if (typeof console !== 'undefined') {
      console.log(
        '%c🔍 Search Index built: ' + Index.documents.length + ' documents, ' +
        Object.keys(Index.invertedIndex).length + ' unique terms',
        'color:#06b6d4;font-weight:bold;'
      );
    }
  }

  /* ===========================================
     8. SCORING
     =========================================== */
  function scoreDoc(doc, query) {
    const q = query.toLowerCase();
    const qTokens = tokenize(q);
    if (qTokens.length === 0) return 0;

    const W = SEARCH_CONFIG.weights;
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const descLower = (doc.description || '').toLowerCase();
    const categoryLower = (doc.categoryName || '').toLowerCase();
    const keywords = (doc.keywords || []).map(k => k.toLowerCase());
    const tags = (doc.tags || []).map(t => t.toLowerCase());

    // === TITLE scoring ===
    if (titleLower === q) score += W.titleExact;
    else if (titleLower.startsWith(q)) score += W.titleStartsWith;
    else if (titleLower.includes(q)) score += W.titleContains;

    // === Title token match ===
    const titleTokens = tokenize(titleLower);
    qTokens.forEach(qt => {
      if (titleTokens.includes(qt)) score += 25;
      else if (titleTokens.some(tt => tt.startsWith(qt))) score += 15;
      else if (SEARCH_CONFIG.enableFuzzy &&
               titleTokens.some(tt => fuzzyMatch(qt, tt))) score += 10;
    });

    // === KEYWORDS scoring ===
    qTokens.forEach(qt => {
      keywords.forEach(kw => {
        if (kw === qt) score += W.keywordsExact;
        else if (kw.includes(qt)) score += W.keywordsContains;
        else if (SEARCH_CONFIG.enableFuzzy && fuzzyMatch(qt, kw)) {
          score += 20;
        }
      });
    });

    // === CATEGORY scoring ===
    if (categoryLower.includes(q)) score += W.categoryMatch;
    qTokens.forEach(qt => {
      if (categoryLower.includes(qt)) score += 15;
    });

    // === DESCRIPTION scoring ===
    if (descLower.includes(q)) score += W.descriptionContains;
    qTokens.forEach(qt => {
      if (descLower.includes(qt)) score += 8;
    });

    // === TAGS scoring ===
    qTokens.forEach(qt => {
      tags.forEach(tag => {
        if (tag === qt) score += W.tagMatch;
        else if (tag.includes(qt)) score += 15;
      });
    });

    // === TRENDING bonus ===
    if (doc.trending) score += 5;

    // === TYPE bonus ===
    // Tools & categories slightly preferred for "tool"-like queries
    if (doc.type === 'tool') score += 3;
    if (doc.type === 'category') score += 2;

    return score;
  }

  /* ===========================================
     9. SEARCH FUNCTIONS
     =========================================== */

  /**
   * Main search function
   * @param {string} query — search query
   * @param {object} options — { type, category, limit }
   * @returns {Array} sorted results
   */
  function search(query, options = {}) {
    if (!query || typeof query !== 'string') return [];
    const trimmed = query.trim();
    if (trimmed.length < SEARCH_CONFIG.minQueryLength) return [];
    if (trimmed.length > SEARCH_CONFIG.maxQueryLength) {
      trimmed = trimmed.slice(0, SEARCH_CONFIG.maxQueryLength);
    }

    buildIndex();

    const limit = options.limit || SEARCH_CONFIG.maxResults;
    const typeFilter = options.type || null;      // 'tool' | 'post' | 'category' | null
    const catFilter = options.category || null;   // category slug

    // Candidate docIds
    let candidateIds = null;

    // Use inverted index for fast candidate filtering
    const qTokens = tokenize(trimmed);
    if (qTokens.length > 0) {
      const matchedIds = new Set();
      qTokens.forEach(qt => {
        // Exact match
        if (Index.invertedIndex[qt]) {
          Index.invertedIndex[qt].forEach(id => matchedIds.add(id));
        }
        // Prefix match
        Object.keys(Index.invertedIndex).forEach(indexedWord => {
          if (indexedWord.startsWith(qt) && indexedWord !== qt) {
            Index.invertedIndex[indexedWord].forEach(id => matchedIds.add(id));
          }
        });
        // Fuzzy (only if not enough candidates)
        if (SEARCH_CONFIG.enableFuzzy && matchedIds.size < 20) {
          Object.keys(Index.invertedIndex).forEach(indexedWord => {
            if (fuzzyMatch(qt, indexedWord)) {
              Index.invertedIndex[indexedWord].forEach(id => matchedIds.add(id));
            }
          });
        }
      });
      candidateIds = matchedIds;
    }

    // Filter docs
    let docs = Index.documents;
    if (candidateIds && candidateIds.size > 0) {
      docs = docs.filter(d => candidateIds.has(d.docId));
    } else if (candidateIds && candidateIds.size === 0) {
      // No index matches — still run full-text scoring for safety
      docs = Index.documents;
    }

    if (typeFilter) {
      docs = docs.filter(d => d.type === typeFilter);
    }
    if (catFilter) {
      docs = docs.filter(d => d.category === catFilter);
    }

    // Score & sort
    const scored = docs
      .map(doc => ({ doc, score: scoreDoc(doc, trimmed) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map(item => ({
      ...item.doc,
      _score: item.score
    }));
  }

  /**
   * Autocomplete / suggest — quick top N
   */
  function suggest(query, limit = 6) {
    return search(query, { limit });
  }

  /**
   * Search only tools
   */
  function searchTools(query, limit = 10) {
    return search(query, { type: 'tool', limit });
  }

  /**
   * Search only blog posts
   */
  function searchPosts(query, limit = 10) {
    return search(query, { type: 'post', limit });
  }

  /**
   * Search only categories
   */
  function searchCategories(query, limit = 10) {
    return search(query, { type: 'category', limit });
  }

  /**
   * Search within a specific category
   */
  function searchInCategory(query, categorySlug, limit = 10) {
    return search(query, { category: categorySlug, limit });
  }

  /* ===========================================
     10. HIGHLIGHTING
     =========================================== */

  /**
   * Highlight matched terms in text
   * @param {string} text
   * @param {string} query
   * @returns {string} HTML with <mark> tags
   */
  function highlight(text, query) {
    if (!text || !query) return escapeHtml(text || '');

    const qTokens = tokenize(query);
    if (qTokens.length === 0) return escapeHtml(text);

    let result = escapeHtml(text);

    qTokens.forEach(token => {
      const regex = new RegExp(`(${escapeRegex(token)})`, 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    });

    return result;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* ===========================================
     11. STATISTICS
     =========================================== */
  function getStats() {
    buildIndex();
    return {
      totalDocuments: Index.documents.length,
      tools: Index.typeIndex.tool ? Index.typeIndex.tool.length : 0,
      posts: Index.typeIndex.post ? Index.typeIndex.post.length : 0,
      categories: Index.typeIndex.category ? Index.typeIndex.category.length : 0,
      uniqueTerms: Object.keys(Index.invertedIndex).length,
      isBuilt: Index.isBuilt
    };
  }

  /* ===========================================
     12. REBUILD
     =========================================== */
  function rebuild() {
    Index.documents = [];
    Index.invertedIndex = {};
    Index.categoryIndex = {};
    Index.typeIndex = { tool: [], post: [], category: [] };
    Index.docIdCounter = 0;
    Index.isBuilt = false;
    buildIndex();
  }

  /* ===========================================
     13. PUBLIC API
     =========================================== */
  const SearchIndex = {
    // Core
    build: buildIndex,
    rebuild,
    search,
    suggest,

    // Filtered search
    searchTools,
    searchPosts,
    searchCategories,
    searchInCategory,

    // Highlight
    highlight,

    // Stats
    getStats,

    // Utils
    normalize,
    tokenize,
    similarity,

    // Config
    getConfig() {
      return { ...SEARCH_CONFIG };
    },

    // Raw index (for debugging)
    getRawIndex() {
      buildIndex();
      return {
        documents: Index.documents,
        invertedIndex: Index.invertedIndex,
        categoryIndex: Index.categoryIndex,
        typeIndex: Index.typeIndex
      };
    }
  };

  /* ===========================================
     14. EXPORT
     =========================================== */
  window.SearchIndex = SearchIndex;
  window.BigToolzSearchIndex = SearchIndex;

  /* ===========================================
     15. AUTO-BUILD (when dependencies load)
     =========================================== */
  // Defer build until DOM ready to ensure dependencies loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Only build if data sources exist
      if (window.TOOLS_DATABASE || window.BLOG_DATABASE) {
        buildIndex();
      }
    });
  } else {
    if (window.TOOLS_DATABASE || window.BLOG_DATABASE) {
      buildIndex();
    }
  }

})();