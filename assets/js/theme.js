/* ===========================================
   BigToolz - Theme Controller
   Version: 2.0.0
   Last updated: 2026-01-15
   Purpose: Advanced dark/light mode with auto & scheduled switching
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. CONFIG
     =========================================== */
  const CONFIG = {
    storageKey: 'bigtoolz_theme',           // 'light' | 'dark' | 'auto'
    attribute: 'data-theme',                // HTML attribute
    transitionClass: 'theme-transition',    // for smooth switch
    keyboardShortcut: { key: 'd', ctrl: true, shift: true },
    enableScheduled: false,                 // sunrise/sunset auto
    scheduled: {
      darkStart: 19,   // 7 PM
      darkEnd: 7       // 7 AM
    }
  };

  /* ===========================================
     2. STATE
     =========================================== */
  const state = {
    mode: 'auto',      // 'light' | 'dark' | 'auto'
    resolved: 'light'  // actual applied theme
  };

  /* ===========================================
     3. HELPERS
     =========================================== */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(CONFIG.storageKey);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(mode) {
    try {
      if (mode === 'auto') {
        localStorage.removeItem(CONFIG.storageKey);
      } else {
        localStorage.setItem(CONFIG.storageKey, mode);
      }
    } catch (e) {}
  }

  function getScheduledTheme() {
    if (!CONFIG.enableScheduled) return null;
    const hour = new Date().getHours();
    const { darkStart, darkEnd } = CONFIG.scheduled;
    // Dark hours: darkStart to midnight, midnight to darkEnd
    const isDark = hour >= darkStart || hour < darkEnd;
    return isDark ? 'dark' : 'light';
  }

  /* ===========================================
     4. RESOLVE ACTUAL THEME
     =========================================== */
  function resolveTheme(mode) {
    if (mode === 'light' || mode === 'dark') return mode;

    // Auto mode — priority: scheduled > system
    const scheduled = getScheduledTheme();
    if (scheduled) return scheduled;

    return getSystemTheme();
  }

  /* ===========================================
     5. APPLY THEME
     =========================================== */
  function applyTheme(mode, opts = {}) {
    const resolved = resolveTheme(mode);
    state.mode = mode;
    state.resolved = resolved;

    const html = document.documentElement;

    // Add transition class briefly for smooth switch
    if (!opts.instant) {
      html.classList.add(CONFIG.transitionClass);
      setTimeout(() => html.classList.remove(CONFIG.transitionClass), 300);
    }

    // Set attribute
    if (resolved === 'dark') {
      html.setAttribute(CONFIG.attribute, 'dark');
    } else if (resolved === 'light') {
      html.setAttribute(CONFIG.attribute, 'light');
    } else {
      html.removeAttribute(CONFIG.attribute);
    }

    // Update meta theme-color (mobile browser bar)
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', resolved === 'dark' ? '#0f172a' : '#2563eb');
    }

    // Update toggle button icons/aria
    updateToggleButtons();

    // Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { mode, resolved, timestamp: Date.now() }
    }));

    // Analytics event
    if (window.gtag) {
      window.gtag('event', 'theme_change', {
        theme_mode: mode,
        theme_resolved: resolved
      });
    }
  }

  /* ===========================================
     6. TOGGLE
     =========================================== */
  function toggleTheme() {
    const current = state.mode;
    let next;

    // Cycle: auto → dark → light → auto
    // OR simple flip if user hasn't set auto
    if (current === 'auto') {
      next = getSystemTheme() === 'dark' ? 'light' : 'dark';
    } else if (current === 'dark') {
      next = 'light';
    } else {
      next = 'dark';
    }

    storeTheme(next);
    applyTheme(next);
  }

  /* ===========================================
     7. SET MODE (explicit)
     =========================================== */
  function setMode(mode) {
    if (!['light', 'dark', 'auto'].includes(mode)) return;
    storeTheme(mode);
    applyTheme(mode);
  }

  /* ===========================================
     8. UPDATE TOGGLE BUTTONS
     =========================================== */
  function updateToggleButtons() {
    const btns = $$('.theme-btn');

    btns.forEach(btn => {
      const { mode, resolved } = state;

      // Icon swap — show sun when dark, moon when light
      const moon = btn.querySelector('.icon-moon');
      const sun = btn.querySelector('.icon-sun');

      if (moon && sun) {
        if (resolved === 'dark') {
          moon.style.display = 'none';
          sun.style.display = '';
        } else {
          moon.style.display = '';
          sun.style.display = 'none';
        }
      }

      // Update aria + title
      const labels = {
        auto: 'Theme: Auto (system)',
        dark: 'Theme: Dark',
        light: 'Theme: Light'
      };
      const next = resolved === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', `${labels[mode]}. Click to switch to ${next}.`);
      btn.setAttribute('title', labels[mode]);
      btn.setAttribute('data-theme-mode', mode);
    });
  }

  /* ===========================================
     9. INIT (No-flash on load)
     =========================================== */
  function initInstant() {
    const stored = getStoredTheme();
    const mode = stored || 'auto';
    const resolved = resolveTheme(mode);

    // Apply instantly (no transition on first paint)
    const html = document.documentElement;
    if (resolved === 'dark') {
      html.setAttribute(CONFIG.attribute, 'dark');
    } else if (resolved === 'light') {
      html.setAttribute(CONFIG.attribute, 'light');
    }

    state.mode = mode;
    state.resolved = resolved;
  }

  /* ===========================================
     10. LISTENERS
     =========================================== */
  function initListeners() {
    // System preference change
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (state.mode === 'auto') {
          applyTheme('auto');
        }
      });

    // Storage sync (other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === CONFIG.storageKey) {
        const newMode = e.newValue || 'auto';
        applyTheme(newMode);
      }
    });

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      const sc = CONFIG.keyboardShortcut;
      const ctrlMatch = sc.ctrl ? (e.ctrlKey || e.metaKey) : true;
      const shiftMatch = sc.shift ? e.shiftKey : true;

      if (e.key.toLowerCase() === sc.key && ctrlMatch && shiftMatch) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Scheduled check every 5 min
    if (CONFIG.enableScheduled) {
      setInterval(() => {
        if (state.mode === 'auto') {
          applyTheme('auto', { instant: true });
        }
      }, 5 * 60 * 1000);
    }

    // Attach toggle handlers
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-btn');
      if (!btn) return;
      e.preventDefault();
      toggleTheme();
    });
  }

  /* ===========================================
     11. INIT
     =========================================== */
  function init() {
    // Already applied in initInstant() — set state and listeners
    const stored = getStoredTheme();
    const mode = stored || 'auto';
    applyTheme(mode, { instant: true });
    initListeners();
  }

  // Apply instantly (before DOM ready) to prevent flash
  initInstant();

  // Full init after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ===========================================
     12. PUBLIC API
     =========================================== */
  window.BigToolzTheme = {
    get mode() { return state.mode; },
    get resolved() { return state.resolved; },
    toggle: toggleTheme,
    set: setMode,
    auto: () => setMode('auto'),
    dark: () => setMode('dark'),
    light: () => setMode('light'),
    onChange: (callback) => {
      window.addEventListener('themechange', (e) => callback(e.detail));
    }
  };

})();