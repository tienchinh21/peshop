import { useQuery } from "@tanstack/react-query";
import { getShopFlashSales, getParticipatedFlashSales } from "../services/flash-sale.service";
export const shopFlashSaleKeys = {
  all: ["shop-flash-sale"] as const,
  lists: () => [...shopFlashSaleKeys.all, "list"] as const,
  list: (startDate: string, endDate: string) => [...shopFlashSaleKeys.lists(), startDate, endDate] as const,
  participated: () => [...shopFlashSaleKeys.all, "participated"] as const
};

/**
 * Hook to fetch available Flash Sales within a date range
 * 
 * @param startDate - Start date filter (ISO string format)
 * @param endDate - End date filter (ISO string format)
 * @param enabled - Optional flag to enable/disable the query
 * @returns Query result with Flash Sales data
 * 
 * Requirements: 4.2, 4.3, 5.3, 5.5
 */
export const useShopFlashSales = (startDate: string, endDate: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: shopFlashSaleKeys.list(startDate, endDate),
    queryFn: () => getShopFlashSales(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });
};

/**
 * Hook to fetch Flash Sales that the shop has participated in
 * 
 * @param enabled - Optional flag to enable/disable the query
 * @returns Query result with participated Flash Sales and their products
 * 
 * Requirements: 4.2, 4.3, 5.3, 5.5
 */
export const useParticipatedFlashSales = (enabled: boolean = true) => {
  return useQuery({
    queryKey: shopFlashSaleKeys.participated(),
    queryFn: getParticipatedFlashSales,
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });
};