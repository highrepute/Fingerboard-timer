const CACHE_NAME = 'fingerboard-timer-v17';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Icons and the manifest never change between deploys, so serve them from cache
// straight away. The page itself does change, so it goes network-first below.
function isStaticAsset(url) {
  return /\.(png|json)$/.test(new URL(url).pathname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  if (isStaticAsset(req.url)) {
    // Cache-first: instant, and these don't go stale.
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
    return;
  }

  // Network-first for the page: always pick up the latest deploy, but fall back
  // to the cached copy the moment the network is unavailable or too slow, so the
  // app still opens offline. Each successful fetch refreshes the cache.
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match('./index.html'))
      )
  );
});
