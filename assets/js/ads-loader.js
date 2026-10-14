/* ===========================================
   BigToolz - AdSense Loader
   Version: 1.0.0
   Last updated: 2026-01-15
   Purpose: Lazy-load AdSense, consent-aware, viewability tracking
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. CONFIG
     =========================================== */
  const CONFIG = {
    client: 'ca-pub-0000000000000000',     // ⚠️ Replace with your AdSense Publisher ID
    autoAds: false,                         // Google Auto Ads
    lazyLoad: true,                         // Lazy-load ad slots
    lazyRootMargin: '200px',                // How early to trigger load
    refreshOnVisible: false,                // Re-request ads on tab return
    minRefreshInterval: 60000,              // Min 60s between refreshes
    reserveSpace: true,                     // Prevent CLS
    detectBlocker: true,                    // Detect ad blockers
    consentRequired: true,                  // Wait for consent before loading
    debug: false                            // Console logs
  };

  /* ===========================================
     2. STATE
     =========================================== */
  const state = {
    scriptLoaded: false,
    scriptLoading: false,
    consentGranted: false,
    blockerDetected: false,
    slotsInitialized: new Set(),
    lastRefresh: 0,
    observer: null
  };

  /* ===========================================
     3. HELPERS
     =========================================== */
  function log(...args) {
    if (CONFIG.debug) console.log('[Ads]', ...args);
  }

  function warn(...args) {
    if (CONFIG.debug) console.warn('[Ads]', ...args);
  }

  /**
   * Check if user has given ad consent
   */
  function hasAdConsent() {
    try {
      const consent = JSON.parse(localStorage.getItem('bigtoolz_consent') || '{}');
      return consent.ads === true;
    } catch (e) {
      return false;
    }
  }

  /* ===========================================
     4. ADSENSE SCRIPT LOADER
     =========================================== */
  function loadAdSenseScript() {
    if (state.scriptLoaded || state.scriptLoading) return Promise.resolve();
    if (!CONFIG.client || CONFIG.client === 'ca-pub-0000000000000000') {
      warn('AdSense client ID not configured');
      return Promise.resolve();
    }
    if (CONFIG.consentRequired && !state.consentGranted) {
      log('Waiting for consent before loading AdSense');
      return Promise.resolve();
    }

    state.scriptLoading = true;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.client}`;

      script.onload = () => {
        state.scriptLoaded = true;
        state.scriptLoading = false;
        log('AdSense script loaded');

        // Initialize Auto Ads if enabled
        if (CONFIG.autoAds) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: CONFIG.client,
              enable_page_level_ads: true
            });
          } catch (e) {}
        }

        resolve();
      };

      script.onerror = (err) => {
        state.scriptLoading = false;
        warn('AdSense script failed to load');
        reject(err);
      };

      document.head.appendChild(script);
    });
  }

  /* ===========================================
     5. AD BLOCKER DETECTION
     =========================================== */
  function detectAdBlocker() {
    if (!CONFIG.detectBlocker) return Promise.resolve(false);

    return new Promise((resolve) => {
      // Create bait element
      const bait = document.createElement('div');
      bait.className = 'adsbygoogle ad-banner ad-banner-top';
      bait.style.cssText = 'width:1px;height:1px;position:absolute;left:-9999px;top:-9999px;';
      bait.innerHTML = '&nbsp;';
      document.body.appendChild(bait);

      // Give browser time to process
      setTimeout(() => {
        const blocked =
          bait.offsetHeight === 0 ||
          bait.offsetWidth === 0 ||
          getComputedStyle(bait).display === 'none' ||
          getComputedStyle(bait).visibility === 'hidden';

        bait.remove();

        state.blockerDetected = blocked;
        if (blocked) {
          log('Ad blocker detected');
          document.documentElement.classList.add('ad-blocked');
          window.dispatchEvent(new CustomEvent('adblockdetected'));
        }

        resolve(blocked);
      }, 100);
    });
  }

  /* ===========================================
     6. RESERVE AD SPACE (CLS prevention)
     =========================================== */
  function reserveSpace(slot) {
    if (!CONFIG.reserveSpace) return;

    if (!slot.style.minHeight) {
      const format = slot.dataset.adFormat || 'auto';
      const sizes = {
        'horizontal': '90px',
        'rectangle': '250px',
        'vertical': '600px',
        'square': '250px',
        'auto': 'auto'
      };
      slot.style.minHeight = sizes[format] || 'auto';
    }

    // Set contain to isolate layout impact
    slot.style.contain = 'layout style';
  }

  /* ===========================================
     7. INITIALIZE AD SLOT
     =========================================== */
  function initSlot(slot) {
    if (!slot || state.slotsInitialized.has(slot)) return;
    if (slot.dataset.adInitialized === 'true') return;

    // Mark as initialized
    slot.dataset.adInitialized = 'true';
    state.slotsInitialized.add(slot);

    // Reserve space
    reserveSpace(slot);

    // Create ins element if not present
    let ins = slot.querySelector('ins.adsbygoogle');

    if (!ins) {
      ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.style.textAlign = 'center';

      // Data attributes
      ins.dataset.adClient = slot.dataset.adClient || CONFIG.client;
      ins.dataset.adSlot = slot.dataset.adSlot || slot.dataset.slot || '';

      // Format
      if (slot.dataset.adFormat) ins.dataset.adFormat = slot.dataset.adFormat;
      if (slot.dataset.adLayout) ins.dataset.adLayout = slot.dataset.adLayout;
      if (slot.dataset.fullWidthResponsive !== 'false') {
        ins.dataset.fullWidthResponsive = 'true';
      }

      slot.appendChild(ins);
    }

    // Push to adsbygoogle
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      log('Ad slot initialized:', slot.dataset.adSlot || 'auto');

      // Track init
      if (window.BigToolzAnalytics?.track) {
        window.BigToolzAnalytics.track('ad_impression', {
          ad_slot: slot.dataset.adSlot || 'auto',
          ad_format: slot.dataset.adFormat || 'auto',
          page_type: window.BigToolzAnalytics.getType?.() || 'unknown'
        });
      }
    } catch (err) {
      warn('Ad slot push failed:', err);
    }

    // Attach viewability observer
    observeViewability(slot);
  }

  /* ===========================================
     8. LAZY LOADING WITH INTERSECTION OBSERVER
     =========================================== */
  function initLazyObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all
      document.querySelectorAll('[data-ad-slot], .ad-space').forEach(initSlot);
      return;
    }

    state.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initSlot(entry.target);
          state.observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: CONFIG.lazyRootMargin,
      threshold: 0
    });

    // Observe all ad slots
    document.querySelectorAll('[data-ad-slot], .ad-space').forEach(slot => {
      if (slot.dataset.adInitialized !== 'true') {
        state.observer.observe(slot);
      }
    });
  }

  /* ===========================================
     9. VIEWABILITY TRACKING
     =========================================== */
  function observeViewability(slot) {
    if (!('IntersectionObserver' in window)) return;

    let viewTimer = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const ratio = entry.intersectionRatio;

        if (ratio >= 0.5) {
          // 50% visible — start timer
          if (!viewTimer) {
            viewTimer = setTimeout(() => {
              if (slot.dataset.adViewed) return;
              slot.dataset.adViewed = 'true';

              log('Ad viewed (50% for 1s)');

              if (window.BigToolzAnalytics?.track) {
                window.BigToolzAnalytics.track('ad_viewed', {
                  ad_slot: slot.dataset.adSlot || 'auto',
                  ad_format: slot.dataset.adFormat || 'auto',
                  viewability_ratio: ratio
                });
              }
            }, 1000);
          }
        } else {
          // Less than 50% — cancel
          if (viewTimer) {
            clearTimeout(viewTimer);
            viewTimer = null;
          }
        }
      });
    }, {
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    observer.observe(slot);
  }

  /* ===========================================
     10. AUTO-DETECT AD SLOTS IN DOM
     =========================================== */
  function initAutoDetect() {
    // Watch for dynamically added ad slots
    const domObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;

          // Check node itself
          if (node.matches && node.matches('[data-ad-slot], .ad-space')) {
            if (state.observer) {
              state.observer.observe(node);
            } else {
              initSlot(node);
            }
          }

          // Check children
          node.querySelectorAll?.('[data-ad-slot], .ad-space').forEach(slot => {
            if (state.observer) {
              state.observer.observe(slot);
            } else {
              initSlot(slot);
            }
          });
        });
      });
    });

    domObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /* ===========================================
     11. CONSENT INTEGRATION
     =========================================== */
  function initConsent() {
    // Check existing consent
    state.consentGranted = hasAdConsent();

    if (state.consentGranted) {
      // Already consented — load immediately
      loadAdSenseScript().then(() => initLazyObserver());
    } else if (!CONFIG.consentRequired) {
      // Consent not required (e.g., US-only traffic)
      state.consentGranted = true;
      loadAdSenseScript().then(() => initLazyObserver());
    }

    // Listen for consent updates
    window.addEventListener('consentUpdate', (e) => {
      const { ads } = e.detail || {};

      if (ads && !state.consentGranted) {
        state.consentGranted = true;
        log('Consent granted — loading ads');

        // Update gtag consent
        if (window.gtag) {
          window.gtag('consent', 'update', {
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
          });
        }

        loadAdSenseScript().then(() => initLazyObserver());
      } else if (!ads && state.consentGranted) {
        state.consentGranted = false;
        log('Consent revoked — ads disabled');
      }
    });
  }

  /* ===========================================
     12. REFRESH ON VISIBILITY (optional)
     =========================================== */
  function initRefreshOnVisible() {
    if (!CONFIG.refreshOnVisible) return;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      if (!state.consentGranted) return;

      const now = Date.now();
      if (now - state.lastRefresh < CONFIG.minRefreshInterval) return;

      state.lastRefresh = now;

      // Only refresh visible slots
      document.querySelectorAll('[data-ad-slot][data-ad-initialized="true"]').forEach(slot => {
        const rect = slot.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && slot.dataset.adRefreshable === 'true') {
          const ins = slot.querySelector('ins.adsbygoogle');
          if (ins) {
            ins.innerHTML = '';
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              log('Ad refreshed:', slot.dataset.adSlot);
            } catch (e) {}
          }
        }
      });
    });
  }

  /* ===========================================
     13. RESPONSIVE FORMAT SWITCHING
     =========================================== */
  function initResponsiveSwitch() {
    if (!('matchMedia' in window)) return;

    const mobile = window.matchMedia('(max-width: 768px)');

    const handleChange = (e) => {
      const isMobile = e.matches;
      document.documentElement.classList.toggle('is-mobile', isMobile);
      log('Viewport:', isMobile ? 'mobile' : 'desktop');
    };

    mobile.addEventListener('change', handleChange);
    handleChange(mobile);
  }

  /* ===========================================
     14. INIT
     =========================================== */
  function init() {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    log('Initializing AdSense loader');

    // Detect ad blocker (non-blocking)
    detectAdBlocker().then((blocked) => {
      if (blocked) {
        warn('Ads will not display — ad blocker active');
        return;
      }

      // Init consent + load
      initConsent();
    });

    // Other initializers
    initResponsiveSwitch();
    initRefreshOnVisible();
    initAutoDetect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ===========================================
     15. PUBLIC API
     =========================================== */
  window.BigToolzAds = {
    load: loadAdSenseScript,
    initSlot,
    refresh: (selector) => {
      const slot = selector ? document.querySelector(selector) : null;
      if (slot) {
        const ins = slot.querySelector('ins.adsbygoogle');
        if (ins) ins.innerHTML = '';
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {}
      }
    },
    isBlocked: () => state.blockerDetected,
    isLoaded: () => state.scriptLoaded,
    hasConsent: () => state.consentGranted,
    getClient: () => CONFIG.client
  };

})();