class DBHelper{static get DATABASE_URL(){return"http://localhost:1337/restaurants"}static async fetchRestaurants(){const t=await fetch(DBHelper.DATABASE_URL);return await t.json()}static async fetchRestaurantById(t){return(await DBHelper.fetchRestaurants()).find(e=>e.id==t)}static async fetchReviewsByRestaurantId(t){return(await DBHelper.fetchReviews()).filter(e=>e.restaurant_id=t)}static async fetchReviews(){const t=await fetch("http://localhost:1337/reviews/");return await t.json()}static async fetchRestaurantByCuisine(t,e){const a=(await DBHelper.fetchRestaurants()).filter(e=>e.cuisine_type==t);return e(null,a),a}static async fetchRestaurantByNeighborhood(t,e){const a=(await DBHelper.fetchRestaurants()).filter(e=>e.neighborhood==t);return e(null,a),a}static async fetchRestaurantByCuisineAndNeighborhood(t,e,a){let r=await DBHelper.fetchRestaurants();return"all"!=t&&(r=r.filter(e=>e.cuisine_type==t)),"all"!=e&&(r=r.filter(t=>t.neighborhood==e)),a(null,r),r}static async fetchNeighborhoods(t){const e=await DBHelper.fetchRestaurants(),a=e.map((t,a)=>e[a].neighborhood),r=a.filter((t,e)=>a.indexOf(t)==e);return t(null,r),r}static async fetchCuisines(t){const e=await DBHelper.fetchRestaurants(),a=e.map((t,a)=>e[a].cuisine_type),r=a.filter((t,e)=>a.indexOf(t)==e);return t(null,r),r}static urlForRestaurant(t){return`./restaurant.html?id=${t.id}`}static imageUrlForRestaurant(t,e){return e?`/img/${e}/${t.photograph}.jpg`:`/img/webp/${t.photograph}.webp`}static mapMarkerForRestaurant(t,e){return new google.maps.Marker({position:t.latlng,title:t.name,url:DBHelper.urlForRestaurant(t),map:e,animation:google.maps.Animation.DROP})}static updateFavoriteRestaurant(t,e){indexedDB.open("RestaurantsDB",1).onsuccess=(a=>{var r=a.target.result.transaction("restaurants","readwrite").objectStore("restaurants"),s=r.getAll();s.onsuccess=function(){const a=s.result.filter(t=>t.id==e)[0];a.is_favorite=t,r.put(a)}})}static async isRestaurantFav(t){const e=await fetch("http://localhost:1337/restaurants/"),a=(await e.json()).filter(e=>e.id==t)[0];return console.log(a,"fav res"),a.is_favorite}}