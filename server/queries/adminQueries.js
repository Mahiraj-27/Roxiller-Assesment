const { query } = require('../config/database');

/**
 * Real-time aggregate count metrics for the administrative dashboard
 */
const getDashboardCounts = async () => {
  const result = await query(`
    SELECT 
      (SELECT COUNT(*) FROM users)::INT as total_users,
      (SELECT COUNT(*) FROM stores)::INT as total_stores,
      (SELECT COUNT(*) FROM ratings)::INT as total_ratings
  `);
  return result.rows[0];
};

/**
 * List all users with search, role filtering, sorting, and pagination
 */
const listUsers = async ({ search, role, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 10 }) => {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (search) {
    conditions.push(`(u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.address ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (role && role !== 'all') {
    conditions.push(`u.role = $${paramIndex}`);
    params.push(role);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const allowedSorts = ['name', 'email', 'address', 'role', 'created_at'];
  const safeSort = allowedSorts.includes(sortBy) ? sortBy : 'name';
  const safeOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const offset = (page - 1) * limit;

  const countResult = await query(
    `SELECT COUNT(*) as total FROM users u ${whereClause}`,
    params
  );

  const dataResult = await query(
    `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at
     FROM users u
     ${whereClause}
     ORDER BY u.${safeSort} ${safeOrder}
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  );

  const total = parseInt(countResult.rows[0]?.total || 0, 10);

  return {
    users: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Fetch detailed profile of a user, including store info & store rating if role is store_owner
 */
const getUserDetails = async (userId) => {
  const result = await query(
    `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
            s.id as store_id, s.name as store_name,
            COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) as store_rating
     FROM users u
     LEFT JOIN stores s ON s.owner_id = u.id
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE u.id = $1
     GROUP BY u.id, s.id`,
    [userId]
  );
  return result.rows[0] || null;
};

/**
 * List stores for admin management
 */
const listStoresAdmin = async ({ search, sortBy = 'name', sortOrder = 'asc', page = 1, limit = 10 }) => {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (search) {
    conditions.push(`(s.name ILIKE $${paramIndex} OR s.email ILIKE $${paramIndex} OR s.address ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const allowedSorts = ['name', 'email', 'address', 'average_rating'];
  const safeSort = allowedSorts.includes(sortBy) ? sortBy : 'name';
  const safeOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const offset = (page - 1) * limit;

  const countResult = await query(
    `SELECT COUNT(*) as total FROM stores s ${whereClause}`,
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

module.exports = {
  getDashboardCounts,
  listUsers,
  getUserDetails,
  listStoresAdmin,
};
