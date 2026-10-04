const userService = require('../services/userService');
const { sendResponse } = require('./authController');

const getStores = async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder, page, limit } = req.query;
    const result = await userService.getStoresForUser(req.user.id, {
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

const submitRating = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const { rating } = req.body;
    const saved = await userService.submitUserRating(req.user.id, storeId, rating);
    return sendResponse(res, 200, saved, 'Rating submitted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStores,
  submitRating,
};
