// E-Recharge PWA Service Worker
const CACHE_NAME = 'e-recharge-v1';
const RUNTIME_CACHE = 'e-recharge-runtime';
const IMAGE_CACHE = 'e-recharge-images';

// Assets statiques à mettre en cache immédiatement (uniquement fichiers garantis)
const PRECACHE_ASSETS = [
  '/offline.html',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        // Ajouter seulement les assets garantis, ignorer les erreurs
        return Promise.all(
          PRECACHE_ASSETS.map(url =>
            cache.add(url).catch(err => console.log('[SW] Failed to cache:', url))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') return;

  // Ignorer les requêtes API (toujours fetch fresh)
  if (url.pathname.startsWith('/api/v1/') || url.hostname.includes('back-alice')) {
    event.respondWith(fetch(request));
    return;
  }

  // Stratégie pour les images: Cache First
  if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Stratégie pour les pages et assets JS/CSS: Network First, puis Cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si la réponse est OK, la mettre en cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();

          // Déterminer le cache approprié
          const cacheName = request.destination === 'document' ? CACHE_NAME : RUNTIME_CACHE;

          caches.open(cacheName).then((cache) => {
            cache.put(request, responseToCache);
            console.log('[SW] Cached:', request.url);
          });
        }
        return response;
      })
      .catch(() => {
        // Si offline, chercher dans le cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache (offline):', request.url);
            return cachedResponse;
          }
          // Si c'est une navigation et qu'on n'a pas de cache, montrer la page offline
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Écouter les messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
