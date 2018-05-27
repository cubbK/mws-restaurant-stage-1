if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service_worker.js')
    .then(function () { console.log("Service Worker Registered"); });
}

self.addEventListener('fetch', event => {

  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function () {
    const url = new URL(event.request.url);

    if (url.pathname === '/restaurants') {
      const responseData = await useIndexedDb(event);
      const responseJson = {
        restaurants: responseData
      }
      console.log('creating blob')
      const blob = new Blob([JSON.stringify(responseData, null, 2)], { type: 'application/json' })
      const init = { "status" : 200 , "statusText" : "SuperSmashingGreat!" };
      const response = new Response(blob, init);
      return response
    } else {
      return useCache(event);
    }
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

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("restaurants", { keyPath: "id" });
  }
})

async function useIndexedDb(fetchEvent) {
  return new Promise(resolve => {
    const DBOpenRequest = indexedDB.open("RestaurantsDB", 1);

    DBOpenRequest.onsuccess = event => {

      var db = event.target.result;
      var objectStore = db.transaction('restaurants', 'readwrite').objectStore("restaurants");
      var restaurantsRequest = objectStore.getAll();
      restaurantsRequest.onsuccess = function () {
        resolve(restaurantsRequest.result);
      }
    }
  });

}

async function useCache(event) {
  //
  // Try to get the response from a cache.
  //
  const cachedResponse = await caches.match(event.request);

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
}