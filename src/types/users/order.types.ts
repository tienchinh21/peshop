// Re-export from new location for backward compatibility
// TODO: Remove this file after all imports are updated to use @/features/customer/orders
export type {
  OrderProductItemPayload,
  CreateOrderPayload,
  CreateVirtualOrderPayload,
  OrderProductItem,
  OrderShopItem,
  VirtualOrderData,
  VirtualOrderResponse,
  CalculatedOrderData,
  ApplyVoucherPayload,
  ShippingFeeProduct,
  ShippingFeeShopItem,
  GetShippingFeePayload,
  ApplyShippingFeeItem,
  ApplyShippingFeePayload,
  ShippingFeeItem,
  ShippingFeeResponse,
} from "@/features/customer/orders";
