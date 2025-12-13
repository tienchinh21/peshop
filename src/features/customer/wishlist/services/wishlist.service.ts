import { axiosDotnet } from "@/lib/config/axios.config";
import type { WishlistResponse, AddToWishlistPayload, RemoveFromWishlistPayload } from "../types";
const WISHLIST_ENDPOINT = "/Wishlist";
export const getWishlist = async (page: number = 1, pageSize: number = 10): Promise<WishlistResponse> => {
  const response = await axiosDotnet.get(WISHLIST_ENDPOINT, {
    params: {
      page,
      pageSize
    }
  });
  return response.data;
};
export const addToWishlist = async (payload: AddToWishlistPayload): Promise<void> => {
  await axiosDotnet.post(WISHLIST_ENDPOINT, payload);
};
export const removeFromWishlist = async (payload: RemoveFromWishlistPayload): Promise<void> => {
  await axiosDotnet.delete(`${WISHLIST_ENDPOINT}/${payload.productId}`);
};
export const checkWishlistStatus = async (productId: string): Promise<boolean> => {
  const response = await axiosDotnet.get(`${WISHLIST_ENDPOINT}/check/${productId}`);
  return response.data.isInWishlist;
};