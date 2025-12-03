import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShopVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../services";
import type {
  VoucherListFilters,
  CreateVoucherPayload,
  UpdateVoucherPayload,
} from "../types";
import { toast } from "sonner";

export const shopVoucherKeys = {
  all: ["shop-vouchers"] as const,
  lists: () => [...shopVoucherKeys.all, "list"] as const,
  list: (filters: VoucherListFilters) =>
    [...shopVoucherKeys.lists(), filters] as const,
  details: () => [...shopVoucherKeys.all, "detail"] as const,
  detail: (id: string) => [...shopVoucherKeys.details(), id] as const,
};

export const useShopVouchers = (filters?: VoucherListFilters) => {
  return useQuery({
    queryKey: shopVoucherKeys.list(filters || {}),
    queryFn: () => getShopVouchers(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};

export const useVoucherDetail = (id: string) => {
  return useQuery({
    queryKey: shopVoucherKeys.detail(id),
    queryFn: () => getVoucherById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVoucherPayload) => createVoucher(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopVoucherKeys.lists() });
      toast.success("Tạo mã giảm giá thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Tạo mã giảm giá thất bại");
    },
  });
};

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVoucherPayload }) =>
      updateVoucher(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopVoucherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shopVoucherKeys.details() });
      toast.success("Cập nhật mã giảm giá thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Cập nhật mã giảm giá thất bại");
    },
  });
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopVoucherKeys.lists() });
      toast.success("Xóa mã giảm giá thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Xóa mã giảm giá thất bại");
    },
  });
};
