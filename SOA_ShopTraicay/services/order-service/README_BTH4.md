# Order Service - Bài thực hành số 4

## 🎯 Mục tiêu

Xây dựng dịch vụ quản lý đơn hàng hoạt động độc lập trên port riêng theo kiến trúc SOA.

## ✅ Đã hoàn thành

1. ✅ Service chạy độc lập trên port 3002
2. ✅ RESTful API đầy đủ cho Orders (GET, POST, PUT, DELETE)
3. ✅ RESTful API đầy đủ cho Order Items (GET, POST, PUT, DELETE)
4. ✅ Controller xử lý nghiệp vụ
5. ✅ Xác thực JWT cho POST, PUT, DELETE
6. ✅ Kiểm tra tồn kho khi tạo đơn hàng
7. ✅ Hỗ trợ schema với customer_name, customer_email, product_name, total_price

## 🚀 Cách chạy Service độc lập

### Bước 1: Cập nhật Database Schema

Chạy file SQL để cập nhật schema:

```bash
mysql -u root -p fruit_store_db < services/database/orders_schema_bth4.sql
```

Hoặc trong phpMyAdmin:
- Tab SQL → Copy nội dung file `orders_schema_bth4.sql` → Go

### Bước 2: Cập nhật file .env

Thêm vào file `.env` ở thư mục `services`:

```env
ORDER_SERVICE_PORT=3002
```

### Bước 3: Khởi động Service

```bash
cd services/order-service
npm install
npm run dev
```

Hoặc:

```bash
node server-standalone.js
```

Service sẽ chạy tại: `http://localhost:3002`

## 📋 API Endpoints

### Orders API

#### 1. GET /orders - Lấy danh sách đơn hàng

**URL**: `http://localhost:3002/orders`

**Method**: `GET`

**Headers**: Không cần JWT

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_name": "Nguyễn Văn A",
      "customer_email": "nguyenvana@example.com",
      "total_amount": 195000.00,
      "status": "completed",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### 2. GET /orders/:id - Lấy chi tiết đơn hàng

**URL**: `http://localhost:3002/orders/1`

**Method**: `GET`

**Headers**: Không cần JWT

#### 3. POST /orders - Tạo đơn hàng mới

**URL**: `http://localhost:3002/orders`

**Method**: `POST`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "customer_id": 1,
  "customer_name": "Nguyễn Văn A",
  "customer_email": "nguyenvana@example.com",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "payment_method": "cash",
  "notes": "Giao hàng buổi sáng"
}
```

**Lưu ý**: Service sẽ tự động:
- Kiểm tra tồn kho
- Lấy giá sản phẩm
- Tính tổng tiền
- Lưu customer_name và customer_email

#### 4. PUT /orders/:id - Cập nhật đơn hàng

**URL**: `http://localhost:3002/orders/1`

**Method**: `PUT`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 5. DELETE /orders/:id - Xóa đơn hàng

**URL**: `http://localhost:3002/orders/1`

**Method**: `DELETE`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Order Items API

#### 1. GET /order_items - Lấy danh sách order items

**URL**: `http://localhost:3002/order_items`

**Method**: `GET`

**Query params** (tùy chọn):
- `order_id`: Lọc theo order_id
- `product_id`: Lọc theo product_id

#### 2. GET /order_items/:id - Lấy chi tiết order item

**URL**: `http://localhost:3002/order_items/1`

**Method**: `GET`

#### 3. GET /order_items/order/:orderId - Lấy items theo order_id

**URL**: `http://localhost:3002/order_items/order/1`

**Method**: `GET`

#### 4. POST /order_items - Tạo order item mới

**URL**: `http://localhost:3002/order_items`

**Method**: `POST`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "order_id": 1,
  "product_id": 1,
  "quantity": 2,
  "unit_price": 50000
}
```

**Lưu ý**: Service sẽ tự động:
- Lấy product_name từ bảng products
- Tính total_price = quantity * unit_price
- Cập nhật tổng tiền đơn hàng

#### 5. PUT /order_items/:id - Cập nhật order item

**URL**: `http://localhost:3002/order_items/1`

**Method**: `PUT`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body**:
```json
{
  "quantity": 3,
  "unit_price": 55000
}
```

#### 6. DELETE /order_items/:id - Xóa order item

**URL**: `http://localhost:3002/order_items/1`

**Method**: `DELETE`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔐 Xác thực JWT

Tất cả các endpoint **POST, PUT, DELETE** đều yêu cầu JWT token.

Để lấy token:
1. Đăng nhập qua Auth Service (port 3000): `POST http://localhost:3000/login`
2. Lấy token từ response
3. Sử dụng token trong header: `Authorization: Bearer TOKEN`

## 📊 Schema Database

### Bảng Orders

- `id` INT PRIMARY KEY ✅
- `customer_name` VARCHAR(255) ✅ (cần chạy SQL)
- `customer_email` VARCHAR(255) ✅ (cần chạy SQL)
- `total_amount` DECIMAL(10,2) ✅
- `status` VARCHAR(50) ✅
- `created_at` TIMESTAMP ✅
- `updated_at` TIMESTAMP ✅

### Bảng Order Items

- `id` INT PRIMARY KEY ✅
- `order_id` INT ✅
- `product_id` INT ✅
- `product_name` VARCHAR(255) ✅ (cần chạy SQL)
- `quantity` INT ✅
- `unit_price` DECIMAL(10,2) ✅
- `total_price` DECIMAL(10,2) ✅ (cần chạy SQL)

## 🧪 Test với Postman

### Test Case 1: Lấy danh sách đơn hàng (không cần token)

```
GET http://localhost:3002/orders
```

### Test Case 2: Tạo đơn hàng (cần token)

1. Đăng nhập để lấy token:
   ```
   POST http://localhost:3000/login
   Body: {"userName": "admin", "password": "123456"}
   ```

2. Tạo đơn hàng:
   ```
   POST http://localhost:3002/orders
   Header: Authorization: Bearer YOUR_TOKEN
   Body: {
     "customer_id": 1,
     "items": [
       {"product_id": 1, "quantity": 2}
     ],
     "payment_method": "cash"
   }
   ```

### Test Case 3: Lấy danh sách order items

```
GET http://localhost:3002/order_items
```

### Test Case 4: Tạo order item (cần token)

```
POST http://localhost:3002/order_items
Header: Authorization: Bearer YOUR_TOKEN
Body: {
  "order_id": 1,
  "product_id": 1,
  "quantity": 2,
  "unit_price": 50000
}
```

## 🔄 Kiến trúc SOA

Service này hoạt động **độc lập**:
- Chạy trên port riêng (3002)
- Có thể deploy riêng biệt
- Giao tiếp với Auth Service qua JWT
- Giao tiếp với Product Service để kiểm tra tồn kho
- Có thể có database riêng (hiện tại dùng chung)

## 📝 Lưu ý

- Service chạy độc lập, không phụ thuộc vào server.js chính
- JWT token được xác thực qua Auth Service (port 3000)
- GET endpoints không cần token (có thể thay đổi tùy yêu cầu)
- POST, PUT, DELETE đều yêu cầu JWT token
- Khi tạo đơn hàng, service tự động kiểm tra tồn kho

## ✅ Checklist

- [x] Service chạy độc lập trên port 3002
- [x] RESTful API đầy đủ cho Orders
- [x] RESTful API đầy đủ cho Order Items
- [x] Controller xử lý nghiệp vụ
- [x] JWT middleware cho POST, PUT, DELETE
- [x] Kiểm tra tồn kho khi tạo đơn hàng
- [x] Schema database hỗ trợ customer_name, customer_email, product_name, total_price
- [ ] Chạy SQL script để cập nhật schema (1 bước cuối)

