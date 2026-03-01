const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.REPORTING_SERVICE_PORT || 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes và middleware
const reportRoutes = require('./routes/reportRoutes');
const { authenticateToken } = require('../auth-service/middleware/authMiddleware');

// Health check (không cần xác thực)
app.get('/health', (req, res) => {
  res.json({
    service: 'reporting-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Reporting Service - Bài thực hành số 5',
    version: '1.0.0',
    endpoints: {
      productReports: '/reports/products',
      orderReports: '/reports/orders',
      health: '/health'
    },
    note: 'Service chạy độc lập trên port riêng theo kiến trúc SOA'
  });
});

// Report Routes
app.use('/reports', reportRoutes);

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
  console.log(`🚀 Reporting Service đang chạy tại http://localhost:${PORT}`);
  console.log(`📊 Endpoints:`);
  console.log(`   GET    /reports/products - Lấy danh sách báo cáo sản phẩm`);
  console.log(`   GET    /reports/products/:id - Lấy chi tiết báo cáo sản phẩm`);
  console.log(`   GET    /reports/orders - Lấy danh sách báo cáo đơn hàng`);
  console.log(`   GET    /reports/orders/:id - Lấy chi tiết báo cáo đơn hàng`);
  console.log(`   POST   /reports/products - Tạo báo cáo sản phẩm (cần JWT)`);
  console.log(`   POST   /reports/orders - Tạo báo cáo đơn hàng (cần JWT)`);
  console.log(`   DELETE /reports/products/:id - Xóa báo cáo sản phẩm (cần JWT)`);
  console.log(`   DELETE /reports/orders/:id - Xóa báo cáo đơn hàng (cần JWT)`);
  console.log(`   GET    /health - Health check`);
  console.log(`\n✅ Service độc lập theo kiến trúc SOA`);
});

module.exports = app;

