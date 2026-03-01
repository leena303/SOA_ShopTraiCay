# PHÁT BIỂU BÀI TOÁN VÀ YÊU CẦU HỆ THỐNG

## 1. PHÁT BIỂU BÀI TOÁN

### 1.1. Bối cảnh

Trong thời đại số hóa hiện nay, việc quản lý cửa hàng trái cây truyền thống gặp nhiều thách thức:

- **Quản lý thủ công**: Việc quản lý sản phẩm, đơn hàng, kho hàng bằng sổ sách hoặc Excel gây khó khăn trong việc theo dõi, cập nhật và báo cáo.
- **Thiếu tích hợp**: Các chức năng quản lý (sản phẩm, đơn hàng, kho, khách hàng) hoạt động độc lập, không có sự liên kết, dẫn đến dữ liệu không đồng bộ.
- **Khó mở rộng**: Khi cửa hàng phát triển, hệ thống quản lý cũ không thể mở rộng dễ dàng.
- **Thiếu báo cáo**: Không có công cụ phân tích và báo cáo để đánh giá hiệu quả kinh doanh.

### 1.2. Bài toán

Cần xây dựng một **hệ thống quản lý cửa hàng trái cây** với các yêu cầu:

1. **Quản lý toàn diện**: Quản lý sản phẩm, đơn hàng, kho hàng, khách hàng, thanh toán một cách tự động và hiệu quả.
2. **Kiến trúc mở rộng**: Sử dụng kiến trúc SOA (Service-Oriented Architecture) để dễ dàng mở rộng và bảo trì.
3. **Tích hợp liền mạch**: Các dịch vụ hoạt động độc lập nhưng có thể giao tiếp và tích hợp với nhau.
4. **Báo cáo và phân tích**: Cung cấp các báo cáo về doanh thu, lợi nhuận, sản phẩm bán chạy để hỗ trợ ra quyết định.

### 1.3. Mục tiêu

- **Tự động hóa quy trình**: Giảm thiểu công việc thủ công, tăng hiệu quả quản lý.
- **Tăng độ chính xác**: Giảm sai sót trong quản lý kho, tính toán đơn hàng.
- **Cải thiện trải nghiệm**: Cung cấp giao diện thân thiện cho cả người quản lý và khách hàng.
- **Hỗ trợ ra quyết định**: Cung cấp dữ liệu và báo cáo để đưa ra quyết định kinh doanh đúng đắn.

---

## 2. YÊU CẦU HỆ THỐNG

### 2.1. Yêu cầu chức năng (Functional Requirements)

#### 2.1.1. Quản lý Sản phẩm (Product Management)

- **FR-P01**: Hệ thống cho phép quản lý thông tin sản phẩm (tên, mô tả, giá, hình ảnh, danh mục, đơn vị tính).
- **FR-P02**: Hệ thống cho phép thêm, sửa, xóa, xem danh sách sản phẩm.
- **FR-P03**: Hệ thống cho phép tìm kiếm và lọc sản phẩm theo danh mục, tên, trạng thái.
- **FR-P04**: Hệ thống cho phép quản lý số lượng tồn kho của từng sản phẩm.

#### 2.1.2. Quản lý Danh mục (Category Management)

- **FR-C01**: Hệ thống cho phép quản lý danh mục sản phẩm (tên, mô tả, trạng thái).
- **FR-C02**: Hệ thống cho phép thêm, sửa, xóa, xem danh sách danh mục.
- **FR-C03**: Hệ thống cho phép liên kết sản phẩm với danh mục.

#### 2.1.3. Quản lý Đơn hàng (Order Management)

- **FR-O01**: Hệ thống cho phép tạo đơn hàng mới với thông tin khách hàng và danh sách sản phẩm.
- **FR-O02**: Hệ thống tự động kiểm tra tồn kho trước khi tạo đơn hàng.
- **FR-O03**: Hệ thống tự động tính tổng tiền đơn hàng dựa trên giá và số lượng sản phẩm.
- **FR-O04**: Hệ thống cho phép cập nhật trạng thái đơn hàng (pending, processing, completed, cancelled).
- **FR-O05**: Hệ thống cho phép xem chi tiết đơn hàng, danh sách đơn hàng với tìm kiếm và lọc.
- **FR-O06**: Hệ thống tự động xuất kho khi đơn hàng được xác nhận.

#### 2.1.4. Quản lý Kho hàng (Inventory Management)

- **FR-I01**: Hệ thống cho phép quản lý tồn kho của từng sản phẩm.
- **FR-I02**: Hệ thống cho phép nhập kho và xuất kho với ghi chú.
- **FR-I03**: Hệ thống tự động cập nhật số lượng tồn kho khi có đơn hàng.
- **FR-I04**: Hệ thống cảnh báo khi sản phẩm sắp hết hàng (dưới mức tối thiểu).
- **FR-I05**: Hệ thống lưu lịch sử giao dịch kho (nhập/xuất).

#### 2.1.5. Quản lý Khách hàng (Customer Management)

- **FR-CU01**: Hệ thống cho phép quản lý thông tin khách hàng (tên, email, số điện thoại, địa chỉ).
- **FR-CU02**: Hệ thống cho phép thêm, sửa, xóa, xem danh sách khách hàng.
- **FR-CU03**: Hệ thống cho phép liên kết đơn hàng với khách hàng.

#### 2.1.6. Quản lý Thanh toán (Payment Management)

- **FR-PAY01**: Hệ thống cho phép quản lý thông tin thanh toán (phương thức, trạng thái).
- **FR-PAY02**: Hệ thống hỗ trợ nhiều phương thức thanh toán (tiền mặt, chuyển khoản, thẻ).
- **FR-PAY03**: Hệ thống cho phép cập nhật trạng thái thanh toán (pending, paid, refunded).

#### 2.1.7. Quản lý Người dùng (User Management)

- **FR-U01**: Hệ thống cho phép đăng ký, đăng nhập, đăng xuất.
- **FR-U02**: Hệ thống sử dụng JWT (JSON Web Token) để xác thực người dùng.
- **FR-U03**: Hệ thống phân quyền người dùng (admin, customer, staff).
- **FR-U04**: Hệ thống cho phép quản lý thông tin người dùng (thêm, sửa, xóa).

#### 2.1.8. Báo cáo và Thống kê (Reporting & Analytics)

- **FR-R01**: Hệ thống cho phép tạo báo cáo đơn hàng (doanh thu, chi phí, lợi nhuận).
- **FR-R02**: Hệ thống cho phép tạo báo cáo sản phẩm (số lượng bán, doanh thu, lợi nhuận).
- **FR-R03**: Hệ thống tự động tính toán doanh thu, chi phí, lợi nhuận.
- **FR-R04**: Hệ thống cho phép xem thống kê tổng hợp (tổng đơn hàng, tổng doanh thu, sản phẩm bán chạy).

#### 2.1.9. Giao diện Người dùng (User Interface)

- **FR-UI01**: Hệ thống cung cấp giao diện web cho người quản trị (admin dashboard).
- **FR-UI02**: Hệ thống cung cấp giao diện web cho khách hàng (xem sản phẩm, đặt hàng).
- **FR-UI03**: Giao diện responsive, hỗ trợ nhiều thiết bị (desktop, tablet, mobile).
- **FR-UI04**: Giao diện thân thiện, dễ sử dụng, có tìm kiếm và lọc dữ liệu.

---

### 2.2. Yêu cầu phi chức năng (Non-Functional Requirements)

#### 2.2.1. Hiệu năng (Performance)

- **NFR-P01**: Hệ thống phải phản hồi trong vòng 2 giây cho các thao tác thông thường.
- **NFR-P02**: Hệ thống phải hỗ trợ ít nhất 100 người dùng đồng thời.
- **NFR-P03**: Database queries phải được tối ưu hóa với indexes phù hợp.

#### 2.2.2. Bảo mật (Security)

- **NFR-S01**: Hệ thống sử dụng JWT để xác thực và phân quyền.
- **NFR-S02**: Mật khẩu người dùng phải được mã hóa (MD5 hoặc bcrypt).
- **NFR-S03**: API endpoints quan trọng phải yêu cầu authentication.
- **NFR-S04**: Hệ thống phải có CORS (Cross-Origin Resource Sharing) được cấu hình đúng.

#### 2.2.3. Khả năng mở rộng (Scalability)

- **NFR-SC01**: Hệ thống sử dụng kiến trúc SOA, mỗi service có thể scale độc lập.
- **NFR-SC02**: Mỗi service chạy trên port riêng, có thể deploy riêng biệt.
- **NFR-SC03**: Database được thiết kế để hỗ trợ mở rộng (normalization, indexing).

#### 2.2.4. Độ tin cậy (Reliability)

- **NFR-R01**: Hệ thống phải có xử lý lỗi (error handling) đầy đủ.
- **NFR-R02**: Hệ thống phải có validation dữ liệu đầu vào.
- **NFR-R03**: Database transactions phải đảm bảo tính nhất quán dữ liệu (ACID).

#### 2.2.5. Khả năng bảo trì (Maintainability)

- **NFR-M01**: Code phải có cấu trúc rõ ràng, dễ đọc, có comments.
- **NFR-M02**: Mỗi service có cấu trúc thư mục chuẩn (controllers, models, routes, services).
- **NFR-M03**: Hệ thống phải có tài liệu API và hướng dẫn sử dụng.

#### 2.2.6. Khả năng tương thích (Compatibility)

- **NFR-C01**: Hệ thống hỗ trợ các trình duyệt hiện đại (Chrome, Firefox, Edge, Safari).
- **NFR-C02**: Backend hỗ trợ Node.js >= 14.x.
- **NFR-C03**: Database hỗ trợ MySQL >= 5.7 hoặc MariaDB >= 10.3.

---

## 3. PHẠM VI DỰ ÁN

### 3.1. Trong phạm vi

- ✅ Quản lý sản phẩm trái cây (thêm, sửa, xóa, xem).
- ✅ Quản lý đơn hàng (tạo, cập nhật trạng thái, xem chi tiết).
- ✅ Quản lý kho hàng (nhập/xuất, tồn kho).
- ✅ Quản lý khách hàng và người dùng.
- ✅ Quản lý thanh toán.
- ✅ Báo cáo và thống kê cơ bản.
- ✅ Giao diện web cho admin và khách hàng.
- ✅ API RESTful cho tất cả các chức năng.

### 3.2. Ngoài phạm vi

- ❌ Quản lý nhà cung cấp (supplier management).
- ❌ Quản lý nhân viên (staff management) chi tiết.
- ❌ Tích hợp thanh toán trực tuyến (payment gateway).
- ❌ Gửi email/SMS thông báo.
- ❌ Mobile app (iOS/Android).
- ❌ Quản lý đa cửa hàng (multi-store).
- ❌ Tích hợp vận chuyển (shipping integration).

---

## 4. KIẾN TRÚC HỆ THỐNG

### 4.1. Kiến trúc tổng quan

Hệ thống sử dụng **Kiến trúc SOA (Service-Oriented Architecture)** với các đặc điểm:

- **Microservices**: Mỗi chức năng được tách thành một service độc lập.
- **RESTful API**: Các service giao tiếp qua HTTP/REST API.
- **Database per Service**: Mỗi service có database schema riêng (có thể cùng database server nhưng khác schema/table).
- **JWT Authentication**: Sử dụng JWT để xác thực và phân quyền.

### 4.2. Các dịch vụ (Services)

1. **Auth Service** (Port 3000)
   - Xác thực người dùng (login, register, logout)
   - Quản lý JWT tokens
   - Quản lý người dùng

2. **Product Service** (Port 3001)
   - Quản lý sản phẩm
   - Quản lý danh mục
   - Tìm kiếm và lọc sản phẩm

3. **Order Service** (Port 3002)
   - Quản lý đơn hàng
   - Quản lý order items
   - Kiểm tra tồn kho
   - Tính toán tổng tiền

4. **Inventory Service** (Port 3004)
   - Quản lý kho hàng
   - Nhập/xuất kho
   - Lịch sử giao dịch kho

5. **Customer Service** (Port 3004)
   - Quản lý thông tin khách hàng

6. **Payment Service** (Port 3005)
   - Quản lý thanh toán
   - Cập nhật trạng thái thanh toán

7. **Reporting Service** (Port 3003)
   - Tạo báo cáo đơn hàng
   - Tạo báo cáo sản phẩm
   - Thống kê và phân tích

8. **Category Service** (Port 3006)
   - Quản lý danh mục sản phẩm

### 4.3. Frontend

- **Framework**: Angular
- **Chức năng**: 
  - Admin Dashboard (quản lý sản phẩm, đơn hàng, người dùng, thanh toán)
  - Customer Interface (xem sản phẩm, đặt hàng, xem lịch sử đơn hàng)

---

## 5. CÔNG NGHỆ SỬ DỤNG

### 5.1. Backend

- **Runtime**: Node.js >= 14.x
- **Framework**: Express.js
- **Database**: MySQL >= 5.7 / MariaDB >= 10.3
- **Authentication**: JWT (jsonwebtoken)
- **Database Driver**: mysql2
- **Environment Variables**: dotenv

### 5.2. Frontend

- **Framework**: Angular
- **Language**: TypeScript
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Angular Forms (Template-driven & Reactive)

### 5.3. Tools & Utilities

- **API Testing**: Postman
- **Version Control**: Git
- **Package Manager**: npm

---

## 6. KẾT LUẬN

Hệ thống quản lý cửa hàng trái cây được thiết kế với kiến trúc SOA nhằm:

- ✅ **Tự động hóa** quy trình quản lý cửa hàng
- ✅ **Tăng hiệu quả** và giảm sai sót
- ✅ **Dễ mở rộng** và bảo trì
- ✅ **Cung cấp báo cáo** hỗ trợ ra quyết định
- ✅ **Cải thiện trải nghiệm** người dùng

Hệ thống đáp ứng đầy đủ các yêu cầu chức năng và phi chức năng đã nêu, sẵn sàng triển khai và sử dụng trong môi trường thực tế.

---

**Tài liệu này là phần bắt buộc trong báo cáo bài tập lớn, mô tả rõ ràng bài toán, yêu cầu và kiến trúc hệ thống.**

