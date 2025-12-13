# Product Excel Import/Export API Documentation

## Tổng quan

API này cho phép shop xuất danh sách sản phẩm ra file Excel và import lại để cập nhật nhanh thông tin sản phẩm.

## 1. Export Products to Excel

### Endpoint
```
GET /shop/product/export
```

### Mô tả
Xuất tất cả sản phẩm của shop hiện tại ra file Excel. Mỗi variant sẽ được xuất thành 1 dòng riêng biệt.

### Authentication
- **Required**: Yes
- **Authority**: `Shop`
- **Header**: `Authorization: Bearer <token>`

### Request
- **Method**: GET
- **Query Parameters**: Không có

### Response
- **Content-Type**: `application/octet-stream`
- **Content-Disposition**: `attachment; filename=products.xlsx`
- **Body**: File Excel (.xlsx)

### Format Excel

| Cột | Tên | Mô tả | Bắt buộc |
|-----|-----|-------|----------|
| 1 | Product ID | UUID của product | ✅ |
| 2 | Name | Tên sản phẩm | ❌ |
| 3 | Phân loại hàng | Các giá trị PropertyValue của variant, cách nhau bằng dấu phẩy (ví dụ: "Đỏ, L", "Xanh, M") | ❌ |
| 4 | Price | Giá của variant | ❌ |
| 5 | Quantity | Số lượng của variant | ❌ |
| 6 | Variant ID | ID của variant | ✅ |

### Ví dụ Excel

| Product ID | Name | Phân loại hàng | Price | Quantity | Variant ID |
|------------|------|----------------|-------|----------|------------|
| uuid-123 | Áo thun | Đỏ, L | 100000 | 50 | 1 |
| uuid-123 | Áo thun | Xanh, M | 120000 | 30 | 2 |
| uuid-456 | Quần jean | 32, Xanh | 200000 | 20 | 5 |

### Ví dụ sử dụng

#### cURL
```bash
curl -X GET "https://api.example.com/shop/product/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o products.xlsx
```

#### JavaScript (Fetch)
```javascript
fetch('https://api.example.com/shop/product/export', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.xlsx';
  a.click();
});
```

#### Postman
1. Method: GET
2. URL: `https://api.example.com/shop/product/export`
3. Headers:
   - `Authorization: Bearer YOUR_TOKEN`
4. Send → File sẽ được download tự động

### Lưu ý
- File Excel sẽ chứa tất cả sản phẩm của shop hiện tại (trừ sản phẩm đã xóa - status = 2)
- Mỗi variant = 1 dòng riêng biệt
- Nếu product không có variant, vẫn sẽ có 1 dòng với thông tin product (Price và Quantity = 0)

---

## 2. Import Products from Excel

### Endpoint
```
POST /shop/product/import
```

### Mô tả
Import file Excel để cập nhật thông tin sản phẩm. Chỉ cập nhật các bản ghi có Product ID và Variant ID hợp lệ.

### Authentication
- **Required**: Yes
- **Authority**: `Shop`
- **Header**: `Authorization: Bearer <token>`

### Request
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file` (MultipartFile): File Excel (.xlsx hoặc .xls) - **Bắt buộc**

### Format Excel (giống export)

| Cột | Tên | Mô tả | Cập nhật |
|-----|-----|-------|----------|
| 1 | Product ID | UUID của product | ❌ (Chỉ để xác định) |
| 2 | Name | Tên sản phẩm | ✅ (Nếu có giá trị) |
| 3 | Phân loại hàng | Các giá trị PropertyValue | ❌ (Chỉ để tham khảo) |
| 4 | Price | Giá của variant | ✅ (Nếu có giá trị, phải >= 0) |
| 5 | Quantity | Số lượng của variant | ✅ (Nếu có giá trị, phải >= 0) |
| 6 | Variant ID | ID của variant | ❌ (Chỉ để xác định) |

### Quy tắc cập nhật

1. **Product ID**: 
   - Bắt buộc phải có
   - Phải tồn tại trong hệ thống
   - Phải thuộc về shop hiện tại (tự động kiểm tra quyền)

2. **Variant ID**: 
   - Bắt buộc phải có
   - Phải tồn tại trong hệ thống
   - Phải thuộc về product tương ứng (tự động kiểm tra)
   - Phải thuộc về shop hiện tại (tự động kiểm tra quyền)

3. **Name**: 
   - Cập nhật tên sản phẩm nếu có giá trị
   - Slug sẽ tự động được cập nhật theo tên mới

4. **Price**: 
   - Cập nhật giá variant nếu có giá trị
   - Phải >= 0
   - Sau khi cập nhật, giá product sẽ tự động = giá variant thấp nhất

5. **Quantity**: 
   - Cập nhật số lượng variant nếu có giá trị
   - Phải >= 0

6. **Phân loại hàng**: 
   - Không được sử dụng để cập nhật
   - Chỉ để tham khảo

### Bảo mật

- ✅ Tự động kiểm tra quyền truy cập product (chỉ cập nhật được sản phẩm của shop mình)
- ✅ Tự động kiểm tra quyền truy cập variant (chỉ cập nhật được variant của shop mình)
- ✅ Xác minh variant thuộc về product tương ứng (tránh giả mạo ID)
- ✅ Validate dữ liệu (Price >= 0, Quantity >= 0)

### Response

#### Thành công (200 OK)
```json
{
  "error": null,
  "content": null
}
```

#### Lỗi - File không hợp lệ (400 Bad Request)
```json
{
  "error": {
    "message": "Invalid file type. Only Excel files (.xlsx, .xls) are allowed",
    "exception": "BadRequestException"
  },
  "content": null
}
```

#### Lỗi - File trống (400 Bad Request)
```json
{
  "error": {
    "message": "File is required",
    "exception": "BadRequestException"
  },
  "content": null
}
```

#### Lỗi - Import có lỗi (400 Bad Request)
```json
{
  "error": {
    "message": "Import completed with errors. Success: 5, Failed: 2. Errors: Row 3: Invalid Price format; Row 7: Variant does not belong to this product",
    "exception": "BadRequestException"
  },
  "content": null
}
```

### Ví dụ sử dụng

#### cURL
```bash
curl -X POST "https://api.example.com/shop/product/import" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@products.xlsx"
```

#### JavaScript (Fetch)
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('https://api.example.com/shop/product/import', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.error) {
    console.error('Error:', data.error.message);
  } else {
    console.log('Import successful!');
  }
});
```

#### Postman
1. Method: POST
2. URL: `https://api.example.com/shop/product/import`
3. Headers:
   - `Authorization: Bearer YOUR_TOKEN`
4. Body:
   - Chọn `form-data`
   - Key: `file` (type: File)
   - Value: Chọn file Excel
5. Send

### Ví dụ file Excel để import

| Product ID | Name | Phân loại hàng | Price | Quantity | Variant ID |
|------------|------|----------------|-------|----------|------------|
| uuid-123 | Áo thun mới | Đỏ, L | 150000 | 60 | 1 |
| uuid-123 | Áo thun mới | Xanh, M | 130000 | 40 | 2 |
| uuid-456 | Quần jean cập nhật | 32, Xanh | 250000 | 25 | 5 |

**Kết quả:**
- Product `uuid-123`: Tên được cập nhật thành "Áo thun mới", giá product = 130000 (giá variant thấp nhất)
- Variant ID 1: Price = 150000, Quantity = 60
- Variant ID 2: Price = 130000, Quantity = 40
- Product `uuid-456`: Tên được cập nhật thành "Quần jean cập nhật", giá product = 250000
- Variant ID 5: Price = 250000, Quantity = 25

### Lưu ý

1. **File Excel phải có đúng format** như file export (cùng số cột, cùng thứ tự)
2. **Cột "Phân loại hàng" không được sử dụng** để cập nhật, chỉ để tham khảo
3. **Nếu có lỗi ở một số dòng**, các dòng hợp lệ vẫn được cập nhật
4. **Sau khi cập nhật variant**, giá product sẽ tự động cập nhật = giá variant thấp nhất
5. **Chỉ cập nhật khi có giá trị**: Nếu để trống Name, Price hoặc Quantity thì không cập nhật
6. **Bảo mật**: Không thể cập nhật sản phẩm của shop khác (tự động kiểm tra quyền)

### Các lỗi thường gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|------------|-----------|
| `Product ID is required` | Thiếu Product ID | Điền Product ID vào cột đầu tiên |
| `Variant ID is required` | Thiếu Variant ID | Điền Variant ID vào cột cuối cùng |
| `Invalid Variant ID format` | Variant ID không phải số | Kiểm tra lại Variant ID |
| `Invalid Price format` | Price không phải số | Kiểm tra lại định dạng số (ví dụ: 100000 thay vì "100,000") |
| `Price must be >= 0` | Price âm | Đảm bảo Price >= 0 |
| `Quantity must be >= 0` | Quantity âm | Đảm bảo Quantity >= 0 |
| `Variant does not belong to this product` | Variant ID không thuộc về Product ID | Kiểm tra lại Product ID và Variant ID |
| `Product is deleted` | Product đã bị xóa | Không thể cập nhật product đã xóa |
| `Access denied` | Không có quyền truy cập | Chỉ có thể cập nhật sản phẩm của shop mình |

---

## Workflow đề xuất

1. **Export** sản phẩm hiện tại ra Excel
2. **Chỉnh sửa** file Excel:
   - Sửa Name (nếu cần)
   - Sửa Price (nếu cần)
   - Sửa Quantity (nếu cần)
   - **KHÔNG** sửa Product ID, Variant ID, Phân loại hàng
3. **Import** file Excel đã chỉnh sửa
4. Kiểm tra kết quả (thành công hoặc lỗi)

---

## Best Practices

1. ✅ **Luôn export trước khi import** để đảm bảo format đúng
2. ✅ **Backup dữ liệu** trước khi import số lượng lớn
3. ✅ **Test với file nhỏ** trước khi import toàn bộ
4. ✅ **Kiểm tra kỹ Product ID và Variant ID** trước khi import
5. ✅ **Không xóa hoặc thay đổi** cột Product ID và Variant ID
6. ✅ **Sử dụng số nguyên** cho Price và Quantity (không dùng dấu phẩy, dấu chấm phân cách)

---

## Support

Nếu gặp vấn đề, vui lòng liên hệ support team hoặc kiểm tra:
- Format file Excel có đúng không
- Product ID và Variant ID có hợp lệ không
- Có quyền truy cập sản phẩm không
- Dữ liệu có hợp lệ không (Price >= 0, Quantity >= 0)

