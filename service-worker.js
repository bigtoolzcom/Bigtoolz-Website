/* ===========================================
   BigToolz Service Worker
   Version: 1.0.0
   Last updated: 2026-01-15
   =========================================== */

const CACHE_VERSION = 'v1.0.0';
const CACHE_STATIC = `bigtoolz-static-${CACHE_VERSION}`;
const CACHE_DYNAMIC = `bigtoolz-dynamic-${CACHE_VERSION}`;
const CACHE_IMAGES = `bigtoolz-images-${CACHE_VERSION}`;
const CACHE_FONTS = `bigtoolz-fonts-${CACHE_VERSION}`;

// Core files to cache on install (app shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/404.html',
  '/about.html',
  '/contact.html',
  '/privacy-policy.html',
  '/terms.html',
  '/disclaimer.html',
  '/tools/',
  '/blog/',
  '/assets/css/style.css',
  '/assets/css/responsive.css',
  '/assets/css/dark-mode.css',
  '/assets/js/main.js',
  '/assets/js/search.js',
  '/assets/js/theme.js',
  '/assets/js/tools-data.js',
  '/manifest.json',
  '/assets/images/favicon.ico',
  '/assets/images/icons/icon-192.png',
  '/assets/images/icons/icon-512.png'
];

// ===========================================
// INSTALL — Pre-cache app shell
// ===========================================
self.addEventListener('install', event => {
  console.log('[SW] Installing version:', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Activate immediately (don't wait for old tabs to close)
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Pre-cache failed:', err);
      })
  );
});

// ===========================================
// ACTIVATE — Cleanup old caches
// ===========================================
self.addEventListener('activate', event => {
  console.log('[SW] Activating version:', CACHE_VERSION);

  const currentCaches = [
    CACHE_STATIC,
    CACHE_DYNAMIC,
    CACHE_IMAGES,
    CACHE_FONTS
  ];

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!currentCaches.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// ===========================================
// FETCH — Route requests to correct strategy
// ===========================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (POST, PUT, etc.)
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (unless they're fonts/images)
  if (url.origin !== self.location.origin) {
    // Allow Google Fonts
    if (url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')) {
      event.respondWith(fontsStrategy(request));
    }
    return;
  }

  // Skip admin, API, and search endpoints
  if (url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/admin/') ||
      url.pathname.startsWith('/search')) {
    return;
  }

  // Route to appropriate strategy
  if (isHTMLPage(request)) {
    event.respondWith(htmlStrategy(request));
  } else if (isImage(request)) {
    event.respondWith(imageStrategy(request));
  } else if (isFont(request)) {
    event.respondWith(fontsStrategy(request));
  } else if (isCSSOrJS(request)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_STATIC));
  } else {
    event.respondWith(networkFirst(request, CACHE_DYNAMIC));
  }
});

// ===========================================
// STRATEGIES
// ===========================================

// HTML pages — Network First (always try fresh content)
async function htmlStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_DYNAMIC);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    // Offline — try cache, then offline page
    const cached = await caches.match(request);
    if (cached) return cached;

    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) return offlinePage;

    return new Response(
      '<html><body style="font-family:sans-serif;padding:2rem;text-align:center;">' +
      '<h1>You are offline</h1><p>Please check your internet connection.</p>' +
      '</body></html>',
      { headers: { 'Content-Type': 'text/html' }, status: 503 }
    );
  }
}

// Images — Cache First (images rarely change)
async function imageStrategy(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_IMAGES);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    // Return placeholder if offline and not cached
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f3f4f6" width="200" height="200"/><text x="50%" y="50%" fill="#9ca3af" font-family="sans-serif" font-size="14" text-anchor="middle" dy=".3em">Image offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Fonts — Cache First (fonts rarely change)
async function fontsStrategy(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_FONTS);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    return new Response('', { status: 404 });
  }
}

// CSS/JS — Stale While Revalidate (fast + fresh)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Generic — Network First
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}

// ===========================================
// HELPERS
// ===========================================
function isHTMLPage(request) {
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

function isImage(request) {
  const url = request.url.toLowerCase();
  return /\.(png|jpg|jpeg|gif|webp|svg|ico|bmp|avif)$/i.test(url);
}

function isFont(request) {
  const url = request.url.toLowerCase();
  return /\.(woff|woff2|ttf|otf|eot)$/i.test(url);
}

function isCSSOrJS(request) {
  const url = request.url.toLowerCase();
  return /\.(css|js)$/i.test(url);
}

// ===========================================
// MESSAGE — Handle messages from pages
// ===========================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(names =>
        Promise.all(names.map(n => caches.delete(n)))
      ).then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_DYNAMIC).then(cache =>
        cache.addAll(event.data.urls || [])
      ).then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }
});

// ===========================================
// BACKGROUND SYNC (for newsletter, contact form)
// ===========================================
self.addEventListener('sync', event => {
  if (event.tag === 'sync-contact-form') {
    event.waitUntil(syncContactForm());
  }
  if (event.tag === 'sync-newsletter') {
    event.waitUntil(syncNewsletter());
  }
});

async function syncContactForm() {
  // Implement background sync for offline form submissions
  console.log('[SW] Background syncing contact form...');
}

async function syncNewsletter() {
  console.log('[SW] Background syncing newsletter...');
}

// ===========================================
// PUSH NOTIFICATIONS (optional)
// ===========================================
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'BigToolz';
  const options = {
    body: data.body || 'New tool available!',
    icon: '/assets/images/icons/icon-192.png',
    badge: '/assets/images/icons/icon-192.png',
    data: data.url || '/'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

// ===========================================
// END
// ===========================================
console.log('[SW] BigToolz Service Worker loaded:', CACHE_VERSION);