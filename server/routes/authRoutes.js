const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const {
  signupSchema,
  loginSchema,
  changePasswordSchema,
} = require('../validators/authValidators');

const router = express.Router();

// Public routes with request validation
router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/login', validateRequest(loginSchema), authController.login);

// Protected routes requiring valid JWT access token
router.put(
  '/change-password',
  authenticate,
  validateRequest(changePasswordSchema),
  authController.changePassword
);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
