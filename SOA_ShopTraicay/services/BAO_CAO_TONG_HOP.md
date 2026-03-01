# BÁO CÁO TỔNG HỢP
## HỆ THỐNG QUẢN LÝ CỬA HÀNG TRÁI CÂY - KIẾN TRÚC SOA

---

## I. PHÁT BIỂU BÀI TOÁN

### 1.1. Phát biểu bài toán

Trong thời đại số hóa hiện nay, việc quản lý cửa hàng trái cây truyền thống gặp nhiều thách thức:

- **Quản lý thủ công**: Việc quản lý sản phẩm, đơn hàng, kho hàng bằng sổ sách hoặc Excel gây khó khăn trong việc theo dõi, cập nhật và báo cáo. Dữ liệu dễ bị sai sót, khó tìm kiếm và không có tính nhất quán.

- **Thiếu tích hợp**: Các chức năng quản lý (sản phẩm, đơn hàng, kho, khách hàng) hoạt động độc lập, không có sự liên kết, dẫn đến dữ liệu không đồng bộ. Khi cập nhật thông tin ở một nơi, phải cập nhật thủ công ở nhiều nơi khác.

- **Khó mở rộng**: Khi cửa hàng phát triển, hệ thống quản lý cũ không thể mở rộng dễ dàng. Việc thêm chức năng mới hoặc tăng số lượng người dùng gặp nhiều khó khăn.

- **Thiếu báo cáo**: Không có công cụ phân tích và báo cáo để đánh giá hiệu quả kinh doanh. Khó biết được sản phẩm nào bán chạy, doanh thu theo thời gian, lợi nhuận của từng sản phẩm.

**Giải pháp**: Xây dựng một hệ thống quản lý cửa hàng trái cây với kiến trúc SOA (Service-Oriented Architecture), tự động hóa các quy trình quản lý, tích hợp các chức năng một cách liền mạch, và cung cấp các công cụ báo cáo để hỗ trợ ra quyết định.

---

## II. PHÂN TÍCH CHỨC NĂNG CỦA HỆ THỐNG

### 2.1. Xác định mục tiêu của hệ thống

#### 2.1.1. Mục tiêu chính

1. **Tự động hóa quy trình quản lý**
   - Tự động tính toán tổng tiền đơn hàng
   - Tự động kiểm tra và cập nhật tồn kho
   - Tự động tạo báo cáo doanh thu, lợi nhuận

2. **Tăng hiệu quả và độ chính xác**
   - Giảm thiểu sai sót trong quản lý kho và tính toán
   - Đảm bảo tính nhất quán của dữ liệu
   - Tăng tốc độ xử lý đơn hàng

3. **Cải thiện trải nghiệm người dùng**
   - Giao diện thân thiện, dễ sử dụng cho người quản lý
   - Giao diện mua sắm trực quan cho khách hàng
   - Hỗ trợ tìm kiếm và lọc sản phẩm nhanh chóng

4. **Hỗ trợ ra quyết định kinh doanh**
   - Cung cấp báo cáo về doanh thu, lợi nhuận
   - Phân tích sản phẩm bán chạy
   - Thống kê theo thời gian

#### 2.1.2. Yêu cầu chức năng và phi chức năng

**Yêu cầu chức năng:**
- Quản lý sản phẩm (CRUD)
- Quản lý danh mục (CRUD)
- Quản lý đơn hàng (tạo, cập nhật trạng thái, xem chi tiết)
- Quản lý kho hàng (nhập/xuất, tồn kho)
- Quản lý khách hàng và người dùng
- Quản lý thanh toán
- Báo cáo và thống kê
- Xác thực và phân quyền người dùng

**Yêu cầu phi chức năng:**
- Hiệu năng: Phản hồi trong 2 giây, hỗ trợ 100+ người dùng đồng thời
- Bảo mật: JWT authentication, mã hóa mật khẩu
- Khả năng mở rộng: Kiến trúc SOA, mỗi service scale độc lập
- Độ tin cậy: Error handling, validation, ACID transactions
- Khả năng bảo trì: Code có cấu trúc rõ ràng, tài liệu đầy đủ

### 2.2. Xây dựng biểu đồ chức năng dựa trên mục tiêu của hệ thống

```
HỆ THỐNG QUẢN LÝ CỬA HÀNG TRÁI CÂY
│
├── 1. QUẢN LÝ SẢN PHẨM
│   ├── 1.1. Thêm sản phẩm
│   ├── 1.2. Sửa thông tin sản phẩm
│   ├── 1.3. Xóa sản phẩm
│   ├── 1.4. Xem danh sách sản phẩm
│   ├── 1.5. Tìm kiếm và lọc sản phẩm
│   └── 1.6. Quản lý tồn kho sản phẩm
│
├── 2. QUẢN LÝ DANH MỤC
│   ├── 2.1. Thêm danh mục
│   ├── 2.2. Sửa danh mục
│   ├── 2.3. Xóa danh mục
│   └── 2.4. Xem danh sách danh mục
│
├── 3. QUẢN LÝ ĐƠN HÀNG
│   ├── 3.1. Tạo đơn hàng mới
│   ├── 3.2. Kiểm tra tồn kho tự động
│   ├── 3.3. Tính tổng tiền tự động
│   ├── 3.4. Cập nhật trạng thái đơn hàng
│   ├── 3.5. Xem chi tiết đơn hàng
│   ├── 3.6. Tìm kiếm và lọc đơn hàng
│   └── 3.7. Xuất kho tự động
│
├── 4. QUẢN LÝ KHO HÀNG
│   ├── 4.1. Quản lý tồn kho
│   ├── 4.2. Nhập kho
│   ├── 4.3. Xuất kho
│   ├── 4.4. Cảnh báo hết hàng
│   └── 4.5. Lịch sử giao dịch kho
│
├── 5. QUẢN LÝ KHÁCH HÀNG
│   ├── 5.1. Thêm khách hàng
│   ├── 5.2. Sửa thông tin khách hàng
│   ├── 5.3. Xóa khách hàng
│   └── 5.4. Xem danh sách khách hàng
│
├── 6. QUẢN LÝ THANH TOÁN
│   ├── 6.1. Tạo thanh toán
│   ├── 6.2. Cập nhật trạng thái thanh toán
│   └── 6.3. Xem lịch sử thanh toán
│
├── 7. QUẢN LÝ NGƯỜI DÙNG
│   ├── 7.1. Đăng ký
│   ├── 7.2. Đăng nhập
│   ├── 7.3. Đăng xuất
│   ├── 7.4. Quản lý thông tin người dùng
│   └── 7.5. Phân quyền người dùng
│
└── 8. BÁO CÁO VÀ THỐNG KÊ
    ├── 8.1. Báo cáo đơn hàng
    ├── 8.2. Báo cáo sản phẩm
    ├── 8.3. Thống kê doanh thu
    └── 8.4. Thống kê lợi nhuận
```

### 2.3. Phân rã chức năng con (dịch vụ) dựa trên phân rã mục tiêu con của hệ thống

#### Mô tả chi tiết chức năng con (dịch vụ)

**1. Auth Service (Port 3000)**
- **Chức năng**: Xác thực và quản lý người dùng
- **API chính**:
  - `POST /login` - Đăng nhập, trả về JWT token
  - `POST /register` - Đăng ký người dùng mới
  - `POST /logout` - Đăng xuất
  - `GET /users` - Lấy danh sách người dùng (cần JWT)
  - `GET /users/:id` - Lấy thông tin người dùng (cần JWT)
  - `PUT /users/:id` - Cập nhật thông tin người dùng (cần JWT)
  - `DELETE /users/:id` - Xóa người dùng (cần JWT)
- **Database**: Bảng `users`
- **Mục đích**: Quản lý xác thực, phân quyền, và thông tin người dùng

**2. Product Service (Port 3001)**
- **Chức năng**: Quản lý sản phẩm và danh mục
- **API chính**:
  - `GET /products` - Lấy danh sách sản phẩm (có filter)
  - `GET /products/:id` - Lấy chi tiết sản phẩm
  - `POST /products` - Thêm sản phẩm mới (cần JWT)
  - `PUT /products/:id` - Cập nhật sản phẩm (cần JWT)
  - `DELETE /products/:id` - Xóa sản phẩm (cần JWT)
  - `GET /products/categories` - Lấy danh sách danh mục
- **Database**: Bảng `products`, `categories`
- **Mục đích**: Quản lý thông tin sản phẩm, danh mục, tìm kiếm và lọc

**3. Order Service (Port 3002)**
- **Chức năng**: Quản lý đơn hàng và order items
- **API chính**:
  - `GET /orders` - Lấy danh sách đơn hàng (có filter)
  - `GET /orders/:id` - Lấy chi tiết đơn hàng
  - `POST /orders` - Tạo đơn hàng mới (cần JWT, tự động kiểm tra tồn kho)
  - `PUT /orders/:id` - Cập nhật đơn hàng (cần JWT)
  - `PATCH /orders/:id/status` - Cập nhật trạng thái đơn hàng (cần JWT)
  - `DELETE /orders/:id` - Xóa đơn hàng (cần JWT)
  - `GET /order_items/order/:orderId` - Lấy items của đơn hàng
- **Database**: Bảng `orders`, `order_items`
- **Mục đích**: Quản lý đơn hàng, tự động tính tổng tiền, kiểm tra tồn kho

**4. Inventory Service (Port 3004)**
- **Chức năng**: Quản lý kho hàng
- **API chính**:
  - `GET /inventory` - Lấy danh sách tồn kho
  - `GET /inventory/product/:productId` - Lấy tồn kho theo sản phẩm
  - `POST /inventory/stock-in` - Nhập kho (cần JWT)
  - `POST /inventory/stock-out` - Xuất kho (cần JWT)
  - `GET /inventory/low-stock` - Lấy sản phẩm sắp hết hàng
  - `GET /inventory/transactions` - Lấy lịch sử giao dịch
- **Database**: Bảng `inventory`, `inventory_transactions`
- **Mục đích**: Quản lý tồn kho, nhập/xuất kho, cảnh báo hết hàng

**5. Customer Service (Port 3004)**
- **Chức năng**: Quản lý thông tin khách hàng
- **API chính**:
  - `GET /customers` - Lấy danh sách khách hàng
  - `GET /customers/:id` - Lấy chi tiết khách hàng
  - `POST /customers` - Thêm khách hàng mới (cần JWT)
  - `PUT /customers/:id` - Cập nhật khách hàng (cần JWT)
  - `DELETE /customers/:id` - Xóa khách hàng (cần JWT)
- **Database**: Bảng `customers`
- **Mục đích**: Quản lý thông tin khách hàng, liên kết với đơn hàng

**6. Payment Service (Port 3005)**
- **Chức năng**: Quản lý thanh toán
- **API chính**:
  - `GET /payments` - Lấy danh sách thanh toán
  - `GET /payments/:id` - Lấy chi tiết thanh toán
  - `POST /payments` - Tạo thanh toán mới (cần JWT)
  - `PUT /payments/:id` - Cập nhật thanh toán (cần JWT)
  - `PATCH /payments/:id/status` - Cập nhật trạng thái thanh toán (cần JWT)
- **Database**: Bảng `payments`
- **Mục đích**: Quản lý thanh toán, cập nhật trạng thái thanh toán

**7. Reporting Service (Port 3003)**
- **Chức năng**: Tạo báo cáo và thống kê
- **API chính**:
  - `POST /reports/orders` - Tạo báo cáo đơn hàng (cần JWT, tự động tính revenue, cost, profit)
  - `GET /reports/orders` - Lấy danh sách báo cáo đơn hàng
  - `GET /reports/orders/:id` - Lấy chi tiết báo cáo đơn hàng
  - `POST /reports/products` - Tạo báo cáo sản phẩm (cần JWT)
  - `GET /reports/products` - Lấy danh sách báo cáo sản phẩm
  - `GET /reports/products/:id/summary` - Lấy báo cáo tổng hợp sản phẩm
- **Database**: Bảng `order_reports`, `product_reports`
- **Mục đích**: Tạo báo cáo, tính toán doanh thu, chi phí, lợi nhuận

**8. Category Service (Port 3006)**
- **Chức năng**: Quản lý danh mục sản phẩm
- **API chính**:
  - `GET /categories` - Lấy danh sách danh mục
  - `GET /categories/:id` - Lấy chi tiết danh mục
  - `POST /categories` - Thêm danh mục mới (cần JWT)
  - `PUT /categories/:id` - Cập nhật danh mục (cần JWT)
  - `DELETE /categories/:id` - Xóa danh mục (cần JWT)
- **Database**: Bảng `categories`
- **Mục đích**: Quản lý danh mục sản phẩm, liên kết với sản phẩm

### 2.4. Biểu đồ luồng dữ liệu (theo chức năng)

#### 2.4.1. Luồng tạo đơn hàng

```
[Khách hàng] 
    │
    ├─> [Frontend] Chọn sản phẩm
    │       │
    │       ├─> [Product Service] GET /products
    │       │       └─> [Database] products table
    │       │
    │       └─> Hiển thị danh sách sản phẩm
    │
    ├─> [Frontend] Tạo đơn hàng
    │       │
    │       ├─> [Auth Service] POST /login (lấy JWT token)
    │       │       └─> [Database] users table
    │       │
    │       ├─> [Order Service] POST /orders (với JWT token)
    │       │       │
    │       │       ├─> [Product Service] Kiểm tra tồn kho
    │       │       │       └─> [Database] products table
    │       │       │
    │       │       ├─> Tính tổng tiền
    │       │       │
    │       │       ├─> [Database] Tạo record trong orders table
    │       │       │
    │       │       ├─> [Database] Tạo records trong order_items table
    │       │       │
    │       │       └─> [Inventory Service] Xuất kho tự động
    │       │               └─> [Database] inventory_transactions table
    │       │
    │       └─> Trả về đơn hàng đã tạo
    │
    └─> [Frontend] Hiển thị kết quả
```

#### 2.4.2. Luồng tạo báo cáo

```
[Admin]
    │
    ├─> [Frontend] Yêu cầu tạo báo cáo
    │       │
    │       ├─> [Auth Service] Xác thực JWT token
    │       │       └─> [Database] users table
    │       │
    │       ├─> [Reporting Service] POST /reports/orders
    │       │       │
    │       │       ├─> [Order Service] GET /orders/:id
    │       │       │       └─> [Database] orders, order_items tables
    │       │       │
    │       │       ├─> [Product Service] GET /products/:id
    │       │       │       └─> [Database] products table
    │       │       │
    │       │       ├─> Tính toán:
    │       │       │   - Total Revenue = tổng giá trị đơn hàng
    │       │       │   - Total Cost = tổng chi phí (70% giá hoặc cost_price)
    │       │       │   - Total Profit = Revenue - Cost
    │       │       │
    │       │       ├─> [Database] Tạo record trong order_reports table
    │       │       │
    │       │       └─> [Database] Tạo records trong product_reports table
    │       │
    │       └─> Trả về báo cáo đã tạo
    │
    └─> [Frontend] Hiển thị báo cáo
```

#### 2.4.3. Luồng quản lý sản phẩm

```
[Admin]
    │
    ├─> [Frontend] Quản lý sản phẩm
    │       │
    │       ├─> [Auth Service] Xác thực JWT token
    │       │       └─> [Database] users table
    │       │
    │       ├─> [Product Service] CRUD operations
    │       │       │
    │       │       ├─> GET /products
    │       │       │       └─> [Database] products table
    │       │       │
    │       │       ├─> POST /products
    │       │       │       └─> [Database] Insert vào products table
    │       │       │
    │       │       ├─> PUT /products/:id
    │       │       │       └─> [Database] Update products table
    │       │       │
    │       │       └─> DELETE /products/:id
    │       │               └─> [Database] Delete từ products table
    │       │
    │       └─> Trả về kết quả
    │
    └─> [Frontend] Hiển thị kết quả
```

---

## III. PHÂN TÍCH VÀ THIẾT KẾ DỮ LIỆU CỦA HỆ THỐNG

### 3.1. Mô hình thực thể liên kết của từng dịch vụ

#### 3.1.1. Auth Service - ER Diagram

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │
│ username    │
│ password    │
│ email       │
│ token       │
│ created_at  │
│ updated_at  │
└─────────────┘
```

#### 3.1.2. Product Service - ER Diagram

```
┌─────────────┐         ┌──────────────┐
│  Products   │         │  Categories  │
├─────────────┤         ├──────────────┤
│ id (PK)     │         │ id (PK)      │
│ name        │◄──┐     │ name         │
│ description │   │     │ description  │
│ category_id │───┼─────┤ is_active    │
│ unit_price  │   │     │ created_at   │
│ quantity    │   │     │ updated_at   │
│ unit        │   │     └──────────────┘
│ image_url   │   │
│ is_active   │   │
│ created_at  │   │
│ updated_at  │   │
└─────────────┘   │
                  │
                  │
┌─────────────┐   │
│  Inventory  │   │
├─────────────┤   │
│ id (PK)     │   │
│ product_id  │───┘
│ quantity    │
│ min_stock   │
│ max_stock   │
│ location    │
└─────────────┘
```

#### 3.1.3. Order Service - ER Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Orders    │         │ Order Items  │         │  Products   │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)      │         │ id (PK)     │
│ customer_id │         │ order_id     │◄──┐     │ name        │
│ order_number│         │ product_id   │───┼─────┤ unit_price  │
│ total_amount│         │ quantity     │   │     │ ...         │
│ status      │         │ unit_price   │   │     └─────────────┘
│ payment_method│       │ subtotal     │   │
│ payment_status│       │ total_price  │   │
│ notes       │         │ product_name │   │
│ created_at  │         │ created_at   │   │
│ updated_at  │         └──────────────┘   │
└─────────────┘                            │
         │                                  │
         │                                  │
         └──────────────────────────────────┘
```

#### 3.1.4. Customer Service - ER Diagram

```
┌─────────────┐         ┌──────────────┐
│  Customers  │         │   Orders     │
├─────────────┤         ├──────────────┤
│ id (PK)     │         │ id (PK)      │
│ name        │         │ customer_id  │◄──┐
│ email       │         │ order_number │   │
│ phone       │         │ total_amount │   │
│ address     │         │ status       │   │
│ created_at  │         │ created_at   │   │
│ updated_at  │         │ updated_at   │   │
└─────────────┘         └──────────────┘   │
        │                                  │
        └──────────────────────────────────┘
```

#### 3.1.5. Payment Service - ER Diagram

```
┌─────────────┐         ┌──────────────┐
│  Payments   │         │   Orders     │
├─────────────┤         ├──────────────┤
│ id (PK)     │         │ id (PK)      │
│ order_id    │────────►│ order_number │
│ amount      │         │ total_amount │
│ method      │         │ payment_status│
│ status      │         │ ...          │
│ transaction_id│       └──────────────┘
│ created_at  │
│ updated_at  │
└─────────────┘
```

#### 3.1.6. Reporting Service - ER Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│Order Reports│         │Product Reports│        │   Orders    │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)      │         │ id (PK)     │
│ order_id    │────────►│ product_id   │         │ order_number│
│ total_revenue│        │ order_id     │────────►│ total_amount│
│ total_cost  │         │ quantity     │         │ ...         │
│ total_profit│         │ revenue      │         └─────────────┘
│ created_at  │         │ cost         │
│ updated_at  │         │ profit        │
└─────────────┘         │ created_at   │
                        │ updated_at   │
                        └──────────────┘
```

### 3.2. Mô hình quan hệ của từng dịch vụ

#### 3.2.1. Quan hệ giữa các bảng

**Auth Service:**
- `users` (1) ── (0..n) `orders` (qua customer_id hoặc user_id)

**Product Service:**
- `categories` (1) ── (0..n) `products` (qua category_id)
- `products` (1) ── (0..1) `inventory` (qua product_id)
- `products` (1) ── (0..n) `order_items` (qua product_id)

**Order Service:**
- `orders` (1) ── (0..n) `order_items` (qua order_id)
- `orders` (n) ── (1) `customers` (qua customer_id)
- `order_items` (n) ── (1) `products` (qua product_id)

**Customer Service:**
- `customers` (1) ── (0..n) `orders` (qua customer_id)

**Payment Service:**
- `payments` (n) ── (1) `orders` (qua order_id)

**Reporting Service:**
- `order_reports` (n) ── (1) `orders` (qua order_id)
- `product_reports` (n) ── (1) `products` (qua product_id)
- `product_reports` (n) ── (1) `orders` (qua order_id)

### 3.3. Bảng dữ liệu

#### 3.3.1. Auth Service

**Bảng: users**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    token VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3.3.2. Product Service

**Bảng: products**
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    category VARCHAR(100),
    unit_price DECIMAL(10,2) NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'kg',
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

**Bảng: categories**
```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3.3.3. Order Service

**Bảng: orders**
```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','processing','completed','cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_status ENUM('pending','paid','refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

**Bảng: order_items**
```sql
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255),
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

#### 3.3.4. Customer Service

**Bảng: customers**
```sql
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3.3.5. Payment Service

**Bảng: payments**
```sql
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50),
    status ENUM('pending','paid','refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

#### 3.3.6. Reporting Service

**Bảng: order_reports**
```sql
CREATE TABLE order_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    total_revenue DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    total_profit DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

**Bảng: product_reports**
```sql
CREATE TABLE product_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    order_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    revenue DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

#### 3.3.7. Inventory Service

**Bảng: inventory**
```sql
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    min_stock_level DECIMAL(10,2) DEFAULT 0,
    max_stock_level DECIMAL(10,2),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**Bảng: inventory_transactions**
```sql
CREATE TABLE inventory_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    transaction_type ENUM('in','out') NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    reference_type VARCHAR(50),
    reference_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## IV. GIAO DIỆN CỦA HỆ THỐNG

### 4.1. Xây dựng giao diện API cho từng dịch vụ

#### 4.1.1. Auth Service API

**Base URL**: `http://localhost:3000`

| Method | Endpoint | Mô tả | JWT Required |
|--------|----------|-------|--------------|
| POST | `/login` | Đăng nhập, trả về JWT token | ❌ |
| POST | `/register` | Đăng ký người dùng mới | ❌ |
| POST | `/logout` | Đăng xuất | ✅ |
| GET | `/users` | Lấy danh sách người dùng | ✅ |
| GET | `/users/:id` | Lấy thông tin người dùng | ✅ |
| PUT | `/users/:id` | Cập nhật người dùng | ✅ |
| DELETE | `/users/:id` | Xóa người dùng | ✅ |

**Ví dụ Request/Response:**

**POST /login**
```json
Request:
{
  "userName": "admin",
  "password": "123456"
}

Response (200 OK):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

#### 4.1.2. Product Service API

**Base URL**: `http://localhost:3001`

| Method | Endpoint | Mô tả | JWT Required |
|--------|----------|-------|--------------|
| GET | `/products` | Lấy danh sách sản phẩm | ❌ |
| GET | `/products/:id` | Lấy chi tiết sản phẩm | ❌ |
| POST | `/products` | Thêm sản phẩm mới | ✅ |
| PUT | `/products/:id` | Cập nhật sản phẩm | ✅ |
| DELETE | `/products/:id` | Xóa sản phẩm | ✅ |
| GET | `/products/categories` | Lấy danh sách danh mục | ❌ |

**Ví dụ Request/Response:**

**GET /products**
```json
Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Táo đỏ",
      "description": "Táo đỏ tươi ngon",
      "category": "Táo",
      "unit_price": 50000,
      "quantity": 100,
      "unit": "kg",
      "image_url": "/images/tao-do.jpg",
      "is_active": true
    }
  ],
  "count": 1
}
```

**POST /products**
```json
Request:
{
  "name": "Táo đỏ",
  "description": "Táo đỏ tươi ngon",
  "category": "Táo",
  "unit_price": 50000,
  "quantity": 100,
  "unit": "kg",
  "image_url": "/images/tao-do.jpg"
}

Headers:
Authorization: Bearer <JWT_TOKEN>

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Táo đỏ",
    ...
  },
  "message": "Sản phẩm đã được tạo thành công"
}
```

#### 4.1.3. Order Service API

**Base URL**: `http://localhost:3002`

| Method | Endpoint | Mô tả | JWT Required |
|--------|----------|-------|--------------|
| GET | `/orders` | Lấy danh sách đơn hàng | ❌ |
| GET | `/orders/:id` | Lấy chi tiết đơn hàng | ❌ |
| POST | `/orders` | Tạo đơn hàng mới | ✅ |
| PUT | `/orders/:id` | Cập nhật đơn hàng | ✅ |
| PATCH | `/orders/:id/status` | Cập nhật trạng thái | ✅ |
| DELETE | `/orders/:id` | Xóa đơn hàng | ✅ |
| GET | `/order_items/order/:orderId` | Lấy items của đơn hàng | ❌ |

**Ví dụ Request/Response:**

**POST /orders**
```json
Request:
{
  "customer_name": "Nguyễn Văn A",
  "customer_email": "nguyenvana@example.com",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "payment_method": "cash"
}

Headers:
Authorization: Bearer <JWT_TOKEN>

Response (201 Created):
{
  "success": true,
  "message": "Tạo đơn hàng thành công",
  "data": {
    "id": 1,
    "order_number": "ORD-1234567890-001",
    "total_amount": 100000,
    "status": "pending",
    ...
  }
}
```

#### 4.1.4. Reporting Service API

**Base URL**: `http://localhost:3003`

| Method | Endpoint | Mô tả | JWT Required |
|--------|----------|-------|--------------|
| POST | `/reports/orders` | Tạo báo cáo đơn hàng | ✅ |
| GET | `/reports/orders` | Lấy danh sách báo cáo | ❌ |
| GET | `/reports/orders/:id` | Lấy chi tiết báo cáo | ❌ |
| POST | `/reports/products` | Tạo báo cáo sản phẩm | ✅ |
| GET | `/reports/products` | Lấy danh sách báo cáo sản phẩm | ❌ |
| GET | `/reports/products/:id/summary` | Lấy báo cáo tổng hợp | ❌ |

**Ví dụ Request/Response:**

**POST /reports/orders**
```json
Request:
{
  "order_id": 1
}

Headers:
Authorization: Bearer <JWT_TOKEN>

Response (201 Created):
{
  "success": true,
  "message": "Báo cáo đơn hàng đã được tạo",
  "data": {
    "id": 1,
    "order_id": 1,
    "total_revenue": 100000,
    "total_cost": 70000,
    "total_profit": 30000
  }
}
```

**Tài liệu API đầy đủ**: Xem file `POSTMAN_COLLECTION_BTH6.json` và `POSTMAN_GUIDE.md`

### 4.2. Xây dựng giao diện người dùng (Web, Mobile, Windows)

#### 4.2.1. Giao diện Web (Angular)

**Framework**: Angular với TypeScript

**Các trang chính:**

1. **Trang chủ (Home)**
   - Hiển thị danh sách sản phẩm
   - Tìm kiếm và lọc sản phẩm
   - Xem chi tiết sản phẩm
   - Thêm vào giỏ hàng

2. **Trang đăng nhập/Đăng ký**
   - Form đăng nhập với username/password
   - Form đăng ký
   - Xử lý JWT token

3. **Trang quản trị (Admin Dashboard)**
   - **Dashboard**: Thống kê tổng quan (tổng sản phẩm, đơn hàng, người dùng, doanh thu)
   - **Quản lý Sản phẩm**: CRUD sản phẩm, upload ảnh, quản lý tồn kho
   - **Quản lý Danh mục**: CRUD danh mục
   - **Quản lý Đơn hàng**: Xem danh sách, chi tiết, cập nhật trạng thái, thêm đơn hàng
   - **Quản lý Người dùng**: CRUD người dùng, xem chi tiết
   - **Quản lý Thanh toán**: Xem danh sách thanh toán, cập nhật trạng thái

4. **Trang đơn hàng**
   - Xem giỏ hàng
   - Tạo đơn hàng
   - Xác nhận đơn hàng

5. **Trang lịch sử đơn hàng**
   - Xem danh sách đơn hàng của người dùng
   - Xem chi tiết đơn hàng

**Tính năng giao diện:**
- ✅ Responsive design (hỗ trợ desktop, tablet, mobile)
- ✅ Tìm kiếm và lọc dữ liệu
- ✅ Phân trang (pagination)
- ✅ Modal popup cho form thêm/sửa
- ✅ Validation form
- ✅ Loading indicators
- ✅ Error handling và thông báo
- ✅ Modern UI với gradient, shadows, animations

**Công nghệ sử dụng:**
- Angular Framework
- Angular Router (routing)
- Angular Forms (template-driven và reactive)
- Angular HttpClient (API calls)
- SCSS (styling)

**Screenshots/Mô tả giao diện:**
- Giao diện sử dụng theme màu sắc hiện đại (gradient purple-pink)
- Layout sidebar cho admin dashboard
- Tables với sorting và filtering
- Cards cho statistics
- Forms với validation

---

## V. KẾT LUẬN

### 5.1. Tóm tắt dự án

Hệ thống quản lý cửa hàng trái cây đã được xây dựng thành công với kiến trúc SOA (Service-Oriented Architecture), bao gồm:

- **8 dịch vụ độc lập**: Auth, Product, Order, Customer, Payment, Inventory, Reporting, Category
- **RESTful API đầy đủ**: Tất cả các dịch vụ có API CRUD đầy đủ với JWT authentication
- **Giao diện web hoàn chỉnh**: Angular frontend với đầy đủ chức năng quản lý
- **Database được thiết kế tốt**: Normalized schema với foreign keys và indexes
- **Tài liệu đầy đủ**: API documentation, Postman collection, hướng dẫn sử dụng

### 5.2. Đánh giá kết quả

**Điểm mạnh:**
- ✅ Kiến trúc SOA rõ ràng, dễ mở rộng và bảo trì
- ✅ Mỗi service độc lập, có thể deploy riêng biệt
- ✅ API RESTful chuẩn, có authentication và authorization
- ✅ Giao diện người dùng hiện đại, thân thiện
- ✅ Tự động hóa nhiều quy trình (tính tổng tiền, kiểm tra tồn kho, xuất kho)
- ✅ Báo cáo và thống kê tự động tính toán

**Hạn chế và hướng phát triển:**
- ⚠️ Chưa có mobile app (iOS/Android)
- ⚠️ Chưa tích hợp thanh toán trực tuyến (payment gateway)
- ⚠️ Chưa có tính năng gửi email/SMS thông báo
- ⚠️ Chưa có quản lý đa cửa hàng (multi-store)

### 5.3. Kết luận

Dự án đã đáp ứng đầy đủ các yêu cầu của bài tập lớn:

1. ✅ **Phân tích thiết kế hệ thống**: Đã phát biểu bài toán, phân chia dịch vụ, phân tích chi tiết từng dịch vụ, và xây dựng database schema
2. ✅ **Xây dựng giao diện**: Đã xây dựng API đầy đủ với tài liệu, và giao diện người dùng web hoàn chỉnh
3. ✅ **Mức độ hoàn thiện**: Hệ thống hoạt động ổn định, có tài liệu đầy đủ, code có cấu trúc rõ ràng

Hệ thống sẵn sàng để triển khai trong môi trường thực tế và có thể mở rộng thêm các tính năng trong tương lai.

---

**Tài liệu này là báo cáo tổng hợp đầy đủ theo yêu cầu của bài tập lớn.**

