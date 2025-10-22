# NNPTUD-S5 (bt_22th10)

Hướng dẫn nhanh để chạy (yêu cầu MongoDB cục bộ)

Yêu cầu:
- Node.js (14+)
- MongoDB chạy trên `localhost:27017`

Cài đặt và chạy:

```powershell
cd bt_22th10
npm install
# Nếu muốn phát triển dùng nodemon
npm start
# hoặc chạy trực tiếp
node ./bin/www
```

Nếu máy chưa cài MongoDB:
- Cài MongoDB Community Server từ trang chính thức.
- Sau khi cài, start MongoDB service hoặc chạy `mongod --dbpath C:\\data\\db` (Windows) trước khi chạy app.

Ghi chú về chức năng upload:
- Upload một ảnh (avatar): POST `/users/avatar` với field `avatar`. Yêu cầu đăng nhập (token JWT). Server lưu ảnh vào `resources/images` và cập nhật `avatarURL` cho user.
- Upload nhiều ảnh (album): POST `/users/album` với field `images` (multiple). Trả về danh sách URL.
- Trang demo giao diện:
	- `/upload-single` — form upload 1 ảnh
	- `/upload-multi` — form upload nhiều ảnh

Lưu ý khi chuyển giao:
- Đảm bảo người nhận cài MongoDB và start trước khi chạy `npm start`.
- Nếu muốn, có thể thêm `mongodb-memory-server` để chạy dev mà không cần cài MongoDB (mình có thể hỗ trợ tích hợp nếu bạn muốn).