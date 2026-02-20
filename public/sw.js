// AliceBot PWA Advanced Service Worker
console.log('[SW] Loading AliceBot Service Worker...');

// Import Firebase Scripts pour FCM (DOIT être en dehors de try/catch)
console.log('[SW] Loading Firebase scripts...');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');
console.log('[SW] ✅ Firebase scripts loaded');

const CACHE_VERSION = 'v2.1.0';
const CACHE_NAMES = {
  static: `alicebot-static-${CACHE_VERSION}`,
  dynamic: `alicebot-dynamic-${CACHE_VERSION}`,
  images: `alicebot-images-${CACHE_VERSION}`,
  api: `alicebot-api-${CACHE_VERSION}`
};

// Durées de cache (en secondes)
const CACHE_DURATION = {
  static: 30 * 24 * 60 * 60,  // 30 jours
  dynamic: 7 * 24 * 60 * 60,   // 7 jours
  images: 30 * 24 * 60 * 60,   // 30 jours
  api: 5 * 60                  // 5 minutes
};

// Limites de taille de cache
const MAX_CACHE_SIZE = {
  static: 50,
  dynamic: 100,
  images: 60,
  api: 30
};

// URLs à pré-cacher (essentielles)
const PRECACHE_URLS = [
  '/manifest.json'
];

// URLs à exclure du cache
const EXCLUDED_URLS = [
  '/api/v1/analytics',
  '/api/v1/tracking',
  '/api/v1/logs'
];

// ========== FIREBASE CONFIGURATION ==========
console.log('[SW] Initializing Firebase...');

// Configuration Firebase (synchronisée avec le frontend)
const firebaseConfig = {
  apiKey: 'AIzaSyC6_uWq5NwwuvRQGbW7dx7RAtM3L2VphLs',
  authDomain: 'e-recharge-b75ee.firebaseapp.com',
  projectId: 'e-recharge-b75ee',
  storageBucket: 'e-recharge-b75ee.firebasestorage.app',
  messagingSenderId: '700766162336',
  appId: '1:700766162336:web:85a6daacb5ae1e8b5128c5',
  measurementId: 'G-9SS0SFQZQ2',
};

// Variable globale pour messaging
let messaging = null;

try {
  // Initialiser Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('[SW] ✅ Firebase initialized successfully');
  } else {
    console.log('[SW] ✅ Firebase already initialized');
  }

  // Récupérer l'instance Messaging
  messaging = firebase.messaging();
  console.log('[SW] ✅ Firebase Messaging ready');

  // Écouter les messages en arrière-plan
  messaging.onBackgroundMessage((payload) => {
    console.log('[SW] 📬 Firebase background message received:', payload);

    // Extraire les données de la notification
    const notificationTitle =
      payload.notification?.title || payload.data?.title || 'AliceBot';

    // Logo AliceBot dynamique - TOUJOURS utilisé
    const appIcon = new URL('/icons/icon-192x192.png', self.location.origin).href;
    const appBadge = new URL('/icons/icon-96x96.png', self.location.origin).href;

    const notificationOptions = {
      body:
        payload.notification?.body ||
        payload.data?.body ||
        'Vous avez une nouvelle notification',
      icon: appIcon,  // Logo AliceBot DYNAMIQUE
      badge: appBadge, // Badge AliceBot DYNAMIQUE
      image: payload.notification?.image || payload.data?.image,
      data: {
        ...payload.data,
        click_action: payload.data?.url || payload.fcmOptions?.link || '/',
      },
      tag: payload.data?.type || 'alicebot-notification',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      renotify: true,
      silent: false,
      actions: [
        {
          action: 'open',
          title: 'Ouvrir',
          icon: appBadge,
        },
        {
          action: 'close',
          title: 'Fermer',
        },
      ],
    };

    // Afficher la notification
    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  });
} catch (error) {
  console.error('[SW] ❌ Firebase initialization error:', error);
}

// ========== INSTALLATION ==========
self.addEventListener('install', (event) => {
  console.log('[SW] Installation', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_NAMES.static)
      .then(cache => {
        console.log('[SW] Précaching URLs essentielles');
        return cache.addAll(
          PRECACHE_URLS.map(url => new Request(url, { cache: 'reload' }))
        );
      })
      .then(() => {
        console.log('[SW] Précache terminé');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Erreur précache:', error);
      })
  );
});

// ========== ACTIVATION ==========
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation', CACHE_VERSION);

  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('alicebot-') && !Object.values(CACHE_NAMES).includes(name))
            .map(name => {
              console.log('[SW] Suppression ancien cache:', name);
              return caches.delete(name);
            })
        );
      }),
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ])
    .then(() => {
      console.log('[SW] Service Worker activé et en contrôle');
      return self.clients.matchAll()
        .then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_ACTIVATED',
              version: CACHE_VERSION
            });
          });
        });
    })
  );
});

// ========== FONCTIONS UTILITAIRES ==========

// Limiter la taille du cache
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    const toDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(toDelete.map(key => cache.delete(key)));
    console.log(`[SW] Cache ${cacheName} limité à ${maxItems} entrées`);
  }
}

// Vérifier si le cache est expiré
function isCacheExpired(cachedResponse, maxAge) {
  if (!cachedResponse) return true;

  const cachedDate = cachedResponse.headers.get('date');
  if (!cachedDate) return false;

  const cacheTime = new Date(cachedDate).getTime();
  const now = Date.now();
  const age = (now - cacheTime) / 1000;

  return age > maxAge;
}

// Vérifier si une URL doit être mise en cache
function shouldCache(url) {
  return !EXCLUDED_URLS.some(excluded => url.includes(excluded));
}

// ========== STRATÉGIES DE CACHE ==========

// 1. Cache First (pour assets statiques)
async function cacheFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse && !isCacheExpired(cachedResponse, maxAge)) {
    console.log('[SW] Serving from cache:', request.url);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && shouldCache(request.url)) {
      cache.put(request, networkResponse.clone());
      await limitCacheSize(cacheName, MAX_CACHE_SIZE.static);
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error.message);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// 2. Network First (pour contenu dynamique)
async function networkFirst(request, cacheName, maxAge, timeout = 3000) {
  const cache = await caches.open(cacheName);

  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), timeout);
    });

    const networkResponse = await Promise.race([
      fetch(request),
      timeoutPromise
    ]);

    if (networkResponse.ok && shouldCache(request.url)) {
      cache.put(request, networkResponse.clone());
      await limitCacheSize(cacheName, MAX_CACHE_SIZE.dynamic);
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error.message);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('[SW] Serving stale cache:', request.url);
      return cachedResponse;
    }

    throw error;
  }
}

// 3. Stale While Revalidate (pour images)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then(async networkResponse => {
    if (networkResponse.ok && shouldCache(request.url)) {
      cache.put(request, networkResponse.clone());
      await limitCacheSize(cacheName, MAX_CACHE_SIZE.images);
    }
    return networkResponse;
  }).catch(err => {
    console.log('[SW] Background fetch failed:', err.message);
    return null;
  });

  return cachedResponse || fetchPromise;
}

// 4. Network Only (pour requêtes sensibles)
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('[SW] Network only request failed:', error);
    return new Response('Network error', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// ========== INTERCEPTION DES REQUÊTES ==========
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et non-HTTP
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Ignorer les requêtes de mise à jour du SW
  if (url.pathname === '/sw.js') {
    return;
  }

  // Laisser le navigateur gérer directement les fichiers uploadés (cross-origin)
  if (url.pathname.startsWith('/uploads/')) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // API sensibles (auth, transactions) : Network Only
        if (
          url.pathname.startsWith('/api/v1/auth/') ||
          url.pathname.startsWith('/api/v1/transactions/') ||
          url.pathname.startsWith('/api/v1/users/me') ||
          url.hostname.includes('back-alice')
        ) {
          return await networkOnly(request);
        }

        // API en lecture : Network First avec cache de secours
        if (url.pathname.startsWith('/api/v1/')) {
          return await networkFirst(request, CACHE_NAMES.api, CACHE_DURATION.api, 5000);
        }

        // Images : Stale While Revalidate
        if (
          request.destination === 'image' ||
          url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)
        ) {
          return await staleWhileRevalidate(request, CACHE_NAMES.images);
        }

        // Assets statiques (JS, CSS, fonts) : Cache First
        if (
          request.destination === 'script' ||
          request.destination === 'style' ||
          request.destination === 'font' ||
          url.pathname.startsWith('/_next/static/')
        ) {
          return await cacheFirst(request, CACHE_NAMES.static, CACHE_DURATION.static);
        }

        // Documents HTML : Network First
        if (request.destination === 'document' || request.mode === 'navigate') {
          return await networkFirst(request, CACHE_NAMES.dynamic, CACHE_DURATION.dynamic, 5000);
        }

        // Défaut : Network First
        return await networkFirst(request, CACHE_NAMES.dynamic, CACHE_DURATION.dynamic);

      } catch (error) {
        console.error('[SW] Erreur fetch:', error);

        return new Response('Service Worker: Erreur réseau', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

// ========== NOTIFICATIONS PUSH (Firebase Cloud Messaging) ==========
// Firebase Messaging est initialisé en haut du fichier (ligne 43-120)

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event.action);
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Si une fenêtre existe déjà, la focus
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus().then(client => {
              if (client.navigate) {
                return client.navigate(urlToOpen);
              }
            });
          }
        }
        // Sinon ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// ========== BACKGROUND SYNC ==========
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  } else if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncTransactions() {
  try {
    console.log('[SW] Synchronisation des transactions...');
    // Implémenter la logique de sync des transactions offline
    const cache = await caches.open(CACHE_NAMES.api);
    // Logique de synchronisation ici
    console.log('[SW] Synchronisation des transactions terminée');
  } catch (error) {
    console.error('[SW] Erreur sync transactions:', error);
    throw error;
  }
}

async function syncData() {
  try {
    console.log('[SW] Synchronisation des données...');
    // Implémenter la logique de sync générale
    console.log('[SW] Synchronisation des données terminée');
  } catch (error) {
    console.error('[SW] Erreur sync data:', error);
    throw error;
  }
}

// ========== MESSAGES ==========
self.addEventListener('message', (event) => {
  console.log('[SW] Message reçu:', event.data);

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames
              .filter(name => name.startsWith('alicebot-'))
              .map(name => caches.delete(name))
          );
        })
        .then(() => {
          if (event.ports[0]) {
            event.ports[0].postMessage({ success: true });
          }
        })
    );
  }

  if (event.data?.type === 'CLEAR_CACHE_BY_NAME') {
    const cacheName = event.data.cacheName;
    event.waitUntil(
      caches.delete(cacheName)
        .then(success => {
          if (event.ports[0]) {
            event.ports[0].postMessage({ success });
          }
        })
    );
  }

  if (event.data?.type === 'GET_VERSION') {
    if (event.ports[0]) {
      event.ports[0].postMessage({ version: CACHE_VERSION });
    }
  }

  if (event.data?.type === 'GET_CACHE_SIZES') {
    event.waitUntil(
      Promise.all([
        caches.open(CACHE_NAMES.static).then(c => c.keys()),
        caches.open(CACHE_NAMES.dynamic).then(c => c.keys()),
        caches.open(CACHE_NAMES.images).then(c => c.keys()),
        caches.open(CACHE_NAMES.api).then(c => c.keys())
      ]).then(([staticKeys, dynamicKeys, imageKeys, apiKeys]) => {
        if (event.ports[0]) {
          event.ports[0].postMessage({
            static: staticKeys.length,
            dynamic: dynamicKeys.length,
            images: imageKeys.length,
            api: apiKeys.length,
            total: staticKeys.length + dynamicKeys.length + imageKeys.length + apiKeys.length
          });
        }
      })
    );
  }
});

// ========== PERIODIC BACKGROUND SYNC ==========
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag);

  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  try {
    console.log('[SW] Mise à jour périodique du contenu...');
    // Implémenter la logique de mise à jour périodique
    console.log('[SW] Mise à jour terminée');
  } catch (error) {
    console.error('[SW] Erreur mise à jour périodique:', error);
  }
}

console.log('[SW] AliceBot Service Worker chargé - Version:', CACHE_VERSION);
