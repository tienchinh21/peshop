import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getShopProductDetail, updateProductFull } from "../services";
import type { UpdateProductPayload } from "../types";
import { toast } from "sonner";
import _ from "lodash";
export const shopProductDetailKeys = {
  all: ["shop-product-detail"] as const,
  detail: (id: string) => [...shopProductDetailKeys.all, id] as const
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => updateProductFull(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: shopProductDetailKeys.detail(variables.id)
      });
      queryClient.invalidateQueries({
        queryKey: ["shop-products"]
      });
      toast.success("Cập nhật sản phẩm thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Cập nhật sản phẩm thất bại");
      toast.error(errorMessage);
    }
  });
};