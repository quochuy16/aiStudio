# Hướng dẫn chạy web

1. Cài Node.js 18 trở lên.
2. Mở terminal tại thư mục dự án, chạy `npm start`.
3. Mở `http://localhost:3000` để xem web, `http://localhost:3000/admin` để quản lý đơn.

Đổi mật khẩu admin / cổng khi chạy (PowerShell):

```powershell
$env:ADMIN_PASSWORD = 'mat-khau-cua-ban'; $env:PORT = 8080; npm start
```

Sao lưu đơn: chép file `data/don-hang.json`.
