if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service_worker.js')
    .then(function () { console.log("Service Worker Registered"); });
}

self.addEventListener('fetch', event => {
  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function () {
    // Try to get the response from a cache.
    const cachedResponse = await caches.match(event.request);
    console.log(event)
    // Return it if we found one.
    if (cachedResponse) return cachedResponse;
    // If we didn't find a match in the cache, use the network.
    const cache = await caches.open('v1');
    cache.put(event.request, response.clone());
    const fetchedResource = await fetch(event.request);
    return fetchedResource

  }());
});

self.addEventListener('activate', event => {
  var db;
  var request = indexedDB.open("RestaurantsDB");
  request.onerror = function (event) {
    alert("Why didn't you allow my web app to use IndexedDB?!");
  };
  request.onsuccess = function (event) {
    db = event.target.result;
    console.log(123)
  };
  //
  // Define your database
  //

})