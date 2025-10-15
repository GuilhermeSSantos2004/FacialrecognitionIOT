const express = require('express');
const router = express.Router();
const { login, register, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Rotas públicas
router.post('/login', login);
router.post('/register', register);

// Rotas protegidas
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
