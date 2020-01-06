// Install service worker
self.addEventListener('install', event => {
  console.log('Service worker has been installed');
});

// activate service worker
self.addEventListener('activate', event => {
  console.log('Service worker has been activated');
});
