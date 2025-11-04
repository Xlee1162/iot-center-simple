# Kế hoạch Tích hợp Frontend & Backend

Tài liệu này vạch ra kế hoạch chi tiết để kết nối ứng dụng Frontend (React, Vite) với hệ thống Backend (Node.js, Express, MongoDB, WebSocket).

## 🎯 Mục tiêu chính

Chuyển đổi ứng dụng frontend từ việc sử dụng dữ liệu giả (mock data) sang lấy dữ liệu thật từ backend API. Xây dựng nền tảng vững chắc để quản lý dữ liệu, xác thực người dùng và cập nhật giao diện real-time.

---

## Giai đoạn 1: Tích hợp API và Quản lý Xác thực

**Trọng tâm:** Lấy và hiển thị dữ liệu tĩnh, quản lý trạng thái đăng nhập của người dùng.

### Bước 1: Thiết lập Biến Môi trường (Environment Variables)

*   **Mục đích:** Cấu hình ứng dụng linh hoạt cho các môi trường khác nhau (development, production) mà không cần sửa code.
*   **Hành động:**
    1.  Tạo tệp `.env.development`: Chứa cấu hình cho môi trường dev.
    2.  Tạo tệp `.env.production`: Chứa cấu hình cho môi trường sản phẩm.
    3.  Thêm các biến cần thiết như `VITE_API_BASE_URL` và cờ `VITE_AUTH_DISABLED` để bỏ qua đăng nhập khi dev.

    **Ví dụ `.env.development`:**
    ```env
    # URL của backend API khi đang phát triển
    VITE_API_BASE_URL=http://localhost:3000/api

    # Tắt tính năng xác thực để dev nhanh hơn.
    VITE_AUTH_DISABLED=true
    ```

    **Ví dụ `.env.production`:**
    ```env
    # URL của backend API khi chạy production
    VITE_API_BASE_URL=https://api.your-production-domain.com/api

    # Bật tính năng xác thực.
    VITE_AUTH_DISABLED=false
    ```

### Bước 2: Xây dựng Lớp Giao tiếp API (API Layer)

*   **Mục đích:** Tập trung tất cả các lệnh gọi API vào một nơi duy nhất, giúp code sạch sẽ và dễ bảo trì.
*   **Hành động:**
    1.  Cài đặt `axios`: `npm install axios`.
    2.  Tạo thư mục `src/services`.
    3.  Tạo các tệp dịch vụ như `authService.ts`, `deviceService.ts`.
    4.  Viết các hàm gọi API cho mỗi endpoint, ví dụ: `login(email, password)`, `getDevices()`.

### Bước 3: Triển khai Hệ thống Xác thực (Authentication)

*   **Mục đích:** Quản lý trạng thái đăng nhập của người dùng và bảo vệ các trang yêu cầu đăng nhập.
*   **Hành động:**
    1.  Sử dụng **React Context** để tạo `AuthenticationProvider`.
    2.  Provider này sẽ quản lý thông tin người dùng và token JWT.
    3.  Tạo các trang `LoginPage`, `RegisterPage`.
    4.  Tạo component `ProtectedRoute` để kiểm tra người dùng đã đăng nhập chưa, có tính đến cờ `VITE_AUTH_DISABLED`.

### Bước 4: Thay thế Dữ liệu giả bằng Dữ liệu thật

*   **Mục đích:** Kết nối các component với dữ liệu thực tế từ backend.
*   **Hành động:**
    1.  Sử dụng hook `useQuery` từ **TanStack Query** trong các component.
    2.  Gọi các hàm từ Lớp Giao tiếp API (Bước 2) để lấy dữ liệu.
    3.  Xử lý trạng thái `isLoading` bằng cách hiển thị component `<Skeleton />`.
    4.  Xử lý trạng thái `isError` bằng cách hiển thị thông báo lỗi qua `Toast`.

---

## Giai đoạn 2: Tích hợp WebSocket (Kích hoạt Real-time)

**Trọng tâm:** Làm cho ứng dụng có khả năng cập nhật dữ liệu trực tiếp mà không cần làm mới trang.

### Bước 1: Cài đặt & Cấu hình Socket.io Client

*   **Hành động:**
    1.  Cài đặt `socket.io-client`: `npm install socket.io-client`.
    2.  Tạo một module `src/lib/socket.ts` để quản lý một kết nối socket duy nhất.

### Bước 2: Tạo Custom Hook để quản lý Socket

*   **Hành động:** Tạo hook `useSocket()` để các component có thể dễ dàng lắng nghe các sự kiện từ server.

### Bước 3: Cập nhật dữ liệu Real-time

*   **Hành động:**
    1.  Trong các component cần thiết (ví dụ: Dashboard), sử dụng `useSocket()` để lắng nghe các sự kiện (`new-sensor-data`, `device-status-update`).
    2.  Khi nhận được dữ liệu mới, sử dụng `queryClient.setQueryData` của TanStack Query để cập nhật cache, giúp giao diện tự động re-render một cách nhất quán.
