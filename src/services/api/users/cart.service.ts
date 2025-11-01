import { axiosDotnet } from "@/lib/config/axios.config";
import _ from "lodash";
import type {
    CartItem,
    CartResponse,
    AddToCartPayload,
    UpdateCartPayload,
    CartCountResponse,
    CartCountData,
} from "@/types/users/cart.types";

/**
 * Get user's shopping cart
 * GET /Cart/get-cart
 */
export const getCart = async (): Promise<CartItem[]> => {
    const response = await axiosDotnet.get<CartResponse>("/Cart/get-cart");
    return _.get(response, "data.data", []);
};

/**
 * Add item to cart
 * POST /Cart/add-cart
 */
export const addToCart = async (
    payload: AddToCartPayload,
): Promise<CartResponse> => {
    const response = await axiosDotnet.post<CartResponse>(
        "/Cart/add-cart",
        payload,
    );
    return response.data;
};

/**
 * Update cart item quantity
 * PUT /Cart/update-cart
 */
export const updateCart = async (
    payload: UpdateCartPayload,
): Promise<CartResponse> => {
    const response = await axiosDotnet.put<CartResponse>(
        "/Cart/update-cart",
        {},
        {
            params: {
                cartId: payload.cartId,
                quantity: payload.quantity,
            },
        },
    );
    return response.data;
};

/**
 * Delete cart item
 * DELETE /Cart/delete-cart
 */
export const deleteCart = async (cartId: string): Promise<void> => {
    await axiosDotnet.delete(`/Cart/delete-cart`, {
        params: { cartId },
    });
};

/**
 * Clear entire cart
 * DELETE /Cart/clear-cart
 */
export const clearCart = async (): Promise<void> => {
    await axiosDotnet.delete("/Cart/clear-cart");
};

/**
 * Get cart count (total items and quantity)
 * GET /Cart/get-cart-count
 */
export const getCartCount = async (): Promise<CartCountData> => {
    const response = await axiosDotnet.get<CartCountResponse>(
        "/Cart/get-cart-count",
    );
    return _.get(response, "data.data", { totalQuantity: 0, totalItems: 0 });
};
