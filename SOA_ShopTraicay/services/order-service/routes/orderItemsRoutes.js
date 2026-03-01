const express = require('express');
const router = express.Router();
const orderItemsController = require('../controllers/orderItemsController');
const { authenticateToken } = require('../../auth-service/middleware/authMiddleware');

// Lấy tất cả order items (không cần xác thực)
router.get('/', orderItemsController.getAllOrderItems.bind(orderItemsController));

// Lấy order items theo order_id (không cần xác thực)
router.get('/order/:orderId', orderItemsController.getOrderItemsByOrderId.bind(orderItemsController));

// Lấy order item theo ID (không cần xác thực)
router.get('/:id', orderItemsController.getOrderItemById.bind(orderItemsController));

// Tạo order item mới (CẦN JWT - Bài thực hành số 4)
router.post('/', authenticateToken, orderItemsController.createOrderItem.bind(orderItemsController));

// Cập nhật order item (CẦN JWT - Bài thực hành số 4)
router.put('/:id', authenticateToken, orderItemsController.updateOrderItem.bind(orderItemsController));

// Xóa order item (CẦN JWT - Bài thực hành số 4)
router.delete('/:id', authenticateToken, orderItemsController.deleteOrderItem.bind(orderItemsController));

module.exports = router;

