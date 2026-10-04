const environment = require('../config/environment');

/**
 * Global Express error handling middleware
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'An unexpected server error occurred.';

  if (environment.nodeEnv === 'development' || !err.isOperational) {
    console.error('SERVER ERROR:', err);
  }

  const response = {
    success: false,
    message,
  };

  if (err.errors && err.errors.length > 0) {
    response.errors = err.errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = { errorHandler };
