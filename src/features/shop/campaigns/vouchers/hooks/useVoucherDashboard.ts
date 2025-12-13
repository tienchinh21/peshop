import { useQuery } from "@tanstack/react-query";
import { getVoucherShopDashboard } from "../services";
import type { VoucherDashboardFilters } from "../types";
export const voucherDashboardKeys = {
  all: ["voucher-dashboard"] as const,
  detail: (filters: VoucherDashboardFilters) => [...voucherDashboardKeys.all, "detail", filters] as const
};
export const useVoucherDashboard = (filters: VoucherDashboardFilters) => {
  return useQuery({
    queryKey: voucherDashboardKeys.detail(filters),
    queryFn: () => getVoucherShopDashboard(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });
};