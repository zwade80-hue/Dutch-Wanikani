const CACHE = "dutch-vocab-v4";
const FILES = ["/", "/index.html", "/words.json", "/manifest.json", "/benelux.png", "/icon.svg"];

self.addEventListener("install", e => {
  // Cache files individually so a single missing/404 file can't abort the whole install.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(FILES.map(f => c.add(f))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  // Network-first, fall back to cache when offline.
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
