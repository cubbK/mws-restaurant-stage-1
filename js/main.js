let restaurants,
  neighborhoods,
  cuisines,
  lazyLoad
var map
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap()
  fetchNeighborhoods();
  fetchCuisines();
  function logElementEvent(eventName, element) {
    console.log(new Date().getTime(), eventName, element.getAttribute('data-src'));
  }
  /* Uncomment the callbacks in LazyLoad options to see the callbacks logs in your browser's console */
  lazyLoad = new LazyLoad({
    callback_load: function (element) {
      logElementEvent("LOADED", element);
    },
    callback_set: function (element) {
      logElementEvent("SET", element);
    }
  });
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
initMap = async () => {
  const restaurants = await DBHelper.fetchRestaurants()

  const getRestaurantCoord = restaurant => {
    return (
      restaurant.latlng.lat.toString() + ',' + restaurant.latlng.lng.toString()
    )
  } 

  const restaurantsCoord = restaurants.map(getRestaurantCoord)


  const restaurantsCoordString = restaurantsCoord.reduce(
    (accumulator, currentValue) => accumulator + '|' + currentValue, 
    ''
  )

  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };

  const mapContainer = document.getElementById('map')
  const locString = loc.lat.toString() + ',' + loc.lng.toString()
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${locString}&zoom=12&size=1000x400&scale=1&format=jpg&maptype=roadmap
  &markers=${restaurantsCoordString}&key=AIzaSyBd-Cx0sWmoyl3PP7W_KyrKfT5NbSyBtaQ`

  const mapImg = document.createElement(`img`)
  mapImg.src = mapUrl
  mapImg.alt = `Map for restaurants`
  mapImg.classList.add('map-img-home')
  mapContainer.appendChild(mapImg)


  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
    lazyLoad.update();
  });
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const imageContainer = document.createElement('div');
  imageContainer.className = 'restaurant-img-container';

  const imageSrcBig = DBHelper.imageUrlForRestaurant(restaurant);
  const imageSrcMedium = DBHelper.imageUrlForRestaurant(restaurant, 'medium');
  const imageSrcSmall = DBHelper.imageUrlForRestaurant(restaurant, 'small');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.setAttribute('data-src', imageSrcBig);
  image.setAttribute('data-srcset', `
    ${imageSrcSmall} 150w,
    ${imageSrcMedium} 300w,
    ${imageSrcBig} 800w,
  `);
  image.sizes = `
    (max-width: 1200px) 50%,
    (max-width: 767px) 100%,
    270px
  `;
  image.alt = `${restaurant.name} restaurant`
  imageContainer.append(image);

  li.append(imageContainer);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('aria-label', restaurant.name + ' View Details');
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}


