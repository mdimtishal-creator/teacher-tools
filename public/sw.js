
// Minimal Service Worker to satisfy PWA installation requirements
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Fetch handler is required for Chrome to trigger beforeinstallprompt
  // Currently just passing through to the network
  event.respondWith(fetch(event.request).catch(() => {
    return new Response('You are offline', { status: 503, statusText: 'Offline' });
  }));
});
