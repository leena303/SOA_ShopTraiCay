const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../../auth-service/middleware/authMiddleware');

// ============================================
// ORDER REPORTS ROUTES
// ============================================

// Lấy danh sách báo cáo đơn hàng (không cần xác thực)
router.get('/orders', reportController.getAllOrderReports.bind(reportController));

// Lấy chi tiết báo cáo đơn hàng (không cần xác thực)
router.get('/orders/:id', reportController.getOrderReportById.bind(reportController));

// Tạo báo cáo đơn hàng mới (CẦN JWT - Bài thực hành số 5)
router.post('/orders', authenticateToken, reportController.createOrderReport.bind(reportController));

// Xóa báo cáo đơn hàng (CẦN JWT - Bài thực hành số 5)
router.delete('/orders/:id', authenticateToken, reportController.deleteOrderReport.bind(reportController));

// ============================================
// PRODUCT REPORTS ROUTES
// ============================================

// Lấy danh sách báo cáo sản phẩm (không cần xác thực)
router.get('/products', reportController.getAllProductReports.bind(reportController));

// Lấy chi tiết báo cáo sản phẩm (không cần xác thực)
router.get('/products/:id', reportController.getProductReportById.bind(reportController));

// Lấy báo cáo tổng hợp theo product_id (không cần xác thực)
router.get('/products/:id/summary', reportController.getProductReportSummary.bind(reportController));

// Tạo báo cáo sản phẩm mới (CẦN JWT - Bài thực hành số 5)
router.post('/products', authenticateToken, reportController.createProductReport.bind(reportController));

// Xóa báo cáo sản phẩm (CẦN JWT - Bài thực hành số 5)
router.delete('/products/:id', authenticateToken, reportController.deleteProductReport.bind(reportController));

module.exports = router;

