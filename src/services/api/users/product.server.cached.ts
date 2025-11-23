import { cache } from 'react';
import { API_CONFIG, API_ENDPOINTS } from "@/lib/config/api.config";
import { getAuthTokenFromServerCookies } from "@/lib/utils/cookies.utils";
import type {
  ProductsApiResponse,
  ProductFilters,
  ProductDetail,
  ProductDetailApiResponse,
} from "@/types/users/product.types";

/**
 * Cached server-side product detail fetching
 * Uses React cache() to deduplicate requests between generateMetadata and page component
 */
export const getProductDetailCached = cache(async (slug: string): Promise<ProductDetail | null> => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL_DOTNET is not configured");
    return null;
  }

  try {
    const params = new URLSearchParams();
    params.append("slug", slug);

    const url = `${baseUrl}${API_ENDPOINTS.PRODUCTS.DETAIL_FULL}?${params.toString()}`;

    // Get auth token from cookies for server-side requests
    const token = await getAuthTokenFromServerCookies();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include", // Include cookies if available (for SSR with auth)
      next: {
        revalidate: 3600, // Cache for 1 hour (ISR)
      },
    });

    if (!response.ok) {
      // Handle 401 Unauthorized gracefully - product might require auth or endpoint might be misconfigured
      if (response.status === 401) {
        console.warn(`Product detail endpoint requires authentication for slug: ${slug}`);
        return null;
      }
      console.error(`Failed to fetch product detail: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: ProductDetailApiResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching product detail for slug ${slug}:`, error);
    return null;
  }
});

/**
 * Cached server-side products list fetching
 * Uses React cache() for deduplication
 */
export const getProductsServerCached = cache(async (
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
    next: {
      revalidate: 300, // Cache for 5 minutes
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }

  return response.json();
});

/**
 * Get top products for static generation
 * This should be called during build time
 */
export const getTopProductSlugs = cache(async (limit: number = 100): Promise<string[]> => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_API_URL_DOTNET is not configured, returning empty array");
    return [];
  }

  try {
    // Fetch first page of products (assuming they are sorted by popularity)
    const response = await getProductsServerCached({ page: 1, pageSize: limit });
    
    // Extract slugs from products

    const products = response.data?.products || [];
    return products
      .filter((product: any) => product.slug)
      .map((product: any) => product.slug);
  } catch (error) {
    console.error("Failed to fetch top product slugs:", error);
    return [];
  }
});

/**
 * Get top shop IDs for static generation
 */
export const getTopShopIds = cache(async (limit: number = 50): Promise<string[]> => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_API_URL_DOTNET is not configured, returning empty array");
    return [];
  }

  try {
    // Fetch products and extract unique shop IDs
    const response = await getProductsServerCached({ page: 1, pageSize: 100 });
    const products = response.data?.products || [];
    
    const shopIds = new Set<string>();
    products.forEach((product: any) => {
      if (product.shopId) {
        shopIds.add(product.shopId);
      }
    });
    
    return Array.from(shopIds).slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch top shop IDs:", error);
    return [];
  }
});

