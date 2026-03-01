-- Script kiểm tra schema sau khi chạy orders_schema_bth4.sql

-- Kiểm tra bảng orders
DESCRIBE orders;

-- Kiểm tra bảng order_items
DESCRIBE order_items;

-- Kiểm tra dữ liệu mẫu
SELECT 
    id, 
    customer_name, 
    customer_email, 
    total_amount, 
    status,
    created_at,
    updated_at
FROM orders 
LIMIT 5;

-- Kiểm tra order_items mẫu
SELECT 
    id,
    order_id,
    product_id,
    product_name,
    quantity,
    unit_price,
    total_price
FROM order_items 
LIMIT 5;

