-- Script debug để kiểm tra đơn hàng và user
-- Chạy script này để xem có đơn hàng nào và customer_id có khớp không

-- 1. Xem tất cả đơn hàng (giới hạn 10 đơn mới nhất)
SELECT 
    o.id,
    o.customer_id,
    o.customer_name,
    o.customer_email,
    o.order_number,
    o.total_amount,
    o.status,
    o.created_at,
    (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
FROM orders o
ORDER BY o.created_at DESC
LIMIT 10;

-- 2. Xem users để so sánh
SELECT 
    IdUser as id,
    UserName as username,
    email,
    created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- 3. Kiểm tra đơn hàng có customer_id NULL
SELECT COUNT(*) as orders_without_customer_id
FROM orders
WHERE customer_id IS NULL;

-- 4. Kiểm tra đơn hàng có customer_id
SELECT COUNT(*) as orders_with_customer_id
FROM orders
WHERE customer_id IS NOT NULL;

-- 5. Xem chi tiết đơn hàng và user để so sánh
SELECT 
    o.id as order_id,
    o.customer_id as order_customer_id,
    o.customer_email as order_email,
    u.IdUser as user_id,
    u.UserName as user_username,
    u.email as user_email,
    CASE 
        WHEN o.customer_id = u.IdUser THEN 'MATCH BY ID'
        WHEN LOWER(o.customer_email) = LOWER(COALESCE(u.email, u.UserName)) THEN 'MATCH BY EMAIL'
        ELSE 'NO MATCH'
    END as match_status
FROM orders o
CROSS JOIN users u
WHERE o.customer_id IS NOT NULL OR o.customer_email IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 20;

