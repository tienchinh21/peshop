export interface ProductImage {
  urlImage: string;
  sortOrder: number;
}
export interface ProductInformation {
  name: string;
  value: string;
}
export interface PropertyValue {
  value: string;
  propertyProductId: string;
  level: number;
  urlImage: string | null;
  code: number;
}
export interface VariantCreateDto {
  price: number;
  quantity: number;
  status: number;
}
export interface ProductVariant {
  variantCreateDto: VariantCreateDto;
  code: number[] | null;
}
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
export interface ProductPayload {
  name: string;
  description: string;
  price?: number;
  categoryChildId: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  classify: number;
}
export interface ProductVariantsPayload extends ProductPayload {
  variants: ProductVariant[];
}
export interface CreateProductPayload {
  product: ProductPayload;
  productInformations: ProductInformation[];
  propertyValues: PropertyValue[] | null;
  variants: ProductVariant[];
  imagesProduct: ProductImage[];
}
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
export interface ProductResponse {
  error: string | null;
  data: Product | Product[];
  message?: string;
}
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