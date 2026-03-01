const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Lấy tất cả khách hàng
router.get('/', customerController.getAllCustomers.bind(customerController));

// Lấy khách hàng theo ID
router.get('/:id', customerController.getCustomerById.bind(customerController));

// Lấy lịch sử đơn hàng
router.get('/:id/orders', customerController.getOrderHistory.bind(customerController));

// Lấy thống kê khách hàng
router.get('/:id/statistics', customerController.getCustomerStatistics.bind(customerController));

// Tạo khách hàng mới
router.post('/', customerController.createCustomer.bind(customerController));

// Cập nhật khách hàng
router.put('/:id', customerController.updateCustomer.bind(customerController));

// Xóa khách hàng
router.delete('/:id', customerController.deleteCustomer.bind(customerController));

module.exports = router;

