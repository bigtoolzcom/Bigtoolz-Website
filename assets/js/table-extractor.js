/* ===== PDF Table Extractor - BigToolz ===== */
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

function setProgress(pct, text) {
  var f = $('#progressFill'), t = $('#progressText');
  if (f) f.style.width = pct + '%';
  if (t) t.textContent = text;
}

function showError(msg) {
  var box = $('#errorBox'), m = $('#errorMsg');
  if (box && m) { m.textContent = msg; box.classList.add('visible'); }
}
function hideError() {
  var box = $('#errorBox');
  if (box) box.classList.remove('visible');
}

function copyToClipboard(text) {
  return new Promise(function(resolve) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function() { resolve(true); }).catch(function() { resolve(false); });
      return;
    }
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      resolve(ok);
    } catch(e) { resolve(false); }
  });
}

/* ===== PDF.JS SETUP ===== */
if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

/* ===== STATE ===== */
var state = {
  pdf: null,
  totalPages: 0,
  currentPage: 1,
  format: 'csv',
  tables: []
};

/* ===== DOM ===== */
var dropzone = $('#dropzone');
var fileInput = $('#fileInput');
var chooseBtn = $('#chooseBtn');
var browseLink = $('#browseLink');
var progressWrap = $('#progressWrap');
var extractorWrap = $('#extractorWrap');
var pageInfo = $('#pageInfo');
var prevBtn = $('#prevBtn');
var nextBtn = $('#nextBtn');
var extractBtn = $('#extractBtn');
var resetBtn = $('#resetBtn');
var tablePreview = $('#tablePreview');
var outputSection = $('#outputSection');
var outputArea = $('#outputArea');
var copyBtn = $('#copyBtn');
var downloadBtn = $('#downloadBtn');
var colDetect = $('#colDetect');
var minGapInput = $('#minGap');
var minRowsInput = $('#minRows');
var statTables = $('#statTables');
var statRows = $('#statRows');
var statCols = $('#statCols');

/* ===== LOAD PDF ===== */
function loadPDF(file) {
  if (!window.pdfjsLib) {
    showError('PDF.js library not loaded. Please check your internet connection and refresh.');
    return;
  }

  hideError();
  dropzone.style.display = 'none';
  extractorWrap.classList.remove('visible');
  progressWrap.classList.add('visible');
  setProgress(0, 'Reading PDF...');

  var reader = new FileReader();
  reader.onload = function(e) {
    var typedArray = new Uint8Array(e.target.result);
    window.pdfjsLib.getDocument({ data: typedArray }).promise.then(function(pdf) {
      state.pdf = pdf;
      state.totalPages = pdf.numPages;
      state.currentPage = 1;
      progressWrap.classList.remove('visible');
      extractorWrap.classList.add('visible');
      updatePageInfo();
      showToast('PDF loaded: ' + state.totalPages + ' pages', 'success');
    }).catch(function(err) {
      console.error('PDF load error:', err);
      progressWrap.classList.remove('visible');
      dropzone.style.display = '';
      showError('Failed to load PDF. File may be corrupted or password-protected.');
    });
  };
  reader.onerror = function() {
    progressWrap.classList.remove('visible');
    dropzone.style.display = '';
    showError('Failed to read file.');
  };
  reader.readAsArrayBuffer(file);
}

/* ===== PAGE INFO ===== */
function updatePageInfo() {
  pageInfo.textContent = 'Page ' + state.currentPage + ' / ' + state.totalPages;
  prevBtn.disabled = state.currentPage <= 1;
  nextBtn.disabled = state.currentPage >= state.totalPages;
}

/* ===== EXTRACT TABLES ===== */
extractBtn.addEventListener('click', function() {
  if (!state.pdf) return;

  hideError();
  setProgress(0, 'Extracting text...');
  progressWrap.classList.add('visible');

  state.pdf.getPage(state.currentPage).then(function(page) {
    var viewport = page.getViewport({ scale: 1 });
    return page.getTextContent().then(function(textContent) {
      var items = textContent.items.filter(function(it) { return it.str && it.str.trim(); });
      if (!items.length) {
        throw new Error('No text found on this page. This may be a scanned PDF (needs OCR).');
      }

      var tables = detectTables(items, viewport);
      state.tables = tables;
      renderExtraction(tables);
      progressWrap.classList.remove('visible');

      if (tables.length === 0) {
        showToast('No tables detected on this page', 'warn');
      } else {
        showToast('✅ ' + tables.length + ' table' + (tables.length > 1 ? 's' : '') + ' found!', 'success');
      }
    });
  }).catch(function(err) {
    console.error('Extract error:', err);
    progressWrap.classList.remove('visible');
    showError(err.message || 'Failed to extract text from this page.');
  });
});

/* ===== TABLE DETECTION ALGORITHM ===== */
function detectTables(items, viewport) {
  // Group items by lines (Y coordinate)
  var lineMap = {};
  var tolerance = 3;

  items.forEach(function(it) {
    var y = Math.round(it.transform[5]);
    var foundKey = null;
    for (var key in lineMap) {
      if (Math.abs(parseInt(key, 10) - y) <= tolerance) {
        foundKey = key;
        break;
      }
    }
    if (foundKey === null) {
      lineMap[y] = [];
      foundKey = y;
    }
    lineMap[foundKey].push({
      text: it.str,
      x: it.transform[4],
      width: it.width || 0,
      height: it.height || 10
    });
  });

  // Sort lines top-to-bottom
  var yKeys = Object.keys(lineMap).map(Number).sort(function(a, b) { return b - a; });

  // Build rows with X-sorted items
  var rows = yKeys.map(function(y) {
    var items = lineMap[y].sort(function(a, b) { return a.x - b.x; });
    return { y: y, items: items };
  });

  var mode = colDetect.value;
  var minGap = parseInt(minGapInput.value, 10) || 15;
  var minRows = parseInt(minRowsInput.value, 10) || 2;

  // Detect tables: consecutive rows with similar number of columns
  var tables = [];
  var currentTable = [];

  rows.forEach(function(row) {
    var cols = splitRowIntoColumns(row.items, mode, minGap);
    if (cols.length >= 2) {
      currentTable.push(cols);
    } else {
      // End of a table
      if (currentTable.length >= minRows) {
        tables.push(currentTable);
      }
      currentTable = [];
    }
  });

  if (currentTable.length >= minRows) {
    tables.push(currentTable);
  }

  return tables;
}

function splitRowIntoColumns(items, mode, minGap) {
  if (items.length === 0) return [];
  if (items.length === 1) return [items[0].text];

  // Sort by X
  var sorted = items.slice().sort(function(a, b) { return a.x - b.x; });
  var columns = [];
  var currentCol = [sorted[0]];

  for (var i = 1; i < sorted.length; i++) {
    var prev = sorted[i - 1];
    var curr = sorted[i];
    var gap = curr.x - (prev.x + prev.width);

    if (gap > minGap) {
      columns.push(currentCol.map(function(x) { return x.text; }).join(' ').trim());
      currentCol = [curr];
    } else {
      currentCol.push(curr);
    }
  }
  columns.push(currentCol.map(function(x) { return x.text; }).join(' ').trim());

  return columns.filter(function(c) { return c.length > 0; });
}

/* ===== RENDER EXTRACTION ===== */
function renderExtraction(tables) {
  // Stats
  statTables.textContent = tables.length;
  var totalRows = 0;
  var maxCols = 0;
  tables.forEach(function(t) {
    totalRows += t.length;
    t.forEach(function(row) {
      if (row.length > maxCols) maxCols = row.length;
    });
  });
  statRows.textContent = totalRows;
  statCols.textContent = maxCols;

  // Preview: show all tables
  if (tables.length === 0) {
    tablePreview.innerHTML = '<p style="text-align:center;color:#9ca3af;font-size:13px;padding:20px;">No tables detected on this page. Try adjusting column detection or minimum rows.</p>';
    outputSection.style.display = 'none';
    return;
  }

  var html = '';
  tables.forEach(function(table, idx) {
    html += '<div style="margin-bottom:24px;">';
    html += '<div style="font-size:13px;font-weight:700;color:#059669;margin-bottom:8px;">Table ' + (idx + 1) + ' (' + table.length + ' rows)</div>';
    html += '<table>';
    table.forEach(function(row, rowIdx) {
      html += '<tr>';
      if (rowIdx === 0) {
        row.forEach(function(cell) { html += '<th>' + escapeHtml(cell) + '</th>'; });
      } else {
        row.forEach(function(cell) { html += '<td>' + escapeHtml(cell) + '</td>'; });
      }
      html += '</tr>';
    });
    html += '</table>';
    html += '</div>';
  });
  tablePreview.innerHTML = html;

  // Output in current format
  updateOutput();
  outputSection.style.display = 'block';
}

function updateOutput() {
  if (!state.tables.length) return;
  var out = '';
  var fmt = state.format;

  if (fmt === 'csv') {
    state.tables.forEach(function(table, i) {
      if (state.tables.length > 1) out += '# Table ' + (i + 1) + '\n';
      table.forEach(function(row) {
        out += row.map(csvEscape).join(',') + '\n';
      });
      out += '\n';
    });
  } else if (fmt === 'tsv') {
    state.tables.forEach(function(table, i) {
      if (state.tables.length > 1) out += '# Table ' + (i + 1) + '\n';
      table.forEach(function(row) {
        out += row.join('\t') + '\n';
      });
      out += '\n';
    });
  } else if (fmt === 'json') {
    var obj = state.tables.map(function(table) {
      var headers = table[0] || [];
      return table.slice(1).map(function(row) {
        var o = {};
        headers.forEach(function(h, i) {
          o[h] = row[i] || '';
        });
        return o;
      });
    });
    out = JSON.stringify(obj.length === 1 ? obj[0] : obj, null, 2);
  } else if (fmt === 'html') {
    state.tables.forEach(function(table, i) {
      if (state.tables.length > 1) out += '<!-- Table ' + (i + 1) + ' -->\n';
      out += '<table>\n';
      table.forEach(function(row, rowIdx) {
        out += '  <tr>\n';
        row.forEach(function(cell) {
          var tag = rowIdx === 0 ? 'th' : 'td';
          out += '    <' + tag + '>' + escapeHtml(cell) + '</' + tag + '>\n';
        });
        out += '  </tr>\n';
      });
      out += '</table>\n\n';
    });
  }

  outputArea.textContent = out || 'No output...';
}

function csvEscape(str) {
  if (str == null) return '';
  str = String(str);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ===== MODE TABS ===== */
$$('.mode-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    $$('.mode-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    state.format = tab.dataset.format;
    updateOutput();
  });
});

/* ===== OPTIONS CHANGE ===== */
colDetect.addEventListener('change', function() {
  if (state.tables.length) updateOutput();
});
minGapInput.addEventListener('change', function() {
  if (state.tables.length) updateOutput();
});

/* ===== NAVIGATION ===== */
prevBtn.addEventListener('click', function() {
  if (state.currentPage > 1) {
    state.currentPage--;
    updatePageInfo();
    tablePreview.innerHTML = '<p style="text-align:center;color:#9ca3af;font-size:13px;padding:20px;">Click "Extract Tables" to process this page.</p>';
    outputSection.style.display = 'none';
  }
});
nextBtn.addEventListener('click', function() {
  if (state.currentPage < state.totalPages) {
    state.currentPage++;
    updatePageInfo();
    tablePreview.innerHTML = '<p style="text-align:center;color:#9ca3af;font-size:13px;padding:20px;">Click "Extract Tables" to process this page.</p>';
    outputSection.style.display = 'none';
  }
});

/* ===== RESET ===== */
resetBtn.addEventListener('click', function() {
  state.pdf = null;
  state.tables = [];
  state.currentPage = 1;
  state.totalPages = 0;
  dropzone.style.display = '';
  extractorWrap.classList.remove('visible');
  progressWrap.classList.remove('visible');
  hideError();
  showToast('Ready for new PDF', 'info');
});

/* ===== COPY ===== */
copyBtn.addEventListener('click', function() {
  if (!outputArea.textContent || outputArea.textContent === 'No output...') {
    showToast('Nothing to copy — extract tables first', 'error');
    return;
  }
  copyToClipboard(outputArea.textContent).then(function(ok) {
    if (ok) showToast('Copied to clipboard!', 'success');
    else showToast('Copy failed', 'error');
  });
});

/* ===== DOWNLOAD ===== */
downloadBtn.addEventListener('click', function() {
  if (!outputArea.textContent || outputArea.textContent === 'No output...') {
    showToast('Nothing to download — extract tables first', 'error');
    return;
  }
  var extMap = { csv: 'csv', tsv: 'tsv', json: 'json', html: 'html' };
  var mimeMap = { csv: 'text/csv', tsv: 'text/tab-separated-values', json: 'application/json', html: 'text/html' };
  var ext = extMap[state.format] || 'txt';
  var mime = mimeMap[state.format] || 'text/plain';
  var blob = new Blob([outputArea.textContent], { type: mime + ';charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'extracted-table-' + Date.now() + '.' + ext;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
  showToast('Download started!', 'success');
});

/* ===== FILE INPUT ===== */
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

/* ===== FAQ ===== */
$$('.faq-question').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item = btn.parentElement;
    var isOpen = item.classList.contains('open');
    $$('.faq-item').forEach(function(i) { i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  });
});