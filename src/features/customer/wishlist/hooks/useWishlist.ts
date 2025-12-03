/**
 * Wishlist Hooks
 *
 * React Query hooks for wishlist operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
} from "../services";
import type { AddToWishlistPayload, RemoveFromWishlistPayload } from "../types";

/**
 * Query keys for wishlist
 */
export const wishlistKeys = {
  all: ["wishlist"] as const,
  list: (page: number, pageSize: number) =>
    [...wishlistKeys.all, "list", { page, pageSize }] as const,
  check: (productId: string) =>
    [...wishlistKeys.all, "check", productId] as const,
};

/**
 * Hook to fetch user's wishlist
 */
export const useWishlist = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: wishlistKeys.list(page, pageSize),
    queryFn: () => getWishlist(page, pageSize),
  });
};

/**
 * Hook to add product to wishlist
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToWishlistPayload) => addToWishlist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};

/**
 * Hook to remove product from wishlist
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveFromWishlistPayload) =>
      removeFromWishlist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};

/**
 * Hook to check if product is in wishlist
 */
export const useCheckWishlistStatus = (productId: string) => {
  return useQuery({
    queryKey: wishlistKeys.check(productId),
    queryFn: () => checkWishlistStatus(productId),
    enabled: !!productId,
  });
};
