var db;
var request = indexedDB.open("RestaurantDB");
request.onerror = function(event) {
  alert("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = function(event) {
  db = event.target.result;
  console.log(db)
};

db.onerror = function(event) {
  // Generic error handler for all errors targeted at this database's
  // requests!
  alert("Database error: " + event.target.errorCode);
};

if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./service_worker.js')
           .then(function() { console.log("Service Worker Registered"); });
}

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(resp) {
//       return resp || fetch(event.request).then(function(response) {
//         return caches.open('v1').then(function(cache) {
//           console.log('put in cache')
//           cache.put(event.request, response.clone());
//           return response;
//         });  
//       });
//     })
//   );
// });

self.addEventListener('fetch', event => {
  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function() {
    // Try to get the response from a cache.
    const cachedResponse = await caches.match(event.request);
    // Return it if we found one.
    if (cachedResponse) return cachedResponse;
    // If we didn't find a match in the cache, use the network.
    const cache = await caches.open('v1');
    cache.put(event.request, response.clone());
    const fetchedResource = await fetch(event.request);
    return fetchedResource

  }());
});