const ownerService = require('../services/ownerService');
const { sendResponse } = require('./authController');

const getDashboard = async (req, res, next) => {
  try {
    const data = await ownerService.getOwnerStoreMetrics(req.user.id);
    return sendResponse(res, 200, data);
  } catch (err) {
    next(err);
  }
};

const getRatings = async (req, res, next) => {
  try {
    const { sortBy, sortOrder, page, limit } = req.query;
    const result = await ownerService.getCustomerRatingsList(req.user.id, {
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

module.exports = {
  getDashboard,
  getRatings,
};
