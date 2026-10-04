const adminService = require('../services/adminService');
const { sendResponse } = require('./authController');

const getDashboard = async (req, res, next) => {
  try {
    const metrics = await adminService.getOverviewMetrics();
    return sendResponse(res, 200, metrics);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { search, role, sortBy, sortOrder, page, limit } = req.query;
    const result = await adminService.getAllUsers({
      search,
      role,
      sortBy,
      sortOrder,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    });
    return sendResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await adminService.createNewUser(req.body);
    return sendResponse(res, 201, user, 'User registered successfully');
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserProfile(req.params.id);
    return sendResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
};

const getStores = async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder, page, limit } = req.query;
    const result = await adminService.getAllStores({
      search,
      sortBy,
      sortOrder,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    });
    return sendResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
};

const createStore = async (req, res, next) => {
  try {
    const store = await adminService.createNewStore(req.body);
    return sendResponse(res, 201, store, 'Store registered successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  getUsers,
  createUser,
  getUserById,
  getStores,
  createStore,
};
