import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import {
  createVirtualOrder,
  getShippingFee,
  applyShippingFee,
  calculateOrderTotal,
  createOrder,
  applySystemVoucher,
  applyShopVoucher,
} from "../services";
import type {
  CreateVirtualOrderPayload,
  ApplyShippingFeePayload,
  CreateOrderPayload,
} from "../types";
import { toast } from "sonner";

export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
  virtualOrder: (payload: CreateVirtualOrderPayload) =>
    [...orderKeys.all, "virtual-order", payload] as const,
};

export const useCreateVirtualOrder = () => {
  return useMutation({
    mutationFn: (payload: CreateVirtualOrderPayload) =>
      createVirtualOrder(payload),
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể tạo đơn hàng. Vui lòng thử lại."
      );
      toast.error(errorMessage);
    },
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      toast.success("Đặt hàng thành công!");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể đặt hàng. Vui lòng thử lại."
      );
      toast.error(errorMessage);
    },
  });
};


export const useApplyShippingFee = () => {
  return useMutation({
    mutationFn: (payload: ApplyShippingFeePayload) => applyShippingFee(payload),
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể áp dụng phí vận chuyển. Vui lòng thử lại."
      );
      toast.error(errorMessage);
    },
  });
};

export const useCalculateOrderTotal = () => {
  return useMutation({
    mutationFn: (orderId: string) => calculateOrderTotal(orderId),
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể tính tổng đơn hàng. Vui lòng thử lại."
      );
      toast.error(errorMessage);
    },
  });
};

export const useApplySystemVoucher = () => {
  return useMutation({
    mutationFn: (payload: { voucherId: string; orderId: string }) =>
      applySystemVoucher(payload),
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể áp dụng voucher. Vui lòng thử lại."
      );
      toast.error(errorMessage);
    },
  });
};

export const useApplyShopVoucher = () => {
  return useMutation({
    mutationFn: (payload: { voucherId: string; orderId: string; shopId: string }) =>
      applyShopVoucher(payload),
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể áp dụng voucher shop. Vui lòng thử lại."
      );
      toast.error(errorMessage);
    },
  });
};
