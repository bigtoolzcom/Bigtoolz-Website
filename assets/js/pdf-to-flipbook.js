/* ===== PDF to Flipbook - BigToolz ===== */
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

function setStatusBar(pct, text) {
  var fill = $('#progressFill');
  var txt = $('#progressText');
  if (fill) fill.style.width = pct + '%';
  if (txt) txt.textContent = text;
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

/* ===== PDF.JS SETUP ===== */
if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

/* ===== STATE ===== */
var state = {
  pdf: null,
  totalPages: 0,
  currentPage: 0,
  pages: [],
  zoom: 1,
  isFlipping: false
};

/* ===== DOM ===== */
var dropzone = $('#dropzone');
var fileInput = $('#fileInput');
var chooseBtn = $('#chooseBtn');
var browseLink = $('#browseLink');
var progressWrap = $('#progressWrap');
var flipbookWrap = $('#flipbookWrap');
var book = $('#book');
var bookSpine = $('#bookSpine');
var flipbookStage = $('#flipbookStage');
var pageInfo = $('#pageInfo');
var prevBtn = $('#prevBtn');
var nextBtn = $('#nextBtn');
var prevBtn2 = $('#prevBtn2');
var nextBtn2 = $('#nextBtn2');
var thumbBtn = $('#thumbBtn');
var thumbnails = $('#thumbnails');
var thumbnailsGrid = $('#thumbnailsGrid');
var zoomInBtn = $('#zoomInBtn');
var zoomOutBtn = $('#zoomOutBtn');
var fullscreenBtn = $('#fullscreenBtn');
var downloadBtn = $('#downloadBtn');
var resetBtn = $('#resetBtn');

/* ===== LOAD PDF ===== */
function loadPDF(file) {
  if (!window.pdfjsLib) {
    showError('PDF.js library not loaded. Please check your internet connection and refresh the page.');
    return;
  }

  hideError();
  dropzone.style.display = 'none';
  flipbookWrap.classList.remove('visible');
  progressWrap.classList.add('visible');
  setStatusBar(0, 'Reading PDF...');

  var reader = new FileReader();
  reader.onload = function(e) {
    var typedArray = new Uint8Array(e.target.result);
    window.pdfjsLib.getDocument({ data: typedArray }).promise.then(function(pdf) {
      state.pdf = pdf;
      state.totalPages = pdf.numPages;
      state.currentPage = 0;
      state.pages = [];
      renderAllPages();
    }).catch(function(err) {
      console.error('PDF load error:', err);
      progressWrap.classList.remove('visible');
      dropzone.style.display = '';
      showError('Failed to load PDF. The file may be corrupted or password-protected.');
    });
  };
  reader.onerror = function() {
    progressWrap.classList.remove('visible');
    dropzone.style.display = '';
    showError('Failed to read file.');
  };
  reader.readAsArrayBuffer(file);
}

/* ===== RENDER ALL PAGES ===== */
function renderAllPages() {
  var total = state.totalPages;
  var rendered = 0;
  book.innerHTML = '';
  thumbnailsGrid.innerHTML = '';

  // Render each page to a canvas
  var renderQueue = [];
  for (var i = 1; i <= total; i++) {
    renderQueue.push(i);
  }

  function renderNext() {
    if (!renderQueue.length) {
      onAllRendered();
      return;
    }
    var pageNum = renderQueue.shift();
    state.pdf.getPage(pageNum).then(function(page) {
      // Base scale for full-size render
      var viewport = page.getViewport({ scale: 1.5 });
      var canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      var ctx = canvas.getContext('2d');

      page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function() {
        state.pages.push(canvas);

        // Build thumb
        var thumbCanvas = document.createElement('canvas');
        var thumbViewport = page.getViewport({ scale: 0.25 });
        thumbCanvas.width = thumbViewport.width;
        thumbCanvas.height = thumbViewport.height;
        thumbCanvas.getContext('2d').drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);

        var thumbEl = document.createElement('div');
        thumbEl.className = 'thumb';
        thumbEl.dataset.page = pageNum - 1;
        var img = document.createElement('img');
        img.src = thumbCanvas.toDataURL('image/jpeg', 0.7);
        thumbEl.appendChild(img);
        var numBadge = document.createElement('span');
        numBadge.className = 'thumb-num';
        numBadge.textContent = pageNum;
        thumbEl.appendChild(numBadge);
        thumbEl.addEventListener('click', function() {
          goToPage(parseInt(this.dataset.page, 10));
        });
        thumbnailsGrid.appendChild(thumbEl);

        rendered++;
        var pct = Math.round((rendered / total) * 100);
        setStatusBar(pct, 'Rendering page ' + rendered + ' of ' + total + '...');

        renderNext();
      });
    }).catch(function(err) {
      console.error('Page render error:', err);
      rendered++;
      renderNext();
    });
  }

  renderNext();
}

function onAllRendered() {
  progressWrap.classList.remove('visible');
  flipbookWrap.classList.add('visible');
  showToast('✅ PDF loaded! ' + state.totalPages + ' pages ready.', 'success');
  goToPage(0);
  updatePageInfo();
}

/* ===== RENDER FLIPBOOK PAGE ===== */
function renderFlipbook() {
  book.innerHTML = '';
  var total = state.totalPages;

  if (state.currentPage < 0 || state.currentPage >= total) return;

  // Previous page (flipped/visible left side)
  if (state.currentPage > 0) {
    var prevPage = document.createElement('div');
    prevPage.className = 'page flipped';
    var prevCanvas = state.pages[state.currentPage - 1];
    if (prevCanvas) prevPage.appendChild(cloneCanvas(prevCanvas));
    // Position left
    prevPage.style.left = '0';
    prevPage.style.width = '50%';
    book.appendChild(prevPage);
  }

  // Current page (right side)
  var curPage = document.createElement('div');
  curPage.className = 'page-right';
  var curCanvas = state.pages[state.currentPage];
  if (curCanvas) curPage.appendChild(cloneCanvas(curCanvas));
  book.appendChild(curPage);

  // Set book size
  var stage = flipbookStage.getBoundingClientRect();
  var targetW = Math.min(stage.width - 120, 800);
  var targetH = Math.min(stage.height - 80, 520);
  if (curCanvas) {
    var ratio = curCanvas.height / curCanvas.width;
    var w = targetW / 2;
    var h = w * ratio;
    if (h > targetH) {
      h = targetH;
      w = h / ratio;
    }
    book.style.width = (w * 2) + 'px';
    book.style.height = h + 'px';
  }
}

function cloneCanvas(source) {
  var c = document.createElement('canvas');
  c.width = source.width;
  c.height = source.height;
  c.getContext('2d').drawImage(source, 0, 0);
  return c;
}

/* ===== NAVIGATION ===== */
function goToPage(index) {
  if (state.isFlipping) return;
  if (index < 0 || index >= state.totalPages) return;

  state.isFlipping = true;
  state.currentPage = index;

  renderFlipbook();
  updatePageInfo();
  updateThumbActive();

  setTimeout(function() { state.isFlipping = false; }, 400);
}

function nextPage() { goToPage(state.currentPage + 1); }
function prevPage() { goToPage(state.currentPage - 1); }

function updatePageInfo() {
  pageInfo.textContent = 'Page ' + (state.currentPage + 1) + ' of ' + state.totalPages;
  prevBtn.disabled = state.currentPage === 0;
  nextBtn.disabled = state.currentPage >= state.totalPages - 1;
  prevBtn2.disabled = state.currentPage === 0;
  nextBtn2.disabled = state.currentPage >= state.totalPages - 1;
}

function updateThumbActive() {
  $$('.thumb').forEach(function(t) {
    t.classList.toggle('active', parseInt(t.dataset.page, 10) === state.currentPage);
  });
}

/* ===== EVENT BINDINGS ===== */
chooseBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  fileInput.click();
});
browseLink.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  fileInput.click();
});
dropzone.addEventListener('click', function() { fileInput.click(); });

fileInput.addEventListener('change', function(e) {
  var f = e.target.files[0];
  if (f && (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))) {
    loadPDF(f);
  } else {
    showToast('Please select a PDF file', 'error');
  }
  fileInput.value = '';
});

['dragenter', 'dragover'].forEach(function(evt) {
  dropzone.addEventListener(evt, function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.add('dragover');
  });
});
['dragleave', 'drop'].forEach(function(evt) {
  dropzone.addEventListener(evt, function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove('dragover');
  });
});
dropzone.addEventListener('drop', function(e) {
  var f = e.dataTransfer.files[0];
  if (f && (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))) {
    loadPDF(f);
  } else {
    showToast('Please drop a PDF file', 'error');
  }
});

prevBtn.addEventListener('click', prevPage);
nextBtn.addEventListener('click', nextPage);
prevBtn2.addEventListener('click', prevPage);
nextBtn2.addEventListener('click', nextPage);

document.addEventListener('keydown', function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') {
    e.preventDefault();
    nextPage();
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    prevPage();
  }
});

thumbBtn.addEventListener('click', function() {
  thumbnails.classList.toggle('visible');
});

zoomInBtn.addEventListener('click', function() {
  state.zoom = Math.min(state.zoom + 0.15, 2);
  book.style.transform = 'scale(' + state.zoom + ')';
  showToast('Zoom: ' + Math.round(state.zoom * 100) + '%', 'info', 1500);
});
zoomOutBtn.addEventListener('click', function() {
  state.zoom = Math.max(state.zoom - 0.15, 0.5);
  book.style.transform = 'scale(' + state.zoom + ')';
  showToast('Zoom: ' + Math.round(state.zoom * 100) + '%', 'info', 1500);
});

fullscreenBtn.addEventListener('click', function() {
  if (!document.fullscreenElement) {
    flipbookStage.requestFullscreen().catch(function() {
      showToast('Fullscreen not supported', 'error');
    });
  } else {
    document.exitFullscreen();
  }
});

downloadBtn.addEventListener('click', function() {
  if (!state.pages.length) {
    showToast('No pages to download', 'error');
    return;
  }
  var canvas = state.pages[state.currentPage];
  if (!canvas) return;
  canvas.toBlob(function(blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'page-' + (state.currentPage + 1) + '.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    showToast('Page ' + (state.currentPage + 1) + ' downloaded', 'success');
  }, 'image/png');
});

resetBtn.addEventListener('click', function() {
  state.pdf = null;
  state.pages = [];
  state.currentPage = 0;
  state.totalPages = 0;
  book.innerHTML = '';
  thumbnailsGrid.innerHTML = '';
  thumbnails.classList.remove('visible');
  flipbookWrap.classList.remove('visible');
  progressWrap.classList.remove('visible');
  hideError();
  dropzone.style.display = '';
  showToast('Ready for new PDF', 'info');
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

/* ===== RESIZE ===== */
var resizeTimer;
window.addEventListener('resize', function() {
  if (!state.pdf || state.currentPage === undefined) return;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    if (flipbookWrap.classList.contains('visible')) renderFlipbook();
  }, 200);
});