import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, confirmOrders, rejectOrders } from "../services";
import type { OrderFilterParams } from "../types";
import { toast } from "sonner";

export const shopOrderKeys = {
  all: ["shop-orders"] as const,
  lists: () => [...shopOrderKeys.all, "list"] as const,
  list: (filters: OrderFilterParams) =>
    [...shopOrderKeys.lists(), filters] as const,
};

export const useShopOrders = (filters?: OrderFilterParams) => {
  return useQuery({
    queryKey: shopOrderKeys.list(filters || {}),
    queryFn: () => getOrders(filters),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useConfirmOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopOrderKeys.lists() });
      toast.success("Xác nhận đơn hàng thành công");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Xác nhận đơn hàng thất bại");
    },
  });
};

export const useRejectOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopOrderKeys.lists() });
      toast.success("Hủy đơn hàng thành công");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Hủy đơn hàng thất bại");
    },
  });
};
