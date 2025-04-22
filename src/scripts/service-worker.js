const CACHE_NAME = 'story-app-shell-v1';
const URLS_TO_CACHE = [
  '/', '/index.html',
  '/offline.html',
  '/favicon.png',
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/app.bundle.js',
  '/app.css'             // if you extract CSS in prod
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .catch(err => console.error('SW install cache failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys.filter(key => key !== CACHE_NAME)
              .map(key => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Navigation requests → Network first, fallback to offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/offline.html')
          .then(res => res || new Response('Offline Page Not Available', {
            status: 503,
            statusText: 'Offline',
            headers: { 'Content-Type': 'text/plain' }
          }))
        )
    );
    return;
  }

  // API or same-origin → Network first, then cache fallback
  if (url.origin === location.origin || request.url.includes('story-api.dicoding.dev')) {
    event.respondWith(
      fetch(request)
        .then(res => res)
        .catch(() => caches.match(request)
          .then(res => res || new Response('Resource unavailable offline', {
            status: 504,
            statusText: 'Offline',
            headers: { 'Content-Type': 'text/plain' }
          }))
        )
    );
    return;
  }

  // Other → Cache first
  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request)
        .catch(() => new Response('Network error', {
          status: 502,
          statusText: 'Bad Gateway',
          headers: { 'Content-Type': 'text/plain' }
        }))
      )
  );
});

// Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'outbox-sync') {
    event.waitUntil((async () => {
      const { getOutboxItems, clearOutbox } = await import('./db.js');
      const items = await getOutboxItems();
      for (const { token, formData } of items) {
        await fetch('https://story-api.dicoding.dev/v1/stories', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token },
          body: formData,
        });
      }
      await clearOutbox();
    })());
  }
});

// Push Notification
self.addEventListener('push', event => {
  let title = 'Push Default Title';
  let options = {
    body: 'Ini adalah isi notifikasi dari push DevTools.',
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png'
  };

  try {
    const data = event.data.json();
    title = data.title || title;
    options = data.options || options;
  } catch (e) {
    console.warn('Push tanpa data, fallback ke default.');
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(list => list[0]?.focus() || clients.openWindow('/'))
  );
});
