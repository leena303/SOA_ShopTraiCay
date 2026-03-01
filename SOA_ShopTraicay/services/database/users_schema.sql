-- Bảng Users cho bài thực hành số 2
-- Router, Middleware và bảo mật với JWT

CREATE TABLE IF NOT EXISTS users (
    IdUser INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Token VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo index cho UserName để tìm kiếm nhanh hơn
CREATE INDEX idx_username ON users(UserName);

-- Tạo index cho Token để xác thực nhanh hơn
CREATE INDEX idx_token ON users(Token);

-- Thêm dữ liệu mẫu để test
-- Password: "123456" đã được mã hóa MD5 = "e10adc3949ba59abbe56e057f20f883e"
-- Hoặc base64: "MTIzNDU2" (decode = "123456")
INSERT INTO users (UserName, Password) VALUES 
('admin', 'e10adc3949ba59abbe56e057f20f883e'),
('user1', 'e10adc3949ba59abbe56e057f20f883e'),
('test', 'e10adc3949ba59abbe56e057f20f883e')
ON DUPLICATE KEY UPDATE UserName=UserName;

