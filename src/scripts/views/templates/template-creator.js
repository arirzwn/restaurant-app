const createRestaurantDetailTemplate = (restaurant) => `
  <div class="restaurant-detail-content" id="restaurantDetail" tabindex="-1">
    <script>
      document.getElementById('skipToDetailLink').style.display = 'block';
      document.getElementById('skipToDetailLink').focus();
    </script>
    <img src="https://restaurant-api.dicoding.dev/images/large/${
      restaurant.pictureId
    }"
         alt="${restaurant.name}"
         crossorigin="anonymous"
         loading="lazy"
         referrerpolicy="no-referrer"
         tabindex="0"
         class="lazyload" />
    <h2 tabindex="0">${restaurant.name}</h2>
    <div>
      <h3 tabindex="0">Overview</h3>
      <p tabindex="0">Address: ${restaurant.address}</p>
      <p tabindex="0">City: ${restaurant.city}</p>
      <p tabindex="0">Description: ${restaurant.description}</p>
    </div>
    <h3 tabindex="0">🍝 Food Menu 🥘</h3>
    <div class="food-menu">
      ${restaurant.menus.foods
        .map(
          (food) =>
            `<div class="food-card" tabindex="0"><p>${food.name}</p></div>`
        )
        .join('')}
    </div>
    <h3 tabindex="0">☕ Drink Menu🍹</h3>
    <div class="drink-menu">
      ${restaurant.menus.drinks
        .map(
          (drink) =>
            `<div class="drink-card" tabindex="0"><p>${drink.name}</p></div>`
        )
        .join('')}
    </div>
    <h3 tabindex="0">Customer Reviews</h3>
    <div class="review-form">
      <h4 tabindex="0">Add Your Review</h4>
      <form id="reviewForm">
        <input type="text" id="reviewName" placeholder="Your Name" required tabindex="0">
        <textarea id="reviewText" placeholder="Your Review" required tabindex="0"></textarea>
        <button type="submit" tabindex="0">Submit Review</button>
      </form>
    </div>
    <div class="carousel">
      <div class="carousel-inner">
        ${restaurant.customerReviews
          .map(
            (review) => `
          <div class="carousel-item" tabindex="0">
            <p>${review.name}</p>
            <p>${review.review}</p>
            <p>${review.date}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </div>
`;

const createFavoriteButtonTemplate = () => `
  <button id="favoriteButton" aria-label="favorite this restaurant">Favorite</button>
`;

const createFavoritedButtonTemplate = () => `
  <button id="favoritedButton" aria-label="unfavorite this restaurant">Unfavorite</button>
`;

const createRestaurantItemTemplate = (restaurant) => `
  <div class="restaurant-item" data-id="${restaurant.id}">
    <img data-src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}"
         alt="${restaurant.name}"
         crossorigin="anonymous"
         loading="lazy"
         referrerpolicy="no-referrer"
         class="lazyload" />
    <h2 tabindex="0">${restaurant.name}</h2>
    <p tabindex="0">${restaurant.city}</p>
    <div class="rating-container" tabindex="0">${restaurant.rating}</div>
    <a href="#/detail/${restaurant.id}" class="cta view-details-btn" tabindex="0">View Details</a>
  </div>
`;

export {
  createRestaurantDetailTemplate,
  createFavoriteButtonTemplate,
  createFavoritedButtonTemplate,
  createRestaurantItemTemplate,
};
