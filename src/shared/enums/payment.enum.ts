export enum PaymentMethod {
  COD = "1",
  VNPAY = "6",
}
export const PaymentMethodLabel = {
  [PaymentMethod.COD]: "Thanh toán khi nhận hàng (COD)",
  [PaymentMethod.VNPAY]: "Thanh toán VNPay"
} as const;