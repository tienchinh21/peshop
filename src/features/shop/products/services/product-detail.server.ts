import { API_CONFIG_JAVA } from "@/lib/config/api.config";
import { getAuthTokenFromServerCookies } from "@/lib/utils/cookies.utils";
import type { ShopProductDetailResponse } from "../types";
export const getShopProductDetailServer = async (productId: string): Promise<ShopProductDetailResponse | null> => {
  const baseUrl = API_CONFIG_JAVA.BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL_JAVA is not configured");
    return null;
  }
  try {
    const token = await getAuthTokenFromServerCookies();
    const url = `${baseUrl}/shop/product/${productId}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store"
    });
    if (!response.ok) {
      console.error(`Failed to fetch product ${productId}: ${response.status} ${response.statusText}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
};