import { API_CONFIG_JAVA } from "@/lib/config/api.config";
import type { ShopProductDetailResponse } from "@/types/shops/product-detail.type";


export const getShopProductDetailServer = async (
  productId: string
): Promise<ShopProductDetailResponse | null> => {
  const baseUrl = API_CONFIG_JAVA.BASE_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL_JAVA is not configured");
    return null;
  }

  try {
    const url = `${baseUrl}/shop/product/${productId}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 30 seconds
      next: {
        revalidate: 30,
      },
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
