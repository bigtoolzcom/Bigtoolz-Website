/* ===========================================
   BigToolz - Live Search
   Version: 1.0.0
   Last updated: 2026-01-15
   Purpose: Instant search across 300 tools
   =========================================== */

'use strict';

(function () {
  /* ===========================================
     1. CONFIG
     =========================================== */
  const CONFIG = {
    maxResults: 10,
    minChars: 1,
    debounceMs: 150,
    storageKey: 'bigtoolz_recent_searches',
    maxRecent: 5,
    searchUrl: '/search?q='
  };

  /* ===========================================
     2. STATE
     =========================================== */
  const state = {
    tools: [],           // loaded from tools-data.js
    results: [],         // current results
    selectedIndex: -1,   // keyboard nav
    query: '',
    category: 'all',
    recent: [],
    isOpen: false,
    isLoading: false
  };

  /* ===========================================
     3. DOM REFS
     =========================================== */
  let elements = {};

  function initElements() {
    elements = {
      // Inputs (multiple possible)
      inputs: document.querySelectorAll(
        '.hero-search input, .mobile-search input, .search-overlay input, .search-box input, [data-search-input]'
      ),
      // Results containers
      resultContainers: document.querySelectorAll('[data-search-results], .search-results'),
      // Overlay
      overlay: document.querySelector('.search-overlay'),
      overlayInput: document.querySelector('.search-overlay input')
    };
  }

  /* ===========================================
     4. UTILITIES
     =========================================== */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
  }

  /* ===========================================
     5. LOAD TOOLS DATA
     =========================================== */
  function loadToolsData() {
    // Prefer window.TOOLS_DATA (from tools-data.js)
    if (window.TOOLS_DATA && Array.isArray(window.TOOLS_DATA)) {
      state.tools = window.TOOLS_DATA;
      return Promise.resolve();
    }

    // Fallback: try to fetch
    return fetch('/data/tools-database.json')
      .then(res => res.json())
      .then(data => {
        state.tools = data;
      })
      .catch(() => {
        // Silent fail — search will just show "no results"
        state.tools = [];
      });
  }

  /* ===========================================
     6. SEARCH ENGINE
     =========================================== */
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // remove accents
      .trim();
  }

  /**
   * Simple fuzzy match — checks if query chars appear in order
   * Returns score (higher = better match)
   */
  function fuzzyScore(text, query) {
    text = normalize(text);
    query = normalize(query);

    if (!query) return 0;
    if (text === query) return 100;
    if (text.startsWith(query)) return 80;
    if (text.includes(query)) return 60;

    // Fuzzy: chars in order
    let ti = 0, qi = 0, matches = 0;
    while (ti < text.length && qi < query.length) {
      if (text[ti] === query[qi]) {
        matches++;
        qi++;
      }
      ti++;
    }

    if (qi === query.length) {
      return 30 + (matches / text.length) * 20;
    }

    return 0;
  }

  function searchTools(query, category = 'all') {
    if (!query || query.length < CONFIG.minChars) return [];

    const q = normalize(query);
    const results = [];

    state.tools.forEach(tool => {
      // Category filter
      if (category !== 'all' && tool.category !== category) return;

      // Score against multiple fields
      const nameScore = fuzzyScore(tool.name || '', q) * 1.5;
      const keywordScore = (tool.keywords || [])
        .map(k => fuzzyScore(k, q))
        .reduce((max, s) => Math.max(max, s), 0) * 1.2;
      const categoryScore = fuzzyScore(tool.categoryName || '', q);
      const descScore = fuzzyScore(tool.description || '', q) * 0.7;

      const score = nameScore + keywordScore + categoryScore + descScore;

      if (score > 0) {
        results.push({ ...tool, _score: score });
      }
    });

    // Sort by score desc
    results.sort((a, b) => b._score - a._score);

    return results.slice(0, CONFIG.maxResults);
  }

  /* ===========================================
     7. RECENT SEARCHES (localStorage)
     =========================================== */
  function loadRecent() {
    try {
      state.recent = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
    } catch (e) {
      state.recent = [];
    }
  }

  function saveRecent(query) {
    if (!query || query.length < 2) return;
    const q = query.trim().toLowerCase();
    state.recent = state.recent.filter(item => item.toLowerCase() !== q);
    state.recent.unshift(query.trim());
    state.recent = state.recent.slice(0, CONFIG.maxRecent);
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state.recent));
    } catch (e) {}
  }

  function clearRecent() {
    state.recent = [];
    try {
      localStorage.removeItem(CONFIG.storageKey);
    } catch (e) {}
  }

  /* ===========================================
     8. RENDER — DROPDOWN RESULTS
     =========================================== */
  function renderResults(container, query, results) {
    if (!container) return;

    // No query → show recent or trending
    if (!query || query.length < CONFIG.minChars) {
      renderDefault(container);
      return;
    }

    // No results
    if (!results.length) {
      container.innerHTML = `
        <div class="search-no-results">
          <div class="search-no-results-icon">🔍</div>
          <div class="search-no-results-title">No tools found for "${escapeHtml(query)}"</div>
          <div class="search-no-results-desc">Try different keywords or browse all categories.</div>
          <a href="/tools/" class="search-browse-btn">Browse All Tools →</a>
        </div>
      `;
      container.classList.add('open');
      return;
    }

    // Render results
    let html = '<div class="search-results-list">';

    results.forEach((tool, i) => {
      html += `
        <a href="${tool.url}" 
           class="search-result-item ${i === state.selectedIndex ? 'active' : ''}"
           data-index="${i}"
           role="option"
           aria-selected="${i === state.selectedIndex}">
          <div class="search-result-icon" style="background:${tool.color || '#2563eb'};">
            ${tool.icon || '🛠'}
          </div>
          <div class="search-result-info">
            <div class="search-result-name">${highlight(tool.name, query)}</div>
            <div class="search-result-desc">${highlight(tool.description || '', query)}</div>
          </div>
          <div class="search-result-category">${escapeHtml(tool.categoryName || '')}</div>
        </a>
      `;
    });

    html += '</div>';

    // View all link
    html += `
      <a href="${CONFIG.searchUrl}${encodeURIComponent(query)}" class="search-view-all">
        View all results for "${escapeHtml(query)}" →
      </a>
    `;

    container.innerHTML = html;
    container.classList.add('open');
  }

  function renderDefault(container) {
    let html = '';

    // Recent searches
    if (state.recent.length) {
      html += `
        <div class="search-section">
          <div class="search-section-header">
            <span class="search-section-title">Recent Searches</span>
            <button class="search-clear-btn" data-clear-recent>Clear</button>
          </div>
          <div class="search-recent-list">
            ${state.recent.map(r => `
              <button class="search-recent-item" data-recent="${escapeHtml(r)}">
                <span>🕐</span> ${escapeHtml(r)}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Trending tools (top 5 from data, or fallback)
    const trending = state.tools.filter(t => t.trending || t.popular).slice(0, 5);
    const fallback = state.tools.slice(0, 5);
    const trendingList = trending.length ? trending : fallback;

    if (trendingList.length) {
      html += `
        <div class="search-section">
          <div class="search-section-header">
            <span class="search-section-title">🔥 Trending Tools</span>
          </div>
          <div class="search-results-list">
            ${trendingList.map(tool => `
              <a href="${tool.url}" class="search-result-item">
                <div class="search-result-icon" style="background:${tool.color || '#2563eb'};">
                  ${tool.icon || '🛠'}
                </div>
                <div class="search-result-info">
                  <div class="search-result-name">${escapeHtml(tool.name)}</div>
                  <div class="search-result-desc">${escapeHtml(tool.description || '')}</div>
                </div>
                <div class="search-result-category">${escapeHtml(tool.categoryName || '')}</div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Fallback: no data at all
    if (!html) {
      html = `
        <div class="search-empty">
          <div class="search-empty-icon">🔍</div>
          <div class="search-empty-title">Search 300+ free tools</div>
          <div class="search-empty-desc">Try "image compressor", "PDF merge", "word counter", etc.</div>
        </div>
      `;
    }

    container.innerHTML = html;
    container.classList.add('open');
  }

  /* ===========================================
     9. CREATE DROPDOWN CONTAINER
     =========================================== */
  function ensureDropdown(input) {
    // Find parent search wrapper
    const wrapper = input.closest('.hero-search, .mobile-search, .search-overlay-box, .search-box')
      || input.parentElement;

    if (!wrapper) return null;

    // Check if dropdown already exists
    let dropdown = wrapper.querySelector('[data-search-results]');
    if (dropdown) return dropdown;

    // Create dropdown
    dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.setAttribute('data-search-results', '');
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', 'Search results');

    // Position relative on wrapper
    if (getComputedStyle(wrapper).position === 'static') {
      wrapper.style.position = 'relative';
    }

    wrapper.appendChild(dropdown);
    return dropdown;
  }

  /* ===========================================
     10. ATTACH TO INPUT
     =========================================== */
  function attachToInput(input) {
    if (input.dataset.searchAttached) return;
    input.dataset.searchAttached = 'true';

    const dropdown = ensureDropdown(input);
    if (!dropdown) return;

    let currentQuery = '';

    const performSearch = debounce((q) => {
      currentQuery = q;
      state.query = q;
      state.selectedIndex = -1;

      if (!q || q.length < CONFIG.minChars) {
        renderDefault(dropdown);
        return;
      }

      state.isLoading = true;
      const results = searchTools(q, state.category);
      state.results = results;
      state.isLoading = false;

      renderResults(dropdown, q, results);
    }, CONFIG.debounceMs);

    // Input event
    input.addEventListener('input', (e) => {
      performSearch(e.target.value.trim());
    });

    // Focus
    input.addEventListener('focus', () => {
      state.isOpen = true;
      if (!input.value.trim()) {
        renderDefault(dropdown);
      } else {
        performSearch(input.value.trim());
      }
    });

    // Blur (delayed to allow clicks)
    input.addEventListener('blur', () => {
      setTimeout(() => {
        if (!dropdown.matches(':hover')) {
          dropdown.classList.remove('open');
          state.isOpen = false;
          state.selectedIndex = -1;
        }
      }, 200);
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.search-result-item');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!state.isOpen) {
          input.focus();
          renderDefault(dropdown);
          return;
        }
        state.selectedIndex = Math.min(state.selectedIndex + 1, items.length - 1);
        updateActive(dropdown, items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.selectedIndex = Math.max(state.selectedIndex - 1, -1);
        updateActive(dropdown, items);
      } else if (e.key === 'Enter') {
        if (state.selectedIndex >= 0 && items[state.selectedIndex]) {
          e.preventDefault();
          items[state.selectedIndex].click();
        } else if (currentQuery) {
          // Submit form or redirect
          e.preventDefault();
          saveRecent(currentQuery);
          window.location.href = CONFIG.searchUrl + encodeURIComponent(currentQuery);
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('open');
        state.selectedIndex = -1;
        input.blur();
      }
    });
  }

  function updateActive(dropdown, items) {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === state.selectedIndex);
      item.setAttribute('aria-selected', i === state.selectedIndex);
    });

    // Scroll into view
    const active = items[state.selectedIndex];
    if (active) {
      active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /* ===========================================
     11. GLOBAL DROPDOWN EVENTS
     =========================================== */
  function initGlobalEvents() {
    // Click on recent item
    document.addEventListener('click', (e) => {
      const recentBtn = e.target.closest('[data-recent]');
      if (recentBtn) {
        const value = recentBtn.dataset.recent;
        const input = recentBtn.closest('.search-dropdown')?.parentElement?.querySelector('input');
        if (input) {
          input.value = value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        }
      }

      // Clear recent
      const clearBtn = e.target.closest('[data-clear-recent]');
      if (clearBtn) {
        clearRecent();
        const dropdown = clearBtn.closest('.search-dropdown');
        if (dropdown) renderDefault(dropdown);
      }

      // Click on result — save to recent
      const resultItem = e.target.closest('.search-result-item');
      if (resultItem) {
        const query = state.query;
        if (query) saveRecent(query);
      }
    });

    // Click outside closes dropdowns
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.hero-search, .mobile-search, .search-overlay-box, .search-box, .search-dropdown')) {
        document.querySelectorAll('.search-dropdown.open').forEach(d => {
          d.classList.remove('open');
          state.selectedIndex = -1;
        });
      }
    });
  }

  /* ===========================================
     12. INIT
     =========================================== */
  function init() {
    initElements();
    loadRecent();
    initGlobalEvents();

    loadToolsData().then(() => {
      elements.inputs.forEach(input => attachToInput(input));
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ===========================================
     13. GLOBAL API
     =========================================== */
  window.BigToolzSearch = {
    search: searchTools,
    getState: () => ({ ...state }),
    reload: () => loadToolsData().then(() => {
      elements.inputs.forEach(input => attachToInput(input));
    })
  };
})();