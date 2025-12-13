# API Documentation - Review

## POST /Review/create-review

Tạo đánh giá sản phẩm sau khi đã mua hàng.

### 🔐 Xác thực
- **Required:** Bearer Token
- **Role:** User

### 📥 Request

**Content-Type:** `multipart/form-data`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Form Data:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `OrderId` | string | ✅ | ID đơn hàng chứa sản phẩm cần đánh giá |
| `ProductId` | string | ✅ | ID sản phẩm cần đánh giá |
| `VariantId` | string | ✅ | ID biến thể sản phẩm trong đơn hàng |
| `Content` | string | ✅ | Nội dung đánh giá |
| `Rating` | int | ✅ | Số sao (1-5) |
| `Images` | File[] | ❌ | Danh sách ảnh đánh giá (JPG, PNG, WEBP, max 5MB/file) |

**Rating Values:**
- `1` = Rất tệ
- `2` = Tệ  
- `3` = Bình thường
- `4` = Tốt
- `5` = Rất tốt

### 📝 Ví dụ Request

**cURL:**
```bash
curl -X POST "https://api.example.com/Review/create-review" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "OrderId=order_123456" \
  -F "ProductId=product_789" \
  -F "VariantId=variant_001" \
  -F "Content=Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh" \
  -F "Rating=5" \
  -F "Images=@/path/to/image1.jpg" \
  -F "Images=@/path/to/image2.jpg"
```

**JavaScript (Fetch):**
```javascript
const formData = new FormData();
formData.append('OrderId', 'order_123456');
formData.append('ProductId', 'product_789');
formData.append('VariantId', 'variant_001');
formData.append('Content', 'Sản phẩm rất tốt, đóng gói cẩn thận');
formData.append('Rating', '5');

// Thêm ảnh (nếu có)
const imageFiles = document.getElementById('imageInput').files;
for (let i = 0; i < imageFiles.length; i++) {
  formData.append('Images', imageFiles[i]);
}

fetch('https://api.example.com/Review/create-review', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: formData
});
```

### 📤 Response

**200 OK - Thành công:**
```json
{
  "status": true,
  "message": "Đánh giá sản phẩm thành công"
}
```

**400 Bad Request - Lỗi validation hoặc đã đánh giá:**
```json
{
  "status": false,
  "message": "Bạn không có quyền đánh giá sản phẩm"
}
```

**401 Unauthorized:**
Token không hợp lệ hoặc hết hạn.

**403 Forbidden:**
Không có quyền (không phải role User).

### ⚠️ Lưu ý

- `OrderId`, `ProductId`, `VariantId` phải khớp với thông tin trong đơn hàng đã mua
- Chỉ đánh giá được sản phẩm trong đơn hàng đã hoàn thành (đã nhận hàng)
- Mỗi sản phẩm trong một đơn hàng chỉ được đánh giá **1 lần duy nhất**
- Rating phải là số nguyên từ 1 đến 5
- Content không được để trống
- Nếu upload ảnh thất bại, đánh giá vẫn được tạo nhưng không có ảnh
