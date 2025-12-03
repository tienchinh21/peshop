import { API_CONFIG, API_ENDPOINTS } from "@/lib/config/api.config";
import {
  createCachedFetcher,
  CACHE_REVALIDATION,
} from "@/shared/services/cache";
import type {
  ProductsApiResponse,
  ProductFilters,
  ProductDetail,
  ProductDetailApiResponse,
} from "../types";

/**
 * Server-side product fetching without caching
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
  if (filters?.categoryChildId)
    params.append("categoryChildId", filters.categoryChildId);
  if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
  if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
  if (filters?.reviewPoint)
    params.append("reviewPoint", filters.reviewPoint.toString());

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
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Cached server-side product detail fetching
 */
export const getProductDetailCached = createCachedFetcher(
  async (slug: string): Promise<ProductDetail | null> => {
    const baseUrl = API_CONFIG.BASE_URL;

    if (!baseUrl) {
      console.error("NEXT_PUBLIC_API_URL_DOTNET is not configured");
      return null;
    }

    try {
      const params = new URLSearchParams();
      params.append("slug", slug);

      const url = `${baseUrl}${API_ENDPOINTS.PRODUCTS.DETAIL_FULL}?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        next: {
          revalidate: CACHE_REVALIDATION.PRODUCT_DETAIL,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn(
            `Product detail endpoint requires authentication for slug: ${slug}`
          );
          return null;
        }
        console.error(
          `Failed to fetch product detail: ${response.status} ${response.statusText}`
        );
        return null;
      }

      const data: ProductDetailApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching product detail for slug ${slug}:`, error);
      return null;
    }
  }
);

/**
 * Cached server-side products list fetching
 */
export const getProductsServerCached = createCachedFetcher(
  async (
    page?: number,
    pageSize?: number,
    categoryId?: string,
    categoryChildId?: string,
    minPrice?: number,
    maxPrice?: number,
    reviewPoint?: number
  ): Promise<ProductsApiResponse> => {
    const baseUrl = API_CONFIG.BASE_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_API_URL_DOTNET is not configured");
    }

    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (categoryId) params.append("categoryId", categoryId);
    if (categoryChildId) params.append("categoryChildId", categoryChildId);
    if (minPrice) params.append("minPrice", minPrice.toString());
    if (maxPrice) params.append("maxPrice", maxPrice.toString());
    if (reviewPoint) params.append("reviewPoint", reviewPoint.toString());

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
        revalidate: CACHE_REVALIDATION.PRODUCT_LIST,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }
);

/**
 * Get top product slugs for static generation
 */
export const getTopProductSlugs = createCachedFetcher(
  async (limit: number = 100): Promise<string[]> => {
    const baseUrl = API_CONFIG.BASE_URL;

    if (!baseUrl) {
      console.warn(
        "NEXT_PUBLIC_API_URL_DOTNET is not configured, returning empty array"
      );
      return [];
    }

    try {
      const response = await getProductsServerCached(1, limit);

      const products = response.data?.products || [];
      return products
        .filter((product: any) => product.slug)
        .map((product: any) => product.slug);
    } catch (error) {
      console.error("Failed to fetch top product slugs:", error);
      return [];
    }
  }
);

/**
 * Get top shop IDs for static generation
 */
export const getTopShopIds = createCachedFetcher(
  async (limit: number = 50): Promise<string[]> => {
    const baseUrl = API_CONFIG.BASE_URL;

    if (!baseUrl) {
      console.warn(
        "NEXT_PUBLIC_API_URL_DOTNET is not configured, returning empty array"
      );
      return [];
    }

    try {
      const response = await getProductsServerCached(1, 100);
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
  }
);
