// Variant property value structure
export interface VariantPropertyValue {
  imgUrl: string;
  level: number;
  value: string;
}

// Variant property structure
export interface VariantProperty {
  name: string;
}

// Variant value structure in cart
export interface CartVariantValue {
  propertyValue: VariantPropertyValue;
  property: VariantProperty;
}

// Cart item from API response
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

// Add to cart payload
export interface AddToCartPayload {
  price: number;
  quantity: number;
  productId: string;
  variantId: number | null;
}

// Update cart payload (PUT /Cart/update-cart)
export interface UpdateCartPayload {
  cartId: string;
  quantity: number;
}

// Cart response from GET /Cart/get-cart
export interface CartResponse {
  error: string | null;
  data: CartItem[];
}

// Cart count response from GET /Cart/get-cart-count
export interface CartCountData {
  totalQuantity: number;
  totalItems: number;
}

export interface CartCountResponse {
  error: string | null;
  data: CartCountData;
}
