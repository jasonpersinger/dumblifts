const CACHE_NAME = 'dumblifts-v17';

// Firebase URLs — bypass cache (Firestore has its own offline persistence)
const FIREBASE_DOMAINS = [
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'apis.google.com',
  'www.googleapis.com',
  'firebaseinstallations.googleapis.com'
];
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap'
];

// Install — cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache first, fallback to network (skip Firebase URLs)
self.addEventListener('fetch', event => {
  // Let Firebase handle its own requests (auth, Firestore, etc.)
  if (FIREBASE_DOMAINS.some(domain => event.request.url.includes(domain))) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache new resources dynamically (like Google Fonts font files)
        if (response.ok && event.request.url.startsWith('https://fonts.g')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback — return cached index
      return caches.match('/');
    })
  );
});
