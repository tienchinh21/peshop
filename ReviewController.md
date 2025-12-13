# ReviewController - Tài liệu API

## Tổng quan

`ReviewController` cung cấp API để quản lý đánh giá (reviews) của shop. Controller này chỉ có thể truy cập bởi người dùng có quyền `Shop` và tự động lọc các đánh giá theo shop của người dùng đang đăng nhập.

**Base URL:** `/shop/reviews`

**Yêu cầu xác thực:** Cần có quyền `Shop` (`@PreAuthorize("hasAuthority('Shop')")`)

---

## Endpoints

### 1. Lấy danh sách đánh giá

**Endpoint:** `GET /shop/reviews`

**Mô tả:** Trả về danh sách tất cả đánh giá của shop hiện tại, có thể được lọc, phân trang và sắp xếp.

**Tham số query:**

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| `page` | Integer | Không | Số trang (bắt đầu từ 0). Mặc định: 0 |
| `size` | Integer | Không | Số phần tử mỗi trang. Mặc định: 20 |
| `sort` | String | Không | Dạng `property,(asc\|desc)` — ví dụ: `createdAt,desc` |
| `filter` | String | Không | Biểu thức lọc theo cú pháp Spring Filter |

**Lưu ý quan trọng:**
- API tự động lọc chỉ trả về các đánh giá thuộc về shop của người dùng đang đăng nhập
- Các filter được truyền vào sẽ được kết hợp với điều kiện lọc theo shop

---

## Cách sử dụng Filter (Spring Filter)

### Toán tử so sánh

- `:` - So sánh bằng (equals)
- `>` - Lớn hơn
- `>=` - Lớn hơn hoặc bằng
- `<` - Nhỏ hơn
- `<=` - Nhỏ hơn hoặc bằng

**Ví dụ:**
```
rating : 5
rating >= 4
```

### Toán tử logic

- `and` - Và
- `or` - Hoặc
- `not` - Phủ định

**Ví dụ:**
```
rating >= 4 and rating <= 5
rating : 5 or rating : 4
```

### So khớp chuỗi

- `~` - Like (phân biệt hoa thường)
- `~~` - Like (không phân biệt hoa thường)

**Lưu ý:** Nếu muốn so khớp **chính xác toàn bộ chuỗi**, hãy dùng `:` thay vì `~`

**Ví dụ:**
```
content ~~ 'tốt'
content ~ 'Tốt'
```

### Truy cập thuộc tính nested

Để truy cập thuộc tính của các entity liên quan, sử dụng dấu chấm (`.`):

**Các thuộc tính có sẵn trong Review:**
- `id` - ID của đánh giá
- `rating` - Điểm đánh giá (Integer)
- `content` - Nội dung đánh giá (String)
- `urlImg` - URL hình ảnh (String)
- `createdAt` - Thời gian tạo (Instant)
- `user.name` - Tên người dùng
- `user.avatar` - Avatar người dùng
- `variant.id` - ID biến thể sản phẩm
- `product.id` - ID sản phẩm
- `order.id` - ID đơn hàng

**Ví dụ:**
```
user.name ~~ 'Nguyễn'
variant.id : 'VARIANT_ID'
product.id : 'PRODUCT_ID'
```

---

## Ví dụ sử dụng

### 1. Lấy tất cả đánh giá (không filter)

```http
GET /shop/reviews?page=0&size=10
```

### 2. Lọc đánh giá theo điểm số

```http
GET /shop/reviews?page=0&size=10&filter=rating >= 4
```

### 3. Lọc đánh giá 5 sao

```http
GET /shop/reviews?page=0&size=10&filter=rating : 5
```

### 4. Lọc đánh giá có chứa từ khóa trong nội dung

```http
GET /shop/reviews?page=0&size=10&filter=content ~~ 'tốt'
```

### 5. Lọc đánh giá theo tên người dùng

```http
GET /shop/reviews?page=0&size=10&filter=user.name ~~ 'Nguyễn'
```

### 6. Lọc đánh giá theo sản phẩm cụ thể

```http
GET /shop/reviews?page=0&size=10&filter=product.id : 'PRODUCT_ID'
```

### 7. Lọc đánh giá theo biến thể sản phẩm

```http
GET /shop/reviews?page=0&size=10&filter=variant.id : 'VARIANT_ID'
```

### 8. Lọc đánh giá từ 4 sao trở lên và có nội dung chứa "tốt"

```http
GET /shop/reviews?page=0&size=10&filter=rating >= 4 and content ~~ 'tốt'
```

### 9. Sắp xếp theo thời gian tạo (mới nhất trước)

```http
GET /shop/reviews?page=0&size=10&sort=createdAt,desc
```

### 10. Lọc và sắp xếp kết hợp

```http
GET /shop/reviews?page=0&size=10&sort=createdAt,desc&filter=rating >= 4 and content ~~ 'tốt'
```

### 11. Lọc đánh giá theo đơn hàng

```http
GET /shop/reviews?page=0&size=10&filter=order.id : 'ORDER_ID'
```

---

## Cấu trúc Response

### Response thành công (200 OK)

```json
{
  "info": {
    "page": 0,
    "size": 10,
    "pages": 5,
    "total": 47
  },
  "response": [
    {
      "id": 1,
      "rating": 5,
      "content": "Sản phẩm rất tốt, giao hàng nhanh",
      "urlImg": "https://example.com/image.jpg",
      "user": {
        "name": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar.jpg"
      },
      "variant": {
        "id": "VARIANT_ID",
        "name": "iPhone 15 Pro Max 256GB - Xanh Titan",
        "price": 29990000,
        "image": "https://example.com/variant.jpg"
      },
      "createdAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "rating": 4,
      "content": "Sản phẩm ổn, giá hợp lý",
      "urlImg": null,
      "user": {
        "name": "Trần Thị B",
        "avatar": null
      },
      "variant": {
        "id": "VARIANT_ID_2",
        "name": "Samsung Galaxy S24 Ultra 512GB - Đen",
        "price": 24990000,
        "image": "https://example.com/variant2.jpg"
      },
      "createdAt": "2025-01-14T15:20:00Z"
    }
  ]
}
```

### Cấu trúc PaginationDTO.Response

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `info` | Object | Thông tin phân trang |
| `info.page` | Integer | Số trang hiện tại (bắt đầu từ 1) |
| `info.size` | Integer | Số phần tử mỗi trang |
| `info.pages` | Integer | Tổng số trang |
| `info.total` | Long | Tổng số phần tử |
| `response` | Array | Danh sách đánh giá |

### Cấu trúc ReviewResponseDto

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| `id` | Integer | ID của đánh giá |
| `rating` | Integer | Điểm đánh giá (1-5) |
| `content` | String | Nội dung đánh giá |
| `urlImg` | String | URL hình ảnh đính kèm (có thể null) |
| `user` | Object | Thông tin người dùng |
| `user.name` | String | Tên người dùng |
| `user.avatar` | String | URL avatar người dùng (có thể null) |
| `variant` | Object | Thông tin biến thể sản phẩm |
| `createdAt` | Instant | Thời gian tạo đánh giá (ISO 8601) |

---

## Xử lý lỗi

### 401 Unauthorized
Người dùng chưa đăng nhập hoặc không có quyền `Shop`.

```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Access Denied"
}
```

### 400 Bad Request
Tham số không hợp lệ (ví dụ: filter syntax sai, page/size không hợp lệ).

```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid filter syntax"
}
```

---

## Lưu ý

1. **Tự động lọc theo Shop:** API tự động chỉ trả về các đánh giá thuộc về shop của người dùng đang đăng nhập. Không cần và không thể filter theo shop khác.

2. **Phân trang:** 
   - `page` bắt đầu từ 0 (trang đầu tiên là 0)
   - `size` mặc định là 20 nếu không chỉ định
   - Response trả về `info.page` bắt đầu từ 1 (để dễ hiểu hơn)

3. **Sắp xếp:**
   - Format: `property,direction`
   - `direction` có thể là `asc` hoặc `desc`
   - Có thể sắp xếp theo nhiều trường: `sort=createdAt,desc&sort=rating,asc`

4. **Filter:**
   - Filter được URL encode khi gửi request
   - Các filter được kết hợp với điều kiện lọc theo shop (AND)
   - Filter có thể để trống để lấy tất cả đánh giá của shop

5. **Performance:**
   - Sử dụng phân trang để tránh tải quá nhiều dữ liệu
   - Khuyến nghị `size` không quá 100

---

## Ví dụ cURL

### Lấy đánh giá 5 sao, sắp xếp mới nhất trước

```bash
curl -X GET "http://localhost:8080/shop/reviews?page=0&size=10&sort=createdAt,desc&filter=rating%20%3A%205" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Lấy đánh giá có nội dung chứa "tốt"

```bash
curl -X GET "http://localhost:8080/shop/reviews?page=0&size=10&filter=content%20~~%20'tốt'" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Tài liệu liên quan

- [Spring Filter Documentation](https://github.com/turkraft/spring-filter)
- [Spring Data JPA Specification](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#specifications)
- [ReviewService.java](../service/shop/ReviewService.java)
- [ReviewResponseDto.java](../../dto/review/ReviewResponseDto.java)

