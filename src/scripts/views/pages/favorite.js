import { createRestaurantItemTemplate } from '../../views/templates/template-creator';

const Favorite = {
  async render() {
    return `
      <h2 class="title">Your Favorite Restaurants</h2>
      <section class="restaurant-list" id="favoriteRestaurantList" tabindex="-1"></section>
    `;
  },

  async afterRender() {
    const FavoriteRestaurantIdb = (
      await import(
        /* webpackChunkName: "favorite-restaurant-idb" */ '../../data/favorite-restaurant-idb'
      )
    ).default;
    const restaurants = await FavoriteRestaurantIdb.getAllRestaurants();
    const favoriteRestaurantList = document.querySelector(
      '#favoriteRestaurantList'
    );
    const skipLink = document.querySelector('#skipToContentLink');

    if (!favoriteRestaurantList) {
      console.error('Favorite restaurant list element not found');
      return;
    }

    if (skipLink) {
      skipLink.setAttribute('href', '#favoriteRestaurantList');

      skipLink.addEventListener('click', (event) => {
        event.preventDefault();
        favoriteRestaurantList.focus();
        favoriteRestaurantList.scrollIntoView({ behavior: 'smooth' });
      });
    }

    window.addEventListener(
      'keydown',
      function handleFirstTab(e) {
        if (e.key === 'Tab' && !e.shiftKey) {
          e.preventDefault();
          skipLink.focus();
          window.removeEventListener('keydown', handleFirstTab);
        }
      },
      { once: true }
    );

    if (restaurants.length === 0) {
      favoriteRestaurantList.innerHTML = `
        <div class="empty-favorite-message" tabindex="0">
          You don't have any favorite restaurants yet
        </div>
      `;
    } else {
      restaurants.forEach((restaurant) => {
        const restaurantItem = document.createElement('div');
        restaurantItem.innerHTML = createRestaurantItemTemplate(restaurant);
        const container = restaurantItem.firstElementChild;
        container.setAttribute('tabindex', '0');
        favoriteRestaurantList.appendChild(container);
      });
    }

    const firstRestaurantItem =
      favoriteRestaurantList.querySelector('.restaurant-item');
    if (firstRestaurantItem) {
      firstRestaurantItem.focus();
    } else {
      const emptyMessage = favoriteRestaurantList.querySelector(
        '.empty-favorite-message'
      );
      if (emptyMessage) {
        emptyMessage.focus();
      }
    }
  },
};

export default Favorite;
