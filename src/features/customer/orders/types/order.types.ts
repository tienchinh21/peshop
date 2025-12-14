import { PaymentMethod, PaymentStatus, OrderStatus, DeliveryStatus } from "./order.enums";
export interface OrderProductItemPayload {
  productId: string;
  variantId: number;
  quantity: number;
}
export interface CreateVirtualOrderPayload {
  userAddressId: string;
  items: OrderProductItemPayload[];
}
export interface UpdateOrderItemPayload {
  productId: string;
  variantId: number;
  quantity: number;
  note?: string;
  priceOriginal?: number;
  categoryId?: string;
  shopId?: string;
  orderCode?: string;
  flashSaleProductId?: string;
  flashSalePercentDecrease?: number;
  flashSalePrice?: number;
  productName?: string;
  productWeight?: number;
  productLength?: number;
  productWidth?: number;
  productHeight?: number;
}
export interface UpdateVirtualOrderPayload {
  orderId: string;
  items: UpdateOrderItemPayload[];
}
export interface DeleteVirtualOrderPayload {
  orderId: string;
}
export interface OrderProductItem {
  productId: string;
  variantId: number | null;
  quantity: number;
  priceOriginal: number;
  categoryId?: string;
  flashSaleProductId?: string;
  flashSalePercentDecrease?: number;
  flashSalePrice?: number;
  flashSaleDiscount?: number;
}
export interface OrderShopItem {
  shopId: string;
  shopName: string;
  shopLogoUrl: string | null;
  orderCode: string;
  products: OrderProductItem[];
  gifts: any[];
  priceOriginal: number;
  feeShipping: number;
  voucherId: string | null;
  voucherValue: number;
  flashSaleDiscount: number;
}
export interface VirtualOrderData {
  orderId: string;
  recipientName: string;
  recipientPhone: string;
  userFullNewAddress: string;
  itemShops: OrderShopItem[];
  orderTotal: number;
  feeShippingTotal: number;
  discountTotal: number;
  flashSaleDiscountTotal: number;
  amountTotal: number;
  hasFlashSale: boolean;
  createdAt: string;
}
export interface VirtualOrderResponse {
  status: boolean;
  message: string;
  order: VirtualOrderData;
}
export interface VariantValue {
  imgUrl?: string;
  level?: number;
  value: string;
  propertyName?: string;
  valueName?: string;
}
export interface OrderProductDetail {
  productId: string;
  productName: string;
  productImage: string;
  variantId: string | null;
  variantValues?: VariantValue[];
  price: number;
  quantity: number;
  isAllowReview: boolean;
}
export interface OrderListItem {
  orderId: string;
  orderCode: string;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shopId: string;
  shopName: string;
  hasFlashSale: boolean;
  items: OrderProductDetail[];
}
export interface OrderDetail {
  orderId: string;
  orderCode: string;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shopId: string;
  shopName: string;
  hasFlashSale: boolean;
  createdAt: string;
  discountPrice: number;
  shippingFee: number;
  originalPrice: number;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  items: OrderProductDetail[];
}
export interface CreateOrderPayload {
  orderId: string;
  paymentMethod: PaymentMethod;
}
export interface CreateOrderResponse {
  status: boolean;
  message: string;
  paymentUrl?: string;
}
export interface ApplySystemVoucherPayload {
  voucherId: string;
  orderId: string;
}
export interface ApplyShopVoucherPayload {
  voucherId: string;
  orderId: string;
  shopId: string;
}
export interface ApplyVoucherResponse {
  status: boolean;
  message: string;
  order?: VirtualOrderData;
}
export interface CalculateOrderTotalResponse {
  status: boolean;
  message: string;
  order: {
    orderId: string;
    orderTotal: number;
    feeShippingTotal: number;
    discountTotal: number;
    flashSaleDiscountTotal: number;
    amountTotal: number;
    hasFlashSale: boolean;
    itemShops: OrderShopItem[];
  };
}
export interface GetShippingFeePayload {
  orderId: string;
}
export interface ShippingFeeOption {
  shopId: string;
  shopName: string;
  totalFee: number;
  serviceTypeId: number;
  serviceTypeName: string;
  expectedDeliveryTime: string | null;
}
export interface GetShippingFeeResponse {
  listFeeShipping: ShippingFeeOption[];
}
export interface ApplyShippingFeePayload {
  orderId: string;
}
export interface ApplyShippingFeeResponse {
  status: boolean;
  message: string;
}
export interface CancelOrderPayload {
  orderId: string;
}
export interface CancelOrderResponse {
  status: boolean;
  message: string;
}
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  error?: string | null;
}
export type ShippingFeeResponse = GetShippingFeeResponse;
export type CalculatedOrderData = VirtualOrderData;
