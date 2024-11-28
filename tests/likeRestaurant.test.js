import FavoriteRestaurantIdb from '../src/scripts/data/favorite-restaurant-idb';
import FavoriteButtonInitiator from '../src/scripts/utils/favorite-button-initiator';

/**
 * Skenario positif menyukai restoran:

Restoran belum disukai
Tombol untuk menyukai restoran ditampilkan 3, Tombol menyukai restoran ditekan oleh pengguna
Restoran ditambahkan ke daftra restoran yang disukai, restoran berhasil ditambahkan
Skenario negatif :

Restoran sudah disukai, tidak harus menambahkan.
Restoran tidak memiliki ID, sistem tidak memeroes penyimpanan
 */

describe('Liking A Restaurant', () => {
  const addFavoriteButtonContainer = () => {
    document.body.innerHTML = '<div id="favoriteButtonContainer"></div>';
  };

  beforeEach(() => {
    addFavoriteButtonContainer();
  });

  afterEach(async () => {
    await FavoriteRestaurantIdb.deleteRestaurant(1);
  });

  it('should show the favorite button when the restaurant has not been liked before', async () => {
    await FavoriteButtonInitiator.init({
      favoriteButtonContainer: document.querySelector(
        '#favoriteButtonContainer'
      ),
      restaurant: {
        id: 1,
        name: 'A Restaurant',
      },
    });

    expect(
      document.querySelector('[aria-label="favorite this restaurant"]')
    ).toBeTruthy();
  });

  it('should be able to like the restaurant', async () => {
    await FavoriteButtonInitiator.init({
      favoriteButtonContainer: document.querySelector(
        '#favoriteButtonContainer'
      ),
      restaurant: {
        id: 1,
        name: 'A Restaurant',
      },
    });

    document.querySelector('#favoriteButton').dispatchEvent(new Event('click'));
    const restaurant = await FavoriteRestaurantIdb.getRestaurant(1);

    expect(restaurant).toEqual({ id: 1, name: 'A Restaurant' });
  });

  it('should not add a restaurant again when it is already liked', async () => {
    await FavoriteButtonInitiator.init({
      favoriteButtonContainer: document.querySelector(
        '#favoriteButtonContainer'
      ),
      restaurant: {
        id: 1,
        name: 'A Restaurant',
      },
    });

    await FavoriteRestaurantIdb.putRestaurant({ id: 1, name: 'A Restaurant' });
    document.querySelector('#favoriteButton').dispatchEvent(new Event('click'));

    expect(await FavoriteRestaurantIdb.getAllRestaurants()).toEqual([
      { id: 1, name: 'A Restaurant' },
    ]);
  });

  it('should not add a restaurant when it has no id', async () => {
    await FavoriteButtonInitiator.init({
      favoriteButtonContainer: document.querySelector(
        '#favoriteButtonContainer'
      ),
      restaurant: {},
    });

    document.querySelector('#favoriteButton').dispatchEvent(new Event('click'));

    expect(await FavoriteRestaurantIdb.getAllRestaurants()).toEqual([]);
  });
});
