import { API_CONFIG } from "@/lib/config/api.config";
import _ from "lodash";
import type { GetShopResponse, ShopData } from "@/types/users/get-shop.types";
import type { Product, ProductsApiResponse } from "@/types/users/product.types";

/**
 * Server-side shop data fetching for SSR
 */
export const getShopServer = async (shopId: string): Promise<ShopData | null> => {
  const baseUrl = API_CONFIG.BASE_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL_DOTNET is not configured");
    return null;
  }

  try {
    const url = `${baseUrl}/Shop/get-shop-detail?shopId=${shopId}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60, // Cache 60 seconds
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: GetShopResponse = await response.json();
    return data.data || null;
  } catch (error) {
    return null;
  }
};

/**
 * Server-side shop products fetching for SSR
 */
export const getProductsByShopIdServer = async (
  shopId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{ products: Product[]; totalPages: number } | null> => {
  const baseUrl = API_CONFIG.BASE_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL_DOTNET is not configured");
    return null;
  }

  try {
    const params = new URLSearchParams({
      ShopId: shopId,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const url = `${baseUrl}/Product/get-products-by-shop?${params.toString()}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include", // Include cookies if available
      next: {
        revalidate: 30, // Cache 30 seconds
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: any = await response.json();
    
    // Response structure: { error: null, data: { data: [...products], totalPages: ... } }
    const products = data.data?.data || [];
    const totalPages = data.data?.totalPages || 1;
    
    return {
      products,
      totalPages,
    };
  } catch (error) {
    return null;
  }
};
