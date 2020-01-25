/**** Main App Script ****/
/**
 * Set global variables
 */
let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
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
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
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
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant, restaurants));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant, restaurants) => {
  const li = document.createElement('li');
  li.setAttribute('aria-label', `Restaurant ${restaurant.name}`);
  li.setAttribute('aria-posinset', `${restaurant.id}`);
  li.setAttribute('aria-setsize', `${restaurants.length}`);

  const pictureElement = document.createElement('picture');

  const pictureElement500Source = document.createElement('source');
  pictureElement500Source.media = '(min-width: 500px)';
  pictureElement500Source.srcset= `img/medium/${restaurant.photograph}`;
  pictureElement.append(pictureElement500Source);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.alt = `Picture of Restaurant ${restaurant.name}`;
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  pictureElement.append(image);
  li.append(pictureElement);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = `View Details`;
  more.className = 'details-button'
  more.setAttribute('aria-label', `${restaurant.name} Details`);
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });
}
