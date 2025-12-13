import { axiosJava } from "@/lib/config/axios.config";
import type { ShopVoucherListResponse, ShopVoucherDetailResponse, VoucherListFilters, CreateVoucherPayload, UpdateVoucherPayload } from "@/types/shops/voucher.type";
const buildSortParam = (filters: VoucherListFilters): string => {
  if (!filters.sortBy) return "";
  const order = filters.sortOrder || "asc";
  return `${filters.sortBy},${order}`;
};
const buildFilterExpression = (filters: VoucherListFilters): string => {
  const expressions: string[] = [];
  if (filters.search) {
    expressions.push(`(name ~~ '*${filters.search}*' or code ~~ '*${filters.search}*')`);
  }
  if (filters.status !== undefined && filters.status !== null) {
    expressions.push(`status : ${filters.status}`);
  }
  if (filters.type !== undefined && filters.type !== null) {
    expressions.push(`type : ${filters.type}`);
  }
  return expressions.join(" and ");
};
export const getShopVouchers = async (filters?: VoucherListFilters): Promise<ShopVoucherListResponse> => {
  const params = new URLSearchParams();
  const page = filters?.page ? filters.page - 1 : 0;
  const size = filters?.size || 10;
  params.append("page", page.toString());
  params.append("size", size.toString());
  const sort = buildSortParam(filters || {});
  if (sort) params.append("sort", sort);
  const filterExpression = buildFilterExpression(filters || {});
  if (filterExpression) params.append("filter", filterExpression);
  const url = `/voucher-shop?${params.toString()}`;
  const response = await axiosJava.get<ShopVoucherListResponse>(url);
  return response.data;
};
export const getVoucherById = async (id: string): Promise<ShopVoucherDetailResponse> => {
  const response = await axiosJava.get<ShopVoucherDetailResponse>(`/voucher-shop/${id}`);
  return response.data;
};
export const createVoucher = async (payload: CreateVoucherPayload) => {
  const response = await axiosJava.post("/voucher-shop", payload);
  return response.data;
};

/**
 * Cập nhật voucher shop
 *
 * @param id - ID của voucher cần cập nhật
 * @param payload - Payload chứa các field cần cập nhật
 *
 * Lưu ý:
 * - Không thể update voucher có status = ENDED (2)
 * - Nếu status = INACTIVE (0): có thể update tất cả field (name, discountValue, minimumOrderValue, quantity, startTime, endTime) — endTime phải > startTime
 * - Nếu status = ACTIVE (1): chỉ có thể update name và quantity
 * - Code không thể thay đổi trong mọi trường hợp
 * - Voucher phải thuộc về shop của user đang login
 */
export const updateVoucher = async (id: string, payload: UpdateVoucherPayload): Promise<ShopVoucherDetailResponse> => {
  const response = await axiosJava.put<ShopVoucherDetailResponse>(`/voucher-shop/${id}`, payload);
  return response.data;
};
export const deleteVoucher = async (id: string) => {
  const response = await axiosJava.delete(`/voucher-shop/${id}`);
  return response.data;
};