const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtTokens');
const {
  findUserByEmail,
  createUser,
  getUserPasswordById,
  updateUserPassword,
} = require('../queries/userQueries');

const SALT_ROUNDS = 10;

/**
 * Register a new normal user account
 */
const signup = async ({ name, email, password, address }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    throw new ApiError('An account with this email address already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    address: address.trim(),
    role: 'user',
  });

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { user, accessToken, refreshToken };
};

/**
 * Authenticate user credentials for all roles (admin, user, store_owner)
 */
const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError('Invalid email or password', 401);
  }

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Return user without password hash
  const { password: _pwd, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

/**
 * Update authenticated user's password
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const storedHash = await getUserPasswordById(userId);
  if (!storedHash) {
    throw new ApiError('User account not found', 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, storedHash);
  if (!isMatch) {
    throw new ApiError('Current password is incorrect', 401);
  }

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await updateUserPassword(userId, newHash);
};

module.exports = {
  signup,
  login,
  changePassword,
};
