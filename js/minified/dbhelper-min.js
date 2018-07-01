class DBHelper{static get DATABASE_URL(){return"http://localhost:1337/restaurants"}static async fetchRestaurants(){const t=await fetch(DBHelper.DATABASE_URL);return await t.json()}static async fetchRestaurantById(t){return(await DBHelper.fetchRestaurants()).find(e=>e.id==t)}static async fetchReviewsByRestaurantId(t){const e=await fetch(`http://localhost:1337/reviews/?restaurant_id=${t}`);return await e.json()}static async fetchReviews(){const t=await fetch("http://localhost:1337/reviews/");return await t.json()}static async fetchRestaurantByCuisine(t,e){const a=(await DBHelper.fetchRestaurants()).filter(e=>e.cuisine_type==t);return e(null,a),a}static async fetchRestaurantByNeighborhood(t,e){const a=(await DBHelper.fetchRestaurants()).filter(e=>e.neighborhood==t);return e(null,a),a}static async fetchRestaurantByCuisineAndNeighborhood(t,e,a){let s=await DBHelper.fetchRestaurants();return"all"!=t&&(s=s.filter(e=>e.cuisine_type==t)),"all"!=e&&(s=s.filter(t=>t.neighborhood==e)),a(null,s),s}static async fetchNeighborhoods(t){const e=await DBHelper.fetchRestaurants(),a=e.map((t,a)=>e[a].neighborhood),s=a.filter((t,e)=>a.indexOf(t)==e);return t(null,s),s}static async fetchCuisines(t){const e=await DBHelper.fetchRestaurants(),a=e.map((t,a)=>e[a].cuisine_type),s=a.filter((t,e)=>a.indexOf(t)==e);return t(null,s),s}static urlForRestaurant(t){return`./restaurant.html?id=${t.id}`}static imageUrlForRestaurant(t,e){return e?`/img/${e}/${t.photograph}.jpg`:`/img/webp/${t.photograph}.webp`}static mapMarkerForRestaurant(t,e){return new google.maps.Marker({position:t.latlng,title:t.name,url:DBHelper.urlForRestaurant(t),map:e,animation:google.maps.Animation.DROP})}static updateFavoriteRestaurant(t,e){indexedDB.open("RestaurantsDB",1).onsuccess=(a=>{var s=a.target.result.transaction("restaurants","readwrite").objectStore("restaurants"),r=s.getAll();r.onsuccess=function(){const a=r.result.filter(t=>t.id==e)[0];a.is_favorite=t,s.put(a)}})}static async isRestaurantFav(t){const e=await fetch("http://localhost:1337/restaurants/");return"true"==(await e.json()).filter(e=>e.id==t)[0].is_favorite}static async getUnsavedReviews(){return new Promise(t=>{indexedDB.open("RestaurantsDB",1).onsuccess=(e=>{var a=e.target.result.transaction("unsavedReviews","readwrite").objectStore("unsavedReviews").getAll();a.onsuccess=function(){const e=a.result;t(e)}})})}static addUnsavedReview(t){indexedDB.open("RestaurantsDB",1).onsuccess=(e=>{e.target.result.transaction("unsavedReviews","readwrite").objectStore("unsavedReviews").add(t)})}static clearUnsavedReviews(){indexedDB.open("RestaurantsDB",1).onsuccess=(t=>{t.target.result.transaction("unsavedReviews","readwrite").objectStore("unsavedReviews").clear()})}}