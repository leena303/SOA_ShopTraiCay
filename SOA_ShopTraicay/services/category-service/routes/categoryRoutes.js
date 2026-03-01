const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../../auth-service/middleware/authMiddleware');

// Lấy tất cả danh mục (không cần JWT)
router.get('/', categoryController.getAllCategories.bind(categoryController));

// Lấy thống kê số lượng sản phẩm theo danh mục (không cần JWT)
router.get('/stats', categoryController.getCategoryProductCounts.bind(categoryController));

// Lấy danh mục theo ID (không cần JWT)
router.get('/:id', categoryController.getCategoryById.bind(categoryController));

// Tạo danh mục mới (CẦN JWT)
router.post('/', authenticateToken, categoryController.createCategory.bind(categoryController));

// Cập nhật danh mục (CẦN JWT)
router.put('/:id', authenticateToken, categoryController.updateCategory.bind(categoryController));

// Xóa danh mục (CẦN JWT)
router.delete('/:id', authenticateToken, categoryController.deleteCategory.bind(categoryController));

module.exports = router;

