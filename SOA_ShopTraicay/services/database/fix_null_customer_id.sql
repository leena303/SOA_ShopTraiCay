-- Script để cập nhật customer_id cho các đơn hàng có customer_id = NULL
-- Dựa vào customer_email để map với users table

-- Bước 1: Xem các đơn hàng cần cập nhật và user tương ứng (nếu có)
SELECT 
    o.id as order_id,
    o.customer_id,
    o.customer_email,
    o.customer_name,
    u.IdUser as user_id,
    u.UserName as user_username,
    u.email as user_email,
    CASE 
        WHEN LOWER(o.customer_email) = LOWER(u.email) THEN 'MATCH BY EMAIL'
        WHEN LOWER(o.customer_email) = LOWER(u.UserName) THEN 'MATCH BY USERNAME'
        WHEN o.customer_name = u.UserName THEN 'MATCH BY NAME'
        ELSE 'NO MATCH'
    END as match_type
FROM orders o
LEFT JOIN users u ON (
    LOWER(o.customer_email) = LOWER(COALESCE(u.email, u.UserName))
    OR LOWER(o.customer_name) = LOWER(u.UserName)
)
WHERE o.customer_id IS NULL
ORDER BY o.created_at DESC;

-- Bước 2: Cập nhật customer_id cho các đơn hàng dựa vào email (exact match)
UPDATE orders o
INNER JOIN users u ON LOWER(o.customer_email) = LOWER(COALESCE(u.email, u.UserName))
SET o.customer_id = u.IdUser
WHERE o.customer_id IS NULL;

-- Bước 3: Cập nhật customer_id cho các đơn hàng dựa vào customer_name = username (nếu email không match)
UPDATE orders o
INNER JOIN users u ON LOWER(o.customer_name) = LOWER(u.UserName)
SET o.customer_id = u.IdUser
WHERE o.customer_id IS NULL;

-- Bước 4: Kiểm tra kết quả - xem các đơn hàng còn customer_id = NULL
SELECT 
    id,
    customer_id,
    customer_email,
    customer_name,
    order_number,
    created_at
FROM orders
WHERE customer_id IS NULL
ORDER BY created_at DESC;

-- Bước 5: Xem tất cả đơn hàng đã có customer_id
SELECT 
    o.id,
    o.customer_id,
    o.customer_email,
    o.customer_name,
    u.UserName as user_username,
    u.email as user_email,
    o.order_number,
    o.status,
    o.created_at
FROM orders o
LEFT JOIN users u ON o.customer_id = u.IdUser
WHERE o.customer_id IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 20;

