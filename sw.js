
const CACHE_NAME = 'liba-v6-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './liba.css',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e=>{
  const { request } = e;
  e.respondWith(
    caches.match(request).then(res => res || fetch(request).then(r=>{
      const copy = r.clone();
      caches.open(CACHE_NAME).then(c=>c.put(request, copy));
      return r;
    }).catch(()=>caches.match('./index.html')))
  );
});
