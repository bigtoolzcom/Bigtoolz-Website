/* ===========================================
   BigToolz - Social Sharing
   Version: 1.0.0
   Last updated: 2026-01-15
   Purpose: Share tools, blog posts across social platforms
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. CONFIG
     =========================================== */
  const CONFIG = {
    siteName: 'BigToolz',
    siteUrl: 'https://bigtoolz.com',
    defaultHashtags: ['BigToolz', 'FreeTools', 'OnlineTools'],
    via: 'bigtoolz',            // Twitter handle
    modalId: 'share-modal',
    autoDetect: true,           // auto-attach to [data-share] elements
    trackAnalytics: true
  };

  /* ===========================================
     2. SHARE URL BUILDERS
     =========================================== */
  const shareUrls = {

    facebook: (data) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,

    twitter: (data) => {
      const params = new URLSearchParams({
        url: data.url,
        text: data.title,
        via: CONFIG.via
      });
      if (data.hashtags?.length) {
        params.set('hashtags', data.hashtags.join(','));
      }
      return `https://twitter.com/intent/tweet?${params}`;
    },

    linkedin: (data) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`,

    whatsapp: (data) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(data.title + ' ' + data.url)}`,

    telegram: (data) =>
      `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`,

    reddit: (data) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}`,

    pinterest: (data) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(data.url)}&description=${encodeURIComponent(data.title)}${data.image ? '&media=' + encodeURIComponent(data.image) : ''}`,

    email: (data) =>
      `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.description + '\n\n' + data.url)}`,

    sms: (data) =>
      `sms:?&body=${encodeURIComponent(data.title + ' ' + data.url)}`

  };

  /* ===========================================
     3. ICONS
     =========================================== */
  const ICONS = {
    facebook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    twitter: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    linkedin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    whatsapp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
    telegram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
    reddit: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>',
    pinterest: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 0 0-4.373 23.178c-.07-.978-.135-2.478.028-3.545.145-.95.941-6.037.941-6.037s-.24-.48-.24-1.191c0-1.116.646-1.948 1.451-1.948.685 0 1.016.514 1.016 1.129 0 .689-.439 1.718-.665 2.674-.19.797.4 1.447 1.185 1.447 1.422 0 2.516-1.5 2.516-3.665 0-1.915-1.376-3.253-3.342-3.253-2.276 0-3.612 1.706-3.612 3.468 0 .687.265 1.424.595 1.823.065.079.075.148.055.229-.061.252-.196.797-.223.908-.035.145-.115.176-.265.106-1.011-.469-1.64-1.94-1.64-3.125 0-2.545 1.85-4.884 5.331-4.884 2.798 0 4.973 1.995 4.973 4.66 0 2.781-1.754 5.021-4.187 5.021-.817 0-1.585-.424-1.848-.925 0 0-.404 1.543-.503 1.921-.182.702-.675 1.582-1.006 2.118A12 12 0 1 0 12 0z"/></svg>',
    email: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
    copy: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
    qr: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v3M17 20h3M14 20v1"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    link: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>'
  };

  /* ===========================================
     4. GET SHARE DATA
     =========================================== */
  function getShareData(el) {
    // Priority: data attributes → meta tags → defaults
    const url = el?.dataset?.shareUrl
      || document.querySelector('link[rel="canonical"]')?.href
      || window.location.href;

    const title = el?.dataset?.shareTitle
      || document.querySelector('meta[property="og:title"]')?.content
      || document.title;

    const description = el?.dataset?.shareDesc
      || document.querySelector('meta[property="og:description"]')?.content
      || document.querySelector('meta[name="description"]')?.content
      || '';

    const image = el?.dataset?.shareImage
      || document.querySelector('meta[property="og:image"]')?.content
      || '';

    const hashtags = el?.dataset?.shareHashtags
      ? el.dataset.shareHashtags.split(',').map(s => s.trim())
      : CONFIG.defaultHashtags;

    return { url, title, description, image, hashtags };
  }

  /* ===========================================
     5. NATIVE SHARE (Mobile)
     =========================================== */
  async function nativeShare(data) {
    if (!navigator.share) return false;

    try {
      await navigator.share({
        title: data.title,
        text: data.description,
        url: data.url
      });
      trackShare('native', data);
      return true;
    } catch (err) {
      // User cancelled — not an error
      if (err.name !== 'AbortError') {
        console.warn('Native share failed:', err);
      }
      return false;
    }
  }

  /* ===========================================
     6. BUILD MODAL
     =========================================== */
  function buildModal() {
    if (document.getElementById(CONFIG.modalId)) return;

    const modal = document.createElement('div');
    modal.id = CONFIG.modalId;
    modal.className = 'share-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'share-modal-title');
    modal.innerHTML = `
      <div class="share-modal-backdrop" data-close></div>
      <div class="share-modal-panel">
        <div class="share-modal-header">
          <h2 class="share-modal-title" id="share-modal-title">Share this page</h2>
          <button class="share-modal-close" data-close aria-label="Close">${ICONS.close}</button>
        </div>

        <div class="share-modal-body">

          <!-- Link copy -->
          <div class="share-link-box">
            <input type="text" class="share-link-input" id="share-link" readonly>
            <button class="share-link-copy" data-copy-link>
              ${ICONS.link} Copy
            </button>
          </div>

          <!-- Social buttons -->
          <div class="share-grid">
            <button class="share-btn share-btn-facebook" data-share="facebook" aria-label="Share on Facebook">
              ${ICONS.facebook}
              <span>Facebook</span>
            </button>
            <button class="share-btn share-btn-twitter" data-share="twitter" aria-label="Share on X">
              ${ICONS.twitter}
              <span>X / Twitter</span>
            </button>
            <button class="share-btn share-btn-linkedin" data-share="linkedin" aria-label="Share on LinkedIn">
              ${ICONS.linkedin}
              <span>LinkedIn</span>
            </button>
            <button class="share-btn share-btn-whatsapp" data-share="whatsapp" aria-label="Share on WhatsApp">
              ${ICONS.whatsapp}
              <span>WhatsApp</span>
            </button>
            <button class="share-btn share-btn-telegram" data-share="telegram" aria-label="Share on Telegram">
              ${ICONS.telegram}
              <span>Telegram</span>
            </button>
            <button class="share-btn share-btn-reddit" data-share="reddit" aria-label="Share on Reddit">
              ${ICONS.reddit}
              <span>Reddit</span>
            </button>
            <button class="share-btn share-btn-pinterest" data-share="pinterest" aria-label="Share on Pinterest">
              ${ICONS.pinterest}
              <span>Pinterest</span>
            </button>
            <button class="share-btn share-btn-email" data-share="email" aria-label="Share via Email">
              ${ICONS.email}
              <span>Email</span>
            </button>
          </div>

          <!-- QR code -->
          <div class="share-qr-section" id="share-qr-section" hidden>
            <div class="share-qr-header">Scan QR Code</div>
            <div class="share-qr-wrap">
              <canvas id="share-qr-canvas" width="200" height="200"></canvas>
              <button class="share-qr-download" data-download-qr>Download QR</button>
            </div>
          </div>

        </div>

        <div class="share-modal-footer">
          <button class="share-qr-toggle" data-toggle-qr>
            ${ICONS.qr} Show QR Code
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    attachModalEvents(modal);
  }

  /* ===========================================
     7. MODAL EVENTS
     =========================================== */
  function attachModalEvents(modal) {
    // Close on backdrop / close btn
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) {
        closeModal();
      }
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    // Social button clicks
    modal.querySelectorAll('[data-share]').forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.share;
        const data = modal._shareData;
        if (!data) return;

        if (shareUrls[platform]) {
          const url = shareUrls[platform](data);
          window.open(url, '_blank', 'width=600,height=500,noopener,noreferrer');
          trackShare(platform, data);
        }
      });
    });

    // Copy link
    modal.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
      const input = modal.querySelector('#share-link');
      if (!input) return;
      try {
        await navigator.clipboard.writeText(input.value);
        const btn = modal.querySelector('[data-copy-link]');
        const original = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove('copied');
        }, 2000);
      } catch (e) {
        input.select();
        document.execCommand('copy');
      }
    });

    // Toggle QR
    modal.querySelector('[data-toggle-qr]')?.addEventListener('click', async () => {
      const section = modal.querySelector('#share-qr-section');
      const isHidden = section.hasAttribute('hidden');

      if (isHidden) {
        section.removeAttribute('hidden');
        await renderQR(modal._shareData.url);
      } else {
        section.setAttribute('hidden', '');
      }
    });

    // Download QR
    modal.querySelector('[data-download-qr]')?.addEventListener('click', () => {
      const canvas = modal.querySelector('#share-qr-canvas');
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'bigtoolz-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  /* ===========================================
     8. QR CODE RENDER
     =========================================== */
  async function renderQR(text) {
    const canvas = document.getElementById('share-qr-canvas');
    if (!canvas) return;

    // Try to use qrcode.js from vendors
    if (window.QRCode && typeof window.QRCode.toCanvas === 'function') {
      try {
        await window.QRCode.toCanvas(canvas, text, {
          width: 200,
          margin: 1,
          color: {
            dark: '#1a1a2e',
            light: '#ffffff'
          }
        });
        return;
      } catch (e) {}
    }

    // Fallback: use API (external — works without local lib)
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 200, 200);
      ctx.drawImage(img, 0, 0, 200, 200);
    };
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  }

  /* ===========================================
     9. OPEN / CLOSE MODAL
     =========================================== */
  function openModal(data) {
    buildModal();
    const modal = document.getElementById(CONFIG.modalId);
    if (!modal) return;

    modal._shareData = data;

    // Fill link input
    const input = modal.querySelector('#share-link');
    if (input) input.value = data.url;

    // Show modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    setTimeout(() => {
      modal.querySelector('.share-modal-close')?.focus();
    }, 50);

    // Analytics
    if (window.gtag) {
      window.gtag('event', 'share_modal_open', {
        page_url: data.url
      });
    }
  }

  function closeModal() {
    const modal = document.getElementById(CONFIG.modalId);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ===========================================
     10. TRACK SHARE
     =========================================== */
  function trackShare(platform, data) {
    if (!CONFIG.trackAnalytics) return;

    // GA4
    if (window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'page',
        item_id: data.url
      });
    }

    // Custom event for other scripts
    window.dispatchEvent(new CustomEvent('share', {
      detail: { platform, url: data.url, title: data.title }
    }));
  }

  /* ===========================================
     11. MAIN SHARE FUNCTION
     =========================================== */
  async function share(el) {
    const data = getShareData(el);

    // Try native share first (mobile)
    if (navigator.share) {
      const shared = await nativeShare(data);
      if (shared) return;
    }

    // Fallback: open modal
    openModal(data);
  }

  /* ===========================================
     12. AUTO-DETECT BUTTONS
     =========================================== */
  function initAutoDetect() {
    if (!CONFIG.autoDetect) return;

    document.addEventListener('click', (e) => {
      const btn = e.target.closest(
        '[data-share], .share-btn, .article-share-btn.copy, .share-trigger'
      );
      if (!btn) return;

      // Skip if inside modal (handled separately)
      if (btn.closest('.share-modal')) return;

      // Skip platform-specific buttons (they're handled elsewhere)
      if (btn.dataset.platform) return;

      e.preventDefault();
      share(btn);
    });
  }

  /* ===========================================
     13. INIT
     =========================================== */
  function init() {
    initAutoDetect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ===========================================
     14. PUBLIC API
     =========================================== */
  window.BigToolzShare = {
    share,
    open: openModal,
    close: closeModal,
    urls: shareUrls,
    data: getShareData
  };

})();