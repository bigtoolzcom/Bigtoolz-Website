/* ===========================================
   BigToolz - Clipboard Utilities
   Version: 1.0.0
   Last updated: 2026-01-15
   Purpose: Advanced copy-to-clipboard functionality
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. CONFIG
     =========================================== */
  const CONFIG = {
    feedbackDuration: 2000,     // ms to show "Copied!" state
    autoDetect: true,           // auto-attach click handlers
    buttonSelector: '[data-copy], .copy-btn, .tool-copy-btn, [data-clipboard]',
    toastOnSuccess: true,
    toastOnError: true,
    ariaLive: true
  };

  /* ===========================================
     2. CORE COPY FUNCTION
     =========================================== */
  /**
   * Copy text to clipboard with multiple fallbacks
   * @param {string} text — text to copy
   * @returns {Promise<boolean>} — success
   */
  async function copy(text) {
    if (!text && text !== '') return false;
    text = String(text);

    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        // Fall through to legacy method
      }
    }

    // Fallback: legacy execCommand with hidden textarea
    return legacyCopy(text);
  }

  /**
   * Legacy copy method (works on older browsers / non-HTTPS)
   */
  function legacyCopy(text) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;

      // Prevent zoom on iOS
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.width = '1px';
      textarea.style.height = '1px';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      textarea.style.opacity = '0';
      textarea.setAttribute('readonly', '');

      document.body.appendChild(textarea);

      // Select range (iOS safe)
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textarea.setSelectionRange(0, 999999);
      } else {
        textarea.select();
      }

      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (err) {
      console.error('Legacy copy failed:', err);
      return false;
    }
  }

  /* ===========================================
     3. EXTRACT TEXT FROM SOURCE
     =========================================== */
  /**
   * Determine what to copy from an element
   * Priority: data-copy > data-copy-target > data-clipboard-text > input/textarea value > textContent
   */
  function extractText(el) {
    if (!el) return '';

    // 1. Direct value in data-copy
    if (el.dataset.copy) {
      return applyTransform(el.dataset.copy, el);
    }

    // 2. Target selector (e.g., #result-output)
    const targetSel = el.dataset.copyTarget
      || el.dataset.target
      || el.dataset.clipboardTarget;

    if (targetSel) {
      const target = document.querySelector(targetSel);
      if (target) {
        // If it's an input/textarea, use value; else textContent
        const raw = ('value' in target && target.value !== undefined)
          ? target.value
          : (target.innerText || target.textContent || '');
        return applyTransform(raw, el);
      }
    }

    // 3. data-clipboard-text
    if (el.dataset.clipboardText) {
      return applyTransform(el.dataset.clipboardText, el);
    }

    // 4. Sibling / closest result area
    const resultArea = el.closest('.tool-result, .result-area, .output-area');
    if (resultArea) {
      const output = resultArea.querySelector(
        '.tool-result-output, .result-output, [data-copy-source], pre, code, textarea, input'
      );
      if (output) {
        const raw = ('value' in output && output.value !== undefined)
          ? output.value
          : (output.innerText || output.textContent || '');
        return applyTransform(raw, el);
      }
    }

    // 5. Parent input
    const parentInput = el.parentElement?.querySelector('input, textarea');
    if (parentInput) {
      return applyTransform(parentInput.value, el);
    }

    // 6. Nothing found
    return '';
  }

  /**
   * Apply transformations based on data attributes
   * data-copy-trim="true|false"
   * data-copy-case="upper|lower|none"
   * data-copy-prefix="..."
   * data-copy-suffix="..."
   */
  function applyTransform(text, el) {
    if (text === null || text === undefined) return '';
    text = String(text);

    // Trim (default true)
    if (el.dataset.copyTrim !== 'false') {
      text = text.trim();
    }

    // Case
    const caseMode = el.dataset.copyCase;
    if (caseMode === 'upper') text = text.toUpperCase();
    else if (caseMode === 'lower') text = text.toLowerCase();

    // Prefix / suffix
    if (el.dataset.copyPrefix) text = el.dataset.copyPrefix + text;
    if (el.dataset.copySuffix) text = text + el.dataset.copySuffix;

    return text;
  }

  /* ===========================================
     4. FEEDBACK
     =========================================== */
  function showFeedback(el, success = true) {
    if (!el) return;

    const originalHTML = el.innerHTML;
    const originalAria = el.getAttribute('aria-label');

    el.classList.add(success ? 'copied' : 'copy-error');
    el.classList.add('copied-feedback');

    // Swap text
    if (el.dataset.noFeedback !== 'true') {
      if (el.dataset.feedbackText) {
        el.innerHTML = el.dataset.feedbackText;
      } else {
        el.innerHTML = success ? '✓ Copied!' : '✕ Failed';
      }
    }

    // Restore after duration
    setTimeout(() => {
      el.innerHTML = originalHTML;
      if (originalAria) el.setAttribute('aria-label', originalAria);
      el.classList.remove('copied', 'copy-error', 'copied-feedback');
    }, CONFIG.feedbackDuration);
  }

  /**
   * ARIA live region for screen readers
   */
  let ariaLiveRegion = null;

  function announce(message) {
    if (!CONFIG.ariaLive) return;

    if (!ariaLiveRegion) {
      ariaLiveRegion = document.createElement('div');
      ariaLiveRegion.setAttribute('role', 'status');
      ariaLiveRegion.setAttribute('aria-live', 'polite');
      ariaLiveRegion.setAttribute('aria-atomic', 'true');
      ariaLiveRegion.className = 'sr-only';
      ariaLiveRegion.style.cssText =
        'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      document.body.appendChild(ariaLiveRegion);
    }

    ariaLiveRegion.textContent = '';
    setTimeout(() => {
      ariaLiveRegion.textContent = message;
    }, 100);
  }

  function showToast(message, type) {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
    }
  }

  /* ===========================================
     5. MAIN COPY HANDLER
     =========================================== */
  async function handleCopy(el) {
    const text = extractText(el);

    if (!text) {
      if (CONFIG.toastOnError) showToast('Nothing to copy', 'error');
      announce('Copy failed: no content');
      showFeedback(el, false);
      return false;
    }

    const success = await copy(text);

    if (success) {
      showFeedback(el, true);
      announce('Copied to clipboard');
      if (CONFIG.toastOnSuccess && el.dataset.noToast !== 'true') {
        showToast('Copied to clipboard!', 'success');
      }

      // Analytics
      if (window.gtag) {
        window.gtag('event', 'copy_to_clipboard', {
          source: el.dataset.copySource || el.className,
          length: text.length
        });
      }

      // Custom event
      window.dispatchEvent(new CustomEvent('copied', {
        detail: { text, element: el }
      }));
    } else {
      showFeedback(el, false);
      announce('Copy failed');
      if (CONFIG.toastOnError) showToast('Failed to copy', 'error');
    }

    return success;
  }

  /* ===========================================
     6. AUTO-DETECT & ATTACH
     =========================================== */
  function initAutoDetect() {
    if (!CONFIG.autoDetect) return;

    document.addEventListener('click', (e) => {
      const btn = e.target.closest(CONFIG.buttonSelector);
      if (!btn) return;

      // Skip if it's a share button or in a modal handled elsewhere
      if (btn.closest('.share-modal')) return;

      e.preventDefault();
      e.stopPropagation();
      handleCopy(btn);
    });

    // Keyboard shortcut: Ctrl+Shift+C on focused copy button
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        const focused = document.activeElement;
        if (focused && focused.matches(CONFIG.buttonSelector)) {
          e.preventDefault();
          handleCopy(focused);
        }
      }
    });
  }

  /* ===========================================
     7. BULK COPY
     =========================================== */
  /**
   * Copy multiple pieces of text as a single string
   * @param {string[]} texts — array of strings
   * @param {string} separator — join with (default \n)
   */
  async function copyAll(texts, separator = '\n') {
    if (!Array.isArray(texts) || !texts.length) {
      if (CONFIG.toastOnError) showToast('Nothing to copy', 'error');
      return false;
    }

    const combined = texts
      .filter(t => t !== null && t !== undefined && t !== '')
      .join(separator);

    const success = await copy(combined);

    if (success) {
      announce(`${texts.length} items copied`);
      if (CONFIG.toastOnSuccess) {
        showToast(`${texts.length} items copied to clipboard!`, 'success');
      }
    } else {
      if (CONFIG.toastOnError) showToast('Failed to copy', 'error');
    }

    return success;
  }

  /* ===========================================
     8. COPY FROM URL QUERY
     =========================================== */
  /**
   * Auto-copy value from ?copy= query param on page load
   */
  function autoCopyFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('copy');
    if (!value) return;

    // Copy after slight delay (after page settles)
    setTimeout(async () => {
      const success = await copy(value);
      if (success) {
        showToast('Auto-copied from URL!', 'success');
        announce('Auto-copied from URL');

        // Clean URL (remove ?copy=)
        if (history.replaceState) {
          const clean = window.location.pathname + window.location.hash;
          history.replaceState(null, '', clean);
        }
      }
    }, 500);
  }

  /* ===========================================
     9. INIT
     =========================================== */
  function init() {
    initAutoDetect();
    autoCopyFromQuery();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ===========================================
     10. PUBLIC API
     =========================================== */
  window.BigToolzClipboard = {
    copy,
    copyAll,
    copyFrom: (el) => extractText(el),
    handle: handleCopy,
    legacy: legacyCopy
  };

  // Convenience alias
  window.copyToClipboard = copy;

})();