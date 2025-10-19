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
  propertyValueId: string; // UUID generated on frontend
  value: string;
  propertyProductId: string;
  level: number;
  urlImage: string | null;
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
  propertyValueIds: string[]; // Array of propertyValueId references
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
  images: ProductImage[];
  productInformations: ProductInformation[];
}

// ============ Product Variants Payload ============
export interface ProductVariantsPayload extends ProductPayload {
  variants: ProductVariant[];
}

// ============ Complete Product Creation Payload (New API Structure) ============
export interface CreateProductPayload {
  product: ProductPayload;
  propertyValues: PropertyValue[]; // All unique property values with IDs
  variants: ProductVariant[]; // Variants reference propertyValueIds
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
