const VERSION = 'timer-imm-v2';

const CACHE_FILES = [
  '/evaluacion-aerobica/cronometro-aerobico.html',
  '/evaluacion-aerobica/manifest.json',
  '/evaluacion-aerobica/escudo.png',
  '/evaluacion-aerobica/icon-192.png',
  '/evaluacion-aerobica/icon-512.png',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== VERSION; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        var clone = response.clone();
        caches.open(VERSION).then(function(cache) {
          cache.put(e.request, clone);
        });
        return response;
      })
      .catch(function() {
        return caches.match(e.request);
      })
  );
});
