-- Script để cập nhật customer_email trong orders dựa vào username
-- Nếu customer_email không khớp với bất kỳ user nào, có thể cần cập nhật thủ công

-- 1. Xem mapping hiện tại
SELECT 
    o.id as order_id,
    o.customer_email as order_email,
    o.customer_name,
    u.UserName as user_username,
    u.email as user_email,
    u.IdUser as user_id
FROM orders o
LEFT JOIN users u ON (
    LOWER(o.customer_email) = LOWER(u.email) 
    OR LOWER(o.customer_email) = LOWER(u.UserName)
    OR LOWER(o.customer_name) = LOWER(u.UserName)
)
WHERE o.customer_id IS NULL
ORDER BY o.created_at DESC;

-- 2. Nếu "user@gmail.com" tương ứng với username "user1" hoặc "admin"
-- Có thể cập nhật thủ công:
-- UPDATE orders SET customer_email = 'admin' WHERE customer_email = 'user@gmail.com' AND customer_id IS NULL;
-- UPDATE orders SET customer_email = 'ntlehuyen2k4@gmail.com' WHERE customer_email = 'ntlehuyen2k4@gmail.com' AND customer_id IS NULL;

-- 3. Hoặc cập nhật customer_email = username nếu customer_name khớp với username
UPDATE orders o
INNER JOIN users u ON LOWER(o.customer_name) = LOWER(u.UserName)
SET o.customer_email = u.UserName
WHERE o.customer_id IS NULL 
  AND o.customer_email NOT IN (SELECT UserName FROM users)
  AND o.customer_email NOT IN (SELECT email FROM users WHERE email IS NOT NULL);

-- 4. Sau đó cập nhật customer_id
UPDATE orders o
INNER JOIN users u ON (
    LOWER(o.customer_email) = LOWER(u.UserName)
    OR LOWER(o.customer_email) = LOWER(COALESCE(u.email, u.UserName))
)
SET o.customer_id = u.IdUser
WHERE o.customer_id IS NULL;

