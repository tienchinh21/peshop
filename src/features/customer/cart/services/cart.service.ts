import { axiosDotnet } from "@/lib/config/axios.config";
import _ from "lodash";
import type {
  CartItem,
  CartResponse,
  AddToCartPayload,
  UpdateCartPayload,
  CartCountResponse,
  CartCountData,
} from "../types";

export const getCart = async (): Promise<CartItem[]> => {
  const response = await axiosDotnet.get<CartResponse>("/Cart/get-cart");
  return _.get(response, "data.data", []);
};

export const addToCart = async (
  payload: AddToCartPayload
): Promise<CartResponse> => {
  const response = await axiosDotnet.post<CartResponse>(
    "/Cart/add-cart",
    payload
  );
  return response.data;
};

export const updateCart = async (
  payload: UpdateCartPayload
): Promise<CartResponse> => {
  const response = await axiosDotnet.put<CartResponse>(
    "/Cart/update-cart",
    {},
    {
      params: {
        cartId: payload.cartId,
        quantity: payload.quantity,
      },
    }
  );
  return response.data;
};

export const deleteCart = async (cartId: string): Promise<void> => {
  await axiosDotnet.delete(`/Cart/delete-cart`, {
    params: { cartId },
  });
};

export const clearCart = async (): Promise<void> => {
  await axiosDotnet.delete("/Cart/clear-cart");
};

export const getCartCount = async (): Promise<CartCountData> => {
  const response = await axiosDotnet.get<CartCountResponse>(
    "/Cart/get-cart-count"
  );
  return _.get(response, "data.data", { totalQuantity: 0, totalItems: 0 });
};
