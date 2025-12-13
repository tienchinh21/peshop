export interface SearchSuggestion {
  keyword: string;
  type: "keyword";
  url: string;
}
export interface SearchSuggestionsResponse {
  error: string | null;
  data: SearchSuggestion[];
}
export interface SearchProduct {
  id: string;
  name: string;
  image: string;
  reviewCount: number;
  reviewPoint: number;
  price: number;
  boughtCount: number;
  addressShop: string;
  slug: string;
  shopId: string;
  shopName: string;
}
export interface SearchShop {
  id: string;
  name: string;
  avatar: string;
  address: string;
  slug: string;
}
export interface SearchResultsData {
  products: SearchProduct[];
  shops: SearchShop[];
  searchType: "product" | "shop" | "all";
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface SearchResultsResponse {
  error: string | null;
  data: SearchResultsData;
}
export interface SearchFilters {
  keyword: string;
  page?: number;
  pageSize?: number;
  searchType?: "product" | "shop" | "all";
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "name" | "popularity" | "newest";
  sortOrder?: "asc" | "desc";
}
export interface SearchByImageParams {
  image: File;
  page?: number;
  pageSize?: number;
}
export interface ImageSearchResultData {
  currentPage: number;
  data: SearchProduct[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  pageSize: number;
  previousPage: number;
  totalCount: number;
  totalPages: number;
}
export interface SearchByImageResponse {
  error: string | null;
  data: ImageSearchResultData;
}