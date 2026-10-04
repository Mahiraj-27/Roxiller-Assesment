const { query } = require('../config/database');

/**
 * Submit or update a rating for a store (PostgreSQL upsert via ON CONFLICT)
 */
const upsertRating = async (userId, storeId, rating) => {
  const result = await query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET rating = $3, updated_at = NOW()
     RETURNING *`,
    [userId, storeId, rating]
  );
  return result.rows[0];
};

/**
 * Get a specific user's rating for a specific store
 */
const getUserRatingForStore = async (userId, storeId) => {
  const result = await query(
    'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
    [userId, storeId]
  );
  return result.rows[0] || null;
};

/**
 * Get all customer ratings for a store with customer info (store owner view)
 */
const getRatingsForStore = async (storeId, { sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 }) => {
  const allowedSorts = ['created_at', 'rating', 'name'];
  const safeSort = allowedSorts.includes(sortBy) ? sortBy : 'created_at';
  const safeOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * limit;

  const countResult = await query(
    'SELECT COUNT(*) as total FROM ratings WHERE store_id = $1',
    [storeId]
  );

  const dataResult = await query(
    `SELECT r.*, u.name as user_name, u.email as user_email
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY ${safeSort === 'name' ? 'u.name' : `r.${safeSort}`} ${safeOrder}
     LIMIT $2 OFFSET $3`,
    [storeId, limit, offset]
  );

  const total = parseInt(countResult.rows[0]?.total || 0, 10);

  return {
    ratings: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Get overall rating average and count for a store
 */
const getStoreAverageRating = async (storeId) => {
  const result = await query(
    `SELECT COALESCE(AVG(rating), 0)::NUMERIC(3,2) as average_rating,
            COUNT(*)::INT as total_ratings
     FROM ratings WHERE store_id = $1`,
    [storeId]
  );
  return result.rows[0];
};

module.exports = {
  upsertRating,
  getUserRatingForStore,
  getRatingsForStore,
  getStoreAverageRating,
};
