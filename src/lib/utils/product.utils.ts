import {
  ProductVariant,
  PropertyValue,
  ProductClassification,
} from "@/types/shops/product.type";
import { UIVariant } from "@/hooks/useProductCreation";
import { v4 as uuidv4 } from "uuid";

/**
 * Generate UUID v4 (char36)
 */
const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Transform UI variants to new API format
 * Generates propertyValueId for each unique property value
 * Returns both propertyValues array and variants array
 *
 * @param uiVariants - Variants from ProductInfoSection UI
 * @param classifications - Selected classifications with property IDs
 * @param uploadedVariantImages - Map of variant value to uploaded image URL
 * @returns Object with propertyValues and variants arrays
 */
export const transformVariantsForAPI = (
  uiVariants: UIVariant[],
  classifications: ProductClassification[],
  uploadedVariantImages: { [key: string]: string }
): { propertyValues: PropertyValue[]; variants: ProductVariant[] } => {
  // Step 1: Collect all unique property values and generate IDs
  const propertyValueMap = new Map<string, PropertyValue>();

  classifications.forEach((classification, level) => {
    classification.values.forEach((value) => {
      // Create unique key: propertyProductId + value
      const key = `${classification.propertyId}:${value}`;

      if (!propertyValueMap.has(key)) {
        // Only level 0 can have images
        const imageKey = level === 0 ? value : null;
        const urlImage = imageKey
          ? uploadedVariantImages[imageKey] || null
          : null;

        propertyValueMap.set(key, {
          propertyValueId: generateUUID(), // Generate UUID
          value: value,
          propertyProductId: classification.propertyId,
          level: level,
          urlImage: urlImage,
        });
      }
    });
  });

  // Step 2: Convert map to array
  const propertyValues = Array.from(propertyValueMap.values());

  // Step 3: Transform variants to reference propertyValueIds
  const variants: ProductVariant[] = uiVariants.map((variant) => {
    const propertyValueIds: string[] = variant.values.map((val) => {
      const key = `${val.propertyId}:${val.value}`;
      const propertyValue = propertyValueMap.get(key);
      if (!propertyValue) {
        throw new Error(`PropertyValue not found for key: ${key}`);
      }
      return propertyValue.propertyValueId;
    });

    return {
      variantCreateDto: {
        price: variant.price,
        quantity: variant.stock,
        status: 1, // 1 = active
      },
      propertyValueIds: propertyValueIds,
    };
  });

  return {
    propertyValues,
    variants,
  };
};

/**
 * Validate product data before submission
 * Returns array of error messages, empty if valid
 */
export const validateProductData = (data: {
  productName: string;
  productImages: File[];
  selectedCategory: any;
  variants: UIVariant[];
  productInformations: any[];
}): string[] => {
  const errors: string[] = [];

  // Product name validation
  if (!data.productName || data.productName.trim().length < 10) {
    errors.push("Tên sản phẩm phải có ít nhất 10 ký tự");
  }

  // Product images validation
  if (data.productImages.length === 0) {
    errors.push("Vui lòng thêm ít nhất 1 hình ảnh sản phẩm");
  }

  // Category validation
  if (!data.selectedCategory) {
    errors.push("Vui lòng chọn ngành hàng");
  }

  // Variants validation
  if (data.variants.length === 0) {
    errors.push("Vui lòng thêm ít nhất 1 phân loại sản phẩm");
  } else {
    // Check each variant has price and stock
    const invalidVariants = data.variants.filter(
      (v) => v.price <= 0 || v.stock < 0
    );
    if (invalidVariants.length > 0) {
      errors.push("Tất cả phân loại phải có giá > 0 và số lượng >= 0");
    }
  }

  return errors;
};
