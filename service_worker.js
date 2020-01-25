/**** Service Worker for Restaurant Reviews Stage 1 ****/

// Set basic variables
const APPLICATION_NAME = 'restaurant-reviews-stage-1'
const VERSION = 'v0.0.0.2';
const MAIN_CACHE_NAME = `${APPLICATION_NAME}-${VERSION}-main`;

// Save all needed files for clean app functionalability
const MAIN_CACHE_FILES = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/main.css',
  '/css/over750.css',
  '/data/restaurants.json',
  '/js/api_keys.js',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/register_service_worker.js',
  '/js/restaurant_info.js',
  '/img/offline/offline-map.jpeg'
];

// len equal number of restaurant images
for (var i = 1, len = 10 + 1; i < len; i++) {
  MAIN_CACHE_FILES.push(`/img/small/${i}.jpg`);
}

// Save all created caches in an array
const ALL_CACHES = [
  MAIN_CACHE_NAME
];

/*** Install Event ***/
// Create Cache and fill with all set caches
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(MAIN_CACHE_NAME).then(
      cache => {
        return cache.addAll(MAIN_CACHE_FILES);
      }
    )
  );
});

/*** Activate Event ***/
/* Delete Old MAIN Cache * if version/cach name has changed
 * Boilerplate:
 * "https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/"
*/
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          if (cacheName.startsWith(APPLICATION_NAME)) {
            return !ALL_CACHES.includes(cacheName);
          }
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/*** Fetch Event ***/
/* Highjack all get-events */
/* Fetch from matching cache if exists, if not fetch from network and add to cache.
 * Catch all "not in cach and no network connection"
 * Boilerplate "fetch and offline first" (section: Cache, falling back to network):
 * https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
*/
self.addEventListener('fetch', e => {
  // Only fetch get requests:
  if (!e.request.method === 'GET') return;
  const requestUrl = new URL(e.request.url);

  e.respondWith(
    caches.open(MAIN_CACHE_NAME).then(cache => {
      return cache.match(e.request).then(response => {
        // Return from Cache, if not existent hand over request to network
        return response || fetch(e.request).then(response => {
          cache.put(e.request, response.clone());
          return response;
          // Handle network requests without network
        }).catch(err => {
          if (requestUrl.pathname.startsWith('/restaurant.html')) {
            return caches.match('/restaurant.html');
          } else if (requestUrl.pathname.startsWith('/v4/mapbox.streets/')) {
            return caches.match('/img/offline/offline-map.jpeg');
          } else if (requestUrl.pathname.startsWith('/img/medium')) {
            return caches.match(`/img/small/${requestUrl.pathname.slice(12)}`);
          }
        });
      });
    })
  );
});
