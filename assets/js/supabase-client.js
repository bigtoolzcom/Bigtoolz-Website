/* ===========================================
   BigToolz - Supabase Client
   Version: 1.0.0
   Purpose: Global Supabase connection
   =========================================== */

'use strict';

const SUPABASE_URL = 'https://btmeygsirnyuzsubscde.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rncmFbKPlBLxkeIEXaFxfQ_rIbjebnJ';

window.supabaseClient = null;

(function initSupabase() {
  if (window.supabaseClient) return;

  function createClient() {
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
      console.error('[Supabase] SDK not loaded');
      return;
    }
    try {
      window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      window.dispatchEvent(new CustomEvent('supabase-ready'));
      console.log('[Supabase] Client initialized ✅');
    } catch (err) {
      console.error('[Supabase] Init failed:', err);
    }
  }

  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    createClient();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  script.async = true;
  script.onload = createClient;
  script.onerror = () => console.error('[Supabase] SDK failed to load');
  document.head.appendChild(script);
})();

window.waitForSupabase = function() {
  return new Promise((resolve, reject) => {
    if (window.supabaseClient) {
      resolve(window.supabaseClient);
      return;
    }
    const timeout = setTimeout(() => {
      reject(new Error('Supabase client timeout'));
    }, 10000);

    window.addEventListener('supabase-ready', () => {
      clearTimeout(timeout);
      resolve(window.supabaseClient);
    }, { once: true });
  });
};

window.generateSlug = function(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

window.formatDate = function(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

window.escapeHtml = function(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

window.readingTime = function(content) {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};