export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  boughtCount: number;
  addressShop: string;
  slug: string;
  shopName: string;
  shopId?: string;
  reviewCount: number;
  reviewPoint: number;
}

// Product Detail Types (for Quick View and Detail Page)
export interface ProductVariantValue {
  propertyValueId: string;
  value: string;
  propertyProductId: string;
  level: number;
  urlImage: string | null;
}

export interface ProductVariantDetail {
  variantId: string;
  price: number;
  quantity: number;
  status: number;
  propertyValues: ProductVariantValue[];
}

export interface ProductImage {
  urlImage: string;
  sortOrder: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  shopName: string;
  shopId: string;
  addressShop: string;
  boughtCount: number;
  reviewCount: number;
  reviewPoint: number;
  images: ProductImage[];
  variants: ProductVariantDetail[];
}

export interface ProductDetailApiResponse {
  error: string | null;
  data: ProductDetail;
}

export interface PaginatedProductsData {
  products: Product[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface ProductsApiResponse {
  error: string | null;
  data: PaginatedProductsData;
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  keyword?: string;
  categoryId?: string;
  categoryChildId?: string;
  minPrice?: number;
  maxPrice?: number;
  reviewPoint?: number;
}
