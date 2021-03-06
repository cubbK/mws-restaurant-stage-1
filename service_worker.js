if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service_worker.js')
    .then(function () {
      console.log("Service Worker Registered");
      //
      // Define your database
      //
      var db;
      var request = indexedDB.open("RestaurantsDB", 1);
      request.onerror = function (event) {
        console.log('error creating db', event.error)
      };

      request.onupgradeneeded = function (event) {
        console.log(`on upgrade needed triggered`)
        db = event.target.result;
        var objectStore = db.createObjectStore("restaurants", { keyPath: "id" });
        db.createObjectStore("reviews", { keyPath: "id" });
        db.createObjectStore("unsavedReviews", { keyPath: "unsavedId" } );
      }
    });
}

self.addEventListener('fetch', async event => {

  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function () {
    const url = new URL(event.request.clone().url);

    if (url.pathname.includes(`restaurants`) && url.search.includes(`?is_favorite`)) {

      

      return await fetch(event.request)
    }

    if (url.pathname === '/restaurants' || url.pathname === '/restaurants/') {

      //
      // Get restaurants array from IndexedDB
      //
      const responseData = await useIndexedDb('restaurants');

      
      if (responseData.length > 0) {
        return getIndexedDbResponse(responseData, 'restaurants')
      } else {
        return putRestaurantsInIndexedDbAndReturnThem(event, 'restaurants')
      }

    }
    if ((url.pathname === '/reviews' || url.pathname === '/reviews/') && (event.request.method === 'POST')) {
      return await putReviewInDb(event)
    }

    if (url.pathname === '/reviews' || url.pathname === '/reviews/') {
      const responseData = await useIndexedDb('reviews');
      
      console.log(responseData)

      const searchId = getSearchIdFromReviewFetch(url.search)
      console.log(searchId)

      const responseDataFilteredToId = responseData.filter(review => review.restaurant_id == searchId)

      if (responseDataFilteredToId.length > 0) {
        return getIndexedDbResponse(responseData, 'reviews')
      } else {
        return putRestaurantsInIndexedDbAndReturnThem(event, 'reviews')
      }
    }
    return useCache(event);

  }());
});

function getSearchIdFromReviewFetch (search) {
  console.log(search)

  const idString = search.replace('?restaurant_id=', '')
  const id = parseInt(idString)
  return id
}

self.addEventListener('activate', event => {


  // request.onupgradeneeded = function (event) {

  // }
})

async function putRestaurantsInIndexedDbAndReturnThem(event, store) {
  const restaurantsFetch = await fetch(event.request.clone());
  const restaurants = await restaurantsFetch.clone().json();
 
  const DBOpenRequest = indexedDB.open("RestaurantsDB", 1);
  DBOpenRequest.onsuccess = async event => {
    var db = event.target.result;
    var objectStore = db.transaction(store, 'readwrite').objectStore(store);
    restaurants.map(restaurant => objectStore.put(restaurant))
  }
  return restaurantsFetch
}

async function getIndexedDbResponse(responseData, type) {

  const responseJson = {}
  responseJson[type] = responseData
  const blob = new Blob([JSON.stringify(responseData, null, 2)], { type: 'application/json' })
  const init = { "status": 200, "statusText": "SuperSmashingGreat!" };
  const response = new Response(blob, init);
  return response
}

async function useIndexedDb(store) {
  return new Promise(resolve => {
    const DBOpenRequest = indexedDB.open("RestaurantsDB", 1);

    DBOpenRequest.onsuccess = event => {

      var db = event.target.result;
      var objectStore = db.transaction(store, 'readwrite').objectStore(store);
      var restaurantsRequest = objectStore.getAll();
      restaurantsRequest.onsuccess = function () {
        resolve(restaurantsRequest.result);
      }
      db.close()
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

async function putReviewInDb(event) {
  const review = await event.request.clone().json()
  const response = await fetch(event.request.clone(), {
    method: 'POST',
    body: JSON.stringify(review)
  })
  const responseJson = await response.json()

  const DBOpenRequest = indexedDB.open("RestaurantsDB", 1);
  DBOpenRequest.onsuccess = async event => {
    var db = event.target.result;
    var objectStore = db.transaction('reviews', 'readwrite').objectStore('reviews');
    objectStore.put(responseJson)
  }

  return response
}

