/**
 * Wishlist Feature Module
 *
 * This is the main barrel export for the wishlist feature module.
 * It re-exports everything from subdirectories for convenient importing.
 *
 * Usage:
 * import { WishlistPage, useWishlist, getWishlist } from '@/features/customer/wishlist';
 */

// Components
export { WishlistPage } from "./components";

// Hooks
export {
  wishlistKeys,
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
  useCheckWishlistStatus,
} from "./hooks";

// Services
export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
} from "./services";

// Types
export type {
  WishlistProduct,
  WishlistResponse,
  AddToWishlistPayload,
  RemoveFromWishlistPayload,
  WishlistState,
} from "./types";
