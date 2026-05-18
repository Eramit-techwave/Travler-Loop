const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Authentication endpoints
router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);

module.exports = router;