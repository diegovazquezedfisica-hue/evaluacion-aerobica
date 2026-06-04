// Service Worker — Timer IMM
// Versión: incrementar para forzar actualización en todos los dispositivos
const VERSION = 'timer-imm-v1';

const CACHE_FILES = [
  '/evaluacion-aerobica/cronometro-aerobico.html',
  '/evaluacion-aerobica/manifest.json',
];

// Instalar: cachear archivos
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// Activar: limpiar caches viejas
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

// Fetch: network first, cache fallback
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // Actualizar cache con respuesta fresca
        var clone = response.clone();
        caches.open(VERSION).then(function(cache) {
          cache.put(e.request, clone);
        });
        return response;
      })
      .catch(function() {
        // Sin red: usar cache
        return caches.match(e.request);
      })
  );
});
