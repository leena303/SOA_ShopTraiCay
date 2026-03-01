-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 26, 2025 at 01:17 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fruit_store_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Táo', 'Các loại táo', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(2, 'Cam', 'Các loại cam', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(3, 'Chuối', 'Các loại chuối', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(4, 'Nho', 'Các loại nho', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(5, 'Dưa', 'Các loại dưa', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(6, 'Xoài', 'Các loại xoài', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(7, 'Ổi', 'Các loại ổi', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(8, 'Thanh long', 'Các loại thanh long', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(9, 'Mãng cầu', 'Các loại mãng cầu', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `address`, `created_at`, `updated_at`) VALUES
(1, 'Nguyễn Văn An', 'nguyenvanan@example.com', '0912345678', '123 Đường Lê Lợi, Quận 1, TP.HCM', '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(2, 'Trần Thị Bình', 'tranthibinh@example.com', '0923456789', '456 Đường Nguyễn Huệ, Quận 1, TP.HCM', '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(3, 'Lê Văn Cường', 'levancuong@example.com', '0934567890', '789 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(4, 'Phạm Thị Dung', 'phamthidung@example.com', '0945678901', '321 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM', '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(5, 'Hoàng Văn Em', 'hoangvanem@example.com', '0956789012', '654 Đường Võ Văn Tần, Quận 3, TP.HCM', '2025-11-26 00:45:58', '2025-11-26 00:45:58');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `min_stock_level` decimal(10,2) DEFAULT '0.00',
  `max_stock_level` decimal(10,2) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `last_restocked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product` (`product_id`),
  KEY `idx_inventory_product` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `product_id`, `quantity`, `min_stock_level`, `max_stock_level`, `location`, `last_restocked_at`, `created_at`, `updated_at`) VALUES
(1, 1, 198.00, 20.00, 200.00, 'Kho A - Kệ 1', '2025-11-26 00:45:59', '2025-11-26 00:45:58', '2025-11-26 00:45:59'),
(2, 2, 119.00, 15.00, 180.00, 'Kho A - Kệ 1', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:59'),
(3, 3, 298.00, 30.00, 300.00, 'Kho A - Kệ 2', '2025-11-26 00:45:59', '2025-11-26 00:45:58', '2025-11-26 00:45:59'),
(4, 4, 79.00, 10.00, 150.00, 'Kho A - Kệ 2', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:59'),
(5, 5, 49.00, 5.00, 100.00, 'Kho B - Kệ 3', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(6, 6, 40.00, 5.00, 80.00, 'Kho B - Kệ 3', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(7, 7, 58.00, 10.00, 100.00, 'Kho B - Kệ 4', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(8, 8, 54.00, 10.00, 100.00, 'Kho B - Kệ 4', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(9, 9, 498.00, 50.00, 500.00, 'Kho C - Kệ 5', '2025-11-26 00:45:59', '2025-11-26 00:45:58', '2025-11-26 00:45:59'),
(10, 10, 99.00, 15.00, 200.00, 'Kho C - Kệ 5', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:59'),
(11, 11, 88.00, 10.00, 150.00, 'Kho C - Kệ 6', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(12, 12, 108.00, 15.00, 200.00, 'Kho C - Kệ 6', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(13, 13, 129.00, 20.00, 250.00, 'Kho D - Kệ 7', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:59'),
(14, 14, 95.00, 15.00, 180.00, 'Kho D - Kệ 7', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(15, 15, 70.00, 10.00, 120.00, 'Kho D - Kệ 8', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transactions`
--

DROP TABLE IF EXISTS `inventory_transactions`;
CREATE TABLE IF NOT EXISTS `inventory_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `transaction_type` enum('in','out','adjustment') NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` int DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_transaction_product` (`product_id`),
  KEY `idx_transaction_date` (`created_at`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory_transactions`
--

INSERT INTO `inventory_transactions` (`id`, `product_id`, `transaction_type`, `quantity`, `reference_type`, `reference_id`, `notes`, `created_at`) VALUES
(1, 1, 'out', 2.00, 'order', 1, 'Xuất kho cho đơn hàng ORD-20240101-001', '2025-11-26 00:45:59'),
(2, 5, 'out', 1.00, 'order', 1, 'Xuất kho cho đơn hàng ORD-20240101-001', '2025-11-26 00:45:59'),
(3, 7, 'out', 2.00, 'order', 2, 'Xuất kho cho đơn hàng ORD-20240101-002', '2025-11-26 00:45:59'),
(4, 8, 'out', 1.00, 'order', 2, 'Xuất kho cho đơn hàng ORD-20240101-002', '2025-11-26 00:45:59'),
(5, 3, 'out', 2.00, 'order', 3, 'Xuất kho cho đơn hàng ORD-20240102-001', '2025-11-26 00:45:59'),
(6, 9, 'out', 2.00, 'order', 3, 'Xuất kho cho đơn hàng ORD-20240102-001', '2025-11-26 00:45:59'),
(7, 11, 'out', 2.00, 'order', 4, 'Xuất kho cho đơn hàng ORD-20240102-002', '2025-11-26 00:45:59'),
(8, 12, 'out', 2.00, 'order', 4, 'Xuất kho cho đơn hàng ORD-20240102-002', '2025-11-26 00:45:59'),
(9, 13, 'out', 1.00, 'order', 4, 'Xuất kho cho đơn hàng ORD-20240102-002', '2025-11-26 00:45:59'),
(10, 2, 'out', 1.00, 'order', 5, 'Xuất kho cho đơn hàng ORD-20240103-001', '2025-11-26 00:45:59'),
(11, 4, 'out', 1.00, 'order', 5, 'Xuất kho cho đơn hàng ORD-20240103-001', '2025-11-26 00:45:59'),
(12, 10, 'out', 1.00, 'order', 5, 'Xuất kho cho đơn hàng ORD-20240103-001', '2025-11-26 00:45:59'),
(13, 1, 'in', 50.00, NULL, NULL, 'Nhập hàng mới từ nhà cung cấp', '2025-11-26 00:45:59'),
(14, 3, 'in', 100.00, NULL, NULL, 'Nhập hàng mới từ nhà cung cấp', '2025-11-26 00:45:59'),
(15, 9, 'in', 200.00, NULL, NULL, 'Nhập hàng mới từ nhà cung cấp', '2025-11-26 00:45:59');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `order_number` varchar(50) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','paid','refunded') DEFAULT 'pending',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_order_status` (`status`),
  KEY `idx_order_customer` (`customer_id`),
  KEY `idx_order_date` (`created_at`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `order_number`, `total_amount`, `status`, `payment_method`, `payment_status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 'ORD-20240101-001', 195000.00, 'completed', 'cash', 'paid', 'Giao hàng buổi sáng', '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(2, 2, 'ORD-20240101-002', 320000.00, 'completed', 'cash', 'paid', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(3, 3, 'ORD-20240102-001', 150000.00, 'processing', 'cash', 'pending', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(4, 4, 'ORD-20240102-002', 225000.00, 'pending', 'cash', 'pending', 'Giao hàng chiều', '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(5, 5, 'ORD-20240103-001', 180000.00, 'completed', 'cash', 'paid', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`, `created_at`) VALUES
(1, 1, 1, 2.00, 85000.00, 170000.00, '2025-11-26 00:45:58'),
(2, 1, 5, 1.00, 25000.00, 25000.00, '2025-11-26 00:45:58'),
(3, 2, 7, 2.00, 120000.00, 240000.00, '2025-11-26 00:45:58'),
(4, 2, 8, 1.00, 110000.00, 110000.00, '2025-11-26 00:45:58'),
(5, 3, 3, 2.00, 45000.00, 90000.00, '2025-11-26 00:45:58'),
(6, 3, 9, 2.00, 35000.00, 70000.00, '2025-11-26 00:45:58'),
(7, 4, 11, 2.00, 60000.00, 120000.00, '2025-11-26 00:45:58'),
(8, 4, 12, 2.00, 40000.00, 80000.00, '2025-11-26 00:45:58'),
(9, 4, 13, 1.00, 30000.00, 30000.00, '2025-11-26 00:45:58'),
(10, 5, 2, 1.00, 75000.00, 75000.00, '2025-11-26 00:45:58'),
(11, 5, 4, 1.00, 65000.00, 65000.00, '2025-11-26 00:45:58'),
(12, 5, 10, 1.00, 55000.00, 55000.00, '2025-11-26 00:45:58');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `payment_date` timestamp NULL DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payment_order` (`order_id`),
  KEY `idx_payment_status` (`status`),
  KEY `idx_payment_date` (`payment_date`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `status`, `payment_date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 195000.00, 'completed', '2025-11-26 00:45:59', 'Thanh toán tiền mặt cho đơn hàng ORD-20240101-001', '2025-11-26 00:45:59', '2025-11-26 00:45:59'),
(2, 2, 320000.00, 'completed', '2025-11-26 00:45:59', 'Thanh toán tiền mặt cho đơn hàng ORD-20240101-002', '2025-11-26 00:45:59', '2025-11-26 00:45:59'),
(3, 3, 150000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-20240102-001', '2025-11-26 00:45:59', '2025-11-26 00:45:59'),
(4, 4, 225000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-20240102-002', '2025-11-26 00:45:59', '2025-11-26 00:45:59'),
(5, 5, 180000.00, 'completed', '2025-11-26 00:45:59', 'Thanh toán tiền mặt cho đơn hàng ORD-20240103-001', '2025-11-26 00:45:59', '2025-11-26 00:45:59');

-- --------------------------------------------------------

--
-- Table structure for table `payment_history`
--

DROP TABLE IF EXISTS `payment_history`;
CREATE TABLE IF NOT EXISTS `payment_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_id` int NOT NULL,
  `status_from` enum('pending','completed','cancelled') DEFAULT NULL,
  `status_to` enum('pending','completed','cancelled') NOT NULL,
  `changed_by` varchar(100) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payment_history_payment` (`payment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `category` varchar(50) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `unit` varchar(20) DEFAULT 'kg',
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_category` (`category`),
  KEY `idx_product_category_id` (`category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `category`, `category_id`, `unit_price`, `unit`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Táo đỏ Mỹ', 'Táo đỏ Mỹ tươi ngon, giòn ngọt', 'Táo', 1, 85000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(2, 'Táo xanh', 'Táo xanh giòn, vị chua ngọt', 'Táo', 1, 75000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(3, 'Cam sành', 'Cam sành Việt Nam, nhiều nước', 'Cam', 2, 45000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(4, 'Cam vàng', 'Cam vàng nhập khẩu, ngọt thanh', 'Cam', 2, 65000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(5, 'Chuối tiêu', 'Chuối tiêu chín vàng, thơm ngon', 'Chuối', 3, 25000.00, 'nải', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(6, 'Chuối tây', 'Chuối tây to, ngọt', 'Chuối', 3, 30000.00, 'nải', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(7, 'Nho đỏ', 'Nho đỏ không hạt, ngọt', 'Nho', 4, 120000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(8, 'Nho xanh', 'Nho xanh giòn, vị thanh', 'Nho', 4, 110000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(9, 'Dưa hấu', 'Dưa hấu đỏ, mát lạnh', 'Dưa', 5, 35000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(10, 'Dưa lưới', 'Dưa lưới vàng, thơm ngọt', 'Dưa', 5, 55000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(11, 'Xoài cát', 'Xoài cát Hòa Lộc, thơm ngọt', 'Xoài', 6, 60000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(12, 'Xoài tứ quý', 'Xoài tứ quý, vị chua ngọt', 'Xoài', 6, 40000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(13, 'Ổi', 'Ổi giòn, ngọt thanh', 'Ổi', 7, 30000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(14, 'Thanh long', 'Thanh long ruột đỏ, ngọt mát', 'Thanh long', 8, 45000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(15, 'Mãng cầu', 'Mãng cầu dai, ngọt', 'Mãng cầu', 9, 50000.00, 'kg', NULL, 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
