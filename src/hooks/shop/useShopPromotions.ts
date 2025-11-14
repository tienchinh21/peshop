import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  addPromotionRules,
  addPromotionGifts,
  deletePromotionRules,
  deletePromotionGifts,
} from "@/services/api/shops/promotion.service";
import type {
  PromotionListFilters,
  CreatePromotionPayload,
  UpdatePromotionPayload,
  AddPromotionRulesPayload,
  AddPromotionGiftsPayload,
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

export const useAddPromotionRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddPromotionRulesPayload[] }) =>
      addPromotionRules(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopPromotionKeys.lists() });
      toast.success("Thêm điều kiện thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Thêm điều kiện thất bại"
      );
      toast.error(errorMessage);
    },
  });
};

export const useAddPromotionGifts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddPromotionGiftsPayload[] }) =>
      addPromotionGifts(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopPromotionKeys.lists() });
      toast.success("Thêm quà tặng thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Thêm quà tặng thất bại"
      );
      toast.error(errorMessage);
    },
  });
};

export const useDeletePromotionRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ruleIds: string[]) => deletePromotionRules(ruleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopPromotionKeys.lists() });
      toast.success("Xóa điều kiện thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Xóa điều kiện thất bại"
      );
      toast.error(errorMessage);
    },
  });
};

export const useDeletePromotionGifts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (giftIds: string[]) => deletePromotionGifts(giftIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopPromotionKeys.lists() });
      toast.success("Xóa quà tặng thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Xóa quà tặng thất bại"
      );
      toast.error(errorMessage);
    },
  });
};
