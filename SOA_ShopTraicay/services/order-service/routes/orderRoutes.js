const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../../auth-service/middleware/authMiddleware');

// Lấy tất cả đơn hàng (không cần xác thực)
router.get('/', orderController.getAllOrders.bind(orderController));

// Lấy thống kê đơn hàng (không cần xác thực)
router.get('/statistics', orderController.getOrderStatistics.bind(orderController));

// Lấy đơn hàng theo ID (không cần xác thực)
router.get('/:id', orderController.getOrderById.bind(orderController));

// Tạo đơn hàng mới (CẦN JWT - Bài thực hành số 4)
router.post('/', authenticateToken, orderController.createOrder.bind(orderController));

// Cập nhật đơn hàng (CẦN JWT - Bài thực hành số 4)
router.put('/:id', authenticateToken, orderController.updateOrder.bind(orderController));

// Cập nhật trạng thái đơn hàng (CẦN JWT - Bài thực hành số 4)
router.patch('/:id/status', authenticateToken, orderController.updateOrderStatus.bind(orderController));

// Xóa đơn hàng (CẦN JWT - Bài thực hành số 4)
router.delete('/:id', authenticateToken, orderController.deleteOrder.bind(orderController));

module.exports = router;

