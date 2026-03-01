const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3004;
const DATA_FILE = path.join(__dirname, 'data', 'customers.json');

// Middleware
app.use(cors());
app.use(body-parser.json());

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
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0901234567",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Trần Thị B",
        email: "tranthib@example.com",
        phone: "0907654321",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
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

// GET /customers - Lấy tất cả khách hàng
app.get('/customers', (req, res) => {
  try {
    const customers = readData();
    const { search } = req.query;
    
    let filteredCustomers = customers;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.phone.includes(search)
      );
    }
    
    res.json({
      success: true,
      data: filteredCustomers,
      count: filteredCustomers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách khách hàng',
      error: error.message
    });
  }
});

// GET /customers/:id - Lấy chi tiết khách hàng
app.get('/customers/:id', (req, res) => {
  try {
    const customers = readData();
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin khách hàng',
      error: error.message
    });
  }
});

// POST /customers - Tạo khách hàng mới
app.post('/customers', (req, res) => {
  try {
    const customers = readData();
    const { name, email, phone, address } = req.body;
    
    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: name, email, phone'
      });
    }
    
    // Kiểm tra email đã tồn tại
    const existingCustomer = customers.find(c => c.email === email);
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }
    
    const newCustomer = {
      id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
      name,
      email,
      phone,
      address: address || '',
      createdAt: new Date().toISOString()
    };
    
    customers.push(newCustomer);
    writeData(customers);
    
    res.status(201).json({
      success: true,
      message: 'Tạo khách hàng thành công',
      data: newCustomer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo khách hàng',
      error: error.message
    });
  }
});

// PUT /customers/:id - Cập nhật thông tin khách hàng
app.put('/customers/:id', (req, res) => {
  try {
    const customers = readData();
    const customerId = parseInt(req.params.id);
    const customerIndex = customers.findIndex(c => c.id === customerId);
    
    if (customerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }
    
    const { email } = req.body;
    
    // Kiểm tra email trùng (nếu có thay đổi)
    if (email && email !== customers[customerIndex].email) {
      const existingCustomer = customers.find(c => c.email === email && c.id !== customerId);
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng bởi khách hàng khác'
        });
      }
    }
    
    const updatedCustomer = {
      ...customers[customerIndex],
      ...req.body,
      id: customerId, // Đảm bảo không thay đổi ID
      createdAt: customers[customerIndex].createdAt // Giữ nguyên ngày tạo
    };
    
    customers[customerIndex] = updatedCustomer;
    writeData(customers);
    
    res.json({
      success: true,
      message: 'Cập nhật thông tin khách hàng thành công',
      data: updatedCustomer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin khách hàng',
      error: error.message
    });
  }
});

// DELETE /customers/:id - Xóa khách hàng
app.delete('/customers/:id', (req, res) => {
  try {
    const customers = readData();
    const customerId = parseInt(req.params.id);
    const filteredCustomers = customers.filter(c => c.id !== customerId);
    
    if (customers.length === filteredCustomers.length) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }
    
    writeData(filteredCustomers);
    
    res.json({
      success: true,
      message: 'Xóa khách hàng thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa khách hàng',
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'customer-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Khởi tạo dữ liệu
initializeData();

// Start server
app.listen(PORT, () => {
  console.log(`👥 Customer Service đang chạy tại http://localhost:${PORT}`);
});

