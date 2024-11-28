import { openDB } from 'idb';

const DATABASE_NAME = 'restaurant-database';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'restaurants';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
  },
});

const FavoriteRestaurantIdb = {
  async getRestaurant(id) {
    if (!id) {
      return;
    }
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async getAllRestaurants() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async putRestaurant(restaurant) {
    if (!restaurant || !restaurant.id) {
      return;
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, restaurant);
  },
  async deleteRestaurant(id) {
    if (!id) {
      return;
    }
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default FavoriteRestaurantIdb;
