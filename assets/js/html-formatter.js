/* ===== HTML Formatter - BigToolz ===== */
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
var $$ = function(s, p) { return Array.from((p || document).querySelectorAll(s)); };

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

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
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

/* ===== STATE ===== */
var state = {
  mode: 'beautify',
  indent: 2,
  output: ''
};

/* ===== DOM ===== */
var inputArea = $('#inputArea');
var outputCode = $('#outputCode');
var formatBtn = $('#formatBtn');
var formatBtnLabel = $('#formatBtnLabel');
var copyBtn = $('#copyBtn');
var downloadBtn = $('#downloadBtn');
var clearBtn = $('#clearBtn');
var pasteBtn = $('#pasteBtn');
var uploadBtn = $('#uploadBtn');
var sampleBtn = $('#sampleBtn');
var fileInput = $('#fileInput');
var statusDot = $('#statusDot');
var statusText = $('#statusText');
var statusMessage = $('#statusMessage');
var inputStats = $('#inputStats');
var outputStats = $('#outputStats');
var inputMeta = $('#inputMeta');
var outputMeta = $('#outputMeta');
var errorBox = $('#errorBox');
var errorMsg = $('#errorMsg');
var preserveComments = $('#preserveComments');

/* ===== CONSTANTS ===== */
var VOID_TAGS = {
  area:1, base:1, br:1, col:1, embed:1, hr:1, img:1, input:1, link:1, meta:1,
  param:1, source:1, track:1, wbr:1,
  path:1, circle:1, rect:1, line:1, polyline:1, polygon:1, ellipse:1, use:1, stop:1
};

var RAW_TAGS = { script:1, style:1, pre:1, textarea:1 };

var INLINE_TAGS = {
  a:1, span:1, b:1, i:1, u:1, em:1, strong:1, small:1, big:1, sub:1, sup:1, code:1,
  kbd:1, samp:1, var:1, cite:1, q:1, abbr:1, label:1, button:1, input:1, select:1,
  option:1, textarea:1, img:1, br:1, wbr:1
};

/* ===== TOKENIZER ===== */
function tokenize(html) {
  var tokens = [];
  var i = 0;
  var len = html.length;

  while (i < len) {
    // Comment — hex escape for <
    if (html.substr(i, 4) === '\x3C!--') {
      var cEnd = html.indexOf('-->', i + 4);
      var commentText = cEnd === -1 ? html.slice(i) : html.slice(i, cEnd + 3);
      tokens.push({ type: 'comment', value: commentText });
      i += commentText.length;
      continue;
    }

    // DOCTYPE
    if (html.substr(i, 9).toUpperCase() === '\x3C!DOCTYPE') {
      var dEnd = html.indexOf('>', i);
      var dText = dEnd === -1 ? html.slice(i) : html.slice(i, dEnd + 1);
      tokens.push({ type: 'doctype', value: dText });
      i += dText.length;
      continue;
    }

    // CDATA
    if (html.substr(i, 9) === '\x3C![CDATA[') {
      var cdEnd = html.indexOf(']]>', i + 9);
      var cdText = cdEnd === -1 ? html.slice(i) : html.slice(i, cdEnd + 3);
      tokens.push({ type: 'cdata', value: cdText });
      i += cdText.length;
      continue;
    }

    // Tag
    if (html[i] === '<') {
      var j = i + 1;
      var inQuote = null;
      while (j < len) {
        var ch = html[j];
        if (inQuote) {
          if (ch === inQuote && html[j - 1] !== '\\') inQuote = null;
        } else if (ch === '"' || ch === "'") {
          inQuote = ch;
        } else if (ch === '>') {
          break;
        }
        j++;
      }
      if (j >= len) {
        tokens.push({ type: 'text', value: html.slice(i) });
        break;
      }

      var tagText = html.slice(i, j + 1);
      var inner = tagText.slice(1, -1).trim();

      if (inner.charAt(0) === '/') {
        var name = inner.slice(1).trim().toLowerCase().split(/\s+/)[0];
        tokens.push({ type: 'closeTag', name: name, value: tagText });
      } else {
        var parts = inner.split(/\s+/);
        var tname = parts[0].toLowerCase();
        var selfClosing = inner.slice(-1) === '/' || VOID_TAGS[tname];
        tokens.push({ type: 'openTag', name: tname, selfClosing: selfClosing, value: tagText });
      }

      var lastToken = tokens[tokens.length - 1];
      if (lastToken.type === 'openTag' && RAW_TAGS[lastToken.name] && !lastToken.selfClosing) {
        var closeStr = '</' + lastToken.name + '>';
        var closeIdx = html.toLowerCase().indexOf(closeStr, j + 1);
        if (closeIdx !== -1) {
          var content = html.slice(j + 1, closeIdx);
          if (content) tokens.push({ type: 'rawContent', value: content, tag: lastToken.name });
          tokens.push({ type: 'closeTag', name: lastToken.name, value: html.slice(closeIdx, closeIdx + closeStr.length) });
          i = closeIdx + closeStr.length;
          continue;
        }
      }

      i = j + 1;
      continue;
    }

    // Text
    var tj = i;
    while (tj < len && html[tj] !== '<') tj++;
    var text = html.slice(i, tj);
    if (text.trim()) tokens.push({ type: 'text', value: text });
    i = tj;
  }

  return tokens;
}

/* ===== BEAUTIFY ===== */
function beautifyHtml(html, indentSize, opts) {
  opts = opts || {};
  var tokens = tokenize(html);
  var indentUnit = indentSize === 'tab' ? '\t' : Array(indentSize + 1).join(' ');
  var depth = 0;
  var lines = [];

  function pushLine(content) {
    var ws = '';
    for (var k = 0; k < depth; k++) ws += indentUnit;
    lines.push(ws + content);
  }

  for (var idx = 0; idx < tokens.length; idx++) {
    var t = tokens[idx];

    if (t.type === 'comment') {
      if (opts.preserveComments !== false) pushLine(t.value);
      continue;
    }
    if (t.type === 'doctype' || t.type === 'cdata') {
      pushLine(t.value);
      continue;
    }
    if (t.type === 'openTag') {
      pushLine(t.value);
      if (!t.selfClosing) depth++;
      continue;
    }
    if (t.type === 'closeTag') {
      if (depth > 0) depth--;
      pushLine(t.value);
      continue;
    }
    if (t.type === 'rawContent') {
      var rawLines = t.value.split('\n');
      var prefix = '';
      for (var k2 = 0; k2 < depth; k2++) prefix += indentUnit;
      if (rawLines.length === 1) {
        lines.push(prefix + t.value);
      } else {
        for (var rl = 0; rl < rawLines.length; rl++) {
          lines.push(rl === 0 ? prefix + rawLines[rl] : rawLines[rl]);
        }
      }
      continue;
    }
    if (t.type === 'text') {
      var textVal = t.value.trim();
      if (textVal) pushLine(textVal);
      continue;
    }
  }

  return mergeInlineTags(lines).join('\n');
}

function mergeInlineTags(lines) {
  var out = [];
  var i = 0;
  while (i < lines.length) {
    var line = lines[i];
    var trimmed = line.trim();
    var openMatch = trimmed.match(/^<([a-zA-Z][\w-]*)(?:\s[^>]*)?>$/);
    if (openMatch && INLINE_TAGS[openMatch[1].toLowerCase()]) {
      var tagName = openMatch[1].toLowerCase();
      var closeStr = '</' + tagName + '>';
      var j = i + 1;
      var merged = trimmed;
      var endIdx = -1;
      while (j < lines.length && j < i + 6) {
        var nextTrimmed = lines[j].trim();
        if (nextTrimmed !== closeStr) merged += nextTrimmed;
        if (nextTrimmed === closeStr) {
          merged += closeStr;
          endIdx = j;
          break;
        }
        j++;
      }
      if (endIdx !== -1 && merged.length < 120) {
        var leadingWs = line.match(/^\s*/)[0];
        out.push(leadingWs + merged);
        i = endIdx + 1;
        continue;
      }
    }
    out.push(line);
    i++;
  }
  return out;
}

/* ===== MINIFY ===== */
function minifyHtml(html) {
  var output = html;
  output = output.replace(/\x3C!--(?!\[if)[\s\S]*?-->/g, '');
  output = output.replace(/>\s+\x3C/g, '><');
  output = output.replace(/\s{2,}/g, ' ');
  output = output.trim();
  return output;
}

/* ===== VALIDATE ===== */
function validateHtml(html) {
  var errors = [];
  var tokens = tokenize(html);
  var stack = [];

  for (var i = 0; i < tokens.length; i++) {
    var t = tokens[i];
    if (t.type === 'openTag' && !t.selfClosing) {
      stack.push({ name: t.name });
    } else if (t.type === 'closeTag') {
      if (stack.length === 0) {
        errors.push('Unexpected closing tag </' + t.name + '> — no matching opening tag.');
        continue;
      }
      var found = -1;
      for (var k = stack.length - 1; k >= 0; k--) {
        if (stack[k].name === t.name) { found = k; break; }
        if (!INLINE_TAGS[stack[k].name]) break;
      }
      if (found === -1) {
        errors.push('Mismatched closing tag </' + t.name + '> — expected </' + stack[stack.length - 1].name + '>.');
        stack.pop();
      } else {
        while (stack.length > found) stack.pop();
      }
    }
  }

  for (var s = 0; s < stack.length; s++) {
    errors.push('Unclosed tag <' + stack[s].name + '> — missing closing </' + stack[s].name + '>.');
  }

  return errors;
}

/* ===== HIGHLIGHT ===== */
function highlightHtml(html) {
  var escaped = escapeHtml(html);

  // Comments
  escaped = escaped.replace(/&lt;\x21--[\s\S]*?--&gt;/g, function(m) {
    return '<span class="hl-comment">' + m + '</span>';
  });

  // DOCTYPE
  escaped = escaped.replace(/&lt;\x21DOCTYPE[^&]*?&gt;/gi, function(m) {
    return '<span class="hl-doctype">' + m + '</span>';
  });

  // CDATA
  escaped = escaped.replace(/&lt;\x21\[CDATA\[[\s\S]*?\]\]&gt;/g, function(m) {
    return '<span class="hl-comment">' + m + '</span>';
  });

  // Tags
  escaped = escaped.replace(/&lt;(\/?)([\w:-]+)((?:\s+[^&]*?)?)(\/?)&gt;/g, function(match, slash, tagName, attrStr, selfClose) {
    var result = '<span class="hl-punct">&lt;</span>';
    if (slash) result += '<span class="hl-punct">/</span>';
    result += '<span class="hl-tag">' + tagName + '</span>';

    if (attrStr) {
      result += attrStr.replace(
        /(\s+)([\w:-]+)(\s*=\s*)("[^"]*"|'[^']*'|[^\s>]+)?/g,
        function(m, ws, name, eq, val) {
          var out = ws + '<span class="hl-attr">' + name + '</span>';
          if (eq && val !== undefined) {
            out += eq;
            out += '<span class="hl-string">' + val + '</span>';
          } else if (eq) {
            out += eq;
          }
          return out;
        }
      );
    }

    if (selfClose) result += '<span class="hl-punct">/</span>';
    result += '<span class="hl-punct">&gt;</span>';
    return result;
  });

  return escaped;
}

/* ===== RENDER ===== */
function renderOutput() {
  var html = state.output || '';
  outputCode.innerHTML = html ? highlightHtml(html) : 'Output will appear here...';
  outputStats.textContent = html.length.toLocaleString() + ' chars';
  outputMeta.textContent = (html ? html.split('\n').length : 0).toLocaleString() + ' lines';
}

function updateInputStats() {
  var text = inputArea.value;
  inputStats.textContent = text.length.toLocaleString() + ' chars';
  inputMeta.textContent = (text ? text.split('\n').length : 0).toLocaleString() + ' lines';
}

/* ===== STATUS ===== */
function setStatus(kind, message) {
  statusDot.className = 'status-dot';
  if (kind === 'error') statusDot.classList.add('error');
  else if (kind === 'warn') statusDot.classList.add('warn');
  var labels = { success: 'Success', error: 'Error', warn: 'Warning', info: 'Info', ready: 'Ready' };
  statusText.textContent = labels[kind] || 'Ready';
  statusMessage.textContent = message || 'Ready';
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.classList.add('visible');
}
function hideError() {
  errorBox.classList.remove('visible');
}

/* ===== FORMAT ===== */
formatBtn.addEventListener('click', function() {
  var html = inputArea.value.trim();
  hideError();

  if (!html) {
    showError('Please paste some HTML first.');
    return;
  }

  try {
    if (state.mode === 'beautify') {
      state.output = beautifyHtml(html, state.indent, {
        preserveComments: preserveComments.checked
      });
      setStatus('success', 'Beautified — ' + state.output.length + ' chars');
    } else if (state.mode === 'minify') {
      state.output = minifyHtml(html);
      var saved = html.length - state.output.length;
      var pct = html.length ? Math.round((saved / html.length) * 100) : 0;
      setStatus('success', 'Minified — ' + saved + ' chars saved (' + pct + '%)');
    } else if (state.mode === 'validate') {
      var errors = validateHtml(html);
      state.output = beautifyHtml(html, state.indent, {
        preserveComments: preserveComments.checked
      });
      if (errors.length === 0) {
        setStatus('success', 'Valid HTML — no issues found');
      } else {
        setStatus('warn', errors.length + ' issue' + (errors.length > 1 ? 's' : '') + ' found');
        showError(errors.slice(0, 5).join('\n') + (errors.length > 5 ? '\n... and ' + (errors.length - 5) + ' more' : ''));
      }
    }
    renderOutput();
  } catch (err) {
    console.error(err);
    setStatus('error', 'Error processing HTML');
    showError('Something went wrong while processing your HTML.');
  }
});

/* ===== MODE TABS ===== */
$$('.mode-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    $$('.mode-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    state.mode = tab.dataset.mode;
    var labels = { beautify: 'Format HTML', minify: 'Minify HTML', validate: 'Validate HTML' };
    formatBtnLabel.textContent = labels[state.mode];
    setStatus('info', 'Mode: ' + state.mode);
  });
});

/* ===== INDENT BUTTONS ===== */
$$('.tool-btn[data-indent]').forEach(function(btn) {
  btn.addEventListener('click', function() {
    $$('.tool-btn[data-indent]').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var v = btn.dataset.indent;
    state.indent = v === 'tab' ? 'tab' : parseInt(v, 10);
  });
});

/* ===== COPY ===== */
copyBtn.addEventListener('click', function() {
  if (!state.output) {
    showToast('Nothing to copy — format first', 'error');
    return;
  }
  copyToClipboard(state.output).then(function(ok) {
    if (ok) showToast('Copied to clipboard!', 'success');
    else showToast('Copy failed', 'error');
  });
});

/* ===== DOWNLOAD ===== */
downloadBtn.addEventListener('click', function() {
  if (!state.output) {
    showToast('Nothing to download — format first', 'error');
    return;
  }
  var blob = new Blob([state.output], { type: 'text/html;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'formatted-' + Date.now() + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
  showToast('Download started!', 'success');
});

/* ===== CLEAR ===== */
clearBtn.addEventListener('click', function() {
  inputArea.value = '';
  state.output = '';
  outputCode.innerHTML = 'Output will appear here...';
  updateInputStats();
  renderOutput();
  hideError();
  setStatus('ready', 'Cleared.');
  showToast('Cleared', 'info');
});

/* ===== PASTE ===== */
pasteBtn.addEventListener('click', function() {
  if (navigator.clipboard && navigator.clipboard.readText) {
    navigator.clipboard.readText().then(function(text) {
      inputArea.value = text;
      updateInputStats();
      showToast('Pasted from clipboard', 'success');
    }).catch(function() {
      inputArea.focus();
      showToast('Press Ctrl+V to paste', 'info');
    });
  } else {
    inputArea.focus();
    showToast('Press Ctrl+V to paste', 'info');
  }
});

/* ===== UPLOAD ===== */
uploadBtn.addEventListener('click', function() { fileInput.click(); });

fileInput.addEventListener('change', function(e) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    inputArea.value = ev.target.result;
    updateInputStats();
    showToast('Loaded ' + file.name, 'success');
  };
  reader.readAsText(file);
  fileInput.value = '';
});

/* ===== SAMPLE ===== */
sampleBtn.addEventListener('click', function() {
  var sampleHTML = [
    '\x3C!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="UTF-8">',
    '<title>Sample Page</title>',
    '</head>',
    '<body>',
    '\x3C!-- Main container -->',
    '<div class="container" id="main">',
    '<h1>Hello, World!</h1>',
    '<p>This is a <strong>sample</strong> HTML document.</p>',
    '<ul class="items"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
    '<img src="image.jpg" alt="Sample image">',
    '<a href="https://bigtoolz.com" target="_blank">Visit BigToolz</a>',
    '</div>',
    '</body>',
    '</html>'
  ].join('\n');

  inputArea.value = sampleHTML;
  updateInputStats();
  showToast('Sample loaded', 'success');
});

/* ===== INPUT ===== */
inputArea.addEventListener('input', updateInputStats);

/* ===== KEYBOARD ===== */
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    formatBtn.click();
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

/* ===== INIT ===== */
updateInputStats();
setStatus('ready', 'Paste HTML and click Format to begin.');