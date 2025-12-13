export interface VariantPropertyValue {
  imgUrl: string;
  level: number;
  value: string;
}
export interface VariantProperty {
  name: string;
}
export interface CartVariantValue {
  propertyValue: VariantPropertyValue;
  property: VariantProperty;
}
export interface CartItem {
  cartId: string;
  shopId: string;
  shopName: string;
  price: number;
  slug: string;
  quantity: number;
  productId: string;
  productName: string;
  productImage: string;
  variantId: string | null;
  variantStatus: number | null;
  variantValues: CartVariantValue[];
}
export interface AddToCartPayload {
  price: number;
  quantity: number;
  productId: string;
  variantId: number | null;
}
export interface UpdateCartPayload {
  cartId: string;
  quantity: number;
}
export interface CartResponse {
  error: string | null;
  data: CartItem[];
}
export interface CartCountData {
  totalQuantity: number;
  totalItems: number;
}
export interface CartCountResponse {
  error: string | null;
  data: CartCountData;
}