# PESHOP - Tổng Quan Dự Án E-Commerce

## 🎯 MỤC ĐÍCH TÀI LIỆU

Tài liệu này mô tả toàn bộ dự án PeShop để AI có thể hiểu và lên kế hoạch demo/thuyết trình.

---

## 📋 THÔNG TIN DỰ ÁN

**Tên:** PeShop - Nền tảng thương mại điện tử Việt Nam  
**Tech Stack:** Next.js 15 + React 19 + TypeScript + TanStack Query + Tailwind CSS  
**Backend:** Dual API (.NET + Java)  
**Ngôn ngữ UI:** Tiếng Việt

---

## 👥 HAI LOẠI NGƯỜI DÙNG

### 1. KHÁCH HÀNG (Customer)

### 2. CHỦ SHOP (Shop Owner)

---

## ✅ TÍNH NĂNG ĐÃ HOÀN THÀNH

### PHÍA KHÁCH HÀNG

| #   | Tính năng             | Mô tả ngắn                             | Điểm nổi bật             |
| --- | --------------------- | -------------------------------------- | ------------------------ |
| 1   | **Đăng ký/Đăng nhập** | Auth với OTP qua email                 | JWT + Refresh Token      |
| 2   | **Trang chủ**         | Banner, sản phẩm nổi bật, danh mục     | ISR caching              |
| 3   | **Xem sản phẩm**      | Danh sách + Chi tiết + Variants        | Filter, Sort, Pagination |
| 4   | **Tìm kiếm**          | Tìm theo từ khóa + Gợi ý               | Auto-suggest             |
| 5   | **Giỏ hàng**          | Thêm/Sửa/Xóa sản phẩm                  | Real-time update         |
| 6   | **Thanh toán**        | Địa chỉ → Voucher → Shipping → Payment | Multi-step checkout      |
| 7   | **Đơn hàng**          | Xem lịch sử + Theo dõi trạng thái      | Order tracking           |
| 8   | **Yêu thích**         | Lưu sản phẩm yêu thích                 | Wishlist                 |
| 9   | **Đánh giá**          | Review + Rating sản phẩm               | Star rating              |
| 10  | **Chat**              | Nhắn tin với shop                      | Real-time (SignalR)      |
| 11  | **Voucher**           | Áp dụng mã giảm giá                    | Validation               |
| 12  | **Xem Shop**          | Trang công khai của shop               | Shop profile             |

### PHÍA CHỦ SHOP

| #   | Tính năng            | Mô tả ngắn                   | Điểm nổi bật       |
| --- | -------------------- | ---------------------------- | ------------------ |
| 1   | **Đăng ký Shop**     | Tạo shop mới                 | Multi-step form    |
| 2   | **Dashboard**        | Thống kê doanh thu, đơn hàng | Charts (Recharts)  |
| 3   | **Quản lý sản phẩm** | CRUD sản phẩm + Variants     | Drag & Drop images |
| 4   | **Quản lý đơn hàng** | Xử lý đơn hàng               | Status workflow    |
| 5   | **Voucher**          | Tạo mã giảm giá              | Discount rules     |
| 6   | **Khuyến mãi**       | Mua X tặng Y                 | Promotion engine   |
| 7   | **Flash Sale**       | Đăng ký sản phẩm Flash Sale  | Time-limited deals |
| 8   | **Chat**             | Trả lời khách hàng           | Real-time          |
| 9   | **Đánh giá**         | Xem/Phản hồi review          | Review management  |

---

## 🔥 TÍNH NĂNG NỔI BẬT ĐỂ DEMO

### 1. Product Variants System

- Sản phẩm có nhiều biến thể (Size, Màu sắc...)
- Mỗi variant có giá, tồn kho riêng
- UI chọn variant trực quan

### 2. Real-time Chat (SignalR)

- Chat 2 chiều Customer ↔ Shop
- Hiển thị trạng thái online
- Lịch sử tin nhắn

### 3. Checkout Flow

- Quản lý địa chỉ giao hàng
- Tích hợp tính phí ship (GoShip)
- Áp dụng voucher + Khuyến mãi
- Tính tổng tiền real-time

### 4. Promotion System

- **Voucher:** Giảm giá theo % hoặc số tiền
- **Buy X Get Y:** Mua sản phẩm A tặng sản phẩm B
- **Flash Sale:** Giảm giá theo khung giờ

### 5. Shop Dashboard

- Biểu đồ doanh thu
- Thống kê đơn hàng
- Todo list công việc

---

## 🛣️ ROUTES CHÍNH

```
CUSTOMER:
/                     → Trang chủ
/san-pham             → Danh sách sản phẩm
/san-pham/[slug]      → Chi tiết sản phẩm
/tim-kiem             → Tìm kiếm
/gio-hang             → Giỏ hàng
/thanh-toan           → Thanh toán
/don-hang             → Đơn hàng của tôi
/yeu-thich            → Sản phẩm yêu thích
/tai-khoan            → Tài khoản

SHOP OWNER:
/shop/dashboard       → Dashboard
/shop/san-pham        → Quản lý sản phẩm
/shop/don-hang        → Quản lý đơn hàng
/shop/chien-dich      → Voucher & Khuyến mãi
/shop/flash-sale      → Flash Sale
```

---

## 📁 CẤU TRÚC CODE

```
src/
├── app/              # Routes (Next.js App Router)
├── features/         # Feature modules
│   ├── customer/     # 14 features khách hàng
│   └── shop/         # 9 features chủ shop
├── shared/           # Code dùng chung
│   ├── components/   # UI components (shadcn/ui)
│   ├── hooks/        # Shared hooks
│   └── services/     # HTTP clients, Auth
└── providers/        # React providers
```

---

## 🎬 GỢI Ý FLOW DEMO

### Flow 1: Customer Journey (5-7 phút)

1. Đăng nhập → 2. Xem sản phẩm → 3. Chọn variant → 4. Thêm giỏ hàng → 5. Áp voucher → 6. Thanh toán → 7. Xem đơn hàng

### Flow 2: Shop Owner Journey (5-7 phút)

1. Dashboard → 2. Thêm sản phẩm mới → 3. Tạo voucher → 4. Đăng ký Flash Sale → 5. Xử lý đơn hàng

### Flow 3: Real-time Features (3-5 phút)

1. Customer gửi tin nhắn → 2. Shop nhận và trả lời → 3. Demo real-time update

---

## 💡 ĐIỂM MẠNH KỸ THUẬT

1. **Feature-based Architecture** - Code tổ chức theo tính năng, dễ maintain
2. **Type-safe** - TypeScript toàn bộ
3. **Server Components** - Tối ưu performance với Next.js 15
4. **Caching Strategy** - TanStack Query + ISR
5. **Dual API** - Tích hợp cả .NET và Java backend
6. **Real-time** - SignalR cho chat
7. **Responsive UI** - Tailwind CSS + shadcn/ui

---

# 🤖 PROMPT CHO AI LÊN KẾ HOẠCH THUYẾT TRÌNH

Copy prompt dưới đây và paste vào ChatGPT hoặc AI khác:

---

```
Tôi có một dự án e-commerce tên PeShop với các thông tin sau:

## TỔNG QUAN
- Nền tảng thương mại điện tử Việt Nam
- 2 loại user: Khách hàng & Chủ shop
- Tech: Next.js 15, React 19, TypeScript, TanStack Query, Tailwind CSS
- Backend: .NET + Java (dual API)

## TÍNH NĂNG KHÁCH HÀNG (14 features)
1. Đăng ký/Đăng nhập (OTP email)
2. Trang chủ (banner, sản phẩm nổi bật)
3. Xem sản phẩm (filter, sort, pagination)
4. Chi tiết sản phẩm (variants: size, màu)
5. Tìm kiếm (auto-suggest)
6. Giỏ hàng (CRUD)
7. Thanh toán (địa chỉ → voucher → shipping → payment)
8. Đơn hàng (lịch sử, tracking)
9. Yêu thích (wishlist)
10. Đánh giá sản phẩm (star rating)
11. Chat với shop (real-time SignalR)
12. Áp dụng voucher
13. Xem trang shop
14. Danh mục sản phẩm

## TÍNH NĂNG CHỦ SHOP (9 features)
1. Đăng ký shop
2. Dashboard (thống kê, biểu đồ)
3. Quản lý sản phẩm (CRUD + variants + drag-drop ảnh)
4. Quản lý đơn hàng (xử lý trạng thái)
5. Tạo voucher (giảm giá)
6. Tạo khuyến mãi (mua X tặng Y)
7. Đăng ký Flash Sale
8. Chat với khách
9. Quản lý đánh giá

## ĐIỂM NỔI BẬT
- Product Variants (sản phẩm nhiều biến thể)
- Real-time Chat (SignalR)
- Multi-step Checkout
- Promotion System (voucher + buy X get Y + flash sale)
- Shop Dashboard với charts

## YÊU CẦU
Hãy giúp tôi lên kế hoạch thuyết trình/demo dự án này trong khoảng 15-20 phút với các yêu cầu:
1. Phân chia thời gian hợp lý cho từng phần
2. Chọn ra những tính năng ấn tượng nhất để demo
3. Đề xuất flow demo mạch lạc, không bị nhàm chán
4. Gợi ý những điểm cần nhấn mạnh về kỹ thuật
5. Chuẩn bị sẵn data demo (tên sản phẩm, giá, voucher...)
6. Dự phòng nếu có lỗi khi demo

Hãy cho tôi một kế hoạch chi tiết theo format:
- Timeline từng phần
- Script nói gì ở mỗi phần
- Những điểm cần click/thao tác
- Câu hỏi có thể được hỏi và cách trả lời
```

---

## 📝 GHI CHÚ THÊM

### Data cần chuẩn bị trước demo:

- [ ] 1 tài khoản customer đã có đơn hàng
- [ ] 1 tài khoản shop owner có sản phẩm
- [ ] Vài sản phẩm với variants (size S/M/L, màu đỏ/xanh)
- [ ] 1-2 voucher còn hiệu lực
- [ ] 1 Flash Sale đang diễn ra
- [ ] Vài tin nhắn chat sẵn

### Những thứ có thể gây lỗi khi demo:

- API timeout → Chuẩn bị video backup
- Session hết hạn → Đăng nhập sẵn trước demo
- Real-time không connect → Refresh page

### Câu hỏi thường gặp:

1. "Tại sao dùng 2 backend?" → Microservices, team chia việc
2. "Tại sao Next.js?" → SEO, SSR, performance
3. "Chat real-time như nào?" → SignalR WebSocket
4. "Bảo mật?" → JWT, HTTP-only cookies, middleware guard
