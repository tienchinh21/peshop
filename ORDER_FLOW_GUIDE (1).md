# Hướng Dẫn Chi Tiết Luồng Đặt Hàng (Order Flow)

## Tổng Quan Luồng Đặt Hàng

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  1. Tạo Order   │───▶│  2. Tính Phí     │───▶│  3. Áp Dụng     │───▶│  4. Tính Tổng    │───▶│  5. Tạo Order   │
│     Ảo          │    │     Ship V2      │    │     Voucher     │    │     Tiền         │    │     Thực        │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Yêu Cầu Chung

### Headers (Tất cả API)
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## Bước 1: Tạo Đơn Hàng Ảo (Virtual Order)

### Mục đích
- Tạo đơn hàng tạm thời từ các sản phẩm được chọn
- Đơn hàng được lưu trên Redis với TTL 60 phút
- Backend tự động kiểm tra và áp dụng FlashSale nếu có

### API Endpoint
```
POST /Order/create-virtual-order
```

### Request Body (Tối Thiểu)
```json
{
  "userAddressId": "addr_001",
  "items": [
    {
      "productId": "prod_001",
      "variantId": 123,
      "quantity": 2
    },
    {
      "productId": "prod_002",
      "variantId": 456,
      "quantity": 1
    }
  ]
}
```

### Giải thích Request
| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `userAddressId` | ✅ | ID địa chỉ giao hàng của user |
| `items` | ✅ | Danh sách sản phẩm |
| `items[].productId` | ✅ | ID sản phẩm |
| `items[].variantId` | ✅ | ID biến thể sản phẩm |
| `items[].quantity` | ✅ | Số lượng (>= 1) |

> ⚠️ **Lưu ý quan trọng:**
> - KHÔNG cần truyền các field: `priceOriginal`, `categoryId`, `shopId`, `flashSaleProductId`, `flashSalePercentDecrease`, `flashSalePrice`
> - Backend sẽ tự động tính toán và fill các giá trị này
> - FlashSale được tự động kiểm tra và áp dụng bởi Backend

### Response Thành Công (200 OK)
```json
{
  "status": true,
  "message": "Đơn hàng đã được tạo thành công",
  "order": {
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "recipientName": "Nguyễn Văn A",
    "recipientPhone": "0901234567",
    "userFullNewAddress": "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    "itemShops": [
      {
        "shopId": "shop_001",
        "shopName": "Shop ABC",
        "shopLogoUrl": "https://...",
        "products": [
          {
            "productId": "prod_001",
            "variantId": 123,
            "quantity": 2,
            "priceOriginal": 500000,
            "productName": "Áo thun nam",
            "flashSaleProductId": "fs_001",
            "flashSalePercentDecrease": 20,
            "flashSalePrice": 400000
          }
        ],
        "priceOriginal": 800000,
        "flashSaleDiscount": 200000,
        "feeShipping": 0,
        "shopGHNId": 12345,
        "shopDistrictId": 1442
      }
    ],
    "orderTotal": 0,
    "feeShippingTotal": 0,
    "discountTotal": 0,
    "flashSaleDiscountTotal": 200000,
    "amountTotal": 0,
    "hasFlashSale": true,
    "toWardCode": "20308",
    "toDistrictId": 1442,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Response Lỗi
```json
{
  "status": false,
  "message": "Số lượng sản phẩm không đủ. Sản phẩm: Áo thun nam, Số lượng hiện có: 5, Số lượng yêu cầu: 10"
}
```

---

## Bước 2: Tính Phí Vận Chuyển (Fee Shipping V2 - GHN)

### Mục đích
- Tính phí ship qua GHN (Giao Hàng Nhanh)
- Sử dụng thông tin địa chỉ đã cache trong order ảo

### 2.1. Lấy Phí Ship

#### API Endpoint
```
POST /FeeShipping/get-fee-shipping-v2
```

#### Request Body (Tối Thiểu)
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `orderId` | ✅ | ID đơn hàng ảo từ bước 1 |

#### Response Thành Công (200 OK)
```json
{
  "listFeeShipping": [
    {
      "shopId": "shop_001",
      "shopName": "Shop ABC",
      "totalFee": 35000,
      "serviceTypeId": 2,
      "serviceTypeName": "Hàng nhẹ",
      "expectedDeliveryTime": null
    },
    {
      "shopId": "shop_002",
      "shopName": "Shop XYZ",
      "totalFee": 42000,
      "serviceTypeId": 2,
      "serviceTypeName": "Hàng nhẹ",
      "expectedDeliveryTime": null
    }
  ]
}
```

### 2.2. Áp Dụng Phí Ship

#### API Endpoint
```
POST /FeeShipping/apply-fee-shipping-v2
```

#### Request Body (Tối Thiểu)
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `orderId` | ✅ | ID đơn hàng ảo |

> 💡 **Lưu ý:** API này tự động áp dụng phí ship đã tính từ bước 2.1 cho tất cả các shop trong đơn hàng.

#### Response Thành Công (200 OK)
```json
{
  "status": true,
  "message": "Áp dụng fee shipping thành công"
}
```

---

## Bước 3: Kiểm Tra & Áp Dụng Voucher

### 3.1. Kiểm Tra Voucher Khả Dụng

#### API Endpoint
```
GET /Voucher/check-eligibility?orderId={orderId}
```

#### Request (Query Parameter)
| Parameter | Bắt buộc | Mô tả |
|-----------|----------|-------|
| `orderId` | ✅ | ID đơn hàng ảo |

#### Response Thành Công (200 OK)
```json
{
  "systemVouchers": {
    "voucherType": "System",
    "vouchers": [
      {
        "isAllowed": true,
        "reason": "",
        "voucher": {
          "id": "vs_001",
          "name": "Giảm 10% toàn sàn",
          "code": "SALE10",
          "quantity": 5,
          "discountValue": 0.1,
          "maxdiscountAmount": 100000,
          "miniumOrderValue": 200000,
          "startTime": "2024-01-01T00:00:00Z",
          "endTime": "2024-01-31T23:59:59Z",
          "valueType": 0,
          "valueTypeName": "Phần trăm"
        }
      },
      {
        "isAllowed": false,
        "reason": "Đơn hàng phải có giá trị tối thiểu 500.000 ₫",
        "voucher": {
          "id": "vs_002",
          "name": "Giảm 50K",
          "code": "GIAM50K",
          "quantity": 3,
          "discountValue": 50000,
          "maxdiscountAmount": 50000,
          "miniumOrderValue": 500000,
          "valueType": 1,
          "valueTypeName": "Số tiền cố định"
        }
      }
    ],
    "bestVoucherId": "vs_001"
  },
  "shopVouchers": [
    {
      "shopId": "shop_001",
      "shopName": "Shop ABC",
      "vouchers": [
        {
          "isAllowed": true,
          "reason": "",
          "voucher": {
            "id": "vshop_001",
            "name": "Giảm 15% Shop ABC",
            "code": "SHOPABC15",
            "quantity": 10,
            "discountValue": 0.15,
            "maxdiscountAmount": 50000,
            "miniumOrderValue": 100000,
            "valueType": 0,
            "valueTypeName": "Phần trăm"
          }
        }
      ],
      "bestVoucherId": "vshop_001"
    }
  ]
}
```

### 3.2. Áp Dụng Voucher Hệ Thống (System Voucher)

#### API Endpoint
```
POST /Voucher/apply-voucher-system
```

#### Request Body (Tối Thiểu)
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "voucherId": "vs_001"
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `orderId` | ✅ | ID đơn hàng ảo |
| `voucherId` | ✅ | ID voucher hệ thống |

#### Response Thành Công (200 OK)
```json
{
  "status": true,
  "message": "System voucher applied successfully"
}
```

### 3.3. Áp Dụng Voucher Shop

#### API Endpoint
```
POST /Voucher/apply-voucher-shop
```

#### Request Body (Tối Thiểu)
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "shopId": "shop_001",
  "voucherId": "vshop_001"
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `orderId` | ✅ | ID đơn hàng ảo |
| `shopId` | ✅ | ID shop cần áp dụng voucher |
| `voucherId` | ✅ | ID voucher của shop |

#### Response Thành Công (200 OK)
```json
{
  "status": true,
  "message": "Shop voucher applied successfully"
}
```

> 💡 **Lưu ý:**
> - Mỗi đơn hàng chỉ áp dụng được **1 voucher hệ thống**
> - Mỗi shop trong đơn hàng có thể áp dụng **1 voucher shop riêng**
> - Voucher hệ thống và voucher shop có thể **kết hợp** với nhau

---

## Bước 4: Tính Toán Tổng Tiền

### Mục đích
- Tính lại tổng tiền sau khi áp dụng phí ship và voucher
- Cập nhật các giá trị: `orderTotal`, `feeShippingTotal`, `discountTotal`, `amountTotal`

### API Endpoint
```
GET /Order/Calclulate-order-total?orderId={orderId}
```

### Request (Query Parameter)
| Parameter | Bắt buộc | Mô tả |
|-----------|----------|-------|
| `orderId` | ✅ | ID đơn hàng ảo |

### Response Thành Công (200 OK)
```json
{
  "status": true,
  "message": "Đơn hàng đã được tính toán thành công",
  "order": {
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "recipientName": "Nguyễn Văn A",
    "recipientPhone": "0901234567",
    "userFullNewAddress": "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    "voucherSystemId": "vs_001",
    "voucherSystemName": "Giảm 10% toàn sàn",
    "voucherSystemValue": 80000,
    "itemShops": [
      {
        "shopId": "shop_001",
        "shopName": "Shop ABC",
        "products": [...],
        "gifts": [],
        "priceOriginal": 800000,
        "feeShipping": 35000,
        "voucherId": "vshop_001",
        "voucherName": "Giảm 15% Shop ABC",
        "voucherValue": 50000,
        "flashSaleDiscount": 200000
      }
    ],
    "orderTotal": 800000,
    "feeShippingTotal": 35000,
    "discountTotal": 130000,
    "flashSaleDiscountTotal": 200000,
    "amountTotal": 505000,
    "hasFlashSale": true
  }
}
```

### Công Thức Tính Tổng
```
amountTotal = orderTotal + feeShippingTotal - discountTotal

Trong đó:
- orderTotal: Tổng giá gốc sản phẩm (đã trừ FlashSale)
- feeShippingTotal: Tổng phí ship
- discountTotal: Tổng giảm giá từ voucher (system + shop)
```

---

## Bước 5: Tạo Đơn Hàng Thực (Create Real Order)

### Mục đích
- Xác nhận và tạo đơn hàng chính thức
- Hỗ trợ 2 phương thức thanh toán: COD và VNPay

### API Endpoint
```
POST /Order/create-order
```

### Request Body (Tối Thiểu)
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "paymentMethod": 0
}
```

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `orderId` | ✅ | ID đơn hàng ảo |
| `paymentMethod` | ✅ | Phương thức thanh toán: `0` = COD, `1` = VNPay |

### Response COD (200 OK)
```json
{
  "status": true,
  "message": "Đơn hàng đã được tạo thành công"
}
```

### Response VNPay (200 OK)
```json
"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=50500000&vnp_Command=pay&..."
```

> 💡 **Lưu ý VNPay:**
> - Response trả về URL redirect đến trang thanh toán VNPay
> - Frontend cần redirect user đến URL này
> - Sau khi thanh toán, VNPay sẽ callback về hệ thống

---

## Tóm Tắt Luồng Hoàn Chỉnh

### Luồng Tối Thiểu (Không Voucher)
```
1. POST /Order/create-virtual-order
   └─ Body: { userAddressId, items: [{ productId, variantId, quantity }] }

2. POST /FeeShipping/get-fee-shipping-v2
   └─ Body: { orderId }

3. POST /FeeShipping/apply-fee-shipping-v2
   └─ Body: { orderId }

4. GET /Order/Calclulate-order-total?orderId={orderId}

5. POST /Order/create-order
   └─ Body: { orderId, paymentMethod: 0 }
```

### Luồng Đầy Đủ (Có Voucher)
```
1. POST /Order/create-virtual-order
   └─ Body: { userAddressId, items: [{ productId, variantId, quantity }] }

2. POST /FeeShipping/get-fee-shipping-v2
   └─ Body: { orderId }

3. POST /FeeShipping/apply-fee-shipping-v2
   └─ Body: { orderId }

4. GET /Voucher/check-eligibility?orderId={orderId}

5. POST /Voucher/apply-voucher-system (Optional)
   └─ Body: { orderId, voucherId }

6. POST /Voucher/apply-voucher-shop (Optional - cho mỗi shop)
   └─ Body: { orderId, shopId, voucherId }

7. GET /Order/Calclulate-order-total?orderId={orderId}

8. POST /Order/create-order
   └─ Body: { orderId, paymentMethod: 0 hoặc 1 }
```

---

## Các API Phụ Trợ

### Xóa Đơn Hàng Ảo
```
DELETE /Order/delete-virtual-order?orderId={orderId}
```

### Cập Nhật Đơn Hàng Ảo
```
PUT /Order/update-virtual-order
Body: {
  "orderId": "...",
  "items": [{ productId, variantId, quantity }]
}
```

### Lấy Danh Sách Voucher Của User
```
GET /Voucher/get-vouchers
```

---

## Xử Lý Lỗi Thường Gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| "Đơn hàng không tồn tại" | Order đã hết hạn (>60 phút) | Tạo lại order ảo |
| "Số lượng sản phẩm không đủ" | Tồn kho không đủ | Giảm số lượng hoặc chọn sản phẩm khác |
| "Shop chưa đăng ký GHN" | Shop chưa tích hợp GHN | Liên hệ shop |
| "Voucher không hợp lệ" | Voucher hết hạn/hết lượt | Chọn voucher khác |
| "Đơn hàng chưa đạt giá trị tối thiểu" | Giá trị đơn < minOrderValue | Thêm sản phẩm hoặc chọn voucher khác |

---

## Enum Values

### PaymentMethod
| Value | Tên |
|-------|-----|
| 0 | COD |
| 1 | VNPay |

### VoucherValueType
| Value | Tên |
|-------|-----|
| 0 | Percentage (Phần trăm) |
| 1 | FixedAmount (Số tiền cố định) |
