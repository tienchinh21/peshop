import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRef } from "react";
import {
  getProducts,
  getProductBySlug,
  searchProducts,
  getProductDetail,
  getPromotionsByProduct,
  checkPromotionsInOrder,
} from "@/services/api/users/product.service";
import type {
  ProductFilters,
  ProductsApiResponse,
} from "@/types/users/product.types";

/**
 * Query keys for products
 * Provides consistent cache keys across the application
 */
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  detailFull: (slug: string) =>
    [...productKeys.details(), "full", slug] as const,
  infinite: (filters: ProductFilters) =>
    [...productKeys.all, "infinite", filters] as const,
  promotions: (productId: string) =>
    [...productKeys.all, "promotions", productId] as const,
  orderPromotions: (orderId: string) =>
    [...productKeys.all, "order-promotions", orderId] as const,
};

/**
 * Hook for fetching paginated products
 * Use this for simple pagination without infinite scroll
 */
export const useProducts = (filters?: ProductFilters) => {
  // Determine which API to use based on filters
  const isSearch = filters?.keyword || filters?.search;
  const hasFilters =
    filters?.categoryId ||
    filters?.categoryChildId ||
    filters?.minPrice ||
    filters?.maxPrice ||
    filters?.reviewPoint;

  // Always fetch - the hook should always return data
  const shouldFetch = true;

  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => {
      if (isSearch) {
        // Use search API when keyword is provided (for search results)
        return searchProducts({
          ...filters,
          keyword: filters?.keyword || filters?.search,
        });
      }
      // Use regular products API for general listing and filters
      return getProducts(filters);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: shouldFetch,
    placeholderData: (previousData: any) => previousData,
  });
};

/**
 * Hook for infinite scroll/load more functionality
 * Automatically manages pagination and data accumulation
 */
export const useInfiniteProducts = (filters?: ProductFilters) => {
  return useInfiniteQuery({
    queryKey: productKeys.infinite(filters || {}),
    queryFn: ({ pageParam = 1 }) =>
      getProducts({ ...filters, page: pageParam, pageSize: 20 }),
    getNextPageParam: (lastPage: ProductsApiResponse) => {
      return lastPage.data.hasNextPage ? lastPage.data.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

/**
 * Hook for fetching single product by slug
 */
export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => getProductBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
    retry: 3,
  });
};

/**
 * Hook for fetching full product details with variants (for Quick View)
 */
export const useProductDetail = (slug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.detailFull(slug),
    queryFn: () => getProductDetail(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug && enabled,
    retry: 3,
  });
};

/**
 * Hook for prefetching product details
 * Useful for optimistic loading on hover
 */
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detailFull(slug),
      queryFn: () => getProductDetail(slug),
      staleTime: 5 * 60 * 1000,
    });
  };
};

/**
 * Hook for prefetching product details with debounce
 * Prefetches after 1 second of hover to avoid excessive API calls
 */
export const usePrefetchProductWithDebounce = () => {
  const queryClient = useQueryClient();
  const prefetchProduct = usePrefetchProduct();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onMouseEnter = (slug: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout to prefetch after 1 second
    timeoutRef.current = setTimeout(() => {
      prefetchProduct(slug);
    }, 1000);
  };

  const onMouseLeave = () => {
    // Clear timeout if user leaves before 1 second
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return {
    onMouseEnter,
    onMouseLeave,
  };
};

/**
 * Hook for invalidating products cache
 * Use after mutations that affect product data
 */
export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
  };
};

export const useProductPromotions = (
  productId: string,
  hasPromotion: boolean
) => {
  return useQuery({
    queryKey: productKeys.promotions(productId),
    queryFn: () => getPromotionsByProduct(productId),
    enabled: !!productId && hasPromotion,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useOrderPromotions = (orderId: string | null) => {
  return useQuery({
    queryKey: productKeys.orderPromotions(orderId || ""),
    queryFn: () => checkPromotionsInOrder(orderId!),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
