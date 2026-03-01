-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 03:14 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Táo', 'Các loại táo', 0, '2025-11-26 00:45:58', '2025-11-28 03:00:55'),
(4, 'Nho', 'Các loại nho', 0, '2025-11-26 00:45:58', '2025-11-28 02:41:19'),
(5, 'Dưa', 'Các loại dưa', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(6, 'Xoài', 'Các loại xoài', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(7, 'Ổi', 'Các loại ổi', 0, '2025-11-26 00:45:58', '2025-11-28 03:01:00'),
(8, 'Thanh long', 'Các loại thanh long', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(9, 'Mãng cầu', 'Các loại mãng cầu', 1, '2025-11-26 00:45:58', '2025-11-26 00:45:58');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `min_stock_level` decimal(10,2) DEFAULT 0.00,
  `max_stock_level` decimal(10,2) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `last_restocked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `product_id`, `quantity`, `min_stock_level`, `max_stock_level`, `location`, `last_restocked_at`, `created_at`, `updated_at`) VALUES
(1, 1, 200.00, 20.00, 200.00, 'Kho A - Kệ 1', '2025-11-27 17:35:57', '2025-11-26 00:45:58', '2025-11-27 17:35:57'),
(2, 2, 106.00, 15.00, 180.00, 'Kho A - Kệ 1', '2025-11-30 04:53:52', '2025-11-26 00:45:58', '2025-11-30 04:55:11'),
(3, 3, 291.00, 30.00, 300.00, 'Kho A - Kệ 2', '2025-11-30 11:13:03', '2025-11-26 00:45:58', '2025-11-30 11:13:03'),
(4, 4, 75.00, 10.00, 150.00, 'Kho A - Kệ 2', '2025-11-30 11:13:03', '2025-11-26 00:45:58', '2025-11-30 11:13:03'),
(5, 5, 49.00, 5.00, 100.00, 'Kho B - Kệ 3', '2025-11-30 04:53:52', '2025-11-26 00:45:58', '2025-11-30 04:53:52'),
(6, 6, 40.00, 5.00, 80.00, 'Kho B - Kệ 3', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(7, 7, 59.00, 10.00, 100.00, 'Kho B - Kệ 4', '2025-11-30 09:40:11', '2025-11-26 00:45:58', '2025-11-30 09:40:11'),
(8, 8, 51.00, 10.00, 100.00, 'Kho B - Kệ 4', '2025-11-27 17:36:12', '2025-11-26 00:45:58', '2025-11-28 04:48:21'),
(9, 9, 498.00, 50.00, 500.00, 'Kho C - Kệ 5', '2025-11-30 04:53:52', '2025-11-26 00:45:58', '2025-11-30 04:53:52'),
(10, 10, 99.00, 15.00, 200.00, 'Kho C - Kệ 5', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:59'),
(11, 11, 90.00, 10.00, 150.00, 'Kho C - Kệ 6', '2025-11-28 02:55:04', '2025-11-26 00:45:58', '2025-11-28 02:55:04'),
(12, 12, 110.00, 15.00, 200.00, 'Kho C - Kệ 6', '2025-11-28 02:55:04', '2025-11-26 00:45:58', '2025-11-28 02:55:04'),
(13, 13, 130.00, 20.00, 250.00, 'Kho D - Kệ 7', '2025-11-28 02:55:04', '2025-11-26 00:45:58', '2025-11-28 02:55:04'),
(14, 14, 95.00, 15.00, 180.00, 'Kho D - Kệ 7', NULL, '2025-11-26 00:45:58', '2025-11-26 00:45:58'),
(15, 15, 69.00, 10.00, 120.00, 'Kho D - Kệ 8', NULL, '2025-11-26 00:45:58', '2025-11-28 04:20:24');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transactions`
--

CREATE TABLE `inventory_transactions` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `transaction_type` enum('in','out','adjustment') NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(15, 9, 'in', 200.00, NULL, NULL, 'Nhập hàng mới từ nhà cung cấp', '2025-11-26 00:45:59'),
(16, 1, 'in', 200.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-20240101-001', '2025-11-27 17:35:57'),
(17, 5, 'in', 50.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-20240101-001', '2025-11-27 17:35:57'),
(18, 7, 'in', 60.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-20240101-002', '2025-11-27 17:36:12'),
(19, 8, 'in', 55.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-20240101-002', '2025-11-27 17:36:12'),
(20, 11, 'in', 90.00, NULL, NULL, 'Hoàn trả từ đơn hàng ORD-20240102-002', '2025-11-28 02:55:04'),
(21, 12, 'in', 110.00, NULL, NULL, 'Hoàn trả từ đơn hàng ORD-20240102-002', '2025-11-28 02:55:04'),
(22, 13, 'in', 130.00, NULL, NULL, 'Hoàn trả từ đơn hàng ORD-20240102-002', '2025-11-28 02:55:04'),
(23, 2, 'out', 117.00, 'order', 6, 'Xuất kho cho đơn hàng ORD-1764301265782-74', '2025-11-28 03:41:05'),
(24, 2, 'out', 116.00, 'order', 7, 'Xuất kho cho đơn hàng ORD-1764301310631-207', '2025-11-28 03:41:50'),
(25, 4, 'out', 78.00, 'order', 7, 'Xuất kho cho đơn hàng ORD-1764301310631-207', '2025-11-28 03:41:50'),
(26, 2, 'out', 115.00, 'order', 8, 'Xuất kho cho đơn hàng ORD-1764302945881-183', '2025-11-28 04:09:05'),
(27, 5, 'out', 49.00, 'order', 8, 'Xuất kho cho đơn hàng ORD-1764302945881-183', '2025-11-28 04:09:05'),
(28, 2, 'out', 114.00, 'order', 9, 'Xuất kho cho đơn hàng ORD-1764303327177-678', '2025-11-28 04:15:27'),
(29, 2, 'out', 113.00, 'order', 10, 'Xuất kho cho đơn hàng ORD-1764303623985-226', '2025-11-28 04:20:23'),
(30, 15, 'out', 69.00, 'order', 10, 'Xuất kho cho đơn hàng ORD-1764303623985-226', '2025-11-28 04:20:24'),
(31, 2, 'out', 112.00, 'order', 11, 'Xuất kho cho đơn hàng ORD-1764304257389-254', '2025-11-28 04:30:57'),
(32, 3, 'out', 297.00, 'order', 12, 'Xuất kho cho đơn hàng ORD-1764304420625-980', '2025-11-28 04:33:40'),
(33, 2, 'in', 113.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764304257389-254', '2025-11-28 04:47:03'),
(34, 7, 'out', 59.00, 'order', 13, 'Xuất kho cho đơn hàng ORD-1764305266628-121', '2025-11-28 04:47:46'),
(35, 8, 'out', 51.00, 'order', 14, 'Xuất kho cho đơn hàng ORD-1764305301215-649', '2025-11-28 04:48:21'),
(36, 2, 'out', 112.00, 'order', 15, 'Xuất kho cho đơn hàng ORD-1764305507728-292', '2025-11-28 04:51:47'),
(37, 3, 'in', 298.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764304420625-980', '2025-11-28 04:52:50'),
(38, 3, 'out', 297.00, 'order', 16, 'Xuất kho cho đơn hàng ORD-1764306587530-219', '2025-11-28 05:09:47'),
(39, 3, 'out', 296.00, 'order', 17, 'Xuất kho cho đơn hàng ORD-1764307081222-820', '2025-11-28 05:18:01'),
(40, 3, 'in', 297.00, NULL, NULL, 'Hoàn trả từ đơn hàng ORD-1764307081222-820', '2025-11-28 05:19:23'),
(41, 3, 'in', 298.00, NULL, NULL, 'Hoàn trả từ đơn hàng ORD-1764306587530-219', '2025-11-28 05:19:28'),
(42, 3, 'out', 297.00, 'order', 18, 'Xuất kho cho đơn hàng ORD-1764307205140-703', '2025-11-28 05:20:05'),
(43, 3, 'out', 296.00, 'order', 19, 'Xuất kho cho đơn hàng ORD-1764307254218-183', '2025-11-28 05:20:54'),
(44, 2, 'out', 111.00, 'order', 20, 'Xuất kho cho đơn hàng ORD-1764307865353-465', '2025-11-28 05:31:05'),
(45, 2, 'out', 110.00, 'order', 21, 'Xuất kho cho đơn hàng ORD-1764308143925-153', '2025-11-28 05:35:43'),
(46, 3, 'out', 295.00, 'order', 22, 'Xuất kho cho đơn hàng ORD-1764308255675-603', '2025-11-28 05:37:35'),
(47, 3, 'in', 296.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764308255675-603', '2025-11-28 05:37:46'),
(48, 2, 'out', 109.00, 'order', 23, 'Xuất kho cho đơn hàng ORD-1764308290501-644', '2025-11-28 05:38:10'),
(49, 3, 'out', 294.00, 'order', 24, 'Xuất kho cho đơn hàng ORD-1764309119830-698', '2025-11-28 05:51:59'),
(50, 2, 'out', 107.00, 'order', 24, 'Xuất kho cho đơn hàng ORD-1764309119830-698', '2025-11-28 05:51:59'),
(51, 9, 'out', 496.00, 'order', 25, 'Xuất kho cho đơn hàng ORD-1764320514011-198', '2025-11-28 09:01:54'),
(52, 2, 'out', 106.00, 'order', 25, 'Xuất kho cho đơn hàng ORD-1764320514011-198', '2025-11-28 09:01:54'),
(53, 3, 'out', 293.00, 'order', 25, 'Xuất kho cho đơn hàng ORD-1764320514011-198', '2025-11-28 09:01:54'),
(54, 5, 'out', 48.00, 'order', 25, 'Xuất kho cho đơn hàng ORD-1764320514011-198', '2025-11-28 09:01:54'),
(55, 9, 'in', 498.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764320514011-198', '2025-11-30 04:53:52'),
(56, 2, 'in', 107.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764320514011-198', '2025-11-30 04:53:52'),
(57, 3, 'in', 294.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764320514011-198', '2025-11-30 04:53:52'),
(58, 5, 'in', 49.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764320514011-198', '2025-11-30 04:53:52'),
(59, 2, 'out', 106.00, 'order', 26, 'Xuất kho cho đơn hàng ORD-1764478511003-133', '2025-11-30 04:55:11'),
(60, 7, 'out', 58.00, 'order', 26, 'Xuất kho cho đơn hàng ORD-1764478511003-133', '2025-11-30 04:55:11'),
(61, 3, 'out', 293.00, 'order', 26, 'Xuất kho cho đơn hàng ORD-1764478511003-133', '2025-11-30 04:55:11'),
(62, 7, 'in', 59.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764478511003-133', '2025-11-30 09:40:11'),
(63, 3, 'in', 294.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764478511003-133', '2025-11-30 09:40:11'),
(64, 3, 'out', 292.00, 'order', 27, 'Xuất kho cho đơn hàng ORD-1764497542584-62', '2025-11-30 10:12:22'),
(65, 4, 'out', 77.00, 'order', 27, 'Xuất kho cho đơn hàng ORD-1764497542584-62', '2025-11-30 10:12:22'),
(66, 3, 'out', 291.00, 'order', 28, 'Xuất kho cho đơn hàng ORD-1764497560317-712', '2025-11-30 10:12:40'),
(67, 4, 'out', 76.00, 'order', 28, 'Xuất kho cho đơn hàng ORD-1764497560317-712', '2025-11-30 10:12:40'),
(68, 3, 'out', 289.00, 'order', 29, 'Xuất kho cho đơn hàng ORD-1764497659977-701', '2025-11-30 10:14:20'),
(69, 4, 'out', 75.00, 'order', 29, 'Xuất kho cho đơn hàng ORD-1764497659977-701', '2025-11-30 10:14:20'),
(70, 3, 'out', 287.00, 'order', 30, 'Xuất kho cho đơn hàng ORD-1764497800500-219', '2025-11-30 10:16:40'),
(71, 4, 'out', 74.00, 'order', 30, 'Xuất kho cho đơn hàng ORD-1764497800500-219', '2025-11-30 10:16:40'),
(72, 4, 'out', 73.00, 'order', 31, 'Xuất kho cho đơn hàng ORD-1764497996864-897', '2025-11-30 10:19:56'),
(73, 3, 'in', 289.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764497659977-701', '2025-11-30 10:22:33'),
(74, 4, 'in', 74.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764497659977-701', '2025-11-30 10:22:33'),
(75, 3, 'in', 291.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764497542584-62', '2025-11-30 11:13:03'),
(76, 4, 'in', 75.00, NULL, NULL, 'Hoàn trả từ đơn hàng bị hủy ORD-1764497542584-62', '2025-11-30 11:13:03');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `order_number` varchar(50) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','paid','refunded') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `customer_name`, `customer_phone`, `customer_email`, `order_number`, `total_amount`, `status`, `payment_method`, `payment_status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 'Nguyễn Văn An', NULL, 'nguyenvanan@example.com', 'ORD-20240101-001', 195000.00, 'completed', 'cash', 'paid', 'Giao hàng buổi sáng', '2025-11-26 00:45:58', '2025-11-28 02:33:40'),
(3, 3, 'Lê Văn Cường', NULL, 'levancuong@example.com', 'ORD-20240102-001', 150000.00, 'completed', 'cash', 'pending', NULL, '2025-11-26 00:45:58', '2025-11-30 10:37:49'),
(7, 7, 'Nguyễn iduser', NULL, 'ntlehuyen2k4@gmail.com', 'ORD-1764301310631-207', 140000.00, 'completed', 'cash', 'pending', 'Địa chỉ giao hàng: Quy Nhơn, Bình Định', '2025-11-28 03:41:50', '2025-11-30 10:37:59'),
(5, 5, 'Hoàng Văn Em', NULL, 'hoangvanem@example.com', 'ORD-20240103-001', 180000.00, 'completed', 'cash', 'paid', NULL, '2025-11-26 00:45:58', '2025-11-27 15:48:36'),
(6, 7, 'Nguyễn iduser', NULL, 'ntlehuyen2k4@gmail.com', 'ORD-1764301265782-74', 150000.00, 'completed', 'cash', 'pending', 'Địa chỉ giao hàng: Quy Nhơn, Bình Định', '2025-11-28 03:41:05', '2025-11-30 10:38:02'),
(8, 7, 'Nguyễn iduser', NULL, 'ntlehuyen2k4@gmail.com', 'ORD-1764302945881-183', 100000.00, 'completed', 'cash', 'pending', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-28 04:09:05', '2025-11-30 10:37:55'),
(9, 7, 'Nguyễn iduser', NULL, 'ntlehuyen2k4@gmail.com', 'ORD-1764303327177-678', 75000.00, 'pending', 'cash', 'pending', 'Địa chỉ giao hàng: Hoài Nhơn, Bình Định', '2025-11-28 04:15:27', '2025-11-28 05:35:08'),
(10, 7, 'Nguyễn iduser', NULL, 'ntlehuyen2k4@gmail.com', 'ORD-1764303623985-226', 125000.00, 'pending', 'cash', 'pending', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-28 04:20:23', '2025-11-28 05:35:08'),
(11, 1, 'admin', NULL, 'admin', 'ORD-1764304257389-254', 75000.00, 'cancelled', 'cash', 'pending', 'Địa chỉ giao hàng: admin', '2025-11-28 04:30:57', '2025-11-28 04:47:03'),
(12, 1, 'admin', NULL, 'admin', 'ORD-1764304420625-980', 45000.00, 'cancelled', 'cash', 'pending', 'Địa chỉ giao hàng: admin', '2025-11-28 04:33:40', '2025-11-28 04:52:50'),
(13, 1, 'admin', NULL, 'user@gmail.com', 'ORD-1764305266628-121', 120000.00, 'pending', 'cash', 'pending', 'Địa chỉ giao hàng: admin', '2025-11-28 04:47:46', '2025-11-28 05:33:03'),
(14, 1, 'admin', NULL, 'user@gmail.com', 'ORD-1764305301215-649', 440000.00, 'pending', 'cash', 'pending', 'Địa chỉ giao hàng: admin', '2025-11-28 04:48:21', '2025-11-28 05:33:03'),
(15, 1, 'admin', NULL, 'user@gmail.com', 'ORD-1764305507728-292', 75000.00, 'pending', 'cash', 'pending', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-28 04:51:47', '2025-11-28 05:33:03'),
(18, 7, 'Nguyễn iduser', NULL, 'ntlehuyen2k4@gmail.com', 'ORD-1764307205140-703', 45000.00, 'pending', 'cash', 'pending', 'Địa chỉ giao hàng: admin', '2025-11-28 05:20:05', '2025-11-28 05:35:08'),
(19, 7, 'Nguyễn iduser', NULL, 'ntlehuyen2k4@gmail.com', 'ORD-1764307254218-183', 45000.00, 'pending', 'cash', 'pending', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-28 05:20:54', '2025-11-28 05:35:08'),
(20, 7, 'Nguyễn iduser', NULL, 'ntlehuyen2k4@gmail.com', 'ORD-1764307865353-465', 75000.00, 'pending', 'cash', 'pending', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-28 05:31:05', '2025-11-28 05:35:08'),
(21, NULL, 'admin', NULL, 'user@gmail.com', 'ORD-1764308143925-153', 75000.00, 'completed', 'cash', 'pending', 'Địa chỉ giao hàng: admin', '2025-11-28 05:35:43', '2025-11-30 10:33:39'),
(22, NULL, 'admin', '21111', '21111', 'ORD-1764308255675-603', 45000.00, 'cancelled', 'cash', 'pending', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-28 05:37:35', '2025-11-28 05:40:52'),
(23, NULL, 'admin', NULL, 'user@gmail.com', 'ORD-1764308290501-644', 75000.00, 'pending', 'cash', 'pending', 'Địa chỉ giao hàng: admin', '2025-11-28 05:38:10', '2025-11-28 05:38:10'),
(24, NULL, 'admin', NULL, 'user@gmail.com', 'ORD-1764309119830-698', 240000.00, 'pending', 'cash', 'pending', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-28 05:51:59', '2025-11-28 05:51:59'),
(25, 5, '211q11', NULL, '21111', 'ORD-1764320514011-198', 215000.00, 'cancelled', 'cash', 'pending', 'Địa chỉ giao hàng: admin', '2025-11-28 09:01:54', '2025-11-30 04:53:52'),
(26, 10, '12', NULL, '122@', 'ORD-1764478511003-133', 240000.00, 'cancelled', 'cash', 'pending', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-30 04:55:11', '2025-11-30 09:40:11'),
(27, 10, '12', NULL, '122@gmail.com', 'ORD-1764497542584-62', 155002.00, 'cancelled', 'cash', 'pending', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-30 10:12:22', '2025-11-30 11:13:03'),
(28, 10, '12', NULL, '122@gmail.com', 'ORD-1764497560317-712', 110001.00, 'pending', 'cash', 'paid', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-30 10:12:40', '2025-11-30 11:27:58'),
(29, 10, '12', NULL, '122@gmail.com', 'ORD-1764497659977-701', 155002.00, 'cancelled', 'cash', 'pending', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-30 10:14:19', '2025-11-30 10:22:33'),
(30, 10, '12', NULL, '122@gmail.com', 'ORD-1764497800500-219', 155002.00, 'completed', 'cash', 'paid', 'Địa chỉ giao hàng: Quảng Ngãi', '2025-11-30 10:16:40', '2025-11-30 10:36:44'),
(31, 10, '12', NULL, '122@gmail.com', 'ORD-1764497996864-897', 65000.00, 'completed', 'cash', 'paid', 'Địa chỉ giao hàng: Hoài Nhơn, Bình Định', '2025-11-30 10:19:56', '2025-11-30 10:36:39');

-- --------------------------------------------------------

--
-- Table structure for table `orders_reports`
--

CREATE TABLE `orders_reports` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `total_revenue` decimal(10,2) DEFAULT 0.00,
  `total_cost` decimal(10,2) DEFAULT 0.00,
  `total_profit` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `unit_price`, `total_price`, `subtotal`, `created_at`) VALUES
(1, 1, 1, 'Táo đỏ Mỹ', 2.00, 85000.00, 170000.00, 170000.00, '2025-11-26 00:45:58'),
(2, 1, 5, 'Chuối tiêu', 1.00, 25000.00, 25000.00, 25000.00, '2025-11-26 00:45:58'),
(3, 2, 7, 'Nho đỏ', 2.00, 120000.00, 240000.00, 240000.00, '2025-11-26 00:45:58'),
(4, 2, 8, 'Nho xanh', 1.00, 110000.00, 110000.00, 110000.00, '2025-11-26 00:45:58'),
(5, 3, 3, 'Cam sành', 2.00, 45000.00, 90000.00, 90000.00, '2025-11-26 00:45:58'),
(6, 3, 9, 'Dưa hấu', 2.00, 35000.00, 70000.00, 70000.00, '2025-11-26 00:45:58'),
(7, 4, 11, 'Xoài cát', 2.00, 60000.00, 120000.00, 120000.00, '2025-11-26 00:45:58'),
(8, 4, 12, 'Xoài tứ quý', 2.00, 40000.00, 80000.00, 80000.00, '2025-11-26 00:45:58'),
(9, 4, 13, 'Ổi', 1.00, 30000.00, 30000.00, 30000.00, '2025-11-26 00:45:58'),
(10, 5, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-26 00:45:58'),
(11, 5, 4, 'Cam vàng', 1.00, 65000.00, 65000.00, 65000.00, '2025-11-26 00:45:58'),
(12, 5, 10, 'Dưa lưới', 1.00, 55000.00, 55000.00, 55000.00, '2025-11-26 00:45:58'),
(13, 6, 2, 'Táo xanh', 2.00, 75000.00, 150000.00, 150000.00, '2025-11-28 03:41:05'),
(14, 7, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-28 03:41:50'),
(15, 7, 4, 'Cam vàng', 1.00, 65000.00, 65000.00, 65000.00, '2025-11-28 03:41:50'),
(16, 8, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-28 04:09:05'),
(17, 8, 5, 'Chuối tiêu', 1.00, 25000.00, 25000.00, 25000.00, '2025-11-28 04:09:05'),
(18, 9, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-28 04:15:27'),
(19, 10, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-28 04:20:23'),
(20, 10, 15, 'Mãng cầu', 1.00, 50000.00, 50000.00, 50000.00, '2025-11-28 04:20:23'),
(21, 11, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-28 04:30:57'),
(22, 12, 3, 'Cam sành', 1.00, 45000.00, 45000.00, 45000.00, '2025-11-28 04:33:40'),
(23, 13, 7, 'Nho đỏ', 1.00, 120000.00, 120000.00, 120000.00, '2025-11-28 04:47:46'),
(24, 14, 8, 'Nho xanh', 4.00, 110000.00, 440000.00, 440000.00, '2025-11-28 04:48:21'),
(25, 15, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-28 04:51:47'),
(26, 16, 3, 'Cam sành', 1.00, 45000.00, 45000.00, 45000.00, '2025-11-28 05:09:47'),
(27, 17, 3, 'Cam sành', 1.00, 45000.00, 45000.00, 45000.00, '2025-11-28 05:18:01'),
(28, 18, 3, 'Cam sành', 1.00, 45000.00, 45000.00, 45000.00, '2025-11-28 05:20:05'),
(29, 19, 3, 'Cam sành', 1.00, 45000.00, 45000.00, 45000.00, '2025-11-28 05:20:54'),
(30, 20, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-28 05:31:05'),
(31, 21, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-28 05:35:43'),
(32, 22, 3, 'Cam sành', 1.00, 45000.00, 45000.00, 45000.00, '2025-11-28 05:37:35'),
(33, 23, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-28 05:38:10'),
(34, 24, 3, 'Cam sành', 2.00, 45000.00, 90000.00, 90000.00, '2025-11-28 05:51:59'),
(35, 24, 2, 'Táo xanh', 2.00, 75000.00, 150000.00, 150000.00, '2025-11-28 05:51:59'),
(36, 25, 9, 'Dưa hấu', 2.00, 35000.00, 70000.00, 70000.00, '2025-11-28 09:01:54'),
(37, 25, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-28 09:01:54'),
(38, 25, 3, 'Cam sành', 1.00, 45000.00, 45000.00, 45000.00, '2025-11-28 09:01:54'),
(39, 25, 5, 'Chuối tiêu', 1.00, 25000.00, 25000.00, 25000.00, '2025-11-28 09:01:54'),
(40, 26, 2, 'Táo xanh', 1.00, 75000.00, 75000.00, 75000.00, '2025-11-30 04:55:11'),
(41, 26, 7, 'Nho đỏ', 1.00, 120000.00, 120000.00, 120000.00, '2025-11-30 04:55:11'),
(42, 26, 3, 'Cam sành', 1.00, 45000.00, 45000.00, 45000.00, '2025-11-30 04:55:11'),
(43, 27, 3, 'Cam sành', 2.00, 45001.00, 90002.00, 90002.00, '2025-11-30 10:12:22'),
(44, 27, 4, 'Cam vàng', 1.00, 65000.00, 65000.00, 65000.00, '2025-11-30 10:12:22'),
(45, 28, 3, 'Cam sành', 1.00, 45001.00, 45001.00, 45001.00, '2025-11-30 10:12:40'),
(46, 28, 4, 'Cam vàng', 1.00, 65000.00, 65000.00, 65000.00, '2025-11-30 10:12:40'),
(47, 29, 3, 'Cam sành', 2.00, 45001.00, 90002.00, 90002.00, '2025-11-30 10:14:19'),
(48, 29, 4, 'Cam vàng', 1.00, 65000.00, 65000.00, 65000.00, '2025-11-30 10:14:19'),
(49, 30, 3, 'Cam sành', 2.00, 45001.00, 90002.00, 90002.00, '2025-11-30 10:16:40'),
(50, 30, 4, 'Cam vàng', 1.00, 65000.00, 65000.00, 65000.00, '2025-11-30 10:16:40'),
(51, 31, 4, 'Cam vàng', 1.00, 65000.00, 65000.00, 65000.00, '2025-11-30 10:19:56');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `payment_date` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `status`, `payment_date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 195000.00, 'completed', '2025-11-26 00:45:59', 'Thanh toán tiền mặt cho đơn hàng ORD-20240101-001', '2025-11-26 00:45:59', '2025-11-26 00:45:59'),
(2, 2, 320000.00, 'completed', '2025-11-26 00:45:59', 'Thanh toán tiền mặt cho đơn hàng ORD-20240101-002', '2025-11-26 00:45:59', '2025-11-26 00:45:59'),
(3, 3, 150000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-20240102-001', '2025-11-26 00:45:59', '2025-11-26 00:45:59'),
(4, 4, 225000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-20240102-002', '2025-11-26 00:45:59', '2025-11-26 00:45:59'),
(5, 5, 180000.00, 'completed', '2025-11-26 00:45:59', 'Thanh toán tiền mặt cho đơn hàng ORD-20240103-001', '2025-11-26 00:45:59', '2025-11-26 00:45:59'),
(6, 6, 150000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764301265782-74', '2025-11-28 03:41:05', '2025-11-28 03:41:05'),
(7, 7, 140000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764301310631-207', '2025-11-28 03:41:50', '2025-11-28 03:41:50'),
(8, 8, 100000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764302945881-183', '2025-11-28 04:09:05', '2025-11-28 04:09:05'),
(9, 9, 75000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764303327177-678', '2025-11-28 04:15:27', '2025-11-28 04:15:27'),
(10, 10, 125000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764303623985-226', '2025-11-28 04:20:24', '2025-11-28 04:20:24'),
(11, 11, 75000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764304257389-254', '2025-11-28 04:30:57', '2025-11-28 04:30:57'),
(12, 12, 45000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764304420625-980', '2025-11-28 04:33:40', '2025-11-28 04:33:40'),
(13, 13, 120000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764305266628-121', '2025-11-28 04:47:46', '2025-11-28 04:47:46'),
(14, 14, 440000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764305301215-649', '2025-11-28 04:48:21', '2025-11-28 04:48:21'),
(15, 15, 75000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764305507728-292', '2025-11-28 04:51:47', '2025-11-28 04:51:47'),
(16, 16, 45000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764306587530-219', '2025-11-28 05:09:47', '2025-11-28 05:09:47'),
(17, 17, 45000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764307081222-820', '2025-11-28 05:18:01', '2025-11-28 05:18:01'),
(18, 18, 45000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764307205140-703', '2025-11-28 05:20:05', '2025-11-28 05:20:05'),
(19, 19, 45000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764307254218-183', '2025-11-28 05:20:54', '2025-11-28 05:20:54'),
(20, 20, 75000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764307865353-465', '2025-11-28 05:31:05', '2025-11-28 05:31:05'),
(21, 21, 75000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764308143925-153', '2025-11-28 05:35:43', '2025-11-28 05:35:43'),
(22, 22, 45000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764308255675-603', '2025-11-28 05:37:35', '2025-11-28 05:37:35'),
(23, 23, 75000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764308290501-644', '2025-11-28 05:38:10', '2025-11-28 05:38:10'),
(24, 24, 240000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764309119830-698', '2025-11-28 05:51:59', '2025-11-28 05:51:59'),
(25, 25, 215000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764320514011-198', '2025-11-28 09:01:54', '2025-11-28 09:01:54'),
(26, 26, 240000.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764478511003-133', '2025-11-30 04:55:11', '2025-11-30 04:55:11'),
(27, 27, 155002.00, 'pending', NULL, 'Thanh toán tiền mặt cho đơn hàng ORD-1764497542584-62', '2025-11-30 10:12:22', '2025-11-30 10:12:22'),
(28, 28, 110001.00, 'completed', '2025-11-30 11:27:58', 'Thanh toán tiền mặt cho đơn hàng ORD-1764497560317-712', '2025-11-30 10:12:40', '2025-11-30 11:27:58'),
(30, 30, 155002.00, 'completed', '2025-11-30 10:36:44', 'Thanh toán tiền mặt cho đơn hàng ORD-1764497800500-219', '2025-11-30 10:16:40', '2025-11-30 10:36:44'),
(31, 31, 65000.00, 'completed', '2025-11-30 10:36:39', 'Thanh toán tiền mặt cho đơn hàng ORD-1764497996864-897', '2025-11-30 10:19:56', '2025-11-30 10:36:39');

-- --------------------------------------------------------

--
-- Table structure for table `payment_history`
--

CREATE TABLE `payment_history` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `status_from` enum('pending','completed','cancelled') DEFAULT NULL,
  `status_to` enum('pending','completed','cancelled') NOT NULL,
  `changed_by` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_history`
--

INSERT INTO `payment_history` (`id`, `payment_id`, `status_from`, `status_to`, `changed_by`, `notes`, `created_at`) VALUES
(1, 31, 'pending', 'completed', 'system', NULL, '2025-11-30 10:36:39'),
(2, 30, 'pending', 'completed', 'system', NULL, '2025-11-30 10:36:44'),
(3, 29, 'pending', 'cancelled', 'system', 'r', '2025-11-30 10:36:59'),
(4, 28, 'pending', 'completed', 'system', NULL, '2025-11-30 11:27:58');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `unit` varchar(20) DEFAULT 'kg',
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `category`, `category_id`, `unit_price`, `quantity`, `unit`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(3, 'Cam sành', 'Cam sành Việt Nam, nhiều nước', 'Cam', 2, 45001.00, 222222, 'kg', '/images/camsanh.jpg', 1, '2025-11-26 00:45:58', '2025-11-30 05:35:52'),
(4, 'Cam vàng', 'Cam vàng nhập khẩu, ngọt thanh', 'Cam', 2, 65000.00, 222222, 'kg', '/images/camvang.jpg', 1, '2025-11-26 00:45:58', '2025-11-30 05:35:52'),
(5, 'Chuối tiêu', 'Chuối tiêu chín vàng, thơm ngon', 'Chuối', 3, 25000.00, 222222, 'nải', '/images/oi.jpg', 0, '2025-11-26 00:45:58', '2025-11-30 05:43:24'),
(7, 'Nho đỏ', 'Nho đỏ không hạt, ngọt', 'Nho', 4, 120000.00, 22222, 'kg', '/images/nhodo.jpg', 1, '2025-11-26 00:45:58', '2025-11-30 05:35:52'),
(8, 'Nho xanh', 'Nho xanh giòn, vị thanh', 'Nho', 4, 110000.00, 2222, 'kg', '/images/nhoxanh.jpg', 1, '2025-11-26 00:45:58', '2025-11-30 05:35:52'),
(9, 'Dưa hấu', 'Dưa hấu đỏ, mát lạnh', 'Dưa', 5, 35000.00, 22222, 'kg', '/images/duahau.jpg', 1, '2025-11-26 00:45:58', '2025-11-30 05:35:52'),
(10, 'Dưa lưới', 'Dưa lưới vàng, thơm ngọt', 'Dưa', 5, 55000.00, 2222, 'kg', '/images/oi.jpg', 1, '2025-11-26 00:45:58', '2025-11-30 05:43:24'),
(11, 'Xoài cát', 'Xoài cát Hòa Lộc, thơm ngọt', 'Xoài', 6, 60000.00, 2222, 'kg', '/images/xoaicat.jpg', 1, '2025-11-26 00:45:58', '2025-11-30 05:35:52'),
(12, 'Xoài tứ quý', 'Xoài tứ quý, vị chua ngọt', 'Xoài', 6, 40000.00, 2222, 'kg', '/images/xoaituquy.jpg', 1, '2025-11-26 00:45:58', '2025-11-30 05:35:52'),
(13, 'Ổi', 'Ổi giòn, ngọt thanh', 'Ổi', 7, 30000.00, 2222, 'kg', '/images/oi.jpg', 1, '0000-00-00 00:00:00', '2025-11-30 05:35:52'),
(14, 'Thanh long', 'Thanh long ruột đỏ, ngọt mát', 'Thanh long', 8, 45000.00, 0, 'kg', '/images/thanhlong.jpg', 1, '2025-11-26 00:45:58', '2025-11-30 05:35:52'),
(15, 'Mãng cầu', 'Mãng cầu dai, ngọt', 'Mãng cầu', 9, 50000.00, 0, 'kg', '/images/traiman.jpg', 1, '2025-11-26 00:45:58', '2025-11-30 05:43:24');

-- --------------------------------------------------------

--
-- Table structure for table `product_reports`
--

CREATE TABLE `product_reports` (
  `id` int(11) NOT NULL,
  `order_report_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `total_sold` int(11) DEFAULT 0,
  `revenue` decimal(10,2) DEFAULT 0.00,
  `cost` decimal(10,2) DEFAULT 0.00,
  `profit` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `IdUser` int(11) NOT NULL,
  `UserName` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Token` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`IdUser`, `UserName`, `email`, `Password`, `Token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTc2NDQ4MTY5MiwiZXhwIjoxNzY0NTY4MDkyfQ.UrxBLRVz9F27uUXRsEFJ5OC_krksP2neLykhgvWVc0I', '2025-11-25 17:45:58', '2025-11-30 05:48:12'),
(2, 'user1', 'user1', 'e10adc3949ba59abbe56e057f20f883e', NULL, '2025-11-25 17:45:58', '2025-11-28 03:18:36'),
(5, '211q11', '21111', 'd79c8788088c2193f0244d8f1f36d2db', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiIyMTFxMTEiLCJpYXQiOjE3NjQ0NzgxMTUsImV4cCI6MTc2NDU2NDUxNX0.KGtoLq0Qmm4FiyA6zKP7gGwac9LKMk1fAiP0d_rLNE8', '2025-11-28 02:52:59', '2025-11-30 04:48:35'),
(7, 'ntlehuyen2k4', 'ntlehuyen2k4@gmail.com', '$2b$10$dummy', NULL, '2025-11-28 05:35:08', '2025-11-28 05:35:08'),
(8, '21111', NULL, 'd79c8788088c2193f0244d8f1f36d2db', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlcm5hbWUiOiIyMTExMSIsImlhdCI6MTc2NDMzMzU3OCwiZXhwIjoxNzY0NDE5OTc4fQ.6jQzGqFWvCr-Mo0PuZVCQkIKkPlLG2s9anR9teLeND4', '2025-11-28 12:37:26', '2025-11-28 12:39:38'),
(9, '1111', NULL, 'd79c8788088c2193f0244d8f1f36d2db', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcm5hbWUiOiIxMTExIiwiaWF0IjoxNzY0NDc4NDQ3LCJleHAiOjE3NjQ1NjQ4NDd9.IDghefOUFYoSBp7iFAxDZHq4ppc6SYIKoztqGoHxoZA', '2025-11-30 04:50:10', '2025-11-30 04:54:07'),
(10, '12', NULL, 'd79c8788088c2193f0244d8f1f36d2db', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoiMTIiLCJpYXQiOjE3NjQ1MDEwOTYsImV4cCI6MTc2NDU4NzQ5Nn0.FZds140CvYqRXNVV_xesQ-Lmy8ZzMUnAqaLeqJggxSQ', '2025-11-30 04:54:38', '2025-11-30 11:11:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_product` (`product_id`),
  ADD KEY `idx_inventory_product` (`product_id`);

--
-- Indexes for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transaction_product` (`product_id`),
  ADD KEY `idx_transaction_date` (`created_at`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_order_status` (`status`),
  ADD KEY `idx_order_customer` (`customer_id`),
  ADD KEY `idx_order_date` (`created_at`);

--
-- Indexes for table `orders_reports`
--
ALTER TABLE `orders_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_order_items_product_name` (`product_name`(250));

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_payment_order` (`order_id`),
  ADD KEY `idx_payment_status` (`status`),
  ADD KEY `idx_payment_date` (`payment_date`);

--
-- Indexes for table `payment_history`
--
ALTER TABLE `payment_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_payment_history_payment` (`payment_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_category` (`category`),
  ADD KEY `idx_product_category_id` (`category_id`),
  ADD KEY `idx_products_quantity` (`quantity`);

--
-- Indexes for table `product_reports`
--
ALTER TABLE `product_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_report_id` (`order_report_id`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`IdUser`),
  ADD UNIQUE KEY `UserName` (`UserName`),
  ADD KEY `idx_username` (`UserName`),
  ADD KEY `idx_token` (`Token`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `orders_reports`
--
ALTER TABLE `orders_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `payment_history`
--
ALTER TABLE `payment_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `product_reports`
--
ALTER TABLE `product_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `IdUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product_reports`
--
ALTER TABLE `product_reports`
  ADD CONSTRAINT `product_reports_ibfk_1` FOREIGN KEY (`order_report_id`) REFERENCES `orders_reports` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
