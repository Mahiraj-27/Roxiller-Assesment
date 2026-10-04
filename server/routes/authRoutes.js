const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route handlers will be wrapped with validation & auth middleware in next commit
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/change-password', authController.changePassword);
router.post('/logout', authController.logout);

module.exports = router;
