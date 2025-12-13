import { axiosJava } from "@/lib/config/axios.config";
import { OrderResponse, OrderFilterParams, UpdateOrderStatusRequest } from "../types";
export const getOrders = async (params?: OrderFilterParams): Promise<OrderResponse> => {
  const queryParams = new URLSearchParams();
  if (params) {
    if (params.page !== undefined) queryParams.append("page", params.page.toString());
    if (params.size !== undefined) queryParams.append("size", params.size.toString());
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.filter) queryParams.append("filter", params.filter);
  }
  const response = await axiosJava.get<OrderResponse>(`/shop/orders?${queryParams.toString()}`);
  return response.data;
};
export const confirmOrders = async (orderIds: string[]): Promise<void> => {
  const body: UpdateOrderStatusRequest[] = orderIds.map(id => ({
    orderId: id
  }));
  await axiosJava.patch("/shop/orders/status/confirmed", body);
};
export const rejectOrders = async (orderIds: string[]): Promise<void> => {
  const body: UpdateOrderStatusRequest[] = orderIds.map(id => ({
    orderId: id
  }));
  await axiosJava.patch("/shop/orders/status/rejected", body);
};