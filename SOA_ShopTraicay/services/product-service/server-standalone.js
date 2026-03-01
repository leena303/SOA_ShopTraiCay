const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PRODUCT_SERVICE_PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files từ thư mục uploads (ảnh sản phẩm)
// Có thể truy cập qua: http://localhost:3001/uploads/tên-file.jpg
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Serve static files từ thư mục images ở root (nếu có)
// Có thể truy cập qua: http://localhost:3001/images/tên-file.jpg
const imagesPath = path.join(__dirname, '..', '..', 'images');
app.use('/images', express.static(imagesPath));

// Import routes và middleware
const productRoutes = require('./routes/productRoutes');
const { authenticateToken } = require('../auth-service/middleware/authMiddleware');

// Health check (không cần xác thực)
app.get('/health', (req, res) => {
  res.json({
    service: 'product-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Product Management Service - Bài thực hành số 3',
    version: '1.0.0',
    endpoints: {
      products: '/products',
      health: '/health'
    },
    note: 'Service chạy độc lập trên port riêng theo kiến trúc SOA'
  });
});

// Product Routes
// GET endpoints không cần xác thực (có thể thay đổi tùy yêu cầu)
app.use('/products', productRoutes);

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
  console.log(`🚀 Product Service đang chạy tại http://localhost:${PORT}`);
  console.log(`📦 Endpoints:`);
  console.log(`   GET  /products - Lấy danh sách sản phẩm`);
  console.log(`   GET  /products/:id - Lấy chi tiết sản phẩm`);
  console.log(`   POST /products - Tạo sản phẩm mới (cần JWT)`);
  console.log(`   PUT  /products/:id - Cập nhật sản phẩm (cần JWT)`);
  console.log(`   DELETE /products/:id - Xóa sản phẩm (cần JWT)`);
  console.log(`   GET  /health - Health check`);
  console.log(`\n🖼️  Static Files (Ảnh sản phẩm):`);
  console.log(`   GET  /uploads/* - Ảnh từ thư mục uploads/`);
  console.log(`   GET  /images/* - Ảnh từ thư mục images/ (root)`);
  console.log(`\n✅ Service độc lập theo kiến trúc SOA`);
});

module.exports = app;

