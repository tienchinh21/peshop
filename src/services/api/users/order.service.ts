import { axiosDotnet } from "@/lib/config/axios.config";
import _ from "lodash";
import type {
  CreateVirtualOrderPayload,
  VirtualOrderResponse,
  VirtualOrderData,
  GetShippingFeePayload,
  ShippingFeeResponse,
  ApplyShippingFeePayload,
  CreateOrderPayload,
} from "@/types/users/order.types";

export const createVirtualOrder = async (
  payload: CreateVirtualOrderPayload
): Promise<VirtualOrderData> => {
  const response = await axiosDotnet.post<VirtualOrderResponse>(
    "/Order/create-virtual-order",
    payload
  );
  return _.get(response, "data.data.order");
};

export const createOrder = async (payload: CreateOrderPayload): Promise<CreateOrderPayload> => {
  const response = await axiosDotnet.post<any>(
    "/Order/create-order",
    payload
  );
  return _.get(response, "data.data.order");
};

export const getShippingFee = async (
  payload: GetShippingFeePayload
): Promise<ShippingFeeResponse> => {
  const response = await axiosDotnet.post(
    "/FeeShipping/get-fee-shipping",
    payload
  );
  return _.get(response, "data.data");
};

export const applyShippingFee = async (
  payload: ApplyShippingFeePayload
): Promise<any> => {
  const response = await axiosDotnet.post(
    "/FeeShipping/apply-list-fee-shipping",
    payload
  );
  return _.get(response, "data.data", []);
};

export const calculateOrderTotal = async (
  orderId: string
): Promise<VirtualOrderData> => {
  const response = await axiosDotnet.get<VirtualOrderResponse>(
    `/Order/Calclulate-order-total?orderId=${orderId}`
  );
  return _.get(response, "data.data.order");  
};

export const applySystemVoucher = async (payload: {
  voucherId: string;
  orderId: string;
}): Promise<any> => {
  const response = await axiosDotnet.post(
    "/Voucher/apply-voucher-system",
    payload
  );
  return _.get(response, "data.data", []);
};

export const applyShopVoucher = async (payload: {
  voucherId: string;
  orderId: string;
  shopId: string;
}): Promise<any> => {
  const response = await axiosDotnet.post(
    "/Voucher/apply-voucher-shop",
    payload
  );
  return _.get(response, "data.data", []);
};
