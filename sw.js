importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
const CACHE_NAME = 'casino-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo.png',
  '/ruleta.gif',
  '/blackjack.png',
  '/bacara.png',
  '/texas.png'
];

// Instala el motor y guarda los archivos básicos en la memoria del celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Responde rápido usando la memoria caché cuando el cliente abra la app
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
