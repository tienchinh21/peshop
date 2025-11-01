export interface ShopVoucher {
  id: string;
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
  usedCount?: number;
  createdAt?: string;
  updatedAt?: string;
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

export interface UpdateVoucherPayload extends Partial<CreateVoucherPayload> {
  id: string;
}

