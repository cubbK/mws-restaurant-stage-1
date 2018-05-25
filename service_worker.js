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
      console.log('use indexedDb')
      const DBOpenRequest = indexedDB.open("RestaurantsDB", 1);
      DBOpenRequest.onsuccess = event => {
        const db = event.target.result;
        
          var transaction = db.transaction(["restaurants"], "readwrite").objectStore('restaurants');
          // report on the success of the transaction completing, when everything is done
          transaction.oncomplete = function (event) {
            console.log('transaction complete', event.target);
          };

        transaction.onerror = function (event) {
          console.log('transaction error')
        };

      }
      return await fetch(event.request)
    } else {
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
    console.log("Successfuly created the db");
  };
  request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("restaurants", { keyPath: "id" });
  }
})