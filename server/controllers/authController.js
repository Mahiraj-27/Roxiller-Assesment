const authService = require('../services/authService');

const sendResponse = (res, statusCode, data = null, message = null) => {
  const payload = { success: statusCode < 400 };
  if (message) payload.message = message;
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

const signup = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.signup(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 201, { user, accessToken }, 'User registered successfully');
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 200, { user, accessToken }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body);
    return sendResponse(res, 200, null, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken');
    return sendResponse(res, 200, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  logout,
  sendResponse,
};
