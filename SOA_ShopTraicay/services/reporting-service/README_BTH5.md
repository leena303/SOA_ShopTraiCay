# Reporting Service - Bài thực hành số 5

## 🎯 Mục tiêu

Xây dựng dịch vụ báo cáo với các chức năng thống kê số lượng hàng tồn, hàng bán được, doanh thu, chi phí, lợi nhuận. Báo cáo theo sản phẩm và đơn hàng.

## ✅ Đã hoàn thành

1. ✅ Service chạy độc lập trên port 3003
2. ✅ RESTful API đầy đủ cho Order Reports
3. ✅ RESTful API đầy đủ cho Product Reports
4. ✅ Controller xử lý nghiệp vụ
5. ✅ Service layer tính toán doanh thu, chi phí, lợi nhuận
6. ✅ JWT authentication cho POST, DELETE
7. ✅ Schema database cho orders_reports và product_reports

## 🚀 Cách chạy Service độc lập

### Bước 1: Cập nhật Database Schema

Chạy file SQL để tạo bảng:

```bash
mysql -u root -p fruit_store_db < services/database/reports_schema_bth5.sql
```

Hoặc trong phpMyAdmin:
- Tab SQL → Copy nội dung file `reports_schema_bth5.sql` → Go

### Bước 2: Cập nhật file .env

Thêm vào file `.env` ở thư mục `services`:

```env
REPORTING_SERVICE_PORT=3003
```

### Bước 3: Khởi động Service

```bash
cd services/reporting-service
npm install
npm run dev
```

Hoặc:

```bash
node server-standalone.js
```

Service sẽ chạy tại: `http://localhost:3003`

## 📋 API Endpoints

### Order Reports API

#### 1. GET /reports/orders - Lấy danh sách báo cáo đơn hàng

**URL**: `http://localhost:3003/reports/orders`

**Method**: `GET`

**Query params** (tùy chọn):
- `order_id`: Lọc theo order_id
- `date_from`: Lọc từ ngày (YYYY-MM-DD)
- `date_to`: Lọc đến ngày (YYYY-MM-DD)

**Headers**: Không cần JWT

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "total_revenue": 195000.00,
      "total_cost": 136500.00,
      "total_profit": 58500.00,
      "order_number": "ORD-2024-001",
      "order_status": "completed",
      "customer_name": "Nguyễn Văn A",
      "customer_email": "nguyenvana@example.com"
    }
  ],
  "count": 1
}
```

#### 2. GET /reports/orders/:id - Lấy chi tiết báo cáo đơn hàng

**URL**: `http://localhost:3003/reports/orders/1`

**Method**: `GET`

**Headers**: Không cần JWT

**Response**: Bao gồm cả danh sách product_reports liên quan

#### 3. POST /reports/orders - Tạo báo cáo đơn hàng mới

**URL**: `http://localhost:3003/reports/orders`

**Method**: `POST`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "order_id": 1
}
```

**Lưu ý**: Service sẽ tự động:
- Lấy thông tin đơn hàng từ bảng `orders`
- Lấy chi tiết đơn hàng từ bảng `order_items`
- Tính tổng doanh thu (total_revenue)
- Tính tổng chi phí (total_cost) - dựa trên cost_price hoặc 70% revenue
- Tính tổng lợi nhuận (total_profit = revenue - cost)
- Tạo báo cáo sản phẩm cho từng item trong đơn hàng

#### 4. DELETE /reports/orders/:id - Xóa báo cáo đơn hàng

**URL**: `http://localhost:3003/reports/orders/1`

**Method**: `DELETE`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Product Reports API

#### 1. GET /reports/products - Lấy danh sách báo cáo sản phẩm

**URL**: `http://localhost:3003/reports/products`

**Method**: `GET`

**Query params** (tùy chọn):
- `product_id`: Lọc theo product_id
- `order_report_id`: Lọc theo order_report_id
- `date_from`: Lọc từ ngày
- `date_to`: Lọc đến ngày

**Headers**: Không cần JWT

#### 2. GET /reports/products/:id - Lấy chi tiết báo cáo sản phẩm

**URL**: `http://localhost:3003/reports/products/1`

**Method**: `GET`

**Headers**: Không cần JWT

#### 3. GET /reports/products/:id/summary - Lấy báo cáo tổng hợp theo product_id

**URL**: `http://localhost:3003/reports/products/1/summary`

**Method**: `GET`

**Headers**: Không cần JWT

**Response**: Tổng hợp tất cả báo cáo của sản phẩm (total_sold, total_revenue, total_cost, total_profit)

#### 4. POST /reports/products - Tạo báo cáo sản phẩm mới

**URL**: `http://localhost:3003/reports/products`

**Method**: `POST`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "order_report_id": 1,
  "product_id": 1,
  "quantity": 2,
  "unit_price": 50000
}
```

#### 5. DELETE /reports/products/:id - Xóa báo cáo sản phẩm

**URL**: `http://localhost:3003/reports/products/1`

**Method**: `DELETE`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔐 Xác thực JWT

Tất cả các endpoint **POST, DELETE** đều yêu cầu JWT token.

Để lấy token:
1. Đăng nhập qua Auth Service (port 3000): `POST http://localhost:3000/login`
2. Lấy token từ response
3. Sử dụng token trong header: `Authorization: Bearer TOKEN`

## 📊 Schema Database

### Bảng orders_reports

- `id` INT PRIMARY KEY ✅
- `order_id` INT ✅
- `total_revenue` DECIMAL(10,2) ✅
- `total_cost` DECIMAL(10,2) ✅
- `total_profit` DECIMAL(10,2) ✅

### Bảng product_reports

- `id` INT PRIMARY KEY ✅
- `order_report_id` INT ✅
- `product_id` INT ✅
- `total_sold` INT ✅
- `revenue` DECIMAL(10,2) ✅
- `cost` DECIMAL(10,2) ✅
- `profit` DECIMAL(10,2) ✅

## 🧪 Test với Postman

### Test Case 1: Lấy danh sách báo cáo đơn hàng (không cần token)

```
GET http://localhost:3003/reports/orders
```

### Test Case 2: Tạo báo cáo đơn hàng (cần token)

1. Đăng nhập để lấy token:
   ```
   POST http://localhost:3000/login
   Body: {"userName": "admin", "password": "123456"}
   ```

2. Tạo báo cáo đơn hàng:
   ```
   POST http://localhost:3003/reports/orders
   Header: Authorization: Bearer YOUR_TOKEN
   Body: {
     "order_id": 1
   }
   ```

**Kỳ vọng**: 
- Tạo báo cáo đơn hàng với total_revenue, total_cost, total_profit
- Tự động tạo báo cáo sản phẩm cho từng item

### Test Case 3: Lấy danh sách báo cáo sản phẩm

```
GET http://localhost:3003/reports/products
```

### Test Case 4: Lấy báo cáo tổng hợp sản phẩm

```
GET http://localhost:3003/reports/products/1/summary
```

**Kỳ vọng**: Tổng hợp tất cả báo cáo của sản phẩm ID 1

## 💡 Logic Tính Toán

### Doanh thu (Revenue)
- **Order Report**: Tổng `total_price` từ `order_items` của đơn hàng
- **Product Report**: `unit_price * quantity` của sản phẩm trong đơn hàng

### Chi phí (Cost)
- Nếu sản phẩm có `cost_price` trong bảng `products` → dùng `cost_price`
- Nếu không có → mặc định = 70% của `unit_price`
- **Total Cost** = `cost_per_unit * quantity`

### Lợi nhuận (Profit)
- **Profit** = **Revenue** - **Cost**

## 🔄 Kiến trúc SOA

Service này hoạt động **độc lập**:
- Chạy trên port riêng (3003)
- Có thể deploy riêng biệt
- Giao tiếp với Auth Service qua JWT
- Đọc dữ liệu từ bảng `orders`, `order_items`, `products`
- Có thể có database riêng (hiện tại dùng chung)

## 📝 Lưu ý

- Service chạy độc lập, không phụ thuộc vào server.js chính
- JWT token được xác thực qua Auth Service (port 3000)
- GET endpoints không cần token (có thể thay đổi tùy yêu cầu)
- POST, DELETE đều yêu cầu JWT token
- Khi tạo báo cáo đơn hàng, service tự động tạo báo cáo sản phẩm cho từng item
- Chi phí mặc định = 70% revenue nếu không có cost_price

## ✅ Checklist

- [x] Service chạy độc lập trên port 3003
- [x] RESTful API đầy đủ cho Order Reports
- [x] RESTful API đầy đủ cho Product Reports
- [x] Controller xử lý nghiệp vụ
- [x] Service layer tính toán doanh thu, chi phí, lợi nhuận
- [x] JWT middleware cho POST, DELETE
- [x] Schema database cho orders_reports và product_reports
- [ ] Chạy SQL script để tạo bảng (1 bước cuối)

