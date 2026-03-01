-- Kiểm tra đơn hàng gần đây và thông tin user

-- 1. Xem tất cả đơn hàng gần đây (10 đơn hàng mới nhất)
SELECT 
    o.id,
    o.customer_id,
    o.customer_name,
    o.customer_email,
    o.order_number,
    o.total_amount,
    o.status,
    o.created_at
FROM orders o
ORDER BY o.created_at DESC
LIMIT 10;

-- 2. Xem tất cả users
SELECT 
    IdUser as id,
    UserName as username,
    email,
    created_at
FROM users
ORDER BY created_at DESC;

-- 3. So sánh customer_email trong orders với email/username trong users
SELECT 
    o.id as order_id,
    o.customer_id,
    o.customer_email as order_email,
    o.customer_name as order_name,
    u.IdUser as user_id,
    u.UserName as user_username,
    u.email as user_email,
    CASE 
        WHEN o.customer_id = u.IdUser THEN 'MATCH BY ID'
        WHEN LOWER(o.customer_email) = LOWER(u.email) THEN 'MATCH BY EMAIL'
        WHEN LOWER(o.customer_email) = LOWER(u.UserName) THEN 'MATCH BY USERNAME'
        ELSE 'NO MATCH'
    END as match_status
FROM orders o
LEFT JOIN users u ON (
    o.customer_id = u.IdUser 
    OR LOWER(o.customer_email) = LOWER(COALESCE(u.email, u.UserName))
)
ORDER BY o.created_at DESC
LIMIT 20;

-- 4. Đếm số đơn hàng theo customer_id
SELECT 
    customer_id,
    COUNT(*) as order_count,
    GROUP_CONCAT(id ORDER BY created_at DESC) as order_ids
FROM orders
GROUP BY customer_id
ORDER BY order_count DESC;

-- 5. Đếm số đơn hàng có customer_id = NULL
SELECT 
    COUNT(*) as orders_with_null_customer_id
FROM orders
WHERE customer_id IS NULL;

