import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "@/services/api/shops/promotion.service";
import type {
  PromotionListFilters,
  CreatePromotionPayload,
  UpdatePromotionPayload,
} from "@/types/shops/promotion.type";
import { toast } from "sonner";
import _ from "lodash";

export const shopPromotionKeys = {
  all: ["shop-promotions"] as const,
  lists: () => [...shopPromotionKeys.all, "list"] as const,
  list: (filters: PromotionListFilters) =>
    [...shopPromotionKeys.lists(), filters] as const,
  details: () => [...shopPromotionKeys.all, "detail"] as const,
  detail: (id: string) => [...shopPromotionKeys.details(), id] as const,
};

export const useShopPromotions = (filters?: PromotionListFilters) => {
  return useQuery({
    queryKey: shopPromotionKeys.list(filters || {}),
    queryFn: () => getPromotions(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePromotionDetail = (id: string) => {
  return useQuery({
    queryKey: shopPromotionKeys.detail(id),
    queryFn: () => getPromotionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePromotionPayload) => createPromotion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopPromotionKeys.lists() });
      toast.success("Tạo chương trình thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Tạo chương trình thất bại"
      );
      toast.error(errorMessage);
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePromotionPayload }) =>
      updatePromotion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopPromotionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shopPromotionKeys.details() });
      toast.success("Cập nhật chương trình thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Cập nhật chương trình thất bại"
      );
      toast.error(errorMessage);
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopPromotionKeys.lists() });
      toast.success("Xóa chương trình thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Xóa chương trình thất bại"
      );
      toast.error(errorMessage);
    },
  });
};

