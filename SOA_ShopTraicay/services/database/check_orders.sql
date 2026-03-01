-- Kiểm tra đơn hàng trong database
-- Chạy script này để xem có đơn hàng nào và customer_id có được lưu đúng không

-- Xem tất cả đơn hàng
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
LIMIT 20;

-- Xem đơn hàng có customer_id NULL
SELECT 
    o.id,
    o.customer_id,
    o.customer_name,
    o.customer_email,
    o.order_number,
    o.created_at
FROM orders o
WHERE o.customer_id IS NULL
ORDER BY o.created_at DESC;

-- Xem đơn hàng có customer_id
SELECT 
    o.id,
    o.customer_id,
    o.customer_name,
    o.customer_email,
    o.order_number,
    o.created_at
FROM orders o
WHERE o.customer_id IS NOT NULL
ORDER BY o.created_at DESC;

-- Xem users để so sánh
SELECT 
    IdUser as id,
    UserName as username,
    email,
    created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

