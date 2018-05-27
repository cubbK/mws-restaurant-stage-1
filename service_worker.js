if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service_worker.js')
    .then(function () { console.log("Service Worker Registered"); });
}

self.addEventListener('fetch', event => {

  // Prevent the default, and handle the request ourselves.
  event.respondWith(function () {
    const url = new URL(event.request.url);

    if (url.pathname === '/restaurants') {
      return useIndexedDb(event);
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
  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Successfuly created the db");
  };
  request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("restaurants", { keyPath: "id" });
  }
})

async function useIndexedDb(fetchEvent) {
  console.log('use indexedDb')
  const fetchedRestaurants = await fetch(fetchEvent.request);
  const items = await fetchedRestaurants.json();

  const DBOpenRequest = indexedDB.open("RestaurantsDB", 1);
  DBOpenRequest.onsuccess = async event => {

    const db = event.target.result;

    //
    // create an object store on the transaction
    //

    console.log(123)
   
    var objectStore = db.transaction('restaurants', 'readwrite').objectStore("restaurants");
    items.map(restaurant => objectStore.put(restaurant))        

    objectStore.onsucces = async function () {
      console.log('object store success')
    }

    objectStore.onerror = function () {
      console.log('err')
    }

  }
  return await fetch(fetchEvent.request)
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