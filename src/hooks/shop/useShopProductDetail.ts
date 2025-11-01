import { useQuery } from "@tanstack/react-query";
import { getShopProductDetail } from "@/services/api/shops/product-detail.service";

/**
 * Query keys for shop product detail
 */
export const shopProductDetailKeys = {
  all: ["shop-product-detail"] as const,
  detail: (id: string) => [...shopProductDetailKeys.all, id] as const,
};

/**
 * Hook to fetch shop product detail
 * 
 * @param productId - Product ID
 * @returns React Query result
 */
export const useShopProductDetail = (productId: string) => {
  return useQuery({
    queryKey: shopProductDetailKeys.detail(productId),
    queryFn: () => getShopProductDetail(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: 1,
    retryDelay: 1000,
  });
};

