# CLAUDE.md — Web đặt video AI

Website quảng cáo cho một editor làm video AI: khách xem dịch vụ, trải nghiệm thử, gửi yêu cầu kèm thông tin liên hệ → web hiện mã QR chuyển khoản. Chủ web vào `/admin` xem đơn và **tự liên hệ lại** khách.

- Superpowers: không (mặc định 12/11/2026 — người dùng chưa chọn, hỏi lại nếu cần đổi)
- Lưu đơn: server Node + file JSON + trang `/admin` (người dùng chọn 12/11/2026: khách để lại thông tin, chủ web xem đơn và liên hệ lại)

## Bản đồ

| Trang / module | File | Tài liệu |
|---|---|---|
| Server, API, lưu trữ, chạy | `server.js`, `package.json` | `docs/chung/` |
| Trang chủ + form đặt video + QR | `public/index.html`, `public/app.js`, `public/style.css`, `public/qr.jpg` | `docs/dat-video/` |
| Nhân vật heo (SVG) + icon 3D | `scripts/tao-nhan-vat.js` → `public/nhan-vat/`, `public/models/icon/` | `docs/dat-video/` |
| Quản lý đơn | `public/admin.html`, `public/admin.js` | `docs/dat-video/` |

## Chạy & kiểm tra

```bash
npm start          # http://localhost:3000 , quản lý: /admin
npm test           # test API, dùng file dữ liệu tạm
```

Không cần `npm install` (không có dependency). Mật khẩu admin qua biến `ADMIN_PASSWORD` (mặc định `admin123` chỉ để chạy local).

## Quy tắc

- `data/` chứa đơn thật của khách → không vào git, không in ra chat.
- Không thêm framework / dependency khi không có lý do rõ ràng.
- Đổi chức năng → cập nhật `docs/<chuc-nang>/` tương ứng.
