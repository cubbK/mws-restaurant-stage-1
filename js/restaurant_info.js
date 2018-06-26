let restaurant;
var map;
let unsavedReviews = []

document.addEventListener("DOMContentLoaded", () => {
  DBHelper.fetchRestaurants()

  const reviewForm = document.querySelector("#reviewForm")
  reviewForm.addEventListener("submit", event => {
    event.preventDefault()
    submitReview()
  })

  const favoriteBtn = document.querySelector(`.favorite-star`)
  favoriteBtn.addEventListener(`click`, (event) => {
    toggleFav(event)
  })

  checkIfStarIsActive()
})

async function checkIfStarIsActive () {
  const restaurantId = getParameterByName('id')
  const isFav = await DBHelper.isRestaurantFav(restaurantId)
  const star = document.querySelector('.favorite-star')

  console.log(isFav, typeof(isFav), 'is Fav in in check start if active')

  isFav ? star.classList.add('true') : star.classList.remove('true')
}

async function toggleFav(event) {
  event.target.classList.toggle(`true`)
  const restaurantId = getParameterByName('id')
  const isFavorite = await DBHelper.isRestaurantFav(restaurantId)
  const toFavorite = (!isFavorite).toString()
  
  console.log('toFavorite', toFavorite)

  if (window.navigator.onLine) {
    DBHelper.updateFavoriteRestaurant(toFavorite, restaurantId)
    fetch(`http://localhost:1337/restaurants/${restaurantId}/?is_favorite=${toFavorite}`, {
      method: `POST`
    })
  } else {
    DBHelper.updateFavoriteRestaurant(toFavorite, restaurantId)
  }
  


}

// 
// Sends A post request with review data inside form-control
//
function submitReview() {
  const restaurantId = getParameterByName('id')
  const reviewData = getReviewData()
  reviewData.restaurant_id = restaurantId

  addReviewToHtml(reviewData)

  
  if (window.navigator.onLine) {
    fetch('http://localhost:1337/reviews/', {
      method: 'post',
      body: JSON.stringify(reviewData)
    })
  } else {
    unsavedReviews.push(reviewData)
  
  }

}


function getReviewData() {
  const reviewName = document.querySelector('#review-name').value
  const reviewRating = document.querySelector('#review-rating').value
  const reviewComments = document.querySelector('#reviewForm textarea').value

  const data = {
    name: reviewName,
    rating: reviewRating,
    comments: reviewComments
  }

  return data
}

function addReviewToHtml(review) {
  const ul = document.getElementById('reviews-list');
  ul.appendChild(createReviewHTML(review))
}


/**
 * Initialize Google map, called from HTML.
 */
window.initMap = async () => {
  const restaurant = await fetchRestaurantFromURL()
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: restaurant.latlng,
    scrollwheel: false
  });
  fillBreadcrumb();
  DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = async (callback) => {
  const id = getParameterByName('id');
  const restaurant = await DBHelper.fetchRestaurantById(id)
  const reviews = await DBHelper.fetchReviewsByRestaurantId(id)

 

  self.restaurant = restaurant
  self.reviews = reviews

  fillRestaurantHTML();
  return restaurant
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const imageSrcBig = DBHelper.imageUrlForRestaurant(restaurant);
  const imageSrcMedium = DBHelper.imageUrlForRestaurant(restaurant, 'medium');
  const imageSrcSmall = DBHelper.imageUrlForRestaurant(restaurant, 'small');

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = imageSrcBig;
  image.srcset = `
    ${imageSrcSmall} 300w,
    ${imageSrcMedium} 500w,
    ${imageSrcBig} 800w,
  `;
  image.sizes = `
    (max-width: 991px) 90%,
    40%
  `;
  image.alt = `${restaurant.name} restaurant`

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews

  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);

}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


window.addEventListener('offline', function (e) {
  const panel = document.querySelector(`.network-panel`)
  panel.classList.add('offline')
  panel.classList.remove('online')
  panel.innerHTML = `Offline`

});

window.addEventListener('online', function (e) {
  const panel = document.querySelector(`.network-panel`)
  panel.classList.add('online')
  panel.classList.remove('offline')
  panel.innerHTML = `Back online`

  submitAllUnsavedReviews()

  setTimeout(() => {
    panel.classList.remove('online')
    panel.innerHTML = ``
  }, 2000)
});

function submitAllUnsavedReviews() {
  console.log(`uploading unsaved reviews`)
  unsavedReviews.map(review => {
    fetch('http://localhost:1337/reviews/', {
      method: 'post',
      body: JSON.stringify(review)
    })
  })
  unsavedReviews = []
}
