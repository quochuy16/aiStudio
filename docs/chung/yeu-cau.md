# Yêu cầu chung

- **G-1** Web chạy bằng Node thuần, không dependency, khởi động bằng `npm start`.
- **G-2** Đơn khách lưu trên máy chủ (file JSON `data/don-hang.json`), không vào git. (người dùng chọn 12/11/2026)
- **G-3** Trang quản lý `/admin` bảo vệ bằng mật khẩu đặt qua biến môi trường `ADMIN_PASSWORD`.
- **G-4** Kiểm thử dùng file dữ liệu tạm và mật khẩu giả, không đụng dữ liệu thật.

## Ngoài phạm vi
- Thanh toán tự động / đối soát chuyển khoản.
- Gửi thông báo (email, Zalo) tự động khi có đơn mới.
