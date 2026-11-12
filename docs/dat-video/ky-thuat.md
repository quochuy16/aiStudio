# Kỹ thuật — Đặt video

## File
- `public/index.html` — các section: `#dich-vu`, `#trai-nghiem`, `#bang-gia`, `#quy-trinh`, `#dat-video`; modal `#modal` chứa QR.
- `public/app.js` — hiệu ứng gõ prompt; khu trải nghiệm (`veDemo`, chip `data-s` / `data-r`); nút `[data-goi]` điền gói; gửi form `POST /api/don`, kiểm tra phía client giống server.
- `public/style.css` — dùng chung cho cả trang chủ và admin; biến màu ở `:root`; khung demo theo class `s-<phong-cach>`.
- `public/nhan-vat/*.svg` — 4 chú heo (`heo-quay-phim`, `heo-dao-dien`, `heo-vay-tay`, `heo-like`), **sinh bằng** `node scripts/tao-nhan-vat.js` (sửa script rồi chạy lại, không sửa tay file SVG). Bộ phận dùng chung: `dau`, `than`, `chan`, `tay()/ongTay()/banTay()`, đạo cụ `mayQuay`, `beret`, `clapper`.
  - **Thay bằng ảnh AI**: đặt PNG nền trong suốt vào `public/nhan-vat/` rồi đổi `src` của `img.nv` / `.nv-like` trong `index.html`.
- Hiệu ứng nhân vật (CSS `.nv`): `nhun` (lặp), nghiêng theo chuột qua `rotate` + `translate` dùng `--mx` và `--k`; bấm → class `nhay` (`app.js` gắn/gỡ). Icon `.noi-3d` trôi theo `--mx/--my`. `app.js` cập nhật `--mx/--my` khi `pointermove`.
- `public/models/icon/` — icon 3D Fluent Emoji (MIT), nguồn ở `public/models/NGUON.md`.
- Không còn dùng three.js (đã bỏ 12/11/2026).
- `public/admin.html` + `admin.js` — mật khẩu giữ trong `sessionStorage` (`adminPw`), gửi qua header `x-admin-password`; mọi dữ liệu khách đi qua `esc()` trước khi chèn HTML.

## Dữ liệu đơn
`{ ma, ten, loaiVideo, thoiLuong, nganSach, hanChot, moTa, sdt, zalo, facebook, email, trangThai, ghiChu, taoLuc, capNhatLuc? }`
- `ma`: `VD` + `yyMMdd` + 4 ký tự hex.
- `trangThai`: `moi | da-lien-he | dang-lam | hoan-thanh | huy` (mảng `TRANG_THAI` trong `server.js`, `TT` trong `admin.js`).
- Kiểm tra: `kiemTraDon()` trong `server.js`.

## Kiểm tra
`npm test`, rồi mở trình duyệt gửi thử 1 đơn và xem ở `/admin`.
