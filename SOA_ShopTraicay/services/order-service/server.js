const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3003;
const DATA_FILE = path.join(__dirname, 'data', 'orders.json');
const INVENTORY_SERVICE_URL = 'http://localhost:3002';
const PRODUCT_SERVICE_URL = 'http://localhost:3001';
const CUSTOMER_SERVICE_URL = 'http://localhost:3004';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Đảm bảo thư mục data tồn tại
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Đọc dữ liệu
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Ghi dữ liệu
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Lấy thông tin sản phẩm
async function getProduct(productId) {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
    return response.data.data;
  } catch (error) {
    return null;
  }
}

// Lấy thông tin khách hàng
async function getCustomer(customerId) {
  try {
    const response = await axios.get(`${CUSTOMER_SERVICE_URL}/customers/${customerId}`);
    return response.data.data;
  } catch (error) {
    return null;
  }
}

// Routes

// GET /orders - Lấy tất cả đơn hàng
app.get('/orders', async (req, res) => {
  try {
    const orders = readData();
    const { status, customerId } = req.query;
    
    let filteredOrders = orders;
    
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }
    
    if (customerId) {
      filteredOrders = filteredOrders.filter(o => o.customerId === parseInt(customerId));
    }
    
    // Lấy thông tin chi tiết cho mỗi đơn hàng
    const ordersWithDetails = await Promise.all(
      filteredOrders.map(async (order) => {
        const customer = await getCustomer(order.customerId);
        const itemsWithProducts = await Promise.all(
          order.items.map(async (item) => {
            const product = await getProduct(item.productId);
            return {
              ...item,
              product: product || { id: item.productId, name: 'Unknown' }
            };
          })
        );
        
        return {
          ...order,
          customer: customer || { id: order.customerId, name: 'Unknown' },
          items: itemsWithProducts
        };
      })
    );
    
    res.json({
      success: true,
      data: ordersWithDetails,
      count: ordersWithDetails.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đơn hàng',
      error: error.message
    });
  }
});

// GET /orders/:id - Lấy chi tiết đơn hàng
app.get('/orders/:id', async (req, res) => {
  try {
    const orders = readData();
    const order = orders.find(o => o.id === parseInt(req.params.id));
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    const customer = await getCustomer(order.customerId);
    const itemsWithProducts = await Promise.all(
      order.items.map(async (item) => {
        const product = await getProduct(item.productId);
        return {
          ...item,
          product: product || { id: item.productId, name: 'Unknown' }
        };
      })
    );
    
    res.json({
      success: true,
      data: {
        ...order,
        customer: customer || { id: order.customerId, name: 'Unknown' },
        items: itemsWithProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin đơn hàng',
      error: error.message
    });
  }
});

// POST /orders - Tạo đơn hàng mới
app.post('/orders', async (req, res) => {
  try {
    const orders = readData();
    const { customerId, items } = req.body;
    
    // Validation
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: customerId và items (mảng) là bắt buộc'
      });
    }
    
    // Kiểm tra tồn kho và tính tổng tiền
    let totalAmount = 0;
    const validatedItems = [];
    
    for (const item of items) {
      const { productId, quantity } = item;
      
      if (!productId || !quantity) {
        return res.status(400).json({
          success: false,
          message: 'Mỗi item cần có productId và quantity'
        });
      }
      
      // Lấy thông tin sản phẩm
      const product = await getProduct(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy sản phẩm với ID: ${productId}`
        });
      }
      
      // Kiểm tra tồn kho
      try {
        const inventoryResponse = await axios.get(`${INVENTORY_SERVICE_URL}/inventory/${productId}`);
        const inventory = inventoryResponse.data.data;
        
        if (inventory.available < quantity) {
          return res.status(400).json({
            success: false,
            message: `Sản phẩm "${product.name}" không đủ hàng. Hiện có: ${inventory.available}, yêu cầu: ${quantity}`
          });
        }
        
        // Đặt chỗ hàng
        await axios.post(`${INVENTORY_SERVICE_URL}/inventory/reserve`, {
          productId,
          quantity
        });
        
        validatedItems.push({
          productId,
          quantity,
          price: product.price,
          subtotal: product.price * quantity
        });
        
        totalAmount += product.price * quantity;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: `Lỗi khi kiểm tra tồn kho cho sản phẩm ${productId}: ${error.message}`
        });
      }
    }
    
    // Tạo đơn hàng
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      customerId: parseInt(customerId),
      items: validatedItems,
      totalAmount,
      status: 'pending', // pending, confirmed, processing, shipped, delivered, cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    writeData(orders);
    
    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng',
      error: error.message
    });
  }
});

// PUT /orders/:id/status - Cập nhật trạng thái đơn hàng
app.put('/orders/:id/status', async (req, res) => {
  try {
    const orders = readData();
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status không hợp lệ. Các giá trị hợp lệ: ${validStatuses.join(', ')}`
      });
    }
    
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    const oldStatus = order.status;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    // Nếu đơn hàng bị hủy, giải phóng hàng đã đặt chỗ
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      for (const item of order.items) {
        try {
          await axios.post(`${INVENTORY_SERVICE_URL}/inventory/release`, {
            productId: item.productId,
            quantity: item.quantity
          });
        } catch (error) {
          console.error(`Lỗi khi giải phóng hàng cho sản phẩm ${item.productId}:`, error.message);
        }
      }
    }
    
    // Nếu đơn hàng được giao, giảm số lượng thực tế trong kho
    if (status === 'delivered' && oldStatus !== 'delivered') {
      for (const item of order.items) {
        try {
          await axios.post(`${INVENTORY_SERVICE_URL}/inventory/fulfill`, {
            productId: item.productId,
            quantity: item.quantity
          });
        } catch (error) {
          console.error(`Lỗi khi hoàn thành đơn hàng cho sản phẩm ${item.productId}:`, error.message);
        }
      }
    }
    
    writeData(orders);
    
    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái đơn hàng',
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'order-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🛒 Order Service đang chạy tại http://localhost:${PORT}`);
});

