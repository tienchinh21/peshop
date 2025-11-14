export interface PromotionProduct {
  id: string;
  name: string;
  imgMain: string;
}

export interface PromotionGift {
  id?: string;
  productId?: string;
  product?: PromotionProduct;
  giftQuantity: number;
  maxGiftPerOrder?: number;
}

export interface PromotionRule {
  id?: string;
  productId?: string;
  product?: PromotionProduct;
  quantity: number;
}

export interface PromotionCreateDto {
  name: string;
  status: number;
  startTime: string;
  endTime: string;
  totalUsageLimit: number;
}

export interface Promotion {
  id: string;
  name: string;
  status: number;
  startTime: string;
  endTime: string;
  totalUsageLimit: number;
  rules?: PromotionRule[];
  gifts?: PromotionGift[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePromotionPayload {
  promotionCreateDto: PromotionCreateDto;
  promotionGifts: PromotionGift[];
  promotionRules: PromotionRule[];
}

export interface UpdatePromotionPayload {
  promotionUpdateDto: {
    name: string;
    status: number;
    startTime: string;
    endTime: string;
    totalUsageLimit: number;
  };
  promotionGifts: Array<{
    id: string;
    productId: string;
    giftQuantity: number;
  }>;
  promotionRules: Array<{
    id: string;
    productId: string;
    quantity: number;
  }>;
}

export interface AddPromotionRulesPayload {
  productId: string;
  quantity: number;
}

export interface AddPromotionGiftsPayload {
  productId: string;
  giftQuantity: number;
}

export interface PromotionListPaginationInfo {
  page: number;
  size: number;
  pages: number;
  total: number;
}

export interface PromotionListResponse {
  error: string | null;
  content: {
    info: PromotionListPaginationInfo;
    response: Promotion[];
  };
}

export interface PromotionListFilters {
  page?: number;
  size?: number;
  search?: string;
  status?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

import { StatusColors } from "@/lib/utils/enums/statusColors";

export enum PromotionStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

export const PromotionStatusLabels: Record<PromotionStatus, string> = {
  [PromotionStatus.INACTIVE]: "Tạm dừng",
  [PromotionStatus.ACTIVE]: "Hoạt động",
};

export const PromotionStatusColors: Record<PromotionStatus, string> = {
  [PromotionStatus.INACTIVE]: StatusColors.INACTIVE,
  [PromotionStatus.ACTIVE]: StatusColors.ACTIVE,
};
