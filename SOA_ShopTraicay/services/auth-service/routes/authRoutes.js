const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Đăng ký - POST /register
router.post('/register', authController.register.bind(authController));

// Đăng nhập - POST /login
router.post('/login', authController.login.bind(authController));

// Xác thực token - POST /auth
router.post('/auth', authController.authenticate.bind(authController));

// Đăng xuất - POST /logout (không bắt buộc token, vì có thể logout khi token hết hạn)
router.post('/logout', authController.logout.bind(authController));

// Quản lý users (CẦN JWT - Admin)
router.get('/users', authenticateToken, userController.getAllUsers.bind(userController));
router.get('/users/total', authenticateToken, userController.getTotalUsers.bind(userController));
router.get('/users/:id', authenticateToken, userController.getUserById.bind(userController));
router.put('/users/:id', authenticateToken, userController.updateUser.bind(userController));
router.delete('/users/:id', authenticateToken, userController.deleteUser.bind(userController));

module.exports = router;

