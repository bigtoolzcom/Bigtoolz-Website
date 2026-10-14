/* ===========================================
   BigToolz - PWA Controller
   Version: 1.0.0
   Last updated: 2026-01-15
   Purpose: Service Worker + install prompt + update UI
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. CONFIG
     =========================================== */
  const CONFIG = {
    swPath: '/service-worker.js',
    scope: '/',
    installBannerDelay: 3000,          // ms before showing install prompt
    installBannerCooldown: 7,          // days to wait after dismissal
    updateBannerDelay: 500,            // ms after update detected
    checkInterval: 60 * 60 * 1000,     // check for updates every hour
    debug: false                       // console logs
  };

  /* ===========================================
     2. STATE
     =========================================== */
  const state = {
    registration: null,
    newWorker: null,
    installPrompt: null,
    isStandalone: false,
    isIOS: false,
    isOnline: navigator.onLine
  };

  /* ===========================================
     3. HELPERS
     =========================================== */
  function log(...args) {
    if (CONFIG.debug) console.log('[PWA]', ...args);
  }

  function track(event, params = {}) {
    if (window.BigToolzAnalytics?.track) {
      window.BigToolzAnalytics.track(event, params);
    }
    if (CONFIG.debug) log('Event:', event, params);
  }

  function detectPlatform() {
    // iOS detection
    state.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Standalone (already installed)
    state.isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
  }

  /* ===========================================
     4. SERVICE WORKER REGISTRATION
     =========================================== */
  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      log('Service Worker not supported');
      return null;
    }

    // Only HTTPS or localhost
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      log('Service Worker requires HTTPS');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(CONFIG.swPath, {
        scope: CONFIG.scope,
        updateViaCache: 'none'
      });

      state.registration = registration;
      log('Service Worker registered:', registration.scope);
      track('sw_registered', { scope: registration.scope });

      // Detect new worker waiting
      if (registration.waiting && navigator.serviceWorker.controller) {
        showUpdateBanner(registration.waiting);
      }

      // Watch for new installs
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        log('New Service Worker installing');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            log('New Service Worker installed — waiting');
            state.newWorker = newWorker;
            showUpdateBanner(newWorker);
          }
        });
      });

      // Periodic update check
      setInterval(() => registration.update().catch(() => {}), CONFIG.checkInterval);

      // Check on visibility return
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && registration) {
          registration.update().catch(() => {});
        }
      });

      return registration;
    } catch (err) {
      log('Service Worker registration failed:', err);
      return null;
    }
  }

  /* ===========================================
     5. UPDATE BANNER
     =========================================== */
  function showUpdateBanner(worker) {
    if (document.querySelector('.pwa-update-banner')) return;

    const banner = document.createElement('div');
    banner.className = 'pwa-update-banner';
    banner.setAttribute('role', 'alert');
    banner.innerHTML = `
      <div class="pwa-update-content">
        <span class="pwa-update-icon">✨</span>
        <div class="pwa-update-text">
          <strong>New version available</strong>
          <span>Reload to get the latest features</span>
        </div>
        <button class="pwa-update-btn" data-update>Update</button>
        <button class="pwa-update-close" data-dismiss aria-label="Dismiss">✕</button>
      </div>
    `;

    document.body.appendChild(banner);

    setTimeout(() => banner.classList.add('visible'), CONFIG.updateBannerDelay);

    // Update button
    banner.querySelector('[data-update]').addEventListener('click', () => {
      track('sw_update_accepted');
      worker.postMessage({ type: 'SKIP_WAITING' });

      // Reload once new worker takes control
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloaded) return;
        reloaded = true;
        window.location.reload();
      });

      // Fallback reload if controllerchange doesn't fire
      setTimeout(() => {
        if (!reloaded) window.location.reload();
      }, 1000);
    });

    // Dismiss button
    banner.querySelector('[data-dismiss]').addEventListener('click', () => {
      track('sw_update_dismissed');
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 300);
    });
  }

  /* ===========================================
     6. INSTALL PROMPT (A2HS)
     =========================================== */
  function initInstallPrompt() {
    // Skip if already installed
    if (state.isStandalone) {
      log('Already installed — skipping install prompt');
      return;
    }

    // Skip if user recently dismissed
    const dismissedAt = localStorage.getItem('pwa_install_dismissed');
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < CONFIG.installBannerCooldown) {
        log('Install prompt recently dismissed — skipping');
        return;
      }
    }

    // Listen for beforeinstallprompt (Chrome, Edge, Android)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.installPrompt = e;
      log('Install prompt available');

      // Show banner after delay
      setTimeout(() => showInstallBanner(), CONFIG.installBannerDelay);
    });

    // iOS Safari doesn't fire beforeinstallprompt — show manual instructions
    if (state.isIOS && !state.isStandalone) {
      setTimeout(() => showIOSInstallBanner(), CONFIG.installBannerDelay);
    }

    // Handle install event
    window.addEventListener('appinstalled', () => {
      log('App installed');
      track('pwa_installed');
      state.installPrompt = null;
      hideInstallBanner();
    });
  }

  function showInstallBanner() {
    if (document.querySelector('.pwa-install-banner')) return;
    if (state.isStandalone) return;

    const banner = document.createElement('div');
    banner.className = 'pwa-install-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Install BigToolz as app');
    banner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">⚒</div>
        <div class="pwa-install-text">
          <strong>Install BigToolz</strong>
          <span>Fast access from your home screen — works offline</span>
        </div>
        <button class="pwa-install-btn" data-install>Install</button>
        <button class="pwa-install-close" data-dismiss aria-label="Dismiss">✕</button>
      </div>
    `;

    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('visible'), 50);

    // Install button
    banner.querySelector('[data-install]').addEventListener('click', async () => {
      if (!state.installPrompt) return;

      state.installPrompt.prompt();
      const { outcome } = await state.installPrompt.userChoice;

      log('Install outcome:', outcome);
      track('pwa_install_prompt', { outcome });

      state.installPrompt = null;
      hideInstallBanner();
    });

    // Dismiss button
    banner.querySelector('[data-dismiss]').addEventListener('click', () => {
      localStorage.setItem('pwa_install_dismissed', Date.now().toString());
      track('pwa_install_dismissed');
      hideInstallBanner();
    });
  }

  function showIOSInstallBanner() {
    if (document.querySelector('.pwa-install-banner')) return;
    if (state.isStandalone) return;

    const banner = document.createElement('div');
    banner.className = 'pwa-install-banner pwa-install-ios';
    banner.setAttribute('role', 'dialog');
    banner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">⚒</div>
        <div class="pwa-install-text">
          <strong>Install BigToolz</strong>
          <span>Tap <span class="pwa-ios-share">⤴</span> then "Add to Home Screen"</span>
        </div>
        <button class="pwa-install-close" data-dismiss aria-label="Dismiss">✕</button>
      </div>
    `;

    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('visible'), 50);

    banner.querySelector('[data-dismiss]').addEventListener('click', () => {
      localStorage.setItem('pwa_install_dismissed', Date.now().toString());
      track('pwa_install_dismissed', { platform: 'ios' });
      hideInstallBanner();
    });
  }

  function hideInstallBanner() {
    const banner = document.querySelector('.pwa-install-banner');
    if (!banner) return;
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 300);
  }

  /* ===========================================
     7. ONLINE / OFFLINE STATUS
     =========================================== */
  function initNetworkStatus() {
    const showStatus = (online) => {
      state.isOnline = online;

      // Dispatch event
      window.dispatchEvent(new CustomEvent('networkstatus', {
        detail: { online }
      }));

      // Toast (if offline)
      if (!online && typeof window.showToast === 'function') {
        window.showToast('You are offline — some features may be limited', 'warning', 5000);
      }

      track('network_status', { online });
    };

    window.addEventListener('online', () => showStatus(true));
    window.addEventListener('offline', () => showStatus(false));
  }

  /* ===========================================
     8. CACHE MANAGEMENT API
     =========================================== */
  async function clearCache() {
    if (!state.registration) return false;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        log('Cache cleared:', event.data);
        resolve(event.data?.success === true);
      };

      navigator.serviceWorker.controller?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );

      // Timeout fallback
      setTimeout(() => resolve(false), 3000);
    });
  }

  async function cacheUrls(urls) {
    if (!state.registration || !urls?.length) return false;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data?.success === true);
      };

      navigator.serviceWorker.controller?.postMessage(
        { type: 'CACHE_URLS', urls },
        [messageChannel.port2]
      );

      setTimeout(() => resolve(false), 3000);
    });
  }

  /* ===========================================
     9. STANDALONE MODE
     =========================================== */
  function initStandalone() {
    if (state.isStandalone) {
      document.documentElement.classList.add('pwa-standalone');
      log('Running in standalone mode');
    }
  }

  /* ===========================================
     10. PRELOAD POPULAR TOOLS (post-install)
     =========================================== */
  function preloadPopularTools() {
    // Preload top 10 tools after 5 seconds of idle time
    const popular = [
      '/tools/image-tools/image-compressor/',
      '/tools/pdf-tools/organize-pdf/merge-pdf/',
      '/tools/text-tools/word-counter/',
      '/tools/image-tools/qr-code-generator/',
      '/tools/utility-tools/password-generator/'
    ];

    const preload = () => cacheUrls(popular);

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preload, { timeout: 8000 });
    } else {
      setTimeout(preload, 5000);
    }
  }

  /* ===========================================
     11. INIT
     =========================================== */
  async function init() {
    detectPlatform();
    initStandalone();
    initNetworkStatus();

    const registration = await registerServiceWorker();

    if (registration) {
      initInstallPrompt();
      preloadPopularTools();
    }

    log('PWA initialized', {
      standalone: state.isStandalone,
      ios: state.isIOS,
      online: state.isOnline
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ===========================================
     12. PUBLIC API
     =========================================== */
  window.BigToolzPWA = {
    isInstalled: () => state.isStandalone,
    isIOS: () => state.isIOS,
    isOnline: () => state.isOnline,
    canInstall: () => !!state.installPrompt,
    promptInstall: () => {
      if (state.installPrompt) {
        state.installPrompt.prompt();
      }
    },
    clearCache,
    cacheUrls,
    update: () => state.registration?.update(),
    getRegistration: () => state.registration
  };

})();