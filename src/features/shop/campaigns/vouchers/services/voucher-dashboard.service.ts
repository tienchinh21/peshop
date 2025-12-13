import { axiosJava } from "@/lib/config/axios.config";
import type { VoucherShopDashboardResponse, VoucherDashboardFilters } from "../types";
export const getVoucherShopDashboard = async (filters: VoucherDashboardFilters): Promise<VoucherShopDashboardResponse> => {
  const params = new URLSearchParams();
  params.append("startDate", filters.startDate);
  params.append("endDate", filters.endDate);
  params.append("period", filters.period);
  const url = `/voucher-shop/dashboard?${params.toString()}`;
  const response = await axiosJava.get<VoucherShopDashboardResponse>(url);
  return response.data;
};