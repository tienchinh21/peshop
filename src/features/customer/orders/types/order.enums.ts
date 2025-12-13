export enum PaymentMethod {
  COD = 0,
  VNPay = 6,
}
export enum PaymentStatus {
  Unpaid = 0,
  Paid = 1,
  Failed = 2,
  Refunded = 3,
  Cancelled = 4,
  Pending = 5,
}
export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Shipping = 2,
  Delivered = 3,
  Cancelled = 4,
  Returned = 5,
  Success = 6,
}
export enum DeliveryStatus {
  NotDelivered = 0,
  Delivering = 1,
  Delivered = 2,
}