# Product Service - Bài thực hành số 3

## 🎯 Mục tiêu

Xây dựng dịch vụ quản lý sản phẩm hoạt động độc lập trên port riêng theo kiến trúc SOA.

## ✅ Đã hoàn thành

1. ✅ Service chạy độc lập trên port 3001
2. ✅ RESTful API đầy đủ (GET, POST, PUT, DELETE)
3. ✅ Controller xử lý nghiệp vụ
4. ✅ Xác thực JWT cho POST, PUT, DELETE
5. ✅ Hỗ trợ schema với price và quantity

## 🚀 Cách chạy Service độc lập

### Bước 1: Cập nhật Database Schema

Chạy file SQL để thêm cột `quantity`:

```bash
mysql -u root -p fruit_store_db < ../database/products_schema_bth3.sql
```

Hoặc trong MySQL:

```sql
USE fruit_store_db;
SOURCE database/products_schema_bth3.sql;
```

### Bước 2: Cập nhật file .env

Thêm vào file `.env` ở thư mục `services`:

```env
PRODUCT_SERVICE_PORT=3001
```

### Bước 3: Khởi động Service

```bash
cd services/product-service
npm install
npm run dev
```

Hoặc:

```bash
node server-standalone.js
```

Service sẽ chạy tại: `http://localhost:3001`

## 📋 API Endpoints

### 1. GET /products - Lấy danh sách sản phẩm

**URL**: `http://localhost:3001/products`

**Method**: `GET`

**Headers**: Không cần JWT

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Táo đỏ",
      "description": "Táo đỏ tươi ngon",
      "price": 50000,
      "quantity": 100,
      "category": "Táo",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 2. GET /products/:id - Lấy chi tiết sản phẩm

**URL**: `http://localhost:3001/products/1`

**Method**: `GET`

**Headers**: Không cần JWT

### 3. POST /products - Tạo sản phẩm mới

**URL**: `http://localhost:3001/products`

**Method**: `POST`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "name": "Táo đỏ",
  "description": "Táo đỏ tươi ngon",
  "price": 50000,
  "quantity": 100,
  "category": "Táo"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "id": 1,
    "name": "Táo đỏ",
    "price": 50000,
    "quantity": 100
  }
}
```

### 4. PUT /products/:id - Cập nhật sản phẩm

**URL**: `http://localhost:3001/products/1`

**Method**: `PUT`

**Headers** (BẮT BUỘC):
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "name": "Táo đỏ cập nhật",
  "price": 55000,
  "quantity": 150
}
```

### 5. DELETE /products/:id - Xóa sản phẩm

**URL**: `http://localhost:3001/products/1`

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

## 🧪 Test với Postman

### Test Case 1: Lấy danh sách sản phẩm (không cần token)

```
GET http://localhost:3001/products
```

### Test Case 2: Tạo sản phẩm (cần token)

1. Đăng nhập để lấy token:
   ```
   POST http://localhost:3000/login
   Body: {"userName": "admin", "password": "123456"}
   ```

2. Tạo sản phẩm:
   ```
   POST http://localhost:3001/products
   Header: Authorization: Bearer YOUR_TOKEN
   Body: {
     "name": "Táo đỏ",
     "description": "Táo đỏ tươi ngon",
     "price": 50000,
     "quantity": 100,
     "category": "Táo"
   }
   ```

## 📊 Schema Database

Bảng `products` cần có các cột:

- `id` INT PRIMARY KEY ✅
- `name` VARCHAR(255) ✅
- `description` TEXT ✅
- `price` DECIMAL(10,2) hoặc `unit_price` DECIMAL(10,2) ✅
- `quantity` INT ✅
- `created_at` TIMESTAMP ✅
- `updated_at` TIMESTAMP ✅

## 🔄 Kiến trúc SOA

Service này hoạt động **độc lập**:
- Chạy trên port riêng (3001)
- Có thể deploy riêng biệt
- Giao tiếp với Auth Service qua JWT
- Có thể có database riêng (hiện tại dùng chung)

## 📝 Lưu ý

- Service chạy độc lập, không phụ thuộc vào server.js chính
- JWT token được xác thực qua Auth Service (port 3000)
- GET endpoints không cần token (có thể thay đổi tùy yêu cầu)
- POST, PUT, DELETE đều yêu cầu JWT token

## ✅ Checklist

- [x] Service chạy độc lập trên port 3001
- [x] RESTful API đầy đủ
- [x] Controller xử lý nghiệp vụ
- [x] JWT middleware cho POST, PUT, DELETE
- [x] Schema database hỗ trợ price và quantity
- [x] Tài liệu hướng dẫn

