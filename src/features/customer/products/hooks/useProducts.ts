"use client";

import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { getProducts, searchProducts, getProductBySlug, getProductDetail, getPromotionsByProduct, checkPromotionsInOrder } from "../services";
import type { ProductFilters, ProductsApiResponse } from "../types";
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  detailFull: (slug: string) => [...productKeys.details(), "full", slug] as const,
  infinite: (filters: ProductFilters) => [...productKeys.all, "infinite", filters] as const,
  promotions: (productId: string) => [...productKeys.all, "promotions", productId] as const,
  orderPromotions: (orderId: string) => [...productKeys.all, "order-promotions", orderId] as const
};
export const useProducts = (filters?: ProductFilters) => {
  const keyword = filters?.keyword || filters?.search;
  const hasFilters = filters?.categoryId || filters?.categoryChildId || filters?.minPrice !== undefined || filters?.maxPrice !== undefined || filters?.reviewPoint !== undefined;
  const useSearchApi = !!keyword && !hasFilters;
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => {
      if (useSearchApi) {
        return searchProducts({
          keyword,
          page: filters?.page,
          pageSize: filters?.pageSize
        });
      }
      return getProducts(filters);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: true,
    placeholderData: (previousData: any) => previousData
  });
};
export const useInfiniteProducts = (filters?: ProductFilters) => {
  return useInfiniteQuery({
    queryKey: productKeys.infinite(filters || {}),
    queryFn: ({
      pageParam = 1
    }) => getProducts({
      ...filters,
      page: pageParam,
      pageSize: 20
    }),
    getNextPageParam: (lastPage: ProductsApiResponse) => {
      return lastPage.data.hasNextPage ? lastPage.data.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    retry: 3
  });
};
export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => getProductBySlug(slug),
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
    retry: 3
  });
};
export const useProductDetail = (slug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.detailFull(slug),
    queryFn: () => getProductDetail(slug),
    staleTime: 10 * 60 * 1000,
    enabled: !!slug && enabled,
    retry: 3
  });
};
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();
  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detailFull(slug),
      queryFn: () => getProductDetail(slug),
      staleTime: 5 * 60 * 1000
    });
  };
};
export const usePrefetchProductWithDebounce = () => {
  const queryClient = useQueryClient();
  const prefetchProduct = usePrefetchProduct();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onMouseEnter = (slug: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      prefetchProduct(slug);
    }, 1000);
  };
  const onMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  return {
    onMouseEnter,
    onMouseLeave
  };
};
export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({
      queryKey: productKeys.all
    });
  };
};
export const useProductPromotions = (productId: string) => {
  return useQuery({
    queryKey: productKeys.promotions(productId),
    queryFn: () => getPromotionsByProduct(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
};
export const useOrderPromotions = (orderId: string | null) => {
  return useQuery({
    queryKey: productKeys.orderPromotions(orderId || ""),
    queryFn: () => checkPromotionsInOrder(orderId!),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
};
