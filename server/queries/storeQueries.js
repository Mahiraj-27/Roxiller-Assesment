const { query } = require('../config/database');

const findStoreById = async (id) => {
  const result = await query(
    `SELECT s.*, 
            COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) as average_rating,
            COUNT(r.id)::INT as total_ratings
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    [id]
  );
  return result.rows[0] || null;
};

const createStore = async ({ name, email, address, ownerId = null }) => {
  const result = await query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, address, ownerId]
  );
  return result.rows[0];
};

/**
 * List stores with optional search, sorting, and pagination
 */
const listStores = async ({ search, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 10 }) => {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (search) {
    conditions.push(`(s.name ILIKE $${paramIndex} OR s.address ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const allowedSorts = ['name', 'email', 'address', 'average_rating'];
  const safeSort = allowedSorts.includes(sortBy) ? sortBy : 'name';
  const safeOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const offset = (page - 1) * limit;

  const countResult = await query(
    `SELECT COUNT(DISTINCT s.id) as total FROM stores s ${whereClause}`,
    params
  );

  const dataResult = await query(
    `SELECT s.*, 
            COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) as average_rating,
            COUNT(r.id)::INT as total_ratings
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${whereClause}
     GROUP BY s.id
     ORDER BY ${safeSort === 'average_rating' ? 'average_rating' : `s.${safeSort}`} ${safeOrder}
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  );

  const total = parseInt(countResult.rows[0]?.total || 0, 10);

  return {
    stores: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * List stores for consumers, including their current rating for each store
 */
const listStoresWithUserRating = async (userId, { search, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 10 }) => {
  const conditions = [];
  const params = [userId];
  let paramIndex = 2;

  if (search) {
    conditions.push(`(s.name ILIKE $${paramIndex} OR s.address ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const allowedSorts = ['name', 'email', 'address', 'average_rating'];
  const safeSort = allowedSorts.includes(sortBy) ? sortBy : 'name';
  const safeOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const offset = (page - 1) * limit;

  // Count total matches
  const countParams = [];
  const countConditions = [];
  let countParamIdx = 1;
  if (search) {
    countConditions.push(`(s.name ILIKE $${countParamIdx} OR s.address ILIKE $${countParamIdx})`);
    countParams.push(`%${search}%`);
    countParamIdx++;
  }
  const countWhere = countConditions.length > 0 ? `WHERE ${countConditions.join(' AND ')}` : '';
  const countResult = await query(
    `SELECT COUNT(*) as total FROM stores s ${countWhere}`,
    countParams
  );

  const dataResult = await query(
    `SELECT s.*, 
            COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) as average_rating,
            COUNT(r.id)::INT as total_ratings,
            ur.rating as user_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $1
     ${whereClause}
     GROUP BY s.id, ur.rating
     ORDER BY ${safeSort === 'average_rating' ? 'average_rating' : `s.${safeSort}`} ${safeOrder}
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  );

  const total = parseInt(countResult.rows[0]?.total || 0, 10);

  return {
    stores: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

module.exports = {
  findStoreById,
  createStore,
  listStores,
  listStoresWithUserRating,
};
