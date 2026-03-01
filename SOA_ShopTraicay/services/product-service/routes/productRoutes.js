const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../../auth-service/middleware/authMiddleware');

// Lấy tất cả sản phẩm (không cần xác thực)
router.get('/', productController.getAllProducts.bind(productController));

// Lấy tất cả danh mục (không cần xác thực)
router.get('/categories', productController.getCategories.bind(productController));

// Lấy sản phẩm theo danh mục (không cần xác thực)
router.get('/category/:category', productController.getProductsByCategory.bind(productController));

// Lấy sản phẩm theo ID (không cần xác thực)
router.get('/:id', productController.getProductById.bind(productController));

// Tạo sản phẩm mới (CẦN JWT - Bài thực hành số 3)
router.post('/', authenticateToken, productController.createProduct.bind(productController));

// Cập nhật sản phẩm (CẦN JWT - Bài thực hành số 3)
router.put('/:id', authenticateToken, productController.updateProduct.bind(productController));

// Xóa sản phẩm (CẦN JWT - Bài thực hành số 3)
router.delete('/:id', authenticateToken, productController.deleteProduct.bind(productController));

module.exports = router;

