import { StatusColors } from "./statusColors";
export enum ProductStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
  LOCKED = 3,
}
export const ProductStatusLabels: Record<ProductStatus, string> = {
  [ProductStatus.LOCKED]: "Bị khoá",
  [ProductStatus.ACTIVE]: "Đang hoạt động",
  [ProductStatus.DELETED]: "Đã xóa",
  [ProductStatus.INACTIVE]: "Đã ẩn"
};
export const ProductStatusColors: Record<ProductStatus, string> = {
  [ProductStatus.LOCKED]: StatusColors.LOCKED,
  [ProductStatus.ACTIVE]: StatusColors.ACTIVE,
  [ProductStatus.DELETED]: StatusColors.DELETED,
  [ProductStatus.INACTIVE]: StatusColors.INACTIVE
};
export enum ProductSortField {
  NAME = "name",
  PRICE = "price",
  BOUGHT_COUNT = "boughtCount",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}
export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}