const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Đảm bảo thư mục data tồn tại
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Khởi tạo dữ liệu mẫu nếu chưa có
function initializeData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = [
      {
        id: 1,
        name: "Táo đỏ",
        category: "Táo",
        price: 45000,
        unit: "kg",
        description: "Táo đỏ tươi ngon, giòn ngọt",
        origin: "Lào Cai",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Chuối tiêu",
        category: "Chuối",
        price: 25000,
        unit: "nải",
        description: "Chuối tiêu chín vàng, thơm ngon",
        origin: "Đồng Nai",
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: "Cam sành",
        category: "Cam",
        price: 35000,
        unit: "kg",
        description: "Cam sành mọng nước, ngọt thanh",
        origin: "Vĩnh Long",
        createdAt: new Date().toISOString()
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

// Routes

// GET /products - Lấy tất cả sản phẩm
app.get('/products', (req, res) => {
  try {
    const products = readData();
    const { category, search } = req.query;
    
    let filteredProducts = products;
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    res.json({
      success: true,
      data: filteredProducts,
      count: filteredProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm',
      error: error.message
    });
  }
});

// GET /products/:id - Lấy chi tiết sản phẩm
app.get('/products/:id', (req, res) => {
  try {
    const products = readData();
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin sản phẩm',
      error: error.message
    });
  }
});

// POST /products - Tạo sản phẩm mới
app.post('/products', (req, res) => {
  try {
    const products = readData();
    const { name, category, price, unit, description, origin } = req.body;
    
    // Validation
    if (!name || !category || !price || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: name, category, price, unit'
      });
    }
    
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name,
      category,
      price: parseFloat(price),
      unit,
      description: description || '',
      origin: origin || '',
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    writeData(products);
    
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo sản phẩm',
      error: error.message
    });
  }
});

// PUT /products/:id - Cập nhật sản phẩm
app.put('/products/:id', (req, res) => {
  try {
    const products = readData();
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      id: productId, // Đảm bảo không thay đổi ID
      createdAt: products[productIndex].createdAt // Giữ nguyên ngày tạo
    };
    
    products[productIndex] = updatedProduct;
    writeData(products);
    
    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật sản phẩm',
      error: error.message
    });
  }
});

// DELETE /products/:id - Xóa sản phẩm
app.delete('/products/:id', (req, res) => {
  try {
    const products = readData();
    const productId = parseInt(req.params.id);
    const filteredProducts = products.filter(p => p.id !== productId);
    
    if (products.length === filteredProducts.length) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    writeData(filteredProducts);
    
    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sản phẩm',
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'product-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Khởi tạo dữ liệu khi start
initializeData();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Product Service đang chạy tại http://localhost:${PORT}`);
});

