import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import {
  getAddressList,
  getDefaultAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/services/api/users/address.service";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
} from "@/types/users/address.types";
import { toast } from "sonner";

export const addressKeys = {
  all: ["address"] as const,
  list: () => [...addressKeys.all, "list"] as const,
  default: () => [...addressKeys.all, "default"] as const,
};

export const useAddressList = (enabled: boolean = true) => {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: getAddressList,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled,
  });
};

export const useDefaultAddress = (enabled: boolean = true) => {
  return useQuery({
    queryKey: addressKeys.default(),
    queryFn: getDefaultAddress,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success("Thêm địa chỉ thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể thêm địa chỉ. Vui lòng thử lại."
      );
      toast.error(errorMessage);
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAddressPayload) => updateAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success("Cập nhật địa chỉ thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể cập nhật địa chỉ. Vui lòng thử lại."
      );
      toast.error(errorMessage);
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success("Xóa địa chỉ thành công");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể xóa địa chỉ. Vui lòng thử lại."
      );
      toast.error(errorMessage);
    },
  });
};

