import { useQuery } from '@tanstack/react-query';
import { getSimilarProducts } from '@/services/api/users/product.service';

/**
 * Hook to fetch similar products by category or shop
 */
export const useSimilarProducts = (
  productId: string,
  options?: {
    byCategory?: boolean;
    byShop?: boolean;
    limit?: number;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['products', 'similar', productId, options],
    queryFn: () => getSimilarProducts(productId, {
      byCategory: options?.byCategory,
      byShop: options?.byShop,
      limit: options?.limit || 12,
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!productId && (options?.enabled !== false),
  });
};

