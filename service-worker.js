
/**
 * On Install Event
 * Triggered when the service worker is installed
 */
self.addEventListener('install', function () {
  self.skipWaiting();
});


/**
 * On Activate Event
 * Triggered when the service worker is activated
 */
self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
});


/**
 * On Fetch Event
 * Triggered when the service worker retrieves an asset
 */
self.addEventListener('fetch', function (event) {
 
  // Cache Strategy: Network Only
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        return response;
      })
  );
});