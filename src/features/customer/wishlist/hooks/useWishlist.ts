import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlistStatus } from "../services";
import type { AddToWishlistPayload, RemoveFromWishlistPayload } from "../types";
export const wishlistKeys = {
  all: ["wishlist"] as const,
  list: (page: number, pageSize: number) => [...wishlistKeys.all, "list", {
    page,
    pageSize
  }] as const,
  check: (productId: string) => [...wishlistKeys.all, "check", productId] as const
};
export const useWishlist = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: wishlistKeys.list(page, pageSize),
    queryFn: () => getWishlist(page, pageSize)
  });
};
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddToWishlistPayload) => addToWishlist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all
      });
    }
  });
};
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RemoveFromWishlistPayload) => removeFromWishlist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all
      });
    }
  });
};
export const useCheckWishlistStatus = (productId: string) => {
  return useQuery({
    queryKey: wishlistKeys.check(productId),
    queryFn: () => checkWishlistStatus(productId),
    enabled: !!productId
  });
};