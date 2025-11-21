export interface OrderProductItemPayload {
  productId: string;
  variantId: number;
  note: string;
  quantity: number;
  priceOriginal: number;
  categoryId: string;
  shopId: string;
}

export interface CreateOrderPayload {
  orderId: string;
  paymentMethod: string;
};
export type CreateVirtualOrderPayload = {
  userAddressId: string;
  items: OrderProductItemPayload[];
};

export interface OrderProductItem {
  priceOriginal: number;
  categoryId: string;
  shopId: string;
  productId: string;
  variantId: number | null;
  note: string | null;
  quantity: number;
}

export interface OrderShopItem {
  shopId: string;
  shopName: string;
  shopLogoUrl: string | null;
  shippingId: string | null;
  products: OrderProductItem[];
  priceOriginal: number;
  priceAfterVoucher: number;
  feeShipping: number;
  voucherId: string | null;
  voucherValue: number;
  voucherName: string | null;
}

export interface VirtualOrderData {
  orderId: string;
  userFullName: string;
  voucherSystemId: string | null;
  voucherSystemValue: number;
  voucherSystemName: string | null;
  userFullNewAddress: string;
  itemShops: OrderShopItem[];
  userId: string;
  orderTotal: number;
  feeShippingTotal: number;
  amountTotal: number;
  createdAt: string;
}

export interface VirtualOrderResponse {
  error: string | null;
  data: {
    order: VirtualOrderData;
    status: boolean;
    message: string;
  };
}

export interface CalculatedOrderData {
  orderTotal: number;
  feeShippingTotal: number;
  voucherSystemValue: number;
  amountTotal: number;
  itemShops: Array<{
    shopId: string;
    voucherValue: number;
  }>;
}

export interface ApplyVoucherPayload {
  voucherId: string;
  orderId: string;
  shopId?: string;
}

export interface ShippingFeeProduct {
  productId: string;
  variantId: number;
  note: string;
  quantity: number;
}

export interface ShippingFeeShopItem {
  shopId: string;
  product: ShippingFeeProduct[];
}

export interface GetShippingFeePayload {
  userOldFullAddress: string;
  userOldProviceId: string;
  userOldWardId: string;
  orderId: string;
  listFeeShipping: ShippingFeeShopItem[];
}

export interface ApplyShippingFeeItem {
  shippingId: string;
  shopId: string;
}

export interface ApplyShippingFeePayload {
  orderId: string;
  listFeeShipping: ApplyShippingFeeItem[];
}

export interface ShippingFeeItem {
  id: string;
  carrier_name: string;
  carrier_logo: string;
  carrier_short_name: string;
  service: string;
  cod_fee: number;
  total_fee: number;
  total_amount: number;
  shopId: string;
}

export interface ShippingFeeResponse {
  listFeeShipping: ShippingFeeItem[];
}
