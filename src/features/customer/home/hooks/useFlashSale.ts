"use client";

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFlashSaleToday, getFlashSaleProducts } from "../services";
import type { FlashSaleToday, FlashSaleProductsResponse } from "../types";
export const flashSaleKeys = {
  all: ["flash-sale"] as const,
  today: () => [...flashSaleKeys.all, "today"] as const,
  products: (flashSaleId: string) => [...flashSaleKeys.all, "products", flashSaleId] as const
};

/**
 * Hook for fetching Flash Sales for today
 * @returns Query result with Flash Sale list
 * @requirements 4.2 - Use stale data while revalidating in background
 * @requirements 4.3 - Cancel pending requests on unmount (handled by React Query)
 */
export const useFlashSaleToday = () => {
  return useQuery<FlashSaleToday[], Error>({
    queryKey: flashSaleKeys.today(),
    queryFn: getFlashSaleToday,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
};

/**
 * Hook for fetching products for a specific Flash Sale
 * @param flashSaleId - The ID of the Flash Sale
 * @param enabled - Whether the query should be enabled
 * @returns Query result with Flash Sale products
 * @requirements 4.2 - Use stale data while revalidating in background
 * @requirements 4.3 - Cancel pending requests on unmount (handled by React Query)
 */
export const useFlashSaleProducts = (flashSaleId: string, enabled: boolean = true) => {
  return useQuery<FlashSaleProductsResponse, Error>({
    queryKey: flashSaleKeys.products(flashSaleId),
    queryFn: () => getFlashSaleProducts(flashSaleId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    enabled: !!flashSaleId && enabled,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
};
export const useInvalidateFlashSale = () => {
  const queryClient = useQueryClient();
  return React.useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: flashSaleKeys.all
    });
  }, [queryClient]);
};