import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { createVirtualOrder, updateVirtualOrder, deleteVirtualOrder, getShippingFee, applyShippingFee, calculateOrderTotal, createOrder, getOrders, getOrderDetail, cancelOrder, applySystemVoucher, applyShopVoucher, getTrackingLogs } from "../services";
import type { CreateVirtualOrderPayload, UpdateVirtualOrderPayload, CreateOrderPayload } from "../types";
import { toast } from "sonner";
export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
  virtualOrder: (payload: CreateVirtualOrderPayload) => [...orderKeys.all, "virtual-order", payload] as const,
  tracking: (orderCode: string) => [...orderKeys.all, "tracking", orderCode] as const,
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
export const useUpdateVirtualOrder = () => {
  return useMutation({
    mutationFn: (payload: UpdateVirtualOrderPayload) => updateVirtualOrder(payload),
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Không thể cập nhật đơn hàng. Vui lòng thử lại.");
      toast.error(errorMessage);
    }
  });
};
export const useDeleteVirtualOrder = () => {
  return useMutation({
    mutationFn: (orderId: string) => deleteVirtualOrder(orderId),
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Không thể xóa đơn hàng. Vui lòng thử lại.");
      toast.error(errorMessage);
    }
  });
};
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.list()
      });
      if (!data.paymentUrl) {
        toast.success("Đặt hàng thành công!");
      }
    },
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Không thể đặt hàng. Vui lòng thử lại.");
      toast.error(errorMessage);
    }
  });
};
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.list()
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(orderId)
      });
      toast.success("Đã hủy đơn hàng thành công!");
    },
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Không thể hủy đơn hàng. Vui lòng thử lại.");
      toast.error(errorMessage);
    }
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
export const useGetShippingFee = () => {
  return useMutation({
    mutationFn: (orderId: string) => getShippingFee({
      orderId
    }),
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Không thể lấy phí vận chuyển. Vui lòng thử lại.");
      toast.error(errorMessage);
    }
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
export const useApplySystemVoucher = () => {
  return useMutation({
    mutationFn: (payload: {
      voucherId: string;
      orderId: string;
    }) => applySystemVoucher(payload),
    onSuccess: () => {
      toast.success("Áp dụng voucher thành công!");
    },
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Không thể áp dụng voucher. Vui lòng thử lại.");
      toast.error(errorMessage);
    }
  });
};
export const useApplyShopVoucher = () => {
  return useMutation({
    mutationFn: (payload: {
      voucherId: string;
      orderId: string;
      shopId: string;
    }) => applyShopVoucher(payload),
    onSuccess: () => {
      toast.success("Áp dụng voucher shop thành công!");
    },
    onError: (error: any) => {
      const errorMessage = _.get(error, "response.data.message", "Không thể áp dụng voucher shop. Vui lòng thử lại.");
      toast.error(errorMessage);
    }
  });
};
export const useGetOrders = () => {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: getOrders,
    staleTime: 1000 * 60 * 5
  });
};
export const useGetOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5
  });
};

export const useGetTrackingLogs = (orderCode: string) => {
  return useQuery({
    queryKey: orderKeys.tracking(orderCode),
    queryFn: () => getTrackingLogs(orderCode),
    enabled: !!orderCode,
    staleTime: 1000 * 60 * 2, // 2 minutes - tracking updates frequently
  });
};