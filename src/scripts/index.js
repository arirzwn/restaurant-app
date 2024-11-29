import 'regenerator-runtime';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import '../styles/main.css';
import App from './views/app';
import API_ENDPOINT from './globals/api-endpoint';
import FavoriteRestaurantIdb from './data/favorite-restaurant-idb';

const loadSW = async () => {
  await import(/* webpackChunkName: "sw-register" */ './utils/sw-register');
};

const menuButton = document.querySelector('.app-bar__menu');
const navigation = document.querySelector('.app-bar__navigation');

menuButton.addEventListener('click', () => {
  navigation.classList.toggle('open');
  menuButton.classList.toggle('open');
});

menuButton.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    navigation.classList.toggle('open');
    menuButton.classList.toggle('open');
  }
});

menuButton.addEventListener('keyup', (event) => {
  if (event.key === ' ') {
    event.preventDefault();
    navigation.classList.toggle('open');
    menuButton.classList.toggle('open');
  }
});

function generateStarRating(rating) {
  const starContainer = document.createElement('div');
  starContainer.classList.add('rating');
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.classList.add('star');
    if (i <= rating) {
      star.textContent = '★';
    } else {
      star.textContent = '☆';
    }
    starContainer.appendChild(star);
  }
  return starContainer;
}

function createRestaurantItem(restaurant) {
  const restaurantItem = document.createElement('div');
  restaurantItem.classList.add('restaurant-item');
  restaurantItem.setAttribute('data-id', restaurant.id);
  restaurantItem.tabIndex = '0';
  restaurantItem.setAttribute('aria-label', `Restaurant ${restaurant.name}`);
  restaurantItem.style.minHeight = '200px'; // Set a fixed height to avoid layout shifts

  restaurantItem.innerHTML = `
    <img data-src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" 
         alt="${restaurant.name}" 
         crossorigin="anonymous" 
         tabindex="-1"  class="lazyload"/>
    <h2 tabindex="0">${restaurant.name}</h2>
    <p tabindex="0">${restaurant.city}</p>
    <div class="rating-container" tabindex="0"></div>
    <a href="#/detail/${restaurant.id}" class="cta view-details-btn" tabindex="0">View Details</a>
  `;
  const ratingContainer = restaurantItem.querySelector('.rating-container');
  ratingContainer.appendChild(generateStarRating(restaurant.rating));
  return restaurantItem;
}

async function fetchRestaurants() {
  try {
    const response = await fetch(API_ENDPOINT.LIST);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.restaurants;
  } catch (error) {
    throw new Error(`Failed to fetch restaurants: ${error.message}`);
  }
}

export async function displayRestaurants() {
  const restaurantList = document.querySelector('#restaurantList');

  if (!restaurantList) {
    console.error('Restaurant list element not found');
    return;
  }

  restaurantList.innerHTML = `
    <div class="loading-indicator">
      <div class="loading-spinner"></div>
      <p>Loading restaurants...</p>
    </div>
  `;

  try {
    const [restaurants, favoriteRestaurants] = await Promise.all([
      fetchRestaurants(),
      FavoriteRestaurantIdb.getAllRestaurants(),
    ]);

    const favoriteIds = favoriteRestaurants.map((restaurant) => restaurant.id);
    const nonFavoriteRestaurants = restaurants.filter(
      (restaurant) => !favoriteIds.includes(restaurant.id)
    );

    restaurantList.innerHTML = '';

    if (nonFavoriteRestaurants.length === 0) {
      restaurantList.innerHTML = `
        <div class="error-message">
          No restaurants found
        </div>
      `;
      return;
    }

    nonFavoriteRestaurants.forEach((restaurant) => {
      const restaurantItem = createRestaurantItem(restaurant);
      restaurantList.appendChild(restaurantItem);
    });
  } catch (error) {
    restaurantList.innerHTML = `
      <div class="error-message">
        ${error.message}
      </div>
    `;
  }
}

const app = new App({
  content: document.querySelector('#main-content'),
});

document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('view-details-btn')) {
    event.preventDefault();
    const url = event.target.getAttribute('href');
    window.location.hash = url;
  }
});

window.addEventListener('hashchange', async () => {
  await app.renderPage();
});

window.addEventListener('load', async () => {
  await loadSW();
  await app.renderPage();
  if (!window.location.hash) {
    await displayRestaurants();
  }
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const addBtn = document.createElement('button');
  addBtn.innerText = '+';
  addBtn.classList.add('add-to-home-screen');
  document.body.appendChild(addBtn);

  addBtn.addEventListener('click', () => {
    addBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});
