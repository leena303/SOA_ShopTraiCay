const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Lấy tất cả thanh toán
router.get('/', paymentController.getAllPayments.bind(paymentController));

// Thống kê thanh toán
router.get('/statistics', paymentController.getPaymentStatistics.bind(paymentController));

// Lấy thanh toán theo order_id
router.get('/order/:orderId', paymentController.getPaymentsByOrderId.bind(paymentController));

// Lấy lịch sử thanh toán
router.get('/:id/history', paymentController.getPaymentHistory.bind(paymentController));

// Lấy thanh toán theo ID
router.get('/:id', paymentController.getPaymentById.bind(paymentController));

// Tạo thanh toán mới
router.post('/', paymentController.createPayment.bind(paymentController));

// Cập nhật thanh toán
router.put('/:id', paymentController.updatePayment.bind(paymentController));

// Xác nhận thanh toán
router.patch('/:id/confirm', paymentController.confirmPayment.bind(paymentController));

// Hủy thanh toán
router.patch('/:id/cancel', paymentController.cancelPayment.bind(paymentController));

// Xóa thanh toán
router.delete('/:id', paymentController.deletePayment.bind(paymentController));

module.exports = router;

