import { StatusColors } from "./statusColors";
export enum VoucherStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  EXPIRED = 2,
}
export const VoucherStatusLabels: Record<VoucherStatus, string> = {
  [VoucherStatus.INACTIVE]: "Chưa kích hoạt",
  [VoucherStatus.ACTIVE]: "Đang hoạt động",
  [VoucherStatus.EXPIRED]: "Đã hết hạn"
};
export const VoucherStatusColors: Record<VoucherStatus, string> = {
  [VoucherStatus.INACTIVE]: StatusColors.INACTIVE,
  [VoucherStatus.ACTIVE]: StatusColors.ACTIVE,
  [VoucherStatus.EXPIRED]: StatusColors.EXPIRED
};
export enum VoucherType {
  FIXED_AMOUNT = 0,
  PERCENTAGE = 1,
}
export const VoucherTypeLabels: Record<VoucherType, string> = {
  [VoucherType.FIXED_AMOUNT]: "Giảm giá tiền",
  [VoucherType.PERCENTAGE]: "Giảm giá %"
};
export const VoucherTypeIcons: Record<VoucherType, string> = {
  [VoucherType.FIXED_AMOUNT]: "₫",
  [VoucherType.PERCENTAGE]: "%"
};
export enum VoucherSortField {
  NAME = "name",
  CODE = "code",
  DISCOUNT_VALUE = "discountValue",
  START_TIME = "startTime",
  END_TIME = "endTime",
  CREATED_AT = "createdAt",
}
export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}
