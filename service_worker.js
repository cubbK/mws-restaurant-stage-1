if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./service_worker.js')
           .then(function() { console.log("Service Worker Registered"); });
}

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open('v1').then(function(cache) {
          console.log('put in cache')
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});