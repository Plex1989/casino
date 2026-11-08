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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
