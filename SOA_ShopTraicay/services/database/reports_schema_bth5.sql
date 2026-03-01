-- Schema cho bảng Reports - Bài thực hành số 5
-- Yêu cầu: orders_reports (id, order_id, total_revenue, total_cost, total_profit)
-- Yêu cầu: product_reports (id, order_report_id, product_id, total_sold, revenue, cost, profit)

-- ============================================
-- TẠO BẢNG ORDERS_REPORTS
-- ============================================

CREATE TABLE IF NOT EXISTS orders_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    total_revenue DECIMAL(10, 2) DEFAULT 0.00,
    total_cost DECIMAL(10, 2) DEFAULT 0.00,
    total_profit DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TẠO BẢNG PRODUCT_REPORTS
-- ============================================

CREATE TABLE IF NOT EXISTS product_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_report_id INT NOT NULL,
    product_id INT NOT NULL,
    total_sold INT DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0.00,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    profit DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_report_id (order_report_id),
    INDEX idx_product_id (product_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (order_report_id) REFERENCES orders_reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- KIỂM TRA SCHEMA
-- ============================================

-- DESCRIBE orders_reports;
-- DESCRIBE product_reports;

-- Schema mong muốn:
-- orders_reports:
--   id INT PRIMARY KEY ✅
--   order_id INT ✅
--   total_revenue DECIMAL(10,2) ✅
--   total_cost DECIMAL(10,2) ✅
--   total_profit DECIMAL(10,2) ✅
--
-- product_reports:
--   id INT PRIMARY KEY ✅
--   order_report_id INT ✅
--   product_id INT ✅
--   total_sold INT ✅
--   revenue DECIMAL(10,2) ✅
--   cost DECIMAL(10,2) ✅
--   profit DECIMAL(10,2) ✅

