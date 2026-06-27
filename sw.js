/* Iron Log service worker — caches the app shell so the app loads offline.
   The page (index.html) is fetched network-first so updates roll out on the
   next online launch without needing a cache bump; other assets are
   cache-first for speed. Bump CACHE only when you want to force-purge. */
const CACHE = 'ironlog-v3';
const SHELL = ['.', 'index.html', 'manifest.json', 'icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Network-first for page navigations so a fresh index.html always wins when
  // online; fall back to the cached shell when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('index.html', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('index.html').then(h => h || caches.match('.')))
    );
    return;
  }

  // Cache-first for other static assets; populate the cache on first network hit.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});
