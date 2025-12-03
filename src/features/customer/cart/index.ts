/**
 * Cart Feature Module
 *
 * This is the main barrel export for the cart feature module.
 * It re-exports everything from subdirectories for convenient importing.
 *
 * Usage:
 * import { CartPage, useCart, getCart } from '@/features/customer/cart';
 */

// Components
export { CartPage } from "./components";

// Hooks
export {
  cartKeys,
  useCart,
  useCartCount,
  useAddToCart,
  useUpdateCart,
  useDeleteCart,
  useClearCart,
} from "./hooks";

// Services
export {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
  clearCart,
  getCartCount,
} from "./services";

// Types
export type {
  VariantPropertyValue,
  VariantProperty,
  CartVariantValue,
  CartItem,
  AddToCartPayload,
  UpdateCartPayload,
  CartResponse,
  CartCountData,
  CartCountResponse,
} from "./types";
