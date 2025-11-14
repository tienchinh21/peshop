import {
  ProductVariant,
  PropertyValue,
  ProductClassification,
} from "@/types/shops/product.type";
import { UIVariant } from "@/hooks/useProductCreation";
import type { Product } from "@/types/users/product.types";

export const transformVariantsForAPI = (
  uiVariants: UIVariant[],
  classifications: ProductClassification[],
  uploadedVariantImages: { [key: string]: string }
): { propertyValues: PropertyValue[] | null; variants: ProductVariant[] } => {
  if (classifications.length === 0) {
    const variants: ProductVariant[] = uiVariants.map((variant) => ({
      variantCreateDto: {
        price: variant.price,
        quantity: variant.stock,
        status: 1,
      },
      code: null,
    }));

    return {
      propertyValues: null,
      variants,
    };
  }

  const propertyValueMap = new Map<string, PropertyValue>();
  let codeCounter = 1;

  classifications.forEach((classification, level) => {
    classification.values.forEach((value) => {
      const key = `${classification.propertyId}:${value}`;

      if (!propertyValueMap.has(key)) {
        const imageKey = level === 0 ? value : null;
        const urlImage = imageKey
          ? uploadedVariantImages[imageKey] || null
          : null;

        propertyValueMap.set(key, {
          value: value,
          propertyProductId: classification.propertyId,
          level: level,
          urlImage: urlImage,
          code: codeCounter++,
        });
      }
    });
  });

  const propertyValues = Array.from(propertyValueMap.values());

  const variants: ProductVariant[] = uiVariants.map((variant) => {
    const codes: number[] = variant.values.map((val) => {
      const key = `${val.propertyId}:${val.value}`;
      const propertyValue = propertyValueMap.get(key);
      if (!propertyValue) {
        throw new Error(`PropertyValue not found for key: ${key}`);
      }
      return propertyValue.code;
    });

    return {
      variantCreateDto: {
        price: variant.price,
        quantity: variant.stock,
        status: variant.status ?? 1,
      },
      code: codes,
    };
  });

  return {
    propertyValues,
    variants,
  };
};

export const validateProductData = (data: {
  productName: string;
  productImages: File[];
  selectedCategory: any;
  variants: UIVariant[];
  productInformations: any[];
}): string[] => {
  const errors: string[] = [];

  if (!data.productName || data.productName.trim().length < 10) {
    errors.push("Tên sản phẩm phải có ít nhất 10 ký tự");
  }

  if (data.productImages.length === 0) {
    errors.push("Vui lòng thêm ít nhất 1 hình ảnh sản phẩm");
  }

  if (!data.selectedCategory) {
    errors.push("Vui lòng chọn ngành hàng");
  }

  if (data.variants.length === 0) {
    errors.push("Vui lòng thêm ít nhất 1 phân loại sản phẩm");
  } else {
    const invalidVariants = data.variants.filter(
      (v) => v.price <= 0 || v.stock < 0
    );
    if (invalidVariants.length > 0) {
      errors.push("Tất cả phân loại phải có giá > 0 và số lượng >= 0");
    }
  }

  return errors;
};

export const isValidProduct = (product: unknown): product is Product => {
  if (!product || typeof product !== "object") {
    return false;
  }

  const p = product as Partial<Product>;

  return !!(
    p.id &&
    typeof p.id === "string" &&
    p.name &&
    typeof p.name === "string" &&
    p.slug &&
    typeof p.slug === "string" &&
    typeof p.price === "number" &&
    p.image &&
    typeof p.image === "string"
  );
};

export const filterValidProducts = (products: unknown[]): Product[] => {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.filter(isValidProduct);
};

export const getProductKey = (product: unknown, index: number): string => {
  if (isValidProduct(product)) {
    return product.id;
  }
  return `product-fallback-${index}`;
};
