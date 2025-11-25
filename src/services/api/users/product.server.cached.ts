import { API_CONFIG, API_ENDPOINTS } from "@/lib/config/api.config";
import { getAuthTokenFromServerCookies } from "@/lib/utils/cookies.utils";
import { createCachedFetcher, CACHE_REVALIDATION } from "@/services/core/cache";
import type {
  ProductsApiResponse,
  ProductFilters,
  ProductDetail,
  ProductDetailApiResponse,
} from "@/types/users/product.types";

export const getProductDetailCached = createCachedFetcher(async (slug: string): Promise<ProductDetail | null> => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL_DOTNET is not configured");
    return null;
  }

  try {
    const params = new URLSearchParams();
    params.append("slug", slug);

    const url = `${baseUrl}${API_ENDPOINTS.PRODUCTS.DETAIL_FULL}?${params.toString()}`;


    const token = await getAuthTokenFromServerCookies();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
      next: {
        revalidate: CACHE_REVALIDATION.PRODUCT_DETAIL,
      },
    });

    if (!response.ok) {
    
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


export const getProductsServerCached = createCachedFetcher(async (
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
      revalidate: CACHE_REVALIDATION.PRODUCT_LIST,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }

  return response.json();
});


export const getTopProductSlugs = createCachedFetcher(async (limit: number = 100): Promise<string[]> => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_API_URL_DOTNET is not configured, returning empty array");
    return [];
  }

  try {
    const response = await getProductsServerCached({ page: 1, pageSize: limit });
    

    const products = response.data?.products || [];
    return products
      .filter((product: any) => product.slug)
      .map((product: any) => product.slug);
  } catch (error) {
    console.error("Failed to fetch top product slugs:", error);
    return [];
  }
});


export const getTopShopIds = createCachedFetcher(async (limit: number = 50): Promise<string[]> => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_API_URL_DOTNET is not configured, returning empty array");
    return [];
  }

  try {
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

