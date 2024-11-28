import FavoriteRestaurantIdb from '../src/scripts/data/favorite-restaurant-idb';
import FavoriteButtonInitiator from '../src/scripts/utils/favorite-button-initiator';

/**
 * Skenario positif batal menyukai restoran:
1. Restoran sudah disukai
2. Tombol untuk batal menyukai restoran ditampilkan
3, Tombol batal menyukai restoran ditekan oleh pengguna
4. Restoran dihapus dari daftar restoran yang disukai, restoran berhasil dihapus

Skenario negatif :
1. Ternyata restoran tidak ada didalam datfar  restoran yang disukai

 */

describe('Unliking A Restaurant', () => {
  const addFavoriteButtonContainer = () => {
    document.body.innerHTML = '<div id="favoriteButtonContainer"></div>';
  };

  beforeEach(async () => {
    addFavoriteButtonContainer();
    await FavoriteRestaurantIdb.putRestaurant({ id: 1, name: 'A Restaurant' });
  });

  afterEach(async () => {
    await FavoriteRestaurantIdb.deleteRestaurant(1);
  });

  it('should display unfavorite widget when the restaurant has been liked', async () => {
    await FavoriteButtonInitiator.init({
      favoriteButtonContainer: document.querySelector(
        '#favoriteButtonContainer'
      ),
      restaurant: { id: 1, name: 'A Restaurant' },
    });

    expect(
      document.querySelector('[aria-label="unfavorite this restaurant"]')
    ).toBeTruthy();
  });

  it('should not display favorite widget when the restaurant has been liked', async () => {
    await FavoriteButtonInitiator.init({
      favoriteButtonContainer: document.querySelector(
        '#favoriteButtonContainer'
      ),
      restaurant: { id: 1, name: 'A Restaurant' },
    });

    expect(
      document.querySelector('[aria-label="favorite this restaurant"]')
    ).toBeFalsy();
  });

  it('should be able to remove liked restaurant from the list', async () => {
    await FavoriteButtonInitiator.init({
      favoriteButtonContainer: document.querySelector(
        '#favoriteButtonContainer'
      ),
      restaurant: { id: 1, name: 'A Restaurant' },
    });

    document
      .querySelector('#favoritedButton')
      .dispatchEvent(new Event('click'));

    expect(await FavoriteRestaurantIdb.getAllRestaurants()).toEqual([]);
  });

  it('should not throw error if the unliked restaurant is not in the list', async () => {
    await FavoriteButtonInitiator.init({
      favoriteButtonContainer: document.querySelector(
        '#favoriteButtonContainer'
      ),
      restaurant: { id: 1, name: 'A Restaurant' },
    });

    await FavoriteRestaurantIdb.deleteRestaurant(1);

    document
      .querySelector('#favoritedButton')
      .dispatchEvent(new Event('click'));

    expect(await FavoriteRestaurantIdb.getAllRestaurants()).toEqual([]);
  });
});
