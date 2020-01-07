const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  '/pages/fallback.html',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => cache.addAll(assets))
      .catch(err => console.log(err))
  );
});

// activate service worker
self.addEventListener('activate', event => {
  // console.log('Service worker has been activated');
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== staticCacheName && key !== dynamicCacheName)
            .map(key => caches.delete(key))
        )
      )
      .catch(err => console.log(err))
  );
});

// fetch event
self.addEventListener('fetch', event => {
  if (!(event.request.url.indexOf('http') === 0)) return;
  event.respondWith(
    caches
      .match(event.request)
      .then(cacheRes => {
        return (
          cacheRes ||
          fetch(event.request).then(fetchRes => {
            return caches.open(dynamicCacheName).then(cache => {
              cache.put(event.request.url, fetchRes.clone());
              limitCacheSize(dynamicCacheName, 20);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        if (event.request.url.indexOf('.html') > -1) {
          return caches.match('/pages/fallback.html');
        }
      })
  );
});
