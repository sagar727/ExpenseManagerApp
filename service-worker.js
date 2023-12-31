const cachename = "myCache-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches
      .open(cachename)
      .then((cache) => {
        cache.addAll([
          "/",
          "/index.html",
          "/css/styles.css",
          "/js/database/local-db.js",
          "/js/database/remote-db.js",
          "/js/scripts.js",
          "/pages/add/add.css",
          "/pages/add/add.html",
          "/pages/home/home.css",
          "/pages/home/home.html",
          "/pages/home/pages.js",
          "/pages/settings/settings.css",
          "/pages/settings/settings.html",
          "/pages/settings/settings.js",
          "/pages/signUp/scripts.js",
          "/pages/signUp/signUp.html",
          "/pages/summary/chart.js",
          "/pages/summary/summary.css",
          "/pages/summary/summary.html",
          "/images/background1.jpg",
          "/images/delete.png",
          "/images/pencil.png",
          "/images/logo.png",
        ]);
      })
      .catch((error) => {
        console.log(error);
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((item) => {
        if (item !== cachename) {
          caches.delete(item);
        }
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  //Cache strategy: Network with cache fallback

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(cachename);
      return await cache.match(event.request);
    })
  );
});
