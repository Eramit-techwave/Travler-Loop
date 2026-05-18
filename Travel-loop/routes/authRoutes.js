// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Yahan dhyan do: '/register' ke pehle slash hai aur spelling sahi hai
router.post('/register', authController.signup); 
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);

module.exports = router;