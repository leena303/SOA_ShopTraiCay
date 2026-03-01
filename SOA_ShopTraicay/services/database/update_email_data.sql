-- Cập nhật email cho các user hiện có
-- Chạy lệnh này nếu cột email đã tồn tại

-- Cập nhật email từ UserName cho các user hiện có (nếu chưa có email)
UPDATE users 
SET email = UserName 
WHERE email IS NULL OR email = '';

-- Tạo index cho email (bỏ qua nếu index đã tồn tại)
-- Nếu gặp lỗi "Duplicate key name", nghĩa là index đã tồn tại, bỏ qua lệnh này
CREATE INDEX idx_email ON users(email);

