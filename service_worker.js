if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service_worker.js')
    .then(function () { console.log("Service Worker Registered"); });
}

self.addEventListener('fetch', event => {

  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function () {
    const url = new URL(event.request.url);

    // serve the cat SVG from the cache if the request is
    // same-origin and the path is '/dog.svg'
    // if (url.pathname === '/dog.svg') {
    //   event.respondWith(caches.match('/cat.svg'));
    // }
    console.log('url pathname', url.pathname)
    //
    // Try to get the response from a cache.
    //
    const cachedResponse = await caches.match(event.request);
    console.log('cahced response', cachedResponse)
    console.log(event.request)
    //
    // Return it if we found one.
    //
    if (cachedResponse) return cachedResponse;
    //
    // If we didn't find a match in the cache, use the network.
    //
    const cache = await caches.open('v1');
    const fetchedResource = await fetch(event.request);
    cache.put(event.request, fetchedResource.clone());
    
    return fetchedResource

  }());
});

self.addEventListener('activate', event => {
  //
  // Define your database
  //
  var db;
  var request = indexedDB.open("RestaurantsDB");
  request.onerror = function (event) {
    console.log('error creating db', event.error)
  };
  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Successfuly created the db")
  };
})