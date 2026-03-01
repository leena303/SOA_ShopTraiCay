const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.ORDER_SERVICE_PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes và middleware
const orderRoutes = require('./routes/orderRoutes');
const orderItemsRoutes = require('./routes/orderItemsRoutes');
const { authenticateToken } = require('../auth-service/middleware/authMiddleware');

// Health check (không cần xác thực)
app.get('/health', (req, res) => {
  res.json({
    service: 'order-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Order Management Service - Bài thực hành số 4',
    version: '1.0.0',
    endpoints: {
      orders: '/orders',
      orderItems: '/order_items',
      health: '/health'
    },
    note: 'Service chạy độc lập trên port riêng theo kiến trúc SOA'
  });
});

// Order Routes
app.use('/orders', orderRoutes);

// Order Items Routes
app.use('/order_items', orderItemsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Lỗi server nội bộ'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy endpoint'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Order Service đang chạy tại http://localhost:${PORT}`);
  console.log(`📦 Endpoints:`);
  console.log(`   GET  /orders - Lấy danh sách đơn hàng`);
  console.log(`   GET  /orders/:id - Lấy chi tiết đơn hàng`);
  console.log(`   POST /orders - Tạo đơn hàng mới (cần JWT)`);
  console.log(`   PUT  /orders/:id - Cập nhật đơn hàng (cần JWT)`);
  console.log(`   DELETE /orders/:id - Xóa đơn hàng (cần JWT)`);
  console.log(`   GET  /order_items - Lấy danh sách order items`);
  console.log(`   GET  /order_items/:id - Lấy chi tiết order item`);
  console.log(`   POST /order_items - Tạo order item mới (cần JWT)`);
  console.log(`   PUT  /order_items/:id - Cập nhật order item (cần JWT)`);
  console.log(`   DELETE /order_items/:id - Xóa order item (cần JWT)`);
  console.log(`   GET  /health - Health check`);
  console.log(`\n✅ Service độc lập theo kiến trúc SOA`);
});

module.exports = app;

