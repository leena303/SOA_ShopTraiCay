-- Schema cập nhật cho bảng Orders và Order Items - Bài thực hành số 4
-- Yêu cầu: orders (id, customer_name, customer_email, total_amount, status, created_at, updated_at)
-- Yêu cầu: order_items (id, order_id, product_id, product_name, quantity, unit_price, total_price)

-- ============================================
-- CẬP NHẬT BẢNG ORDERS
-- ============================================

-- Thêm cột customer_name nếu chưa có
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255) AFTER customer_id;

-- Thêm cột customer_email nếu chưa có
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255) AFTER customer_name;

-- Cập nhật customer_name và customer_email từ bảng customers (nếu có)
UPDATE orders o
INNER JOIN customers c ON o.customer_id = c.id
SET o.customer_name = c.name,
    o.customer_email = c.email
WHERE o.customer_name IS NULL OR o.customer_email IS NULL;

-- Đổi status từ ENUM sang VARCHAR(50) nếu cần
-- ALTER TABLE orders MODIFY status VARCHAR(50) DEFAULT 'pending';

-- ============================================
-- CẬP NHẬT BẢNG ORDER_ITEMS
-- ============================================

-- Thêm cột product_name nếu chưa có
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS product_name VARCHAR(255) AFTER product_id;

-- Thêm cột total_price nếu chưa có (giữ subtotal để tương thích)
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2) AFTER unit_price;

-- Cập nhật product_name từ bảng products
UPDATE order_items oi
INNER JOIN products p ON oi.product_id = p.id
SET oi.product_name = p.name
WHERE oi.product_name IS NULL;

-- Cập nhật total_price từ subtotal (nếu chưa có)
UPDATE order_items 
SET total_price = subtotal 
WHERE total_price IS NULL OR total_price = 0;

-- Đổi quantity từ DECIMAL sang INT nếu cần (tùy chọn)
-- ALTER TABLE order_items MODIFY quantity INT;

-- Tạo index cho product_name nếu cần (bỏ qua nếu lỗi key length)
-- CREATE INDEX IF NOT EXISTS idx_order_items_product_name ON order_items(product_name);
-- Lưu ý: Index có thể bị lỗi "key too long" với VARCHAR(255), có thể bỏ qua hoặc dùng prefix
-- CREATE INDEX idx_order_items_product_name ON order_items(product_name(100));

-- Kiểm tra schema
-- DESCRIBE orders;
-- DESCRIBE order_items;

-- Schema mong muốn:
-- orders:
--   id INT PRIMARY KEY ✅
--   customer_name VARCHAR(255) ✅
--   customer_email VARCHAR(255) ✅
--   total_amount DECIMAL(10,2) ✅
--   status VARCHAR(50) ✅
--   created_at TIMESTAMP ✅
--   updated_at TIMESTAMP ✅
--
-- order_items:
--   id INT PRIMARY KEY ✅
--   order_id INT ✅
--   product_id INT ✅
--   product_name VARCHAR(255) ✅
--   quantity INT ✅
--   unit_price DECIMAL(10,2) ✅
--   total_price DECIMAL(10,2) ✅

