/* ===========================================
   BigToolz - Main JavaScript
   Version: 1.0.0
   Last updated: 2026-01-15
   Purpose: Core functions used across all pages
   =========================================== */

'use strict';

/* ===========================================
   1. UTILITIES
   =========================================== */

/**
 * Debounce — wait for pause in calls
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle — limit calls to once per interval
 */
function throttle(fn, limit = 200) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Select DOM elements (safe)
 */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/**
 * Detect if element is in viewport
 */
function isInViewport(el, offset = 0) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight - offset && rect.bottom > 0;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/* ===========================================
   2. THEME INITIALIZATION (No-Flash)
   =========================================== */
(function initTheme() {
  try {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {
    // localStorage may be disabled
  }
})();

/* ===========================================
   3. THEME TOGGLE
   =========================================== */
function initThemeToggle() {
  const themeBtns = $$('.theme-btn');
  if (!themeBtns.length) return;

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      let next;
      if (current === 'dark') {
        next = 'light';
      } else if (current === 'light') {
        next = 'dark';
      } else {
        // Auto mode — flip from system
        next = systemDark ? 'light' : 'dark';
      }

      html.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}

      // Update aria-label
      btn.setAttribute('aria-label',
        next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );

      // Dispatch event for other scripts
      window.dispatchEvent(new CustomEvent('themechange', {
        detail: { theme: next }
      }));
    });
  });

  // Listen for system theme changes (when in auto mode)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

/* ===========================================
   4. SCROLL REVEAL ANIMATIONS
   =========================================== */
function initScrollReveal() {
  const revealElements = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealElements.length) return;

  // Fallback: if IntersectionObserver not supported, show all
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ===========================================
   5. MOBILE MENU
   =========================================== */
function initMobileMenu() {
  const toggleBtns = $$('.mobile-menu-toggle');
  const nav = $('.nav');
  const header = $('.header');

  if (!nav) return;

  // Create mobile menu HTML if not exists
  let mobileMenu = $('.mobile-menu');

  if (!mobileMenu) {
    mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
      <div class="mobile-menu-overlay"></div>
      <div class="mobile-menu-panel">
        <div class="mobile-menu-header">
          <a href="/" class="logo">
            <div class="logo-icon">⚒</div>
            Big<span>Toolz</span>
          </a>
          <button class="mobile-menu-close" aria-label="Close menu">✕</button>
        </div>
        <nav class="mobile-menu-nav">
          <a href="/">Home</a>
          <a href="/tools/">All Tools</a>
          <a href="/tools/">Categories</a>
          <a href="/blog/">Blog</a>
          <a href="/about.html">About Us</a>
          <a href="/contact.html">Contact</a>
        </nav>
        <div class="mobile-menu-footer">
          <button class="theme-btn" aria-label="Toggle theme">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
            Toggle Theme
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(mobileMenu);
  }

  const openMenu = () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Open buttons
  toggleBtns.forEach(btn => btn.addEventListener('click', openMenu));

  // Close button
  const closeBtn = $('.mobile-menu-close', mobileMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Overlay click
  const overlay = $('.mobile-menu-overlay', mobileMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on link click
  $$('a', mobileMenu).forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ===========================================
   6. SEARCH BAR TOGGLE
   =========================================== */
function initSearchToggle() {
  const searchBtns = $$('.search-btn');
  const searchOverlay = $('.search-overlay');

  if (!searchBtns.length) return;

  // Create search overlay if not exists
  let overlay = searchOverlay;
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.innerHTML = `
      <div class="search-overlay-backdrop"></div>
      <div class="search-overlay-box">
        <form class="search-overlay-form" action="/search" method="get">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="search" name="q" placeholder="Search 300+ tools..." aria-label="Search tools" autocomplete="off">
          <button type="button" class="search-overlay-close" aria-label="Close search">✕</button>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const input = $('input', overlay);
  const closeBtn = $('.search-overlay-close', overlay);
  const backdrop = $('.search-overlay-backdrop', overlay);

  const openSearch = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input?.focus(), 100);
  };

  const closeSearch = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  searchBtns.forEach(btn => btn.addEventListener('click', openSearch));
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (backdrop) backdrop.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
    // Ctrl+K / Cmd+K shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
}

/* ===========================================
   7. BACK TO TOP BUTTON
   =========================================== */
function initBackToTop() {
  let btn = $('.back-to-top');

  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    `;
    document.body.appendChild(btn);
  }

  const toggle = throttle(() => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, 150);

  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===========================================
   8. SMOOTH SCROLL (Anchor Links)
   =========================================== */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#' || href === '#!') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const headerOffset = 80;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Update URL without jumping
    if (history.pushState) {
      history.pushState(null, '', href);
    }
  });
}

/* ===========================================
   9. LAZY LOADING IMAGES
   =========================================== */
function initLazyLoading() {
  const lazyImages = $$('img[loading="lazy"]');

  // Native lazy loading is already supported in modern browsers
  // This handles fallback for older browsers

  if ('loading' in HTMLImageElement.prototype) {
    // Native support — nothing to do
    return;
  }

  // Fallback: IntersectionObserver
  if (!('IntersectionObserver' in window)) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px'
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

/* ===========================================
   10. COPY TO CLIPBOARD
   =========================================== */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}

function initCopyButtons() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy], .tool-copy-btn, .copy-btn');
    if (!btn) return;

    let text = btn.dataset.copy;

    // If no data-copy, try to copy from target element
    if (!text) {
      const targetSelector = btn.dataset.copyTarget || btn.dataset.target;
      if (targetSelector) {
        const target = document.querySelector(targetSelector);
        text = target?.innerText || target?.textContent || '';
      }
    }

    if (!text) return;

    const success = await copyToClipboard(text);

    if (success) {
      const originalText = btn.innerHTML;
      btn.classList.add('copied', 'copied-feedback');

      // Change text temporarily
      if (!btn.dataset.noFeedback) {
        btn.innerHTML = '✓ Copied!';
      }

      setTimeout(() => {
        btn.classList.remove('copied', 'copied-feedback');
        btn.innerHTML = originalText;
      }, 2000);

      showToast('Copied to clipboard!', 'success');
    } else {
      showToast('Failed to copy', 'error');
    }
  });
}

/* ===========================================
   11. EXTERNAL LINKS
   =========================================== */
function initExternalLinks() {
  const host = window.location.hostname;

  $$('a[href^="http"]').forEach(link => {
    try {
      const url = new URL(link.href);
      if (url.hostname !== host) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    } catch (e) {}
  });
}

/* ===========================================
   12. TOAST NOTIFICATIONS
   =========================================== */
function showToast(message, type = 'info', duration = 3000) {
  let container = $('.toast-container');

  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.add('dismiss');
    setTimeout(() => toast.remove(), 300);
  }, duration);

  // Click to dismiss
  toast.addEventListener('click', () => {
    toast.classList.add('dismiss');
    setTimeout(() => toast.remove(), 300);
  });

  return toast;
}

// Make globally available
window.showToast = showToast;
window.copyToClipboard = copyToClipboard;

/* ===========================================
   13. PAGE LOADER
   =========================================== */
function initPageLoader() {
  // Show loader on internal navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip external, anchor, download, and modifier clicks
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      e.ctrlKey || e.metaKey || e.shiftKey
    ) return;

    // Skip external links
    try {
      const url = new URL(link.href);
      if (url.hostname !== window.location.hostname) return;
      if (url.pathname === window.location.pathname) return;
    } catch (err) {
      return;
    }

    document.body.classList.add('is-loading');
  });

  // Hide loader when page is restored from bfcache
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.body.classList.remove('is-loading');
    }
  });
}

/* ===========================================
   14. FORM VALIDATION
   =========================================== */
function initFormValidation() {
  $$('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      let valid = true;
      const errors = [];

      $$('[required]', form).forEach(field => {
        const value = field.value.trim();

        // Empty check
        if (!value) {
          valid = false;
          errors.push(`${field.name || 'Field'} is required`);
          field.classList.add('error');
          return;
        }

        // Email check
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          valid = false;
          errors.push('Invalid email address');
          field.classList.add('error');
          return;
        }

        // Min length
        if (field.minLength > 0 && value.length < field.minLength) {
          valid = false;
          errors.push(`${field.name || 'Field'} must be at least ${field.minLength} characters`);
          field.classList.add('error');
          return;
        }

        field.classList.remove('error');
      });

      if (!valid) {
        e.preventDefault();
        showToast(errors[0] || 'Please fill all required fields', 'error');
      }
    });

    // Remove error state on input
    $$('input, textarea, select', form).forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
      });
    });
  });
}

/* ===========================================
   15. BOOKMARK BUTTON
   =========================================== */
function initBookmark() {
  const btns = $$('.bookmark-btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Show instructions for bookmarking
      if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        showToast('Press ⌘ + D to bookmark this page', 'info', 5000);
      } else if (navigator.userAgent.match(/Android/i)) {
        showToast('Tap menu → Add to Home Screen', 'info', 5000);
      } else {
        showToast('Press Ctrl + D to bookmark this page', 'info', 5000);
      }
    });
  });
}

/* ===========================================
   16. SERVICE WORKER REGISTRATION
   =========================================== */
function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showToast('New version available! Refresh to update.', 'info', 6000);
            }
          });
        });
      })
      .catch(err => {
        console.warn('Service Worker registration failed:', err);
      });
  });
}

/* ===========================================
   17. ACTIVE NAV LINK
   =========================================== */
function initActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = $$('.nav a, .mobile-menu-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Exact match
    if (href === currentPath) {
      link.classList.add('active');
    }
    // Homepage
    else if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    }
    // Section match (e.g., /tools/... matches /tools/)
    else if (href !== '/' && currentPath.startsWith(href) && href.length > 1) {
      link.classList.add('active');
    }
  });
}

/* ===========================================
   18. ANIMATED COUNTERS
   =========================================== */
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = parseInt(el.dataset.duration, 10) || 2000;
    const suffix = el.dataset.suffix || '';
    const start = 0;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ===========================================
   19. INIT ALL
   =========================================== */
function init() {
  initThemeToggle();
  initScrollReveal();
  initMobileMenu();
  initSearchToggle();
  initBackToTop();
  initSmoothScroll();
  initLazyLoading();
  initCopyButtons();
  initExternalLinks();
  initPageLoader();
  initFormValidation();
  initBookmark();
  initServiceWorker();
  initActiveNavLink();
  initCounters();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ===========================================
   20. GLOBAL EXPORTS
   =========================================== */
window.BigToolz = {
  debounce,
  throttle,
  formatBytes,
  copyToClipboard,
  showToast,
  isInViewport,
  $,
  $$
};

/* ===========================================
   END
   =========================================== */