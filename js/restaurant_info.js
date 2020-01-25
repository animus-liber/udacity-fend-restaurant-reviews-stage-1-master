let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        keyboard: false,
        scrollWheelZoom: false,
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: APIKeys.mapboxAPIKey,
        maxZoom: 18,
        attribution: '<span aria-hidden="true">Map data &copy</span>; ' +
          '<a tabindex="-1" href="https://www.openstreetmap.org/">OpenStreetMap</a>' +
          '<span aria-hidden="true"> contributors, </span>' +
          '<a tabindex="-1" href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' +
          '<span aria-hidden="true">, Imagery © </span><a tabindex="-1" href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(newMap);

      // Remove zoom in button from tabindex for better UX
      let leafControlZoomIn = document.querySelectorAll('.leaflet-control-zoom-in')[0];
      leafControlZoomIn.tabIndex = -1;

      // Remove zoom out button from tabindex for better UX
      let leafControlZoomOut = document.querySelectorAll('.leaflet-control-zoom-out')[0];
      leafControlZoomOut.tabIndex = -1;

      // Remove Leaflet links from tabindex for better UX
      let leafControlAttri = document.querySelectorAll('.leaflet-control-attribution')[0];
      leafControlAttri.firstChild.tabIndex = -1;

      // Set aria-hidden true on complete map container to ensure Assistive T. will jump over map
      // All important infos can be found within the single list elements
      document.querySelectorAll('.leaflet-container')[0].setAttribute('aria-hidden', 'true');

      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const container = document.getElementById('restaurant-container');
  container.setAttribute('role', 'contentinfo');
  container.setAttribute('aria-label', `Details About Restaurant ${restaurant.name}`);

  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = `Picture of Restaurant ${restaurant.name}`;

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
  hours.setAttribute('role', 'table');
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    row.setAttribute('role', 'row');

    const day = document.createElement('td');
    day.setAttribute('role', 'cell');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.setAttribute('role', 'cell');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach((review, index) => {
    const reviewHTML = createReviewHTML(review)    ;
    reviewHTML.setAttribute('aria-posinset', `${index + 1}`);
    reviewHTML.setAttribute('aria-setsize', `${reviews.length}`);

    ul.appendChild(reviewHTML);
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.setAttribute('aria-label', `Review from ${review.name}`);

  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  li.appendChild(date);

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
fillBreadcrumb = (restaurant=self.restaurant) => {
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
