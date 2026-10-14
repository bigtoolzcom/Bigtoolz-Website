/* ===========================================
   BigToolz - File Download Helper
   Version: 1.0.0
   Last updated: 2026-01-15
   Purpose: Universal download utility for tools
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. CONFIG
     =========================================== */
  const CONFIG = {
    defaultFilename: 'bigtoolz-download',
    defaultExtension: 'txt',
    timestampFilenames: false,
    toastOnSuccess: true,
    toastOnError: true,
    revokeDelay: 1000  // ms before revoking object URL
  };

  /* ===========================================
     2. HELPERS
     =========================================== */

  /**
   * Generate unique filename with timestamp
   */
  function generateFilename(base, ext) {
    base = base || CONFIG.defaultFilename;
    ext = ext || CONFIG.defaultExtension;

    // Clean the base name
    base = base
      .toString()
      .trim()
      .replace(/[^a-z0-9\-\_]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();

    // Add timestamp if enabled
    if (CONFIG.timestampFilenames) {
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      base = `${base}-${ts}`;
    }

    return `${base}.${ext}`;
  }

  /**
   * Get extension from MIME type
   */
  function mimeToExt(mime) {
    const map = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
      'image/bmp': 'bmp',
      'application/pdf': 'pdf',
      'application/json': 'json',
      'application/xml': 'xml',
      'application/zip': 'zip',
      'text/plain': 'txt',
      'text/csv': 'csv',
      'text/html': 'html',
      'text/css': 'css',
      'text/javascript': 'js',
      'application/javascript': 'js',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
    };
    return map[mime] || CONFIG.defaultExtension;
  }

  /**
   * Show toast (if available)
   */
  function notify(message, type = 'info') {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
    }
  }

  /**
   * Trigger download via anchor
   */
  function triggerDownload(href, filename, revoke = false) {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    a.style.display = 'none';
    a.setAttribute('rel', 'noopener');

    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
      if (revoke) URL.revokeObjectURL(href);
    }, CONFIG.revokeDelay);
  }

  /* ===========================================
     3. DOWNLOAD FROM BLOB
     =========================================== */
  /**
   * Download a Blob object
   * @param {Blob} blob
   * @param {string} filename
   */
  function downloadBlob(blob, filename) {
    if (!(blob instanceof Blob)) {
      notify('Invalid file data', 'error');
      return false;
    }

    filename = filename || generateFilename(
      CONFIG.defaultFilename,
      mimeToExt(blob.type)
    );

    try {
      const url = URL.createObjectURL(blob);
      triggerDownload(url, filename, true);

      if (CONFIG.toastOnSuccess) {
        notify('Download started!', 'success');
      }

      // Analytics
      if (window.gtag) {
        window.gtag('event', 'file_download', {
          file_name: filename,
          file_size: blob.size,
          file_type: blob.type
        });
      }

      return true;
    } catch (err) {
      console.error('Blob download failed:', err);
      if (CONFIG.toastOnError) notify('Download failed', 'error');
      return false;
    }
  }

  /* ===========================================
     4. DOWNLOAD FROM DATA URL
     =========================================== */
  /**
   * Download from a Data URL (base64, etc.)
   * @param {string} dataUrl — e.g. "data:image/png;base64,..."
   * @param {string} filename
   */
  function downloadDataUrl(dataUrl, filename) {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      notify('Invalid data URL', 'error');
      return false;
    }

    try {
      // Extract MIME and guess extension
      const mimeMatch = dataUrl.match(/^data:([^;,]+)/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const ext = mimeToExt(mime);

      filename = filename || generateFilename(CONFIG.defaultFilename, ext);

      triggerDownload(dataUrl, filename);

      if (CONFIG.toastOnSuccess) {
        notify('Download started!', 'success');
      }

      if (window.gtag) {
        window.gtag('event', 'file_download', {
          file_name: filename,
          file_type: mime
        });
      }

      return true;
    } catch (err) {
      console.error('Data URL download failed:', err);
      if (CONFIG.toastOnError) notify('Download failed', 'error');
      return false;
    }
  }

  /* ===========================================
     5. DOWNLOAD FROM CANVAS
     =========================================== */
  /**
   * Download a canvas as image
   * @param {HTMLCanvasElement} canvas
   * @param {string} filename
   * @param {string} type — 'image/png' | 'image/jpeg' | 'image/webp'
   * @param {number} quality — 0.0 to 1.0 (for jpg/webp)
   */
  function downloadCanvas(canvas, filename, type = 'image/png', quality = 0.92) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      notify('Invalid canvas', 'error');
      return false;
    }

    try {
      const ext = mimeToExt(type);
      filename = filename || generateFilename(CONFIG.defaultFilename, ext);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            if (CONFIG.toastOnError) notify('Canvas export failed', 'error');
            return;
          }
          downloadBlob(blob, filename);
        },
        type,
        quality
      );

      return true;
    } catch (err) {
      console.error('Canvas download failed:', err);
      if (CONFIG.toastOnError) notify('Download failed', 'error');
      return false;
    }
  }

  /* ===========================================
     6. DOWNLOAD FROM SVG
     =========================================== */
  /**
   * Download an SVG element as PNG or SVG
   * @param {SVGElement} svgElement
   * @param {string} filename
   * @param {number} scale — 1, 2, 3 (for higher resolution)
   */
  function downloadSvg(svgElement, filename = 'image', scale = 2) {
    if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
      notify('Invalid SVG element', 'error');
      return false;
    }

    try {
      // Get SVG dimensions
      const bbox = svgElement.getBoundingClientRect();
      const width = svgElement.viewBox?.baseVal?.width || bbox.width || 300;
      const height = svgElement.viewBox?.baseVal?.height || bbox.height || 300;

      // Serialize SVG
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgElement);

      // Add XML namespace if missing
      if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(
          /^<svg/,
          '<svg xmlns="http://www.w3.org/2000/svg"'
        );
      }

      // Create SVG blob
      const svgBlob = new Blob([svgString], {
        type: 'image/svg+xml;charset=utf-8'
      });

      const svgUrl = URL.createObjectURL(svgBlob);

      // Create image to render
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        URL.revokeObjectURL(svgUrl);

        // Download as PNG
        const pngFilename = filename.replace(/\.svg$/i, '') + '.png';
        downloadCanvas(canvas, pngFilename, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(svgUrl);
        if (CONFIG.toastOnError) notify('SVG render failed', 'error');
      };

      img.src = svgUrl;
      return true;
    } catch (err) {
      console.error('SVG download failed:', err);
      if (CONFIG.toastOnError) notify('Download failed', 'error');
      return false;
    }
  }

  /* ===========================================
     7. DOWNLOAD FROM URL (Remote)
     =========================================== */
  /**
   * Download a remote file (with progress)
   * @param {string} url
   * @param {string} filename
   * @param {Function} onProgress — (loaded, total) => void
   */
  async function downloadFromUrl(url, filename, onProgress) {
    if (!url) {
      notify('Invalid URL', 'error');
      return false;
    }

    try {
      const response = await fetch(url, { mode: 'cors' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentLength = +response.headers.get('content-length') || 0;
      const contentType = response.headers.get('content-type') || '';
      const mime = contentType.split(';')[0].trim();

      // If no streaming (no progress needed)
      if (!onProgress || !response.body || !contentLength) {
        const blob = await response.blob();
        filename = filename || generateFilename(
          extractFilenameFromUrl(url) || CONFIG.defaultFilename,
          mimeToExt(mime)
        );
        return downloadBlob(blob, filename);
      }

      // Stream with progress
      const reader = response.body.getReader();
      const chunks = [];
      let loaded = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;
        onProgress(loaded, contentLength);
      }

      const blob = new Blob(chunks, { type: mime });
      filename = filename || generateFilename(
        extractFilenameFromUrl(url) || CONFIG.defaultFilename,
        mimeToExt(mime)
      );

      return downloadBlob(blob, filename);
    } catch (err) {
      console.error('Remote download failed:', err);
      if (CONFIG.toastOnError) notify('Download failed', 'error');
      return false;
    }
  }

  function extractFilenameFromUrl(url) {
    try {
      const path = new URL(url, window.location.origin).pathname;
      const name = path.split('/').pop();
      return name ? name.replace(/\.[^.]+$/, '') : null;
    } catch (e) {
      return null;
    }
  }

  /* ===========================================
     8. DOWNLOAD TEXT
     =========================================== */
  function downloadText(text, filename, mime = 'text/plain') {
    if (text === null || text === undefined) {
      notify('Nothing to download', 'error');
      return false;
    }

    text = String(text);
    const ext = mimeToExt(mime);
    filename = filename || generateFilename(CONFIG.defaultFilename, ext);

    const blob = new Blob([text], { type: `${mime};charset=utf-8` });
    return downloadBlob(blob, filename);
  }

  /* ===========================================
     9. DOWNLOAD JSON
     =========================================== */
  function downloadJson(data, filename) {
    try {
      const json = typeof data === 'string'
        ? data
        : JSON.stringify(data, null, 2);

      filename = filename || generateFilename(CONFIG.defaultFilename, 'json');
      return downloadText(json, filename, 'application/json');
    } catch (err) {
      console.error('JSON download failed:', err);
      if (CONFIG.toastOnError) notify('Invalid JSON data', 'error');
      return false;
    }
  }

  /* ===========================================
     10. DOWNLOAD CSV
     =========================================== */
  /**
   * Download array of arrays or array of objects as CSV
   * @param {Array} data
   * @param {string} filename
   */
  function downloadCsv(data, filename) {
    if (!Array.isArray(data) || !data.length) {
      notify('No data to download', 'error');
      return false;
    }

    try {
      let csv = '';

      // Array of objects
      if (typeof data[0] === 'object' && !Array.isArray(data[0])) {
        const headers = Object.keys(data[0]);
        csv += headers.map(escapeCsv).join(',') + '\n';
        data.forEach(row => {
          csv += headers.map(h => escapeCsv(row[h])).join(',') + '\n';
        });
      }
      // Array of arrays
      else if (Array.isArray(data[0])) {
        data.forEach(row => {
          csv += row.map(escapeCsv).join(',') + '\n';
        });
      }
      // Array of strings/numbers
      else {
        csv = data.map(escapeCsv).join('\n');
      }

      filename = filename || generateFilename(CONFIG.defaultFilename, 'csv');
      return downloadText(csv, filename, 'text/csv');
    } catch (err) {
      console.error('CSV download failed:', err);
      if (CONFIG.toastOnError) notify('CSV export failed', 'error');
      return false;
    }
  }

  function escapeCsv(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /* ===========================================
     11. DOWNLOAD MULTIPLE FILES (ZIP)
     =========================================== */
  /**
   * Download multiple files as ZIP
   * Requires JSZip library
   * @param {Array} files — [{ name, blob|data|text, type }]
   * @param {string} zipFilename
   */
  async function downloadZip(files, zipFilename = 'archive.zip') {
    if (typeof JSZip === 'undefined') {
      notify('ZIP library not loaded', 'error');
      console.error('JSZip required. Include: /assets/vendors/jszip/jszip.min.js');
      return false;
    }

    if (!Array.isArray(files) || !files.length) {
      notify('No files to zip', 'error');
      return false;
    }

    try {
      const zip = new JSZip();

      files.forEach(file => {
        const name = file.name || 'file';
        if (file.blob instanceof Blob) {
          zip.file(name, file.blob);
        } else if (typeof file.data === 'string') {
          zip.file(name, file.data);
        } else if (file.data) {
          zip.file(name, file.data);
        }
      });

      const blob = await zip.generateAsync(
        { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
        (metadata) => {
          // Optional progress callback
          if (typeof window.onZipProgress === 'function') {
            window.onZipProgress(metadata.percent);
          }
        }
      );

      return downloadBlob(blob, zipFilename);
    } catch (err) {
      console.error('ZIP download failed:', err);
      if (CONFIG.toastOnError) notify('ZIP creation failed', 'error');
      return false;
    }
  }

  /* ===========================================
     12. AUTO-DETECT DOWNLOAD BUTTONS
     =========================================== */
  function initAutoDetect() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-download]');
      if (!btn) return;

      e.preventDefault();

      const type = btn.dataset.download; // 'canvas' | 'url' | 'text' | 'json'
      const target = btn.dataset.downloadTarget;
      const url = btn.dataset.downloadUrl;
      const filename = btn.dataset.downloadFilename;
      const mime = btn.dataset.downloadType;

      switch (type) {
        case 'canvas': {
          const canvas = target
            ? document.querySelector(target)
            : btn.closest('.tool-workspace')?.querySelector('canvas');
          if (canvas) {
            downloadCanvas(canvas, filename, mime || 'image/png');
          }
          break;
        }

        case 'svg': {
          const svg = target
            ? document.querySelector(target)
            : btn.closest('.tool-workspace')?.querySelector('svg');
          if (svg) {
            downloadSvg(svg, filename || 'image');
          }
          break;
        }

        case 'url': {
          if (url) downloadFromUrl(url, filename);
          break;
        }

        case 'text': {
          const src = target
            ? document.querySelector(target)
            : null;
          const text = src ? src.textContent : btn.dataset.downloadContent;
          if (text) downloadText(text, filename, mime || 'text/plain');
          break;
        }

        case 'json': {
          const src = target
            ? document.querySelector(target)
            : null;
          let data = src ? src.textContent : btn.dataset.downloadContent;
          try {
            data = JSON.parse(data);
          } catch (e) {}
          if (data) downloadJson(data, filename);
          break;
        }
      }
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
  window.BigToolzDownload = {
    blob: downloadBlob,
    dataUrl: downloadDataUrl,
    canvas: downloadCanvas,
    svg: downloadSvg,
    url: downloadFromUrl,
    text: downloadText,
    json: downloadJson,
    csv: downloadCsv,
    zip: downloadZip,
    filename: generateFilename
  };

  // Convenience global
  window.downloadFile = downloadBlob;

})();