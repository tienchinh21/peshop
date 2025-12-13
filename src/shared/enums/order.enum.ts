export enum OrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  REJECTED = 2,
}
export const OrderStatusLabel = {
  [OrderStatus.PENDING]: "Chờ xác nhận",
  [OrderStatus.CONFIRMED]: "Đã xác nhận",
  [OrderStatus.REJECTED]: "Đã hủy"
} as const;
export const OrderStatusColor = {
  [OrderStatus.PENDING]: "warning",
  [OrderStatus.CONFIRMED]: "success",
  [OrderStatus.REJECTED]: "destructive"
} as const;