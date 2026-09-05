const CACHE_NAME = 'fingerboard-timer-v24';

// How long to wait for the network before falling back to the cached copy.
// Keeps a slow or flaky connection from stalling the splash screen — the app
// opens from cache instead, and the network response still refreshes the cache
// in the background for next launch.
const NETWORK_TIMEOUT_MS = 1500;

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

  // Network-first with a timeout for the page: pick up the latest deploy when
  // the connection is decent, but never let a slow one hold up the launch.
  event.respondWith((async () => {
    const cached = await caches.match(req);

    const network = fetch(req).then((res) => {
      // Refresh the cache whenever the network does come back, even if we've
      // already answered from cache by then.
      const copy = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
      return res;
    });

    // Nothing cached yet (first ever load) — we have to wait for the network.
    if (!cached) {
      return network.catch(() => caches.match('./index.html'));
    }

    // Keep the request alive past the response so a slow fetch can still
    // populate the cache after we've served the cached copy.
    event.waitUntil(network.catch(() => {}));

    const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NETWORK_TIMEOUT_MS));
    const winner = await Promise.race([network.catch(() => null), timeout]);
    return winner || cached;
  })());
});
