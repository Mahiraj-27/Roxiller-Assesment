const ApiError = require('../utils/ApiError');
const { query } = require('../config/database');
const { getRatingsForStore, getStoreAverageRating } = require('../queries/ratingQueries');

const getOwnerStoreMetrics = async (userId) => {
  const storeResult = await query('SELECT id, name FROM stores WHERE owner_id = $1', [userId]);

  if (storeResult.rows.length === 0) {
    throw new ApiError('No store is currently associated with this owner account.', 404);
  }

  const store = storeResult.rows[0];
  const stats = await getStoreAverageRating(store.id);

  return {
    store: {
      id: store.id,
      name: store.name,
      averageRating: parseFloat(stats.average_rating || 0),
      totalRatings: stats.total_ratings || 0,
    },
  };
};

const getCustomerRatingsList = async (userId, filters) => {
  const storeResult = await query('SELECT id FROM stores WHERE owner_id = $1', [userId]);

  if (storeResult.rows.length === 0) {
    throw new ApiError('No store is currently associated with this owner account.', 404);
  }

  return getRatingsForStore(storeResult.rows[0].id, filters);
};

module.exports = {
  getOwnerStoreMetrics,
  getCustomerRatingsList,
};
