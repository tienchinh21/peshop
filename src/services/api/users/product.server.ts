import { API_CONFIG, API_ENDPOINTS } from "@/lib/config/api.config";
import type {
  ProductsApiResponse,
  ProductFilters,
} from "@/types/users/product.types";

/**
 * Server-side product fetching (for SSR/SSG)
 * This runs on the server and doesn't use axios client
 */
export const getProductsServer = async (
  filters?: ProductFilters
): Promise<ProductsApiResponse> => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL_DOTNET is not configured");
  }

  const params = new URLSearchParams();
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.pageSize) params.append("pageSize", filters.pageSize.toString());
  if (filters?.categoryId) params.append("categoryId", filters.categoryId);
  if (filters?.categoryChildId) params.append("categoryChildId", filters.categoryChildId);
  if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
  if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
  if (filters?.reviewPoint) params.append("reviewPoint", filters.reviewPoint.toString());

  const queryString = params.toString();
  const endpoint = queryString
    ? `${API_ENDPOINTS.PRODUCTS.GET_PRODUCTS}?${queryString}`
    : API_ENDPOINTS.PRODUCTS.GET_PRODUCTS;
  
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Enable caching for better performance
    next: {
      revalidate: 60, // Revalidate every 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
