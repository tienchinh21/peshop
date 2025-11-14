import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
  clearCart,
  getCartCount,
} from "@/services/api/users/cart.service";
import type {
  AddToCartPayload,
  UpdateCartPayload,
} from "@/types/users/cart.types";
import { toast } from "sonner";

export const cartKeys = {
  all: ["cart"] as const,
  list: () => [...cartKeys.all, "list"] as const,
  count: () => [...cartKeys.all, "count"] as const,
};

export const useCart = (enabled: boolean = true) => {
  return useQuery({
    queryKey: cartKeys.list(),
    queryFn: getCart,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
};

export const useCartCount = (enabled: boolean = true) => {
  return useQuery({
    queryKey: cartKeys.count(),
    queryFn: getCartCount,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể thêm vào giỏ hàng. Vui lòng thử lại."
      );
      toast.error(errorMessage);
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCartPayload) => updateCart(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.list() });

      const previousCart = queryClient.getQueryData(cartKeys.list());

      queryClient.setQueryData(cartKeys.list(), (old: any) => {
        if (!_.isArray(old)) return old;

        return _.map(old, (item) =>
          _.get(item, "cartId") === payload.cartId
            ? { ...item, quantity: payload.quantity }
            : item
        );
      });

      return { previousCart };
    },
    onError: (error: any, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.list(), context.previousCart);
      }
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể cập nhật số lượng."
      );
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
};

export const useDeleteCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string) => deleteCart(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể xóa sản phẩm."
      );
      toast.error(errorMessage);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
      toast.success("Đã xóa toàn bộ giỏ hàng!");
    },
    onError: (error: any) => {
      const errorMessage = _.get(
        error,
        "response.data.message",
        "Không thể xóa giỏ hàng."
      );
      toast.error(errorMessage);
    },
  });
};
