/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static async fetchRestaurants() {
    const restaurants = await fetch(DBHelper.DATABASE_URL)
    const json = await restaurants.json()
    return json
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static async fetchRestaurantById(id) {
    const restaurants = await DBHelper.fetchRestaurants()
    const restaurant = restaurants.find(r => r.id == id);
    return restaurant
  }

  static async fetchReviewsByRestaurantId(id) {
    const allReviews = await DBHelper.fetchReviews()

    const reviews = allReviews.filter(review => review.restaurant_id = id)
    return reviews
  }

  static async fetchReviews() {
    const reviews = await fetch(`http://localhost:1337/reviews/`)
    const reviewsData = await reviews.json()
    return reviewsData
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static async fetchRestaurantByCuisine(cuisine, callback) {
    const restaurants = await DBHelper.fetchRestaurants()
    const results = restaurants.filter(r => r.cuisine_type == cuisine)
    callback(null, results)
    return results
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static async fetchRestaurantByNeighborhood(neighborhood, callback) {
    const restaurants = await DBHelper.fetchRestaurants()
    const results = restaurants.filter(r => r.neighborhood == neighborhood);
    callback(null, results)
    return results
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static async fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    const restaurants = await DBHelper.fetchRestaurants()
    let results = restaurants
    if (cuisine != 'all') { // filter by cuisine
      results = results.filter(r => r.cuisine_type == cuisine);
    }
    if (neighborhood != 'all') { // filter by neighborhood
      results = results.filter(r => r.neighborhood == neighborhood);
    }
    callback(null, results)
    return results
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static async fetchNeighborhoods(callback) {
    // Fetch all restaurants
    const restaurants = await DBHelper.fetchRestaurants()

    // Get all neighborhoods from all restaurants
    const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
    // Remove duplicates from neighborhoods
    const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
    callback(null, uniqueNeighborhoods)
    return uniqueNeighborhoods
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static async fetchCuisines(callback) {
    // Fetch all restaurants
    const restaurants = await DBHelper.fetchRestaurants()
    // Get all cuisines from all restaurants
    const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
    // Remove duplicates from cuisines
    const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
    callback(null, uniqueCuisines)
    return uniqueCuisines
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant, size) {
    return size ? `/img/${size}/${restaurant.photograph}.jpg` : `/img/webp/${restaurant.photograph}.webp`
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    }
    );
    return marker;
  }

  static updateFavoriteRestaurant(toFavorite, restaurantId) {
    const DBOpenRequest = indexedDB.open("RestaurantsDB", 1)

    DBOpenRequest.onsuccess = event => {

      var db = event.target.result;
      var objectStore = db.transaction(`restaurants`, 'readwrite').objectStore(`restaurants`)
      var restaurantsRequest = objectStore.getAll()
      restaurantsRequest.onsuccess = function () {
        const restaurants = restaurantsRequest.result
        const neededRestaurant = restaurants.filter(restaurant => restaurant.id == restaurantId)[0]
        neededRestaurant.is_favorite = toFavorite
        objectStore.put(neededRestaurant)
      }
    }
  }

  static async isRestaurantFav(restaurantId) {
    const request = await fetch(`http://localhost:1337/restaurants/`)
    const restaurants = await request.json()
    const neededRestaurant = restaurants.filter(restaurant => restaurant.id == restaurantId)[0]
    console.log(neededRestaurant, 'fav res')
    return neededRestaurant.is_favorite
  }
}
