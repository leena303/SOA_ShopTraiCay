-- Script để cập nhật customer_id cho các đơn hàng có customer_id = NULL
-- Dựa vào customer_email để map với users table

-- Bước 1: Xem các đơn hàng cần cập nhật
SELECT 
    o.id,
    o.customer_id,
    o.customer_email,
    u.IdUser as user_id,
    u.email as user_email,
    u.UserName as username
FROM orders o
LEFT JOIN users u ON LOWER(o.customer_email) = LOWER(COALESCE(u.email, u.UserName))
WHERE o.customer_id IS NULL
ORDER BY o.created_at DESC;

-- Bước 2: Cập nhật customer_id cho các đơn hàng dựa vào email
UPDATE orders o
INNER JOIN users u ON LOWER(o.customer_email) = LOWER(COALESCE(u.email, u.UserName))
SET o.customer_id = u.IdUser
WHERE o.customer_id IS NULL;

-- Bước 3: Kiểm tra kết quả
SELECT 
    id,
    customer_id,
    customer_email,
    customer_name,
    order_number,
    created_at
FROM orders
WHERE customer_id IS NOT NULL
ORDER BY created_at DESC;

