/* ===========================================
   BigToolz - Analytics Tracking
   Version: 1.0.0
   Last updated: 2026-01-15
   Purpose: GA4 tracking + Core Web Vitals + auto events
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. CONFIG
     =========================================== */
  const CONFIG = {
    measurementId: 'G-XXXXXXXXXX',      // ⚠️ Replace with your GA4 ID
    debugMode: false,                   // true in dev, false in prod
    trackOutbound: true,
    trackDownloads: true,
    trackScrollDepth: true,
    trackTimeOnPage: true,
    trackForms: true,
    trackToolUsage: true,
    trackSearch: true,
    trackErrors: true,
    trackWebVitals: true,
    respectDNT: false,                  // honor Do Not Track
    sampleRate: 100,                    // 100 = all users
    engagementTime: 15,                 // seconds for "engaged" event
    scrollThresholds: [25, 50, 75, 100]
  };

  /* ===========================================
     2. STATE
     =========================================== */
  const state = {
    initialized: false,
    startTime: Date.now(),
    maxScroll: 0,
    scrollFired: new Set(),
    engagementFired: false,
    pageViewSent: false
  };

  /* ===========================================
     3. DO NOT TRACK CHECK
     =========================================== */
  function shouldSkipTracking() {
    if (!CONFIG.respectDNT) return false;
    return (
      navigator.doNotTrack === '1' ||
      window.doNotTrack === '1' ||
      navigator.msDoNotTrack === '1'
    );
  }

  /* ===========================================
     4. LOAD GA4 SCRIPT
     =========================================== */
  function loadGAScript() {
    if (document.querySelector(`script[src*="${CONFIG.measurementId}"]`)) {
      return; // already loaded
    }

    // gtag dataLayer setup
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', CONFIG.measurementId, {
      send_page_view: false,     // we'll send manually
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
      debug_mode: CONFIG.debugMode,
      sample_rate: CONFIG.sampleRate
    });

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.measurementId}`;
    document.head.appendChild(script);

    // Preconnect (faster)
    ['https://www.google-analytics.com', 'https://www.googletagmanager.com'].forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      document.head.appendChild(link);
    });
  }

  /* ===========================================
     5. CORE EVENT TRACKER
     =========================================== */
  function track(eventName, params = {}) {
    if (shouldSkipTracking()) return;
    if (typeof window.gtag !== 'function') return;

    // Redact PII
    params = redactPII(params);

    // Add defaults
    const enriched = {
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_title: document.title,
      ...params
    };

    window.gtag('event', eventName, enriched);

    if (CONFIG.debugMode) {
      console.log('[GA4]', eventName, enriched);
    }
  }

  /* ===========================================
     6. PII REDACTION
     =========================================== */
  function redactPII(obj) {
    const piiKeys = ['email', 'phone', 'password', 'name', 'address', 'ssn', 'credit_card'];
    const out = {};

    Object.keys(obj).forEach(key => {
      const lowerKey = key.toLowerCase();
      const isPII = piiKeys.some(p => lowerKey.includes(p));

      if (isPII && typeof obj[key] === 'string') {
        out[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        out[key] = redactPII(obj[key]);
      } else if (typeof obj[key] === 'string' && obj[key].length > 100) {
        out[key] = obj[key].slice(0, 100); // truncate long strings
      } else {
        out[key] = obj[key];
      }
    });

    return out;
  }

  /* ===========================================
     7. PAGE VIEW
     =========================================== */
  function trackPageView(overrides = {}) {
    if (state.pageViewSent && !overrides.force) return;

    track('page_view', {
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
      page_referrer: document.referrer || 'direct',
      page_type: getPageType(),
      ...overrides
    });

    state.pageViewSent = true;
  }

  /**
   * Determine page type from URL
   */
  function getPageType() {
    const path = window.location.pathname;

    if (path === '/' || path === '/index.html') return 'homepage';
    if (path.startsWith('/tools/') && path.split('/').filter(Boolean).length === 2) return 'category';
    if (path.startsWith('/tools/')) return 'tool';
    if (path.startsWith('/blog/') && path.includes('/posts/')) return 'blog_post';
    if (path.startsWith('/blog/')) return 'blog';
    if (path.includes('about')) return 'about';
    if (path.includes('contact')) return 'contact';
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('terms')) return 'terms';
    if (path.includes('disclaimer')) return 'disclaimer';
    if (path.includes('404')) return 'error';

    return 'other';
  }

  /* ===========================================
     8. TOOL USAGE TRACKING
     =========================================== */
  function trackToolUsage(toolName, action = 'use', metadata = {}) {
    track('tool_' + action, {
      tool_name: toolName,
      tool_category: getToolCategory(),
      tool_slug: getToolSlug(),
      ...metadata
    });
  }

  function getToolSlug() {
    const match = window.location.pathname.match(/\/tools\/[^\/]+\/([^\/]+)\/?$/);
    return match ? match[1] : null;
  }

  function getToolCategory() {
    const match = window.location.pathname.match(/\/tools\/([^\/]+)\//);
    return match ? match[1] : null;
  }

  /* ===========================================
     9. OUTBOUND LINK TRACKING
     =========================================== */
  function initOutboundTracking() {
    if (!CONFIG.trackOutbound) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || !link.href) return;

      try {
        const url = new URL(link.href);
        const isExternal = url.hostname !== window.location.hostname;

        if (!isExternal) return;
        if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) return;

        track('click', {
          link_url: link.href,
          link_domain: url.hostname,
          link_text: (link.innerText || link.textContent || '').trim().slice(0, 100),
          outbound: true
        });
      } catch (err) {}
    });
  }

  /* ===========================================
     10. DOWNLOAD TRACKING
     =========================================== */
  function initDownloadTracking() {
    if (!CONFIG.trackDownloads) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[download], [data-download]');
      if (!link) return;

      const filename = link.getAttribute('download')
        || link.dataset.downloadFilename
        || 'unknown';

      track('file_download', {
        file_name: filename,
        link_url: link.href || link.dataset.downloadUrl || ''
      });
    });
  }

  /* ===========================================
     11. SCROLL DEPTH TRACKING
     =========================================== */
  function initScrollTracking() {
    if (!CONFIG.trackScrollDepth) return;

    const onScroll = throttle(() => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollPercent = Math.min(100, Math.round((window.scrollY / docHeight) * 100));
      state.maxScroll = Math.max(state.maxScroll, scrollPercent);

      CONFIG.scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !state.scrollFired.has(threshold)) {
          state.scrollFired.add(threshold);
          track('scroll', {
            percent_scrolled: threshold,
            page_type: getPageType()
          });
        }
      });
    }, 500);

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ===========================================
     12. ENGAGEMENT TIME TRACKING
     =========================================== */
  function initEngagementTracking() {
    if (!CONFIG.trackTimeOnPage) return;

    let activeTime = 0;
    let lastActive = Date.now();
    let isActive = true;

    // Track visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        activeTime += Date.now() - lastActive;
        isActive = false;
      } else {
        lastActive = Date.now();
        isActive = true;
      }
    });

    // Fire engaged event after X seconds
    const engagementTimer = setInterval(() => {
      if (isActive) {
        activeTime += Date.now() - lastActive;
        lastActive = Date.now();
      }

      const seconds = Math.round(activeTime / 1000);

      if (!state.engagementFired && seconds >= CONFIG.engagementTime) {
        state.engagementFired = true;
        track('user_engagement', {
          engagement_time_msec: activeTime,
          page_type: getPageType()
        });
      }
    }, 5000);

    // Send final event on page leave
    window.addEventListener('beforeunload', () => {
      if (isActive) activeTime += Date.now() - lastActive;

      // Use beacon for reliability
      if (navigator.sendBeacon && typeof window.gtag === 'function') {
        // gtag handles this automatically
      }

      track('page_leave', {
        time_on_page_sec: Math.round(activeTime / 1000),
        max_scroll_percent: state.maxScroll,
        page_type: getPageType()
      });
    });

    // Cleanup
    window.addEventListener('unload', () => clearInterval(engagementTimer));
  }

  /* ===========================================
     13. SEARCH TRACKING
     =========================================== */
  function initSearchTracking() {
    if (!CONFIG.trackSearch) return;

    // Listen for custom search events from search.js
    window.addEventListener('search', (e) => {
      track('search', {
        search_term: e.detail?.query || '',
        results_count: e.detail?.results || 0,
        search_type: e.detail?.type || 'live'
      });
    });

    // Also listen for search form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (!form.matches('form[role="search"], form.search-form, .hero-search')) return;

      const input = form.querySelector('input[type="search"], input[name="q"]');
      if (!input) return;

      track('search', {
        search_term: input.value.trim(),
        search_type: 'form'
      });
    });
  }

  /* ===========================================
     14. FORM SUBMISSION TRACKING
     =========================================== */
  function initFormTracking() {
    if (!CONFIG.trackForms) return;

    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (!form.matches('form[data-track]')) return;

      const formName = form.dataset.track || form.id || 'unknown_form';

      track('form_submit', {
        form_name: formName,
        form_type: form.dataset.formType || 'general',
        page_type: getPageType()
      });
    });

    // Also track form start (first input focus)
    document.addEventListener('focusin', (e) => {
      const form = e.target.closest('form[data-track]');
      if (!form || form.dataset.startTracked) return;

      form.dataset.startTracked = 'true';

      track('form_start', {
        form_name: form.dataset.track || form.id || 'unknown',
        form_type: form.dataset.formType || 'general'
      });
    });
  }

  /* ===========================================
     15. CORE WEB VITALS
     =========================================== */
  function initWebVitals() {
    if (!CONFIG.trackWebVitals) return;

    // Dynamic import web-vitals library
    const loadWebVitals = () => {
      const script = document.createElement('script');
      script.type = 'module';
      script.textContent = `
        import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'https://unpkg.com/web-vitals@4/dist/web-vitals.attribution.js?module';

        function report(name, value, rating, attribution) {
          if (window.gtag) {
            window.gtag('event', name, {
              value: Math.round(name === 'CLS' ? value * 1000 : value),
              metric_rating: rating,
              metric_id: attribution?.metricId || '',
              non_interaction: true,
              ...(attribution?.element && { element: attribution.element }),
              ...(attribution?.url && { attribution_url: attribution.url })
            });
          }
          if (window.console && location.hostname === 'localhost') {
            console.log('[Web Vital]', name, value, rating);
          }
        }

        onLCP(({ name, value, rating, attribution }) => report(name, value, rating, attribution));
        onINP(({ name, value, rating, attribution }) => report(name, value, rating, attribution));
        onCLS(({ name, value, rating, attribution }) => report(name, value, rating, attribution));
        onFCP(({ name, value, rating }) => report(name, value, rating));
        onTTFB(({ name, value, rating }) => report(name, value, rating));
      `;
      document.head.appendChild(script);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadWebVitals, { timeout: 4000 });
    } else {
      setTimeout(loadWebVitals, 3000);
    }
  }

  /* ===========================================
     16. ERROR TRACKING
     =========================================== */
  function initErrorTracking() {
    if (!CONFIG.trackErrors) return;

    window.addEventListener('error', (e) => {
      // Skip cross-origin script errors
      if (!e.filename || e.message === 'Script error.') return;

      track('exception', {
        description: e.message,
        fatal: false,
        file: e.filename,
        line: e.lineno,
        column: e.colno
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      track('exception', {
        description: String(e.reason || 'Unhandled promise rejection'),
        fatal: false,
        type: 'unhandled_rejection'
      });
    });
  }

  /* ===========================================
     17. SPA / SMOOTH NAVIGATION
     =========================================== */
  function initSPATracking() {
    // Listen for hashchange
    window.addEventListener('hashchange', () => {
      trackPageView({ force: true });
    });

    // Listen for pushState/replaceState
    let lastURL = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastURL) {
        lastURL = url;
        trackPageView({ force: true });
      }
    }).observe(document, { subtree: true, childList: true });
  }

  /* ===========================================
     18. ADSENSE CLICK TRACKING
     =========================================== */
  function initAdTracking() {
    document.addEventListener('click', (e) => {
      const ad = e.target.closest('ins.adsbygoogle, .ad-space, [data-ad]');
      if (!ad) return;

      track('ad_click', {
        ad_unit: ad.dataset.adSlot || ad.dataset.ad || 'unknown',
        ad_format: ad.dataset.adFormat || 'display',
        page_type: getPageType()
      });
    });
  }

  /* ===========================================
     19. CONSENT MODE V2
     =========================================== */
  function initConsentMode() {
    // Default: deny until user consents
    window.gtag('consent', 'default', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied',
      'functionality_storage': 'granted',
      'security_storage': 'granted',
      'wait_for_update': 500
    });

    // Check saved consent
    try {
      const consent = JSON.parse(localStorage.getItem('bigtoolz_consent') || '{}');
      if (consent.analytics) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
      if (consent.ads) {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
    } catch (e) {}

    // Listen for consent updates from cookie banner
    window.addEventListener('consentUpdate', (e) => {
      const { analytics, ads } = e.detail || {};
      window.gtag('consent', 'update', {
        'analytics_storage': analytics ? 'granted' : 'denied',
        'ad_storage': ads ? 'granted' : 'denied',
        'ad_user_data': ads ? 'granted' : 'denied',
        'ad_personalization': ads ? 'granted' : 'denied'
      });
    });
  }

  /* ===========================================
     20. THROTTLE HELPER
     =========================================== */
  function throttle(fn, delay) {
    let last = 0;
    let timer;
    return function (...args) {
      const now = Date.now();
      const remaining = delay - (now - last);

      if (remaining <= 0) {
        if (timer) clearTimeout(timer);
        last = now;
        fn.apply(this, args);
      } else if (!timer) {
        timer = setTimeout(() => {
          last = Date.now();
          timer = null;
          fn.apply(this, args);
        }, remaining);
      }
    };
  }

  /* ===========================================
     21. INIT
     =========================================== */
  function init() {
    if (state.initialized) return;
    if (shouldSkipTracking()) {
      if (CONFIG.debugMode) console.log('[GA4] Skipped — DNT enabled');
      return;
    }
    if (CONFIG.measurementId === 'G-XXXXXXXXXX') {
      console.warn('[GA4] ⚠️ Replace measurementId with your real GA4 ID');
      return;
    }

    loadGAScript();
    initConsentMode();

    // Wait for gtag to be ready
    setTimeout(() => {
      trackPageView();
    }, 100);

    // Initialize trackers
    initOutboundTracking();
    initDownloadTracking();
    initScrollTracking();
    initEngagementTracking();
    initSearchTracking();
    initFormTracking();
    initErrorTracking();
    initAdTracking();

    // Delayed trackers (after page settles)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initWebVitals();
        initSPATracking();
      }, { timeout: 5000 });
    } else {
      setTimeout(() => {
        initWebVitals();
        initSPATracking();
      }, 3000);
    }

    state.initialized = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ===========================================
     22. PUBLIC API
     =========================================== */
  window.BigToolzAnalytics = {
    track,
    pageView: trackPageView,
    tool: trackToolUsage,
    getType: getPageType,
    redact: redactPII,
    consent: {
      grant: () => {
        localStorage.setItem('bigtoolz_consent', JSON.stringify({ analytics: true, ads: true }));
        window.dispatchEvent(new CustomEvent('consentUpdate', {
          detail: { analytics: true, ads: true }
        }));
      },
      deny: () => {
        localStorage.setItem('bigtoolz_consent', JSON.stringify({ analytics: false, ads: false }));
        window.dispatchEvent(new CustomEvent('consentUpdate', {
          detail: { analytics: false, ads: false }
        }));
      }
    },
    get initialized() { return state.initialized; }
  };

})();