const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/jwtTokens');

/**
 * Authentication Middleware:
 * Validates Bearer access token in Authorization header and populates req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError('Authentication required. Missing or malformed token.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError('Session expired. Please log in again.', 401);
    }
    throw new ApiError('Invalid or corrupted authorization token.', 401);
  }
};

/**
 * Role-Based Access Control Middleware Factory:
 * Enforces that req.user.role is within the allowed roles.
 * Usage: authorizeRoles('admin', 'store_owner')
 */
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError('Authentication required before checking permissions.', 401);
  }

  if (!roles.includes(req.user.role)) {
    throw new ApiError('Access denied: You do not possess the required permissions.', 403);
  }

  next();
};

module.exports = {
  authenticate,
  authorizeRoles,
};
