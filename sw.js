const CACHE_NAME = 'battery-vintage-toys-v1';
const urlsToCache = [
  '/inventario/',
  '/inventario/index.html',
  '/inventario/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Solo cachear recursos del mismo origen, no Firebase
  if (event.request.url.includes('firestore') || 
      event.request.url.includes('googleapis') ||
      event.request.url.includes('anthropic')) {
    return fetch(event.request);
  }
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
