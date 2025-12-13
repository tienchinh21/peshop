# Review Controller API Documentation

Tài liệu hướng dẫn sử dụng các API quản lý đánh giá (Review) cho Shop.

## Yêu cầu xác thực

Tất cả các API trong controller này yêu cầu:
- **Authentication**: JWT Token hợp lệ
- **Authorization**: User phải có quyền `Shop`

---

## 1. Lấy danh sách đánh giá

### Endpoint
```
GET /shop/reviews
```

### Mô tả
Trả về danh sách đánh giá của shop hiện tại. API này hỗ trợ phân trang, sắp xếp và lọc dữ liệu.

**Lưu ý**: API tự động lọc chỉ lấy các review thuộc về shop của user đang đăng nhập.

### Request Parameters

#### Query Parameters

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| `page` | Integer | Không | Số trang (bắt đầu từ 0). Mặc định: 0 |
| `size` | Integer | Không | Số phần tử mỗi trang. Mặc định: 20 |
| `sort` | String | Không | Sắp xếp theo format: `property,(asc\|desc)`. Ví dụ: `createdAt,desc` |
| `filter` | String | Không | Biểu thức lọc theo cú pháp Spring Filter |

#### Cách sử dụng Filter (Spring Filter)

**Toán tử so sánh:**
- `:` - So sánh bằng
- `>` - Lớn hơn
- `>=` - Lớn hơn hoặc bằng
- `<` - Nhỏ hơn
- `<=` - Nhỏ hơn hoặc bằng

**Toán tử logic:**
- `and` - Và
- `or` - Hoặc
- `not` - Phủ định

**So khớp chuỗi:**
- `~` - LIKE (phân biệt hoa thường)
- `~~` - LIKE (không phân biệt hoa thường)

**Lưu ý**: Để so khớp chính xác toàn bộ chuỗi, sử dụng `:` thay vì `~`.

### Ví dụ Request

#### 1. Lấy tất cả reviews (phân trang mặc định)
```http
GET /shop/reviews
```

#### 2. Lọc theo rating
```http
GET /shop/reviews?page=0&size=10&filter=rating : 5
```

#### 3. Lọc reviews có rating >= 4
```http
GET /shop/reviews?page=0&size=10&filter=rating >= 4
```

#### 4. Lọc theo tên sản phẩm
```http
GET /shop/reviews?page=0&size=10&filter=product.name ~~ 'iphone'
```

#### 5. Lọc theo tên người dùng
```http
GET /shop/reviews?page=0&size=10&filter=user.name ~~ 'john'
```

#### 6. Lọc theo ngày tạo (reviews mới nhất)
```http
GET /shop/reviews?page=0&size=10&sort=createdAt,desc&filter=createdAt >= '2025-01-01T00:00:00Z'
```

#### 7. Lọc phức tạp: Rating cao và có hình ảnh
```http
GET /shop/reviews?page=0&size=10&filter=rating >= 4 and urlImg != null
```

#### 8. Lọc theo ID sản phẩm
```http
GET /shop/reviews?page=0&size=10&filter=product.id : 'product-uuid-123'
```

### Response Structure

**Status Code**: `200 OK`

```json
{
  "info": {
    "page": 0,
    "size": 10,
    "pages": 5,
    "total": 50
  },
  "response": [
    {
      "id": 1,
      "rating": 5,
      "content": "Sản phẩm rất tốt, giao hàng nhanh",
      "urlImg": "https://example.com/review-image.jpg",
      "user": {
        "name": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar.jpg"
      },
      "product": {
        "id": "product-uuid-123",
        "name": "iPhone 15 Pro Max",
        "imgMain": "https://example.com/product-image.jpg"
      },
      "variant": {
        "id": 1,
        "price": 29990000.00,
        "quantity": 100,
        "status": 1,
        "variantValues": [
          {
            "id": 1,
            "value": "256GB",
            "imgUrl": null
          },
          {
            "id": 2,
            "value": "Titanium Blue",
            "imgUrl": "https://example.com/color.jpg"
          }
        ]
      },
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### Response Fields

#### Pagination Info
| Field | Type | Mô tả |
|-------|------|-------|
| `info.page` | Integer | Trang hiện tại (bắt đầu từ 0) |
| `info.size` | Integer | Số phần tử mỗi trang |
| `info.pages` | Integer | Tổng số trang |
| `info.total` | Long | Tổng số phần tử |

#### Review Response
| Field | Type | Mô tả |
|-------|------|-------|
| `id` | Integer | ID của review |
| `rating` | Integer | Điểm đánh giá (1-5) |
| `content` | String | Nội dung đánh giá |
| `urlImg` | String | URL hình ảnh đính kèm (nếu có) |
| `user` | Object | Thông tin người đánh giá |
| `user.name` | String | Tên người dùng |
| `user.avatar` | String | URL avatar người dùng |
| `product` | Object | Thông tin sản phẩm được đánh giá |
| `product.id` | String | ID sản phẩm |
| `product.name` | String | Tên sản phẩm |
| `product.imgMain` | String | Hình ảnh chính của sản phẩm |
| `variant` | Object | Thông tin biến thể sản phẩm |
| `variant.id` | Integer | ID biến thể |
| `variant.price` | BigDecimal | Giá biến thể |
| `variant.quantity` | Integer | Số lượng tồn kho |
| `variant.status` | Integer | Trạng thái biến thể |
| `variant.variantValues` | Array | Danh sách giá trị thuộc tính |
| `createdAt` | Instant | Thời gian tạo review (ISO 8601) |

---

## 2. Trả lời đánh giá

### Endpoint
```
PUT /shop/reviews/{id}/reply
```

### Mô tả
Cho phép shop trả lời một đánh giá cụ thể. Shop chỉ có thể trả lời các đánh giá thuộc về shop của mình.

### Path Parameters

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| `id` | Integer | Có | ID của review cần trả lời |

### Request Body

```json
{
  "replyContent": "Cảm ơn bạn đã đánh giá. Chúng tôi rất vui khi nhận được phản hồi tích cực từ bạn!"
}
```

#### Request Body Fields

| Field | Type | Bắt buộc | Validation | Mô tả |
|-------|------|----------|------------|-------|
| `replyContent` | String | Có | @NotBlank | Nội dung trả lời của shop |

### Ví dụ Request

#### Trả lời review có ID = 1
```http
PUT /shop/reviews/1/reply
Content-Type: application/json

{
  "replyContent": "Cảm ơn bạn đã đánh giá. Chúng tôi sẽ cố gắng cải thiện dịch vụ tốt hơn!"
}
```

### Response

**Status Code**: `204 No Content`

Response body rỗng khi thành công.

### Error Responses

#### 400 Bad Request
Khi `replyContent` rỗng hoặc null:
```json
{
  "error": {
    "message": "Reply content is required",
    "exception": "jakarta.validation.ConstraintViolationException"
  },
  "content": null
}
```

#### 404 Not Found
Khi review không tồn tại hoặc không thuộc về shop:
```json
{
  "error": {
    "message": "Review not found",
    "exception": "ResourceNotFoundException"
  },
  "content": null
}
```

#### 401 Unauthorized
Khi không có token hoặc token không hợp lệ:
```json
{
  "error": {
    "message": "Unauthorized",
    "exception": "JwtException"
  },
  "content": null
}
```

#### 403 Forbidden
Khi user không có quyền Shop:
```json
{
  "error": {
    "message": "Access Denied",
    "exception": "AccessDeniedException"
  },
  "content": null
}
```

---

## Ví dụ sử dụng với cURL

### 1. Lấy danh sách reviews
```bash
curl -X GET "http://localhost:8080/shop/reviews?page=0&size=10&sort=createdAt,desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Lọc reviews có rating >= 4
```bash
curl -X GET "http://localhost:8080/shop/reviews?page=0&size=10&filter=rating >= 4" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Trả lời review
```bash
curl -X PUT "http://localhost:8080/shop/reviews/1/reply" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "replyContent": "Cảm ơn bạn đã đánh giá!"
  }'
```

---

## Lưu ý quan trọng

1. **Tự động lọc theo Shop**: API GET `/shop/reviews` tự động chỉ trả về reviews thuộc về shop của user đang đăng nhập. Không cần thêm filter cho shop.

2. **Filter với nested fields**: Khi filter theo các field của entity liên quan (như `product.name`, `user.name`), sử dụng dấu chấm (`.`) để truy cập.

3. **Date/Time format**: Khi filter theo `createdAt`, sử dụng format ISO 8601: `'2025-01-01T00:00:00Z'`

4. **Pagination**: Trang bắt đầu từ 0, không phải 1.

5. **Authorization**: Shop chỉ có thể trả lời reviews thuộc về shop của mình. Nếu cố gắng trả lời review của shop khác, sẽ nhận lỗi 404.

---

## Các field có thể filter trong Review

| Field | Type | Ví dụ filter |
|-------|------|--------------|
| `id` | Integer | `id : 1` |
| `rating` | Integer | `rating >= 4` |
| `content` | String | `content ~~ 'tốt'` |
| `urlImg` | String | `urlImg != null` |
| `createdAt` | Instant | `createdAt >= '2025-01-01T00:00:00Z'` |
| `product.id` | String | `product.id : 'uuid-123'` |
| `product.name` | String | `product.name ~~ 'iphone'` |
| `user.name` | String | `user.name ~~ 'john'` |
| `variant.id` | Integer | `variant.id : 1` |
