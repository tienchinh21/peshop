export interface ProductCategory {
  id: string;
  name: string;
  type: "MAIN" | "SUB";
}

export interface ProductCategoryChild {
  id: string;
  name: string;
  description: string | null;
}

export interface ShopProduct {
  id: string;
  name: string;
  imgMain: string;
  price: number;
  status: number; // 1 = active, 0 = inactive
  boughtCount: number | null;
  reviewPoint: number | null;
  slug: string;
  category: ProductCategory;
  categoryChild: ProductCategoryChild;
}

export interface ProductListPaginationInfo {
  page: number;
  size: number;
  pages: number;
  total: number;
}

export interface ProductListContent {
  info: ProductListPaginationInfo;
  response: ShopProduct[];
}

export interface ShopProductListResponse {
  error: string | null;
  content: ProductListContent;
}

export enum ProductStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

export interface ProductListFilters {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: string;
  categoryChildId?: string;
  status?: ProductStatus;
  sortBy?: "name" | "price" | "boughtCount" | "createdAt";
  sortOrder?: "asc" | "desc";
}
