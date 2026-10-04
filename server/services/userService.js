const ApiError = require('../utils/ApiError');
const { query } = require('../config/database');
const { upsertRating } = require('../queries/ratingQueries');
const { listStoresWithUserRating } = require('../queries/storeQueries');

const getStoresForUser = async (userId, filters) => {
  return listStoresWithUserRating(userId, filters);
};

const submitUserRating = async (userId, storeId, rating) => {
  const storeCheck = await query('SELECT id FROM stores WHERE id = $1', [storeId]);
  if (storeCheck.rows.length === 0) {
    throw new ApiError('Store not found', 404);
  }

  return upsertRating(userId, storeId, rating);
};

module.exports = {
  getStoresForUser,
  submitUserRating,
};
