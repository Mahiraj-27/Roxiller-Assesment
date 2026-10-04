const { query } = require('../config/database');

const findUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

const findUserById = async (id) => {
  const result = await query(
    'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const createUser = async ({ name, email, password, address, role = 'user' }) => {
  const result = await query(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role, created_at`,
    [name, email, password, address, role]
  );
  return result.rows[0];
};

const updateUserPassword = async (userId, hashedPassword) => {
  await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
};

const getUserPasswordById = async (userId) => {
  const result = await query('SELECT password FROM users WHERE id = $1', [userId]);
  return result.rows[0]?.password || null;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserPassword,
  getUserPasswordById,
};
