-- Script xác minh schema đã đúng yêu cầu Bài thực hành số 4

-- ============================================
-- KIỂM TRA BẢNG ORDERS
-- ============================================
SELECT '=== KIỂM TRA BẢNG ORDERS ===' as '';

-- Kiểm tra các cột bắt buộc
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'orders'
  AND COLUMN_NAME IN ('id', 'customer_name', 'customer_email', 'total_amount', 'status', 'created_at', 'updated_at')
ORDER BY ORDINAL_POSITION;

-- Kiểm tra dữ liệu mẫu
SELECT '=== DỮ LIỆU MẪU ORDERS ===' as '';
SELECT 
    id, 
    customer_name, 
    customer_email, 
    total_amount, 
    status,
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
    DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
FROM orders 
LIMIT 3;

-- ============================================
-- KIỂM TRA BẢNG ORDER_ITEMS
-- ============================================
SELECT '=== KIỂM TRA BẢNG ORDER_ITEMS ===' as '';

-- Kiểm tra các cột bắt buộc
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'order_items'
  AND COLUMN_NAME IN ('id', 'order_id', 'product_id', 'product_name', 'quantity', 'unit_price', 'total_price')
ORDER BY ORDINAL_POSITION;

-- Kiểm tra dữ liệu mẫu
SELECT '=== DỮ LIỆU MẪU ORDER_ITEMS ===' as '';
SELECT 
    id,
    order_id,
    product_id,
    product_name,
    quantity,
    unit_price,
    total_price
FROM order_items 
LIMIT 3;

-- ============================================
-- TỔNG KẾT
-- ============================================
SELECT '=== TỔNG KẾT ===' as '';

SELECT 
    'orders' as table_name,
    COUNT(*) as total_rows,
    COUNT(customer_name) as rows_with_customer_name,
    COUNT(customer_email) as rows_with_customer_email
FROM orders
UNION ALL
SELECT 
    'order_items' as table_name,
    COUNT(*) as total_rows,
    COUNT(product_name) as rows_with_product_name,
    COUNT(total_price) as rows_with_total_price
FROM order_items;

