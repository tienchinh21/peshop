# 📋 Hướng dẫn cập nhật Product Creation theo Payload mới

## 🎯 Tổng quan thay đổi

Backend đã cập nhật payload structure với những thay đổi chính:

- Thêm field `variantLevel` để xác định số lượng variant levels
- Tách `productInformations` và `imagesProduct` ra ngoài root level
- Flat structure thay vì nested structure

---

## 🔄 So sánh Payload Structure

### ❌ Payload cũ (Current)

```json
{
  "product": {
    "name": "string",
    "description": "string",
    "categoryChildId": "string",
    "weight": 0,
    "height": 0,
    "length": 0,
    "width": 0,
    "images": [...],              // ← Nằm trong product
    "productInformations": [...]  // ← Nằm trong product
  },
  "propertyValues": [...],
  "variants": [...]
}
```

### ✅ Payload mới (New)

```json
{
  "product": {
    "name": "string",
    "description": "string",
    "categoryChildId": "string",
    "weight": 0,
    "height": 0,
    "length": 0,
    "width": 0,
    "variantLevel": 2             // ← Field mới
  },
  "productInformations": [...],   // ← Tách ra ngoài
  "propertyValues": [...],
  "variants": [...],
  "imagesProduct": [...]          // ← Tách ra ngoài, đổi tên
}
```

---

## 📊 VariantLevel Logic

### Định nghĩa variantLevel:

- **0**: Không có variant (sản phẩm đơn giản)
- **1**: Có 1 level variant (VD: chỉ có màu sắc)
- **2**: Có 2 level variant (VD: màu sắc + kích thước)

### Cách tính variantLevel:

```typescript
const calculateVariantLevel = (
  classifications: ProductClassification[]
): number => {
  return classifications.length;
};
```

---

## 🎨 Payload Examples theo từng Level

### Level 0 - Không có variant

```json
{
  "product": {
    "name": "Bút bi đơn giản",
    "description": "Bút bi màu xanh",
    "categoryChildId": "cat_123",
    "weight": 10,
    "height": 1,
    "length": 15,
    "width": 1,
    "variantLevel": 0
  },
  "productInformations": [
    {
      "name": "Chất liệu",
      "value": "Nhựa"
    }
  ],
  "propertyValues": [],
  "variants": [
    {
      "variantCreateDto": {
        "price": 5000,
        "quantity": 100,
        "status": 1
      },
      "code": []
    }
  ],
  "imagesProduct": [
    {
      "urlImage": "https://example.com/pen.jpg",
      "sortOrder": 0
    }
  ]
}
```

### Level 1 - Có 1 variant (Màu sắc)

```json
{
  "product": {
    "name": "Áo thun basic",
    "description": "Áo thun cotton thoáng mát",
    "categoryChildId": "cat_456",
    "weight": 200,
    "height": 2,
    "length": 30,
    "width": 25,
    "variantLevel": 1
  },
  "productInformations": [
    {
      "name": "Chất liệu",
      "value": "Cotton 100%"
    }
  ],
  "propertyValues": [
    {
      "value": "Đỏ",
      "propertyProductId": "color",
      "level": 0,
      "urlImage": "https://example.com/red-shirt.jpg",
      "code": 1
    },
    {
      "value": "Xanh",
      "propertyProductId": "color",
      "level": 0,
      "urlImage": "https://example.com/blue-shirt.jpg",
      "code": 2
    }
  ],
  "variants": [
    {
      "variantCreateDto": {
        "price": 150000,
        "quantity": 50,
        "status": 1
      },
      "code": [1] // Đỏ
    },
    {
      "variantCreateDto": {
        "price": 150000,
        "quantity": 30,
        "status": 1
      },
      "code": [2] // Xanh
    }
  ],
  "imagesProduct": [
    {
      "urlImage": "https://example.com/shirt-main.jpg",
      "sortOrder": 0
    }
  ]
}
```

### Level 2 - Có 2 variants (Màu sắc + Kích thước)

```json
{
  "product": {
    "name": "Áo thun nam cao cấp",
    "description": "Áo thun nam chất liệu cotton cao cấp",
    "categoryChildId": "cat_789",
    "weight": 250,
    "height": 2,
    "length": 35,
    "width": 30,
    "variantLevel": 2
  },
  "productInformations": [
    {
      "name": "Chất liệu",
      "value": "Cotton 100%"
    },
    {
      "name": "Xuất xứ",
      "value": "Việt Nam"
    }
  ],
  "propertyValues": [
    {
      "value": "Đỏ",
      "propertyProductId": "color",
      "level": 0,
      "urlImage": "https://example.com/red-variant.jpg",
      "code": 1
    },
    {
      "value": "Xanh",
      "propertyProductId": "color",
      "level": 0,
      "urlImage": "https://example.com/blue-variant.jpg",
      "code": 2
    },
    {
      "value": "Size M",
      "propertyProductId": "size",
      "level": 1,
      "urlImage": null,
      "code": 3
    },
    {
      "value": "Size L",
      "propertyProductId": "size",
      "level": 1,
      "urlImage": null,
      "code": 4
    }
  ],
  "variants": [
    {
      "variantCreateDto": {
        "price": 200000,
        "quantity": 25,
        "status": 1
      },
      "code": [1, 3] // Đỏ + Size M
    },
    {
      "variantCreateDto": {
        "price": 200000,
        "quantity": 20,
        "status": 1
      },
      "code": [1, 4] // Đỏ + Size L
    },
    {
      "variantCreateDto": {
        "price": 220000,
        "quantity": 15,
        "status": 1
      },
      "code": [2, 3] // Xanh + Size M
    },
    {
      "variantCreateDto": {
        "price": 220000,
        "quantity": 10,
        "status": 1
      },
      "code": [2, 4] // Xanh + Size L
    }
  ],
  "imagesProduct": [
    {
      "urlImage": "https://example.com/shirt-main.jpg",
      "sortOrder": 0
    },
    {
      "urlImage": "https://example.com/shirt-detail.jpg",
      "sortOrder": 1
    }
  ]
}
```

---

## 🔧 Code Changes Required

### 1. Update Type Definitions

**File: `src/types/shops/product.type.ts`**

```typescript
// ✅ Update ProductPayload
export interface ProductPayload {
  name: string;
  description: string;
  categoryChildId: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  variantLevel: number; // ← Thêm field mới
  // Bỏ images và productInformations
}

// ✅ Update CreateProductPayload
export interface CreateProductPayload {
  product: ProductPayload;
  productInformations: ProductInformation[]; // ← Tách ra ngoài
  propertyValues: PropertyValue[];
  variants: ProductVariant[];
  imagesProduct: ProductImage[]; // ← Đổi tên từ images
}
```

### 2. Update useProductCreation Hook

**File: `src/hooks/useProductCreation.ts`**

```typescript
// ✅ Thêm function tính variantLevel
const calculateVariantLevel = (
  classifications: ProductClassification[]
): number => {
  return classifications.length;
};

// ✅ Update handleSubmitProduct function
const handleSubmitProduct = async () => {
  // ... validation code giữ nguyên ...

  // Step 4: Build product payload (bỏ images và productInformations)
  const productPayload: ProductPayload = {
    name: productName,
    description: productDescription,
    categoryChildId: selectedCategory.id,
    weight,
    length: dimensions.length,
    width: dimensions.width,
    height: dimensions.height,
    variantLevel: calculateVariantLevel(selectedClassifications), // ← Thêm mới
  };

  // Step 5: Build complete payload với structure mới
  const createPayload: CreateProductPayload = {
    product: productPayload,
    productInformations: productInformations.filter(
      (info) => info.value.trim() !== ""
    ), // ← Tách ra ngoài
    propertyValues: propertyValues,
    variants: apiVariants,
    imagesProduct: productImagesWithSort, // ← Đổi tên
  };

  // ... submit code giữ nguyên ...
};
```

### 3. Update Validation Logic (Optional)

**File: `src/lib/utils/product.utils.ts`**

```typescript
// ✅ Update validation nếu cần
export const validateProductData = (data: {
  productName: string;
  productImages: File[];
  selectedCategory: any;
  variants: UIVariant[];
  selectedClassifications: ProductClassification[]; // ← Thêm để validate variantLevel
}): string[] => {
  const errors: string[] = [];

  // Existing validations...

  // ✅ Thêm validation cho variantLevel nếu cần
  const variantLevel = data.selectedClassifications.length;
  if (variantLevel > 2) {
    errors.push("Chỉ hỗ trợ tối đa 2 cấp phân loại");
  }

  return errors;
};
```

---

## 🎨 UI Updates Required

### 1. Không cần thay đổi UI Components

**Lý do:** UI hiện tại đã hoạt động tốt, chỉ cần update logic xử lý data:

- `BasicInfoSection` - Giữ nguyên
- `ProductInfoSection` - Giữ nguyên
- `OtherInfoSection` - Giữ nguyên
- `CreateProductPage` - Giữ nguyên

### 2. Có thể thêm UI hiển thị variantLevel (Optional)

```tsx
// ✅ Thêm vào BasicInfoSection hoặc ProductInfoSection
<div className="mb-4">
  <label className="text-sm font-medium text-gray-700">
    Cấp độ phân loại: {selectedClassifications.length}
  </label>
  <div className="text-xs text-gray-500 mt-1">
    {selectedClassifications.length === 0 && "Sản phẩm đơn giản"}
    {selectedClassifications.length === 1 && "1 cấp phân loại"}
    {selectedClassifications.length === 2 && "2 cấp phân loại"}
  </div>
</div>
```

---

## ✅ Testing Checklist

### 1. Test Level 0 (No variants)

- [ ] Tạo sản phẩm không có phân loại
- [ ] Kiểm tra `variantLevel: 0`
- [ ] Kiểm tra `variants` có 1 item với `code: []`

### 2. Test Level 1 (1 variant)

- [ ] Tạo sản phẩm với 1 phân loại (VD: màu sắc)
- [ ] Kiểm tra `variantLevel: 1`
- [ ] Kiểm tra `propertyValues` có đúng level 0
- [ ] Kiểm tra `variants` có đúng code references

### 3. Test Level 2 (2 variants)

- [ ] Tạo sản phẩm với 2 phân loại (VD: màu sắc + size)
- [ ] Kiểm tra `variantLevel: 2`
- [ ] Kiểm tra `propertyValues` có đúng level 0 và 1
- [ ] Kiểm tra `variants` có đúng code combinations

### 4. Test Payload Structure

- [ ] Kiểm tra `productInformations` ở root level
- [ ] Kiểm tra `imagesProduct` ở root level
- [ ] Kiểm tra `product` không chứa images và productInformations

---

## 🚀 Implementation Order

1. **Update Types** (`product.type.ts`)
2. **Update Hook Logic** (`useProductCreation.ts`)
3. **Test với Level 0** (sản phẩm đơn giản)
4. **Test với Level 1** (1 phân loại)
5. **Test với Level 2** (2 phân loại)
6. **Update Validation** (nếu cần)
7. **Add UI Enhancements** (optional)

---

## ⚠️ Lưu ý quan trọng

1. **Backward Compatibility**: Đảm bảo API endpoint hỗ trợ payload mới
2. **Error Handling**: Update error handling cho structure mới
3. **Type Safety**: Đảm bảo TypeScript types chính xác
4. **Testing**: Test kỹ lưỡng với tất cả các level variants
5. **Documentation**: Update API documentation nếu cần

---

## 📞 Support

Nếu gặp vấn đề trong quá trình implementation, kiểm tra:

1. Console errors cho type mismatches
2. Network tab cho payload structure
3. Backend logs cho validation errors
4. TypeScript compiler errors
