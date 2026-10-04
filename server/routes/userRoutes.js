const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const { submitRatingSchema } = require('../validators/authValidators');

const router = express.Router();

// Enforce authentication & normal user authorization
router.use(authenticate, authorizeRoles('user'));

router.get('/stores', userController.getStores);
router.put('/stores/:storeId/rating', validateRequest(submitRatingSchema), userController.submitRating);

module.exports = router;
