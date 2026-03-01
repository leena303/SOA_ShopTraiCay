-- Script để xử lý các đơn hàng có customer_email = 'ntlehuyen2k4@gmail.com'
-- Có 2 cách: Tạo user mới hoặc cập nhật customer_id thủ công

-- CÁCH 1: Tạo user mới với email/username khớp với đơn hàng
-- (Chỉ chạy nếu chưa có user này)
INSERT INTO users (UserName, email, password, created_at)
SELECT 
    'ntlehuyen2k4' as UserName,
    'ntlehuyen2k4@gmail.com' as email,
    '$2b$10$dummy' as password,  -- Password mặc định (user sẽ cần reset)
    NOW() as created_at
WHERE NOT EXISTS (
    SELECT 1 FROM users 
    WHERE LOWER(UserName) = 'ntlehuyen2k4' 
    OR LOWER(email) = 'ntlehuyen2k4@gmail.com'
);

-- CÁCH 2: Cập nhật customer_id cho các đơn hàng dựa vào user vừa tạo
UPDATE orders o
INNER JOIN users u ON (
    LOWER(u.email) = 'ntlehuyen2k4@gmail.com' 
    OR LOWER(u.UserName) = 'ntlehuyen2k4'
)
SET o.customer_id = u.IdUser
WHERE o.customer_id IS NULL 
  AND o.customer_email = 'ntlehuyen2k4@gmail.com';

-- Kiểm tra kết quả
SELECT 
    o.id,
    o.customer_id,
    o.customer_email,
    o.customer_name,
    u.IdUser as user_id,
    u.UserName as user_username,
    u.email as user_email,
    o.order_number,
    o.status,
    o.created_at
FROM orders o
LEFT JOIN users u ON o.customer_id = u.IdUser
WHERE o.customer_email = 'ntlehuyen2k4@gmail.com'
ORDER BY o.created_at DESC;

-- NẾU BẠN MUỐN GÁN CÁC ĐƠN HÀNG NÀY CHO USER KHÁC (ví dụ: user ID = 5)
-- Thay vì tạo user mới, bạn có thể chạy:
-- UPDATE orders 
-- SET customer_id = 5  -- Thay 5 bằng ID của user bạn muốn
-- WHERE customer_id IS NULL 
--   AND customer_email = 'ntlehuyen2k4@gmail.com';

