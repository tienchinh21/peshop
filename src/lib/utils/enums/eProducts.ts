import { StatusColors } from "./statusColors";

export enum ProductStatus {
  //   LOCKED = 0, // Sản phẩm bị khoá
  //   ACTIVE = 1, // Sản phẩm đang hoạt động
  //   DELETED = 2, // Sản phẩm đã xóa
  //   HIDDEN = 3, // Ẩn sản phẩm khỏi người mua

  INACTIVE = 0, // Sản phẩm không hoạt động
  ACTIVE = 1, // Sản phẩm đang hoạt động
  DELETED = 2, // Sản phẩm đã xóa
  LOCKED = 3, // Sản phẩm bị khoá
}

export const ProductStatusLabels: Record<ProductStatus, string> = {
  [ProductStatus.LOCKED]: "Bị khoá",
  [ProductStatus.ACTIVE]: "Đang hoạt động",
  [ProductStatus.DELETED]: "Đã xóa",
  [ProductStatus.INACTIVE]: "Đã ẩn",
};

export const ProductStatusColors: Record<ProductStatus, string> = {
  [ProductStatus.LOCKED]: StatusColors.LOCKED,
  [ProductStatus.ACTIVE]: StatusColors.ACTIVE,
  [ProductStatus.DELETED]: StatusColors.DELETED,
  [ProductStatus.INACTIVE]: StatusColors.INACTIVE,
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
