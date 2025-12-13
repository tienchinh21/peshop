import { useQuery } from "@tanstack/react-query";
import { getReviews, shopReviewKeys } from "../services";
import type { ReviewFilterParams } from "../types";

/**
 * Hook to fetch shop reviews with filters
 *
 * @param filters - Optional filter parameters (rating, search, sort, pagination)
 * @returns React Query result with reviews data
 *
 * Requirements: 1.1, 1.4
 *
 * @example
 * const { data, isLoading } = useShopReviews({
 *   page: 1,
 *   size: 10,
 *   rating: 5,
 *   sort: 'createdAt,desc'
 * });
 */
export const useShopReviews = (filters?: ReviewFilterParams) => {
  return useQuery({
    queryKey: shopReviewKeys.list(filters || {}),
    queryFn: () => getReviews(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
