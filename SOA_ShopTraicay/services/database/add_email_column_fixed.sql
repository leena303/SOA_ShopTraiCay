-- Thêm cột email vào bảng users (Script đã sửa - không dùng IF NOT EXISTS)
-- Chạy từng lệnh một trong phpMyAdmin hoặc MySQL

-- Bước 1: Kiểm tra xem cột email đã tồn tại chưa
-- Chạy lệnh này trước để xem cấu trúc bảng:
-- DESCRIBE users;

-- Bước 2: Thêm cột email (chỉ chạy nếu cột chưa tồn tại)
-- Nếu cột đã tồn tại, bỏ qua bước này
ALTER TABLE users 
ADD COLUMN email VARCHAR(255) NULL AFTER UserName;

-- Bước 3: Cập nhật email từ UserName cho các user hiện có
UPDATE users 
SET email = UserName 
WHERE email IS NULL OR email = '';

-- Bước 4: Tạo index cho email (chỉ chạy nếu index chưa tồn tại)
-- Nếu index đã tồn tại, bỏ qua bước này
CREATE INDEX idx_email ON users(email);

