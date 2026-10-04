const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const { query } = require('../config/database');
const { findUserByEmail, createUser } = require('../queries/userQueries');
const { createStore } = require('../queries/storeQueries');
const {
  getDashboardCounts,
  listUsers,
  getUserDetails,
  listStoresAdmin,
} = require('../queries/adminQueries');

const SALT_ROUNDS = 10;

const getOverviewMetrics = async () => {
  return getDashboardCounts();
};

const createNewUser = async ({ name, email, password, address, role }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    throw new ApiError('An account with this email address already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return createUser({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    address: address.trim(),
    role,
  });
};

const createNewStore = async ({ name, email, address, ownerId }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await query('SELECT id FROM stores WHERE email = $1', [normalizedEmail]);
  if (existing.rows.length > 0) {
    throw new ApiError('A store with this email address already exists', 409);
  }

  if (ownerId) {
    const ownerCheck = await query('SELECT id, role FROM users WHERE id = $1', [ownerId]);
    if (ownerCheck.rows.length === 0) {
      throw new ApiError('Designated store owner user not found', 404);
    }
  }

  return createStore({
    name: name.trim(),
    email: normalizedEmail,
    address: address.trim(),
    ownerId: ownerId || null,
  });
};

const getAllUsers = async (filters) => {
  return listUsers(filters);
};

const getAllStores = async (filters) => {
  return listStoresAdmin(filters);
};

const getUserProfile = async (userId) => {
  const user = await getUserDetails(userId);
  if (!user) {
    throw new ApiError('User account not found', 404);
  }
  return user;
};

module.exports = {
  getOverviewMetrics,
  createNewUser,
  createNewStore,
  getAllUsers,
  getAllStores,
  getUserProfile,
};
