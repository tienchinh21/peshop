// ============ Product Image Types ============
export interface ProductImage {
  urlImage: string;
  sortOrder: number;
}

// ============ Product Information Types ============
export interface ProductInformation {
  name: string;
  value: string;
}

// ============ Product Property Value Types ============
export interface PropertyValue {
  value: string;
  propertyProductId: string;
  level: number;
  urlImage: string | null;
  code: number; // Unique code for this property value
}

// ============ Variant Create DTO ============
export interface VariantCreateDto {
  price: number;
  quantity: number;
  status: number; // 1 = active
}

// ============ Product Variant Types (New API Structure) ============
export interface ProductVariant {
  variantCreateDto: VariantCreateDto;
  code: number[] | null; // Array of property value codes, null for Level 0
}

// ============ Main Product Types ============
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  categoryChildId: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  images: ProductImage[];
  productInformations: ProductInformation[];
  variants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

// ============ Product Payload Types ============
export interface ProductPayload {
  name: string;
  description: string;
  price?: number;
  categoryChildId: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  classify: number; // 0 = no variants, 1 = single classification, 2 = two classifications
}

// ============ Product Variants Payload ============
export interface ProductVariantsPayload extends ProductPayload {
  variants: ProductVariant[];
}

// ============ Complete Product Creation Payload (New API Structure) ============
export interface CreateProductPayload {
  product: ProductPayload;
  productInformations: ProductInformation[]; // Moved from inside product to root level
  propertyValues: PropertyValue[] | null; // Null for Level 0 (no classifications)
  variants: ProductVariant[]; // Variants with code references (null for Level 0)
  imagesProduct: ProductImage[]; // Renamed from images, moved to root level
}

// ============ Product Update Types ============
export interface UpdateProductInformation {
  id: number;
  value: string;
}

export interface UpdatePropertyValue {
  propertyValueId: string;
  value: string;
  urlImage: string;
}

export interface UpdateVariant {
  variantId: number;
  price: number;
  quantity: number;
  status: number;
}

export interface UpdateProductImage {
  id: string;
  urlImage: string;
}

export interface UpdateProductPayload {
  product: {
    name: string;
    description: string;
    status: number;
    weight: number;
    height: number;
    length: number;
    width: number;
  };
  productInformations: UpdateProductInformation[];
  propertyValues: UpdatePropertyValue[];
  variants: UpdateVariant[];
  imagesProduct: UpdateProductImage[];
}

// ============ Product Response Types ============
export interface ProductResponse {
  error: string | null;
  data: Product | Product[];
  message?: string;
}

// ============ Product Filter Types ============
export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price" | "name" | "createdAt" | "popularity";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  classify?: number | null;
}

// ============ Product Form Types ============
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryChildId: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  images: File[];
  productInformations: ProductInformation[];
  variants: ProductVariant[];
}

// ============ Product Property Types ============
export interface ProductProperty {
  id: string;
  name: string;
}

export interface ProductVariantValue {
  id: string;
  value: string;
  propertyId: string;
}

export interface ProductClassification {
  id: string;
  propertyId: string;
  propertyName: string;
  values: string[];
}

export interface ProductVariantTable {
  classifications: ProductClassification[];
  variants: ProductVariant[];
}
