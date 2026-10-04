const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const {
  createUserSchema,
  createStoreSchema,
} = require('../validators/authValidators');

const router = express.Router();

// Enforce authentication & admin authorization on all admin routes
router.use(authenticate, authorizeRoles('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.post('/users', validateRequest(createUserSchema), adminController.createUser);
router.get('/users/:id', adminController.getUserById);

router.get('/stores', adminController.getStores);
router.post('/stores', validateRequest(createStoreSchema), adminController.createStore);

module.exports = router;
