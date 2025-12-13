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
export interface WishlistResponse {
  items: WishlistProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
export interface AddToWishlistPayload {
  productId: string;
}
export interface RemoveFromWishlistPayload {
  productId: string;
}
export interface WishlistState {
  items: WishlistProduct[];
  isLoading: boolean;
  error: string | null;
}