# Hệ thống Quản lý Cửa hàng Trái cây - SOA Architecture

Dự án Node.js sử dụng MySQL và kiến trúc SOA (Service-Oriented Architecture) để quản lý cửa hàng trái cây.

## 🏗️ Kiến trúc SOA

Dự án được chia thành các service độc lập:

- **Product Service**: Quản lý sản phẩm trái cây
- **Inventory Service**: Quản lý kho hàng và tồn kho
- **Order Service**: Quản lý đơn hàng
- **Customer Service**: Quản lý khách hàng

## 📋 Yêu cầu

- Node.js >= 14.x
- MySQL >= 5.7 hoặc MariaDB >= 10.3
- npm hoặc yarn

## 🚀 Cài đặt

### 1. Clone repository và cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình Database

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin database của bạn:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fruit_store_db

PORT=3000
NODE_ENV=development
```

### 3. Tạo Database và Schema

Chạy file SQL để tạo database và các bảng:

```bash
mysql -u root -p < database/schema.sql
```

Hoặc import trực tiếp trong MySQL:

```sql
source database/schema.sql;
```

### 4. Chạy ứng dụng

```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📚 API Documentation

### Product Service (`/api/products`)

#### Lấy tất cả sản phẩm
```
GET /api/products
GET /api/products?category=Táo
GET /api/products?search=cam
GET /api/products?is_active=true
```

#### Lấy sản phẩm theo ID
```
GET /api/products/:id
```

#### Tạo sản phẩm mới
```
POST /api/products
Body:
{
  "name": "Táo đỏ",
  "description": "Táo đỏ tươi ngon",
  "category": "Táo",
  "unit_price": 50000,
  "unit": "kg",
  "image_url": "https://example.com/apple.jpg"
}
```

#### Cập nhật sản phẩm
```
PUT /api/products/:id
Body: { ... }
```

#### Xóa sản phẩm
```
DELETE /api/products/:id
```

#### Lấy danh mục
```
GET /api/products/categories
```

### Inventory Service (`/api/inventory`)

#### Lấy tất cả kho hàng
```
GET /api/inventory
```

#### Lấy kho hàng theo product_id
```
GET /api/inventory/product/:productId
```

#### Tạo/cập nhật kho hàng
```
POST /api/inventory
Body:
{
  "product_id": 1,
  "quantity": 100,
  "min_stock_level": 10,
  "max_stock_level": 500,
  "location": "Kho A"
}
```

#### Nhập kho
```
POST /api/inventory/stock-in
Body:
{
  "product_id": 1,
  "quantity": 50,
  "notes": "Nhập hàng mới"
}
```

#### Xuất kho
```
POST /api/inventory/stock-out
Body:
{
  "product_id": 1,
  "quantity": 10,
  "reference_type": "order",
  "reference_id": 1,
  "notes": "Xuất cho đơn hàng"
}
```

#### Lấy sản phẩm sắp hết hàng
```
GET /api/inventory/low-stock
```

#### Lấy lịch sử giao dịch
```
GET /api/inventory/transactions
GET /api/inventory/transactions?product_id=1
GET /api/inventory/transactions?transaction_type=in
```

### Order Service (`/api/orders`)

#### Lấy tất cả đơn hàng
```
GET /api/orders
GET /api/orders?status=completed
GET /api/orders?customer_id=1
GET /api/orders?date_from=2024-01-01&date_to=2024-01-31
```

#### Lấy đơn hàng theo ID
```
GET /api/orders/:id
```

#### Tạo đơn hàng mới
```
POST /api/orders
Body:
{
  "customer_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1.5
    }
  ],
  "payment_method": "cash",
  "notes": "Giao hàng buổi sáng"
}
```

#### Cập nhật đơn hàng
```
PUT /api/orders/:id
Body: { ... }
```

#### Cập nhật trạng thái đơn hàng
```
PATCH /api/orders/:id/status
Body:
{
  "status": "completed"
}
```

#### Xóa đơn hàng
```
DELETE /api/orders/:id
```

#### Thống kê đơn hàng
```
GET /api/orders/statistics
GET /api/orders/statistics?date_from=2024-01-01&date_to=2024-01-31
```

### Customer Service (`/api/customers`)

#### Lấy tất cả khách hàng
```
GET /api/customers
GET /api/customers?search=Nguyễn
```

#### Lấy khách hàng theo ID
```
GET /api/customers/:id
```

#### Tạo khách hàng mới
```
POST /api/customers
Body:
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận 1, TP.HCM"
}
```

#### Cập nhật khách hàng
```
PUT /api/customers/:id
Body: { ... }
```

#### Xóa khách hàng
```
DELETE /api/customers/:id
```

#### Lấy lịch sử đơn hàng của khách hàng
```
GET /api/customers/:id/orders
```

#### Lấy thống kê khách hàng
```
GET /api/customers/:id/statistics
```

## 📊 Database Schema

### Bảng chính:

- **customers**: Thông tin khách hàng
- **products**: Danh mục sản phẩm trái cây
- **inventory**: Quản lý tồn kho
- **orders**: Đơn hàng
- **order_items**: Chi tiết đơn hàng
- **inventory_transactions**: Lịch sử giao dịch kho

## 🔄 Luồng xử lý đơn hàng

1. Tạo đơn hàng → Kiểm tra tồn kho
2. Nếu đủ hàng → Tạo đơn hàng và xuất kho
3. Nếu không đủ → Trả về lỗi
4. Khi hủy đơn hàng → Tự động nhập lại kho

## 🧪 Testing với cURL

### Tạo sản phẩm
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Táo đỏ",
    "category": "Táo",
    "unit_price": 50000,
    "unit": "kg"
  }'
```

### Nhập kho
```bash
curl -X POST http://localhost:3000/api/inventory/stock-in \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 100
  }'
```

### Tạo đơn hàng
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {"product_id": 1, "quantity": 2}
    ],
    "payment_method": "cash"
  }'
```

## 📁 Cấu trúc thư mục

```
services/
├── config/
│   └── database.js          # Cấu hình kết nối MySQL
├── database/
│   └── schema.sql            # Database schema
├── product-service/
│   ├── models/
│   ├── services/
│   ├── controllers/
│   └── routes/
├── inventory-service/
│   ├── models/
│   ├── services/
│   ├── controllers/
│   └── routes/
├── order-service/
│   ├── models/
│   ├── services/
│   ├── controllers/
│   └── routes/
├── customer-service/
│   ├── models/
│   ├── services/
│   ├── controllers/
│   └── routes/
├── server.js                 # API Gateway
├── package.json
└── README.md
```

## 🛠️ Công nghệ sử dụng

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MySQL2**: MySQL driver với Promise support
- **dotenv**: Quản lý biến môi trường
- **CORS**: Cross-Origin Resource Sharing

## 📝 Ghi chú

- Mỗi service có thể được phát triển và triển khai độc lập
- Database được chia sẻ giữa các service (monolithic database pattern)
- Có thể mở rộng thành microservices với database riêng cho mỗi service

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

ISC

