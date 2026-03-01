const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3002;
const DATA_FILE = path.join(__dirname, 'data', 'inventory.json');
const PRODUCT_SERVICE_URL = 'http://localhost:3001';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Đảm bảo thư mục data tồn tại
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Khởi tạo dữ liệu mẫu
function initializeData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = [
      {
        productId: 1,
        quantity: 100,
        reserved: 0,
        available: 100,
        lastUpdated: new Date().toISOString()
      },
      {
        productId: 2,
        quantity: 50,
        reserved: 0,
        available: 50,
        lastUpdated: new Date().toISOString()
      },
      {
        productId: 3,
        quantity: 75,
        reserved: 0,
        available: 75,
        lastUpdated: new Date().toISOString()
      }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
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

// Lấy thông tin sản phẩm từ Product Service
async function getProduct(productId) {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
    return response.data.data;
  } catch (error) {
    return null;
  }
}

// Routes

// GET /inventory - Lấy tất cả tồn kho
app.get('/inventory', async (req, res) => {
  try {
    const inventory = readData();
    const { lowStock } = req.query;
    
    let filteredInventory = inventory;
    
    // Lọc sản phẩm sắp hết hàng (available < 20)
    if (lowStock === 'true') {
      filteredInventory = inventory.filter(item => item.available < 20);
    }
    
    // Lấy thông tin sản phẩm cho mỗi item
    const inventoryWithProducts = await Promise.all(
      filteredInventory.map(async (item) => {
        const product = await getProduct(item.productId);
        return {
          ...item,
          product: product || { id: item.productId, name: 'Unknown' }
        };
      })
    );
    
    res.json({
      success: true,
      data: inventoryWithProducts,
      count: inventoryWithProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin tồn kho',
      error: error.message
    });
  }
});

// GET /inventory/:productId - Lấy tồn kho của sản phẩm cụ thể
app.get('/inventory/:productId', async (req, res) => {
  try {
    const inventory = readData();
    const productId = parseInt(req.params.productId);
    const item = inventory.find(i => i.productId === productId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tồn kho cho sản phẩm này'
      });
    }
    
    const product = await getProduct(productId);
    
    res.json({
      success: true,
      data: {
        ...item,
        product: product || { id: productId, name: 'Unknown' }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin tồn kho',
      error: error.message
    });
  }
});

// POST /inventory - Tạo hoặc cập nhật tồn kho
app.post('/inventory', (req, res) => {
  try {
    const inventory = readData();
    const { productId, quantity } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: productId và quantity là bắt buộc'
      });
    }
    
    const existingIndex = inventory.findIndex(i => i.productId === parseInt(productId));
    
    if (existingIndex !== -1) {
      // Cập nhật tồn kho
      const qty = parseInt(quantity);
      inventory[existingIndex].quantity += qty;
      inventory[existingIndex].available = inventory[existingIndex].quantity - inventory[existingIndex].reserved;
      inventory[existingIndex].lastUpdated = new Date().toISOString();
    } else {
      // Tạo mới
      const qty = parseInt(quantity);
      inventory.push({
        productId: parseInt(productId),
        quantity: qty,
        reserved: 0,
        available: qty,
        lastUpdated: new Date().toISOString()
      });
    }
    
    writeData(inventory);
    
    res.json({
      success: true,
      message: 'Cập nhật tồn kho thành công',
      data: inventory.find(i => i.productId === parseInt(productId))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật tồn kho',
      error: error.message
    });
  }
});

// POST /inventory/reserve - Đặt chỗ hàng (khi có đơn hàng)
app.post('/inventory/reserve', (req, res) => {
  try {
    const inventory = readData();
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: productId và quantity là bắt buộc'
      });
    }
    
    const item = inventory.find(i => i.productId === parseInt(productId));
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong kho'
      });
    }
    
    const qty = parseInt(quantity);
    
    if (item.available < qty) {
      return res.status(400).json({
        success: false,
        message: `Không đủ hàng. Hiện có: ${item.available}, yêu cầu: ${qty}`
      });
    }
    
    item.reserved += qty;
    item.available = item.quantity - item.reserved;
    item.lastUpdated = new Date().toISOString();
    
    writeData(inventory);
    
    res.json({
      success: true,
      message: 'Đặt chỗ hàng thành công',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt chỗ hàng',
      error: error.message
    });
  }
});

// POST /inventory/release - Giải phóng hàng đã đặt chỗ
app.post('/inventory/release', (req, res) => {
  try {
    const inventory = readData();
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: productId và quantity là bắt buộc'
      });
    }
    
    const item = inventory.find(i => i.productId === parseInt(productId));
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong kho'
      });
    }
    
    const qty = parseInt(quantity);
    
    if (item.reserved < qty) {
      return res.status(400).json({
        success: false,
        message: `Không đủ hàng đã đặt chỗ. Hiện có: ${item.reserved}, yêu cầu: ${qty}`
      });
    }
    
    item.reserved -= qty;
    item.available = item.quantity - item.reserved;
    item.lastUpdated = new Date().toISOString();
    
    writeData(inventory);
    
    res.json({
      success: true,
      message: 'Giải phóng hàng thành công',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi giải phóng hàng',
      error: error.message
    });
  }
});

// POST /inventory/fulfill - Hoàn thành đơn hàng (giảm số lượng thực tế)
app.post('/inventory/fulfill', (req, res) => {
  try {
    const inventory = readData();
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: productId và quantity là bắt buộc'
      });
    }
    
    const item = inventory.find(i => i.productId === parseInt(productId));
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong kho'
      });
    }
    
    const qty = parseInt(quantity);
    
    if (item.reserved < qty) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng đặt chỗ không đủ'
      });
    }
    
    item.quantity -= qty;
    item.reserved -= qty;
    item.available = item.quantity - item.reserved;
    item.lastUpdated = new Date().toISOString();
    
    writeData(inventory);
    
    res.json({
      success: true,
      message: 'Hoàn thành đơn hàng thành công',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hoàn thành đơn hàng',
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'inventory-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Khởi tạo dữ liệu
initializeData();

// Start server
app.listen(PORT, () => {
  console.log(`📦 Inventory Service đang chạy tại http://localhost:${PORT}`);
});

