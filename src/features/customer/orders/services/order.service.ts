import { axiosDotnet } from "@/lib/config/axios.config";
import _ from "lodash";
import type { CreateVirtualOrderPayload, UpdateVirtualOrderPayload, DeleteVirtualOrderPayload, VirtualOrderResponse, VirtualOrderData, GetShippingFeePayload, GetShippingFeeResponse, ApplyShippingFeePayload, ApplyVoucherResponse, CreateOrderPayload, CreateOrderResponse, OrderListItem, OrderDetail, CancelOrderResponse, ApplySystemVoucherPayload, ApplyShopVoucherPayload, TrackingData, TrackingResponse } from "../types";
export const createVirtualOrder = async (payload: CreateVirtualOrderPayload): Promise<VirtualOrderData> => {
  const response = await axiosDotnet.post<VirtualOrderResponse>("/Order/create-virtual-order", payload);
  const order = _.get(response, "data.data.order");
  if (!order) {
    throw new Error("Failed to create virtual order: no order data returned");
  }
  return order;
};
export const updateVirtualOrder = async (payload: UpdateVirtualOrderPayload): Promise<VirtualOrderData> => {
  const response = await axiosDotnet.put<VirtualOrderResponse>("/Order/update-virtual-order", payload);
  const order = _.get(response, "data.data.order");
  if (!order) {
    throw new Error("Failed to update virtual order: no order data returned");
  }
  return order;
};
export const deleteVirtualOrder = async (orderId: string): Promise<void> => {
  await axiosDotnet.delete(`/Order/delete-virtual-order?orderId=${orderId}`);
};
export const calculateOrderTotal = async (orderId: string): Promise<VirtualOrderData> => {
  const response = await axiosDotnet.get<VirtualOrderResponse>(`/Order/Calclulate-order-total?orderId=${orderId}`);
  const order = _.get(response, "data.data.order");
  if (!order) {
    throw new Error("Failed to calculate order total: no order data returned");
  }
  return order;
};
export const createOrder = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  const response = await axiosDotnet.post<any>("/Order/create-order", payload);
  const data = _.get(response, "data.data");
  // VNPay returns URL string directly in data field
  const paymentUrl = typeof data === "string" ? data : data?.paymentUrl;
  return {
    status: _.get(response, "data.status", false),
    message: _.get(response, "data.message", ""),
    paymentUrl
  };
};
export const getOrders = async (): Promise<OrderListItem[]> => {
  const response = await axiosDotnet.get<OrderListItem[]>("/Order/get-order");
  return _.get(response, "data.data", []);
};
export const getOrderDetail = async (orderId: string): Promise<OrderDetail> => {
  const response = await axiosDotnet.get<OrderDetail>(`/Order/get-order-detail?orderId=${orderId}`);
  const order = _.get(response, "data.data");
  if (!order) {
    throw new Error("Failed to fetch order detail: no order data returned");
  }
  return order;
};
export const cancelOrder = async (orderId: string): Promise<CancelOrderResponse> => {
  const response = await axiosDotnet.delete<any>(`/Order/cancle-order?orderId=${orderId}`);
  return {
    status: _.get(response, "data.status", false),
    message: _.get(response, "data.message", "")
  };
};
export const applySystemVoucher = async (payload: ApplySystemVoucherPayload): Promise<VirtualOrderData> => {
  const response = await axiosDotnet.post<ApplyVoucherResponse>("/Voucher/apply-voucher-system", payload);
  const order = _.get(response, "data.data.order");
  if (order) {
    return order;
  }
  return await calculateOrderTotal(payload.orderId);
};
export const applyShopVoucher = async (payload: ApplyShopVoucherPayload): Promise<VirtualOrderData> => {
  const response = await axiosDotnet.post<ApplyVoucherResponse>("/Voucher/apply-voucher-shop", payload);
  const order = _.get(response, "data.data.order");
  if (order) {
    return order;
  }
  return await calculateOrderTotal(payload.orderId);
};
export const getShippingFee = async (payload: GetShippingFeePayload): Promise<GetShippingFeeResponse> => {
  const response = await axiosDotnet.post<any>("/FeeShipping/get-fee-shipping-v2", payload);
  return {
    listFeeShipping: _.get(response, "data.listFeeShipping", [])
  };
};
export const applyShippingFee = async (payload: ApplyShippingFeePayload): Promise<{
  status: boolean;
  message: string;
}> => {
  const response = await axiosDotnet.post<any>("/FeeShipping/apply-fee-shipping-v2", payload);
  return {
    status: _.get(response, "data.status", false),
    message: _.get(response, "data.message", "")
  };
};

export const getTrackingLogs = async (orderCode: string): Promise<TrackingData> => {
  const response = await axiosDotnet.get<TrackingResponse>(`/ghn/get-tracking-logs?orderCode=${orderCode}`);
  const data = _.get(response, "data.data");
  if (!data) {
    throw new Error("Failed to fetch tracking logs: no data returned");
  }
  return data;
};
