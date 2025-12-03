/**
 * Wishlist Types
 *
 * Type definitions for the wishlist feature.
 */

/**
 * Represents a product in the wishlist
 */
export interface WishlistProduct {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  shopId: string;
  shopName: string;
  inStock: boolean;
  addedAt: string;
}

/**
 * Wishlist response from API
 */
export interface WishlistResponse {
  items: WishlistProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Payload for adding item to wishlist
 */
export interface AddToWishlistPayload {
  productId: string;
}

/**
 * Payload for removing item from wishlist
 */
export interface RemoveFromWishlistPayload {
  productId: string;
}

/**
 * Wishlist state for local management
 */
export interface WishlistState {
  items: WishlistProduct[];
  isLoading: boolean;
  error: string | null;
}
