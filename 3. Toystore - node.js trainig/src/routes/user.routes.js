const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth');

// Публичные маршруты
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refreshToken);

// Защищенные маршруты
router.post('/logout', authenticate, userController.logout);
router.get('/profile', authenticate, userController.getProfile);


module.exports = router;