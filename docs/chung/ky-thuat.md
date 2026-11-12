# Kỹ thuật chung

## File
- `server.js` — `http` thuần: phục vụ `public/`, API dưới `/api/`. `/admin` → `admin.html`. Chặn đường dẫn thoát khỏi `public/`.
- `test/api.test.js` — `node:test`, đặt `DATA_FILE` vào thư mục tạm, `ADMIN_PASSWORD=mat-khau-test`, listen cổng 0.

## Biến môi trường
| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `PORT` | 3000 | Cổng |
| `ADMIN_PASSWORD` | `admin123` | Mật khẩu `/admin` (so sánh `timingSafeEqual`) |
| `DATA_FILE` | `data/don-hang.json` | File lưu đơn |

## Lưu trữ
`docDon()` / `ghiDon()` — đọc/ghi cả mảng JSON, ghi qua file `.tmp` rồi `rename` để tránh hỏng file. Đơn mới `unshift` lên đầu. Phù hợp lượng đơn nhỏ; nhiều đơn thì chuyển sang SQLite.

## API
| Method | Đường dẫn | Quyền | Ghi chú |
|---|---|---|---|
| POST | `/api/don` | công khai | Tạo đơn, trả `{ma}`; lỗi 400 `{loi:[...]}`. Ô `website` là bẫy bot |
| GET | `/api/admin/don` | header `x-admin-password` | Danh sách đơn |
| PATCH | `/api/admin/don/:ma` | admin | `{trangThai, ghiChu}` |
| DELETE | `/api/admin/don/:ma` | admin | Xoá đơn |

## Kiểm tra
`npm test`
