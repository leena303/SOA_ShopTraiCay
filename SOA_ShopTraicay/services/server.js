const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const productRoutes = require('./product-service/routes/productRoutes');
const inventoryRoutes = require('./inventory-service/routes/inventoryRoutes');
const orderRoutes = require('./order-service/routes/orderRoutes');
const customerRoutes = require('./customer-service/routes/customerRoutes');
const categoryRoutes = require('./category-service/routes/categoryRoutes');
const paymentRoutes = require('./payment-service/routes/paymentRoutes');
const authRoutes = require('./auth-service/routes/authRoutes');

// Import middleware
const { authenticateToken } = require('./auth-service/middleware/authMiddleware');

// API Routes - SOA Architecture
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', paymentRoutes);

// Auth Routes - Bài thực hành số 2
app.use('/', authRoutes); // /login, /auth, /logout

// Hello World endpoint - Bài thực hành số 1 (Đơn giản, không cần JWT)
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello World!',
    description: 'Đây là endpoint Hello World để test API với Postman - Bài thực hành số 1',
    framework: 'Express.js',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Hello World endpoint với JWT - Bài thực hành số 2 (Bảo vệ bằng JWT)
app.get('/api/hello-protected', authenticateToken, (req, res) => {
  res.json({
    message: 'Hello World!',
    description: 'Đây là endpoint Hello World để test API với Postman - Đã được bảo vệ bằng JWT',
    framework: 'Express.js',
    timestamp: new Date().toISOString(),
    status: 'success',
    user: {
      id: req.user.id,
      username: req.user.username
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hệ thống quản lý cửa hàng trái cây - SOA Architecture',
    version: '1.0.0',
    endpoints: {
      hello: '/api/hello',
      products: '/api/products',
      categories: '/api/categories',
      inventory: '/api/inventory',
      orders: '/api/orders',
      customers: '/api/customers',
      payments: '/api/payments'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

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
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`\n📋 API Endpoints:`);
  console.log(`   🌍 Hello World (BTH1): http://localhost:${PORT}/api/hello`);
  console.log(`   🔒 Hello World Protected (BTH2): http://localhost:${PORT}/api/hello-protected`);
  console.log(`   🏠 Root: http://localhost:${PORT}/`);
  console.log(`   ❤️  Health: http://localhost:${PORT}/health`);
  console.log(`\n🔐 Auth Endpoints (Bài thực hành số 2):`);
  console.log(`   🔑 Login: POST http://localhost:${PORT}/login`);
  console.log(`   ✅ Auth: POST http://localhost:${PORT}/auth`);
  console.log(`   🚪 Logout: POST http://localhost:${PORT}/logout`);
  console.log(`\n📦 Services:`);
  console.log(`   📦 Product Service: /api/products`);
  console.log(`   🏷️  Category Service: /api/categories`);
  console.log(`   📊 Inventory Service: /api/inventory`);
  console.log(`   🛒 Order Service: /api/orders`);
  console.log(`   👥 Customer Service: /api/customers`);
  console.log(`   💳 Payment Service: /api/payments`);
  console.log(`\n✅ Sẵn sàng test với Postman!`);
});

module.exports = app;

