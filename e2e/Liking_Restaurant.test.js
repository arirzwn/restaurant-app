Feature('Liking Restaurant');

Before(({ I }) => {
  I.amOnPage('/');
});

Scenario('liking one restaurant', async ({ I }) => {
  I.waitForElement('.restaurant-item', 10); // Wait for the restaurant item to be visible
  I.seeElement('.restaurant-item');
  const firstRestaurant = locate('.restaurant-item a.view-details-btn').first(); // Update selector to view details button
  I.click(firstRestaurant);

  I.waitForElement('#favoriteButton', 5); // Wait for the favorite button to be visible
  I.seeElement('#favoriteButton');
  I.click('#favoriteButton');
});

Scenario('unliking one restaurant', async ({ I }) => {
  I.amOnPage('/');
  I.waitForElement('.restaurant-item', 10); // Wait for the restaurant item to be visible
  I.seeElement('.restaurant-item');
  const firstRestaurant = locate('.restaurant-item a.view-details-btn').first(); // Update selector to view details button
  I.click(firstRestaurant);

  I.waitForElement('#favoriteButton', 5); // Wait for the favorite button to be visible
  I.seeElement('#favoriteButton');
  I.click('#favoriteButton'); // Like the restaurant

  I.amOnPage('/#/favorite');
  I.waitForElement('.restaurant-item', 10); // Wait for the restaurant item to be visible
  I.seeElement('.restaurant-item');
  const firstFavoriteRestaurant = locate(
    '.restaurant-item a.view-details-btn'
  ).first(); // Update selector to view details button
  I.click(firstFavoriteRestaurant);

  I.waitForElement('#favoritedButton', 10); // Increase wait time for the favorited button to be visible
  I.seeElement('#favoritedButton');
  I.click('#favoritedButton'); // Unfavorite the restaurant

  I.amOnPage('/#/favorite');
  I.waitForElement('.empty-favorite-message', 10); // Wait for the empty favorite message to be visible
  I.see(
    "You don't have any favorite restaurants yet",
    '.empty-favorite-message'
  ); // Ensure the restaurant is removed from favorites
});
