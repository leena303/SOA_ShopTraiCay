-- Kiểm tra users và orders để tìm mapping

-- 1. Xem tất cả users
SELECT 
    IdUser as id,
    UserName as username,
    email,
    created_at
FROM users
ORDER BY created_at DESC;

-- 2. Xem các email duy nhất trong orders
SELECT DISTINCT 
    customer_email,
    COUNT(*) as order_count
FROM orders
WHERE customer_id IS NULL
GROUP BY customer_email;

-- 3. So sánh email trong orders với users
SELECT 
    o.customer_email as order_email,
    COUNT(o.id) as order_count,
    GROUP_CONCAT(DISTINCT u.UserName) as matching_usernames,
    GROUP_CONCAT(DISTINCT u.email) as matching_emails,
    GROUP_CONCAT(DISTINCT u.IdUser) as matching_user_ids
FROM orders o
LEFT JOIN users u ON (
    LOWER(o.customer_email) = LOWER(u.email) 
    OR LOWER(o.customer_email) = LOWER(u.UserName)
)
WHERE o.customer_id IS NULL
GROUP BY o.customer_email;

-- 4. Nếu cần, có thể cập nhật thủ công dựa vào email cụ thể
-- Ví dụ: nếu "user@gmail.com" là username "user" trong users table
-- UPDATE orders SET customer_id = (SELECT IdUser FROM users WHERE UserName = 'user' LIMIT 1) 
-- WHERE customer_email = 'user@gmail.com' AND customer_id IS NULL;

