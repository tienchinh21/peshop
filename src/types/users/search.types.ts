// ============ Search Suggestion Types ============
export interface SearchSuggestion {
  keyword: string;
  type: "keyword"; // Can be extended to include "product", "shop", etc.
  url: string;
}

export interface SearchSuggestionsResponse {
  error: string | null;
  data: SearchSuggestion[];
}

// ============ Search Result Types ============
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

// ============ Search Filters ============
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

