const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Lấy tất cả kho hàng
router.get('/', inventoryController.getAllInventory.bind(inventoryController));

// Lấy sản phẩm sắp hết hàng
router.get('/low-stock', inventoryController.getLowStock.bind(inventoryController));

// Lấy lịch sử giao dịch
router.get('/transactions', inventoryController.getTransactions.bind(inventoryController));

// Kiểm tra tồn kho
router.get('/check', inventoryController.checkStockAvailability.bind(inventoryController));

// Lấy kho hàng theo product_id
router.get('/product/:productId', inventoryController.getInventoryByProductId.bind(inventoryController));

// Tạo hoặc cập nhật kho hàng
router.post('/', inventoryController.upsertInventory.bind(inventoryController));

// Nhập kho
router.post('/stock-in', inventoryController.stockIn.bind(inventoryController));

// Xuất kho
router.post('/stock-out', inventoryController.stockOut.bind(inventoryController));

module.exports = router;

