export interface ShopVoucher {
  id: string;
  name: string;
  code: string;
  type: number;
  discountValue: number;
  maxDiscountAmount?: number; // Có trong detail response, không có trong list response
  minimumOrderValue?: number; // Có trong detail response, không có trong list response
  quantity: number;
  limitForUser?: number; // Có trong detail response, không có trong list response
  startTime: string;
  endTime: string;
  status: number;
  quantityUsed: number | null;
  createdAt?: string; // Không có trong response
  updatedAt?: string; // Không có trong response
}

export interface VoucherListPaginationInfo {
  page: number;
  size: number;
  pages: number;
  total: number;
}

export interface ShopVoucherListResponse {
  error: string | null;
  content: {
    info: VoucherListPaginationInfo;
    response: ShopVoucher[];
  };
}

export interface ShopVoucherDetailResponse {
  error: string | null;
  content: ShopVoucher;
}

export interface VoucherListFilters {
  page?: number;
  size?: number;
  search?: string;
  status?: number;
  type?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateVoucherPayload {
  name: string;
  code: string;
  type: number;
  discountValue: number;
  maxDiscountAmount: number;
  minimumOrderValue: number;
  quantity: number;
  limitForUser: number;
  startTime: string;
  endTime: string;
  status: number;
}

/**
 * Payload để update voucher shop
 *
 * Lưu ý:
 * - Không thể update voucher có status = ENDED (2)
 * - Nếu status = INACTIVE (0): có thể update tất cả field (name, discountValue, minimumOrderValue, quantity, startTime, endTime) — endTime phải > startTime
 * - Nếu status = ACTIVE (1): chỉ có thể update name và quantity
 * - Code không thể thay đổi trong mọi trường hợp
 * - Voucher phải thuộc về shop của user đang login
 */
export interface UpdateVoucherPayload {
  name?: string;
  discountValue?: number;
  maxDiscountAmount?: number;
  minimumOrderValue?: number;
  quantity?: number;
  startTime?: string;
  endTime?: string;
  // Code, type, limitForUser, status không thể update
}
