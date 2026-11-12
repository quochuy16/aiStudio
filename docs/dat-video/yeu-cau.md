# Yêu cầu — Đặt video

- **DV-1** Trang chủ quảng cáo editor video AI: hero, dịch vụ, bảng giá tham khảo, quy trình.
- **DV-2** Khu "Trải nghiệm thử": khách nhập ý tưởng, chọn phong cách và tỉ lệ khung, xem khung minh hoạ; nút đưa ý tưởng vào form.
- **DV-3** Form đặt video: họ tên*, loại video*, thời lượng, gói, hạn chót, mô tả* (≥10 ký tự), SĐT*, Zalo, Facebook, email.
- **DV-4** Gửi thành công → hiện mã đơn và ảnh QR chuyển khoản (`public/qr.jpg`), hướng dẫn ghi mã đơn khi chuyển khoản.
- **DV-5** Khách **không** nhắn Zalo trực tiếp từ web; khách để lại thông tin, chủ web xem đơn và liên hệ lại. (người dùng chọn 12/11/2026)
- **DV-6** Trang `/admin`: xem danh sách đơn, tìm kiếm, lọc theo trạng thái (Mới / Đã liên hệ / Đang làm / Hoàn thành / Huỷ), ghi chú, xoá; bấm gọi / mở Zalo / Facebook / email của khách.
- **DV-7** Nhân vật 3D cho đẹp. Dùng **model tải từ mạng** (giấy phép CC0 / CC-BY / MIT), không dùng nhân vật tự dựng bằng hình khối vì xấu (người dùng chọn 12/11/2026):
  - Hero: robot hoạt hình (vẫy tay, nhảy khi bấm, thỉnh thoảng giơ ngón cái / gật đầu, đầu nhìn theo chuột) + cáo đi qua lại, chạy khi bấm; icon 3D Fluent (clapperboard, máy quay, bắp rang, sao) bay quanh.
  - Cạnh form: robot nhỏ vẫy tay, gật đầu khi gửi đơn thành công; icon mặt heo, cuộn phim.
  - Thẻ dịch vụ dùng icon 3D thay emoji.
  - Chân trang ghi nguồn model (bắt buộc với CC-BY).
  - Người dùng thấy model miễn phí vẫn chưa đẹp → chọn hướng **ảnh nhân vật 3D kiểu Pixar tạo bằng AI** (cùng phong cách chú heo mascot). Trước mắt dùng **4 chú heo tự vẽ bằng SVG** (quay phim, đạo diễn, vẫy tay, giơ ngón cái); khi người dùng gửi ảnh AI thì thay file. Đã bỏ robot/cáo three.js. (người dùng chọn 12/11/2026)
  - Nhân vật nhún nhẹ, nghiêng theo chuột, bấm vào thì nhảy. Popup gửi thành công có heo giơ ngón cái.

## Ngoài phạm vi
- Upload file / video tham khảo (khách dán link vào mô tả).
