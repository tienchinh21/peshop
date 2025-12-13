import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getShopProducts, deleteShopProduct, updateProductStatus } from "@/services/api/shops/product-list.service";
import type { ProductListFilters } from "@/types/shops/product-list.type";
import { toast } from "sonner";
export const shopProductKeys = {
  all: ["shop-products"] as const,
  lists: () => [...shopProductKeys.all, "list"] as const,
  list: (filters: ProductListFilters) => [...shopProductKeys.lists(), filters] as const
};

/**
 * Hook to fetch shop products with filters
 * 
 * @param filters - Filter parameters
 * @returns React Query result
 * 
 * @example
 * const { data, isLoading } = useShopProducts({
 *   page: 1,
 *   size: 10,
 *   search: 'laptop',
 *   status: ProductStatus.ACTIVE
 * });
 */
export const useShopProducts = (filters?: ProductListFilters) => {
  return useQuery({
    queryKey: shopProductKeys.list(filters || {}),
    queryFn: () => getShopProducts(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });
};
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShopProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shopProductKeys.lists()
      });
      toast.success("Xóa sản phẩm thành công");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Xóa sản phẩm thất bại");
    }
  });
};
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      status
    }: {
      productId: string;
      status: number;
    }) => updateProductStatus(productId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shopProductKeys.lists()
      });
      toast.success("Cập nhật trạng thái thành công");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật trạng thái thất bại");
    }
  });
};