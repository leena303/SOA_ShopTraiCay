-- Thêm cột email vào bảng users
-- Cho phép lưu email riêng biệt với UserName
-- Chạy script này trong MySQL/phpMyAdmin

-- Thêm cột email (bỏ qua lỗi nếu cột đã tồn tại)
ALTER TABLE users 
ADD COLUMN email VARCHAR(255) NULL AFTER UserName;

-- Cập nhật email từ UserName cho các user hiện có (nếu chưa có email)
UPDATE users 
SET email = UserName 
WHERE email IS NULL OR email = '';

-- Tạo index cho email để tìm kiếm nhanh hơn (bỏ qua lỗi nếu index đã tồn tại)
CREATE INDEX idx_email ON users(email);
