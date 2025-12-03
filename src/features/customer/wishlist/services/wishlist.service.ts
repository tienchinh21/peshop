/**
 * Wishlist Service
 *
 * API service for wishlist operations.
 */

import { axiosDotnet } from "@/lib/config/axios.config";
import type {
  WishlistResponse,
  AddToWishlistPayload,
  RemoveFromWishlistPayload,
} from "../types";

/**
 * Wishlist API endpoint
 * Note: Update this when the backend API is implemented
 */
const WISHLIST_ENDPOINT = "/Wishlist";

/**
 * Get user's wishlist
 */
export const getWishlist = async (
  page: number = 1,
  pageSize: number = 10
): Promise<WishlistResponse> => {
  const response = await axiosDotnet.get(WISHLIST_ENDPOINT, {
    params: { page, pageSize },
  });
  return response.data;
};

/**
 * Add product to wishlist
 */
export const addToWishlist = async (
  payload: AddToWishlistPayload
): Promise<void> => {
  await axiosDotnet.post(WISHLIST_ENDPOINT, payload);
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (
  payload: RemoveFromWishlistPayload
): Promise<void> => {
  await axiosDotnet.delete(`${WISHLIST_ENDPOINT}/${payload.productId}`);
};

/**
 * Check if product is in wishlist
 */
export const checkWishlistStatus = async (
  productId: string
): Promise<boolean> => {
  const response = await axiosDotnet.get(
    `${WISHLIST_ENDPOINT}/check/${productId}`
  );
  return response.data.isInWishlist;
};
