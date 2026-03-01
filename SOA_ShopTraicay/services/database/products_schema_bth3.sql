-- Schema cập nhật cho bảng Products - Bài thực hành số 3
-- Yêu cầu: id, name, description, price, quantity, created_at, updated_at

-- Kiểm tra và thêm cột quantity nếu chưa có
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 0 AFTER unit_price;

-- Thêm cột price nếu chưa có (hoặc đổi unit_price thành price)
-- Nếu muốn giữ cả 2 cột, bỏ comment dòng dưới
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) AFTER description;

-- Nếu muốn đổi tên unit_price thành price, chạy lệnh sau:
-- ALTER TABLE products CHANGE unit_price price DECIMAL(10,2);

-- Mở rộng cột name từ VARCHAR(100) lên VARCHAR(255)
ALTER TABLE products MODIFY name VARCHAR(255) NOT NULL;

-- Cập nhật price từ unit_price nếu cột price chưa có dữ liệu
-- UPDATE products SET price = unit_price WHERE price IS NULL OR price = 0;

-- Tạo index cho quantity nếu cần
CREATE INDEX IF NOT EXISTS idx_products_quantity ON products(quantity);

-- Kiểm tra schema
-- DESCRIBE products;

-- Schema mong muốn:
-- id INT PRIMARY KEY ✅
-- name VARCHAR(255) ✅
-- description TEXT ✅
-- price DECIMAL(10,2) - cần đổi từ unit_price hoặc thêm mới
-- quantity INT ✅
-- created_at TIMESTAMP ✅
-- updated_at TIMESTAMP ✅

