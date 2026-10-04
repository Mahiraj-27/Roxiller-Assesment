const express = require('express');
const ownerController = require('../controllers/ownerController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Enforce authentication & store owner authorization
router.use(authenticate, authorizeRoles('store_owner'));

router.get('/dashboard', ownerController.getDashboard);
router.get('/ratings', ownerController.getRatings);

module.exports = router;
