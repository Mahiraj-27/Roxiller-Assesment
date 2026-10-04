const jwt = require('jsonwebtoken');
const environment = require('../config/environment');

const generateAccessToken = (payload) => {
  return jwt.sign(payload, environment.jwt.secret, {
    expiresIn: environment.jwt.expiresIn,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, environment.jwt.refreshSecret, {
    expiresIn: environment.jwt.refreshExpiresIn,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, environment.jwt.secret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, environment.jwt.refreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
