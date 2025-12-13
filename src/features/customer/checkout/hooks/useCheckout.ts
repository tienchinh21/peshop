import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { createVirtualOrder, applyShippingFee, calculateOrderTotal } from "@/features/customer/orders";
import { checkVoucherEligibility } from "@/features/customer/voucher-check";
import type { CreateVirtualOrderPayload } from "@/features/customer/orders";
import { toast } from "sonner";
export const checkoutKeys = {
  all: ["checkout"] as const,
  virtualOrder: (payload: CreateVirtualOrderPayload) => [...checkoutKeys.all, "virtual-order", payload] as const,
  shippingFee: (orderId: string) => [...checkoutKeys.all, "shipping-fee", orderId] as const,
  vouchers: (orderId: string) => [...checkoutKeys.all, "vouchers", orderId] as const,
  orderTotal: (orderId: string) => [...checkoutKeys.all, "order-total", orderId] as const
};
export const useCreateVirtualOrder = () => {
  return useMutation({
    mutationFn: (payload: CreateVirtualOrderPayload) => createVirtualOrder(payload),
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Không thể tạo đơn hàng. Vui lòng thử lại.");
      toast.error(errorMessage);
    }
  });
};
export const useShippingFee = (orderId: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: checkoutKeys.shippingFee(orderId),
    queryFn: async () => {
      throw new Error("useShippingFee should be called manually with payload");
    },
    enabled: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1
  });
};
export const useApplyShippingFee = () => {
  return useMutation({
    mutationFn: (orderId: string) => applyShippingFee({
      orderId
    }),
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Không thể áp dụng phí vận chuyển. Vui lòng thử lại.");
      toast.error(errorMessage);
    }
  });
};
export const useVoucherEligibility = (orderId: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: checkoutKeys.vouchers(orderId),
    queryFn: () => checkVoucherEligibility(orderId),
    enabled: enabled && !!orderId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1
  });
};
export const useCalculateOrderTotal = () => {
  return useMutation({
    mutationFn: (orderId: string) => calculateOrderTotal(orderId),
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Không thể tính tổng đơn hàng. Vui lòng thử lại.");
      toast.error(errorMessage);
    }
  });
};