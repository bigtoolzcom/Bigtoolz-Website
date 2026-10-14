/* ===== HTML to PDF - BigToolz ===== */
'use strict';

/* ===== THEME ===== */
(function(){
  try {
    var t = localStorage.getItem('theme');
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && d)) document.documentElement.setAttribute('data-theme', 'dark');
    else if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
  } catch(e) {}
})();

document.querySelector('.theme-btn')?.addEventListener('click', function() {
  var h = document.documentElement;
  var c = h.getAttribute('data-theme');
  var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var n = c === 'dark' ? 'light' : c === 'light' ? 'dark' : (d ? 'light' : 'dark');
  h.setAttribute('data-theme', n);
  try { localStorage.setItem('theme', n); } catch(e) {}
});

/* ===== HELPERS ===== */
var $ = function(s, p) { return (p || document).querySelector(s); };
var $$ = function(s, p) { return Array.prototype.slice.call((p || document).querySelectorAll(s)); };

function showToast(msg, type, duration) {
  type = type || 'info';
  duration = duration || 3000;
  var t = $('#toast');
  if (!t) return;
  t.className = 'toast visible' + (type !== 'info' ? ' ' + type : '');
  t.textContent = msg;
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.classList.remove('visible'); }, duration);
}

function showError(msg) {
  var box = $('#errorBox');
  var m = $('#errorMsg');
  if (box && m) {
    m.textContent = msg;
    box.classList.add('visible');
  }
}
function hideError() {
  var box = $('#errorBox');
  if (box) box.classList.remove('visible');
}

function setProgress(pct, text) {
  var fill = $('#progressFill');
  var txt = $('#progressText');
  if (fill) fill.style.width = pct + '%';
  if (txt) txt.textContent = text || 'Generating PDF...';
}

/* ===== STATE ===== */
var state = {
  mode: 'code',
  html: '',
  previewMode: 'rendered'
};

/* ===== DOM ===== */
var htmlCode = $('#htmlCode');
var fileDrop = $('#fileDrop');
var fileInput = $('#fileInput');
var urlInput = $('#urlInput');
var urlFetchBtn = $('#urlFetchBtn');
var previewFrame = $('#previewFrame');
var pageSize = $('#pageSize');
var orientation = $('#orientation');
var marginTop = $('#marginTop');
var fileName = $('#fileName');
var scale = $('#scale');
var convertBtn = $('#convertBtn');
var printBtn = $('#printBtn');
var clearBtn = $('#clearBtn');
var progressWrap = $('#progressWrap');

/* ===== MODE TABS ===== */
$$('.mode-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    $$('.mode-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    state.mode = tab.dataset.mode;

    $$('.input-panel').forEach(function(p) {
      p.classList.toggle('active', p.dataset.panel === state.mode);
    });
  });
});

/* ===== PREVIEW TOGGLE ===== */
$$('.preview-toggle button').forEach(function(btn) {
  btn.addEventListener('click', function() {
    $$('.preview-toggle button').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    state.previewMode = btn.dataset.preview;
    renderPreview();
  });
});

/* ===== GET CURRENT HTML ===== */
function getCurrentHtml() {
  if (state.mode === 'code') {
    return htmlCode.value || '';
  }
  return state.html || '';
}

/* ===== PREVIEW RENDER ===== */
function renderPreview() {
  var html = getCurrentHtml();
  var doc = previewFrame.contentDocument || previewFrame.contentWindow.document;

  if (!html.trim()) {
    doc.open();
    doc.write('\x3C!DOCTYPE html>\x3Chtml>\x3Chead>\x3Cstyle>body{font-family:sans-serif;padding:40px;text-align:center;color:#9ca3af;}\x3C/style>\x3C/head>\x3Cbody>\x3Cp>Preview will appear here...\x3C/p>\x3C/body>\x3C/html>');
    doc.close();
    return;
  }

  var previewHtml;
  if (state.previewMode === 'source') {
    previewHtml = '\x3C!DOCTYPE html>\x3Chtml>\x3Chead>\x3Cstyle>body{margin:0;padding:16px;background:#1a1a2e;color:#e2e8f0;font-family:monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;word-break:break-all;}\x3C/style>\x3C/head>\x3Cbody>' + escapeHtml(html) + '\x3C/body>\x3C/html>';
  } else {
    // Extract body if full HTML doc, else wrap
    if (/<body[\s>]/i.test(html) || /<html[\s>]/i.test(html)) {
      previewHtml = html;
    } else {
      previewHtml = '\x3C!DOCTYPE html>\x3Chtml>\x3Chead>\x3Cmeta charset="utf-8">\x3Cstyle>body{font-family:Inter,sans-serif;padding:20px;line-height:1.6;color:#1a1a2e;}\x3C/style>\x3C/head>\x3Cbody>' + html + '\x3C/body>\x3C/html>';
    }
  }

  doc.open();
  doc.write(previewHtml);
  doc.close();
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ===== INPUT EVENTS ===== */
htmlCode.addEventListener('input', function() {
  state.html = htmlCode.value;
  renderPreview();
});

/* ===== FILE DROP ===== */
fileDrop.addEventListener('click', function() { fileInput.click(); });

fileDrop.addEventListener('dragover', function(e) {
  e.preventDefault();
  fileDrop.classList.add('dragover');
});
fileDrop.addEventListener('dragleave', function(e) {
  e.preventDefault();
  fileDrop.classList.remove('dragover');
});
fileDrop.addEventListener('drop', function(e) {
  e.preventDefault();
  fileDrop.classList.remove('dragover');
  var f = e.dataTransfer.files[0];
  if (f) readHtmlFile(f);
});

fileInput.addEventListener('change', function(e) {
  var f = e.target.files[0];
  if (f) readHtmlFile(f);
  fileInput.value = '';
});

function readHtmlFile(file) {
  var reader = new FileReader();
  reader.onload = function(ev) {
    state.html = ev.target.result;
    htmlCode.value = state.html;
    renderPreview();
    showToast('Loaded ' + file.name, 'success');
  };
  reader.readAsText(file);
}

/* ===== URL FETCH ===== */
urlFetchBtn.addEventListener('click', function() {
  var url = urlInput.value.trim();
  if (!url) {
    showToast('Please enter a URL', 'error');
    return;
  }
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  urlFetchBtn.disabled = true;
  urlFetchBtn.textContent = 'Fetching...';
  hideError();

  fetch(url, { mode: 'cors' })
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function(text) {
      state.html = text;
      htmlCode.value = text;
      renderPreview();
      showToast('Fetched URL successfully', 'success');
    })
    .catch(function(err) {
      console.error('Fetch error:', err);
      showError('Could not fetch the URL. This may be due to CORS restrictions on the website. Try pasting the HTML manually in "Paste HTML" mode.');
      showToast('Fetch failed — try manual paste', 'error');
    })
    .finally(function() {
      urlFetchBtn.disabled = false;
      urlFetchBtn.textContent = 'Fetch';
    });
});

/* ===== CONVERT TO PDF ===== */
convertBtn.addEventListener('click', function() {
  var html = getCurrentHtml().trim();
  hideError();

  if (!html) {
    showError('Please add some HTML first (paste, upload, or fetch a URL).');
    return;
  }

  if (typeof html2pdf === 'undefined') {
    showError('PDF library not loaded. Please check your internet connection and refresh the page.');
    return;
  }

  progressWrap.classList.add('visible');
  setProgress(10, 'Preparing HTML...');
  convertBtn.disabled = true;

  // Build a clean container for PDF generation
  var container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-99999px;top:0;width:794px;background:#fff;padding:0;';

  // Build the final HTML
  var finalHtml;
  if (/<html[\s>]/i.test(html) || /<body[\s>]/i.test(html)) {
    finalHtml = html;
  } else {
    finalHtml = '\x3C!DOCTYPE html>\x3Chtml>\x3Chead>\x3Cmeta charset="utf-8">\x3Cstyle>*{box-sizing:border-box;}\x3C/style>\x3C/head>\x3Cbody>' + html + '\x3C/body>\x3C/html>';
  }

  // Use iframe to isolate styles
  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-99999px;top:0;width:794px;height:1123px;border:0;';
  document.body.appendChild(iframe);

  var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(finalHtml);
  iframeDoc.close();

  setProgress(30, 'Rendering content...');

  // Wait for iframe to render
  setTimeout(function() {
    var target = iframeDoc.body;

    setProgress(50, 'Generating PDF...');

    var marginMm = parseInt(marginTop.value, 10) || 10;
    var outputName = (fileName.value.trim() || 'converted') + '.pdf';
    var scaleVal = parseInt(scale.value, 10) || 2;

    var opt = {
      margin: marginMm,
      filename: outputName,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: scaleVal,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: iframeDoc.documentElement.scrollWidth,
        windowHeight: iframeDoc.documentElement.scrollHeight
      },
      jsPDF: {
        unit: 'mm',
        format: pageSize.value,
        orientation: orientation.value
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(target).save()
      .then(function() {
        setProgress(100, 'Done!');
        showToast('PDF downloaded successfully!', 'success');
        setTimeout(function() {
          progressWrap.classList.remove('visible');
          setProgress(0, '');
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        }, 1200);
      })
      .catch(function(err) {
        console.error('PDF generation error:', err);
        showError('Failed to generate PDF. Try reducing content size or changing the scale setting.');
        progressWrap.classList.remove('visible');
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      })
      .finally(function() {
        convertBtn.disabled = false;
      });
  }, 500);
});

/* ===== PRINT TO PDF ===== */
printBtn.addEventListener('click', function() {
  var html = getCurrentHtml().trim();
  if (!html) {
    showError('Please add some HTML first.');
    return;
  }

  var printWindow = window.open('', '_blank');
  if (!printWindow) {
    showError('Pop-up blocked. Please allow pop-ups for this site.');
    return;
  }

  var finalHtml;
  if (/<html[\s>]/i.test(html) || /<body[\s>]/i.test(html)) {
    finalHtml = html;
  } else {
    finalHtml = '\x3C!DOCTYPE html>\x3Chtml>\x3Chead>\x3Cmeta charset="utf-8">\x3Ctitle>Print\x3C/title>\x3C/head>\x3Cbody>' + html + '\x3C/body>\x3C/html>';
  }

  printWindow.document.open();
  printWindow.document.write(finalHtml);
  printWindow.document.close();

  setTimeout(function() {
    printWindow.focus();
    printWindow.print();
  }, 500);
});

/* ===== CLEAR ===== */
clearBtn.addEventListener('click', function() {
  htmlCode.value = '';
  state.html = '';
  renderPreview();
  hideError();
  showToast('Cleared', 'info');
});

/* ===== FAQ ===== */
$$('.faq-question').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item = btn.parentElement;
    var isOpen = item.classList.contains('open');
    $$('.faq-item').forEach(function(i) { i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  });
});

/* ===== INIT ===== */
renderPreview();