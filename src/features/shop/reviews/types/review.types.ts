/**
 * Shop Reviews Types
 * Types for the shop reviews management feature
 * Based on ReviewController API Documentation
 */

/**
 * User information associated with a review
 */
export interface ReviewUser {
  name: string;
  avatar: string | null;
}

/**
 * Product information associated with a review
 */
export interface ReviewProduct {
  id: string;
  name: string;
  image: string | null;
}

/**
 * Variant value (property) of a product variant
 */
export interface VariantValue {
  id: number;
  value: string;
  imgUrl: string | null;
}

/**
 * Product variant information associated with a review
 */
export interface ReviewVariant {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

/**
 * Shop reply to a review
 */
export interface ReviewReply {
  content: string;
  createdAt: string;
}

/**
 * Review entity representing a customer review
 * Matches API response from GET /shop/reviews
 */
export interface Review {
  id: number;
  rating: number;
  content: string;
  urlImg: string | null;
  user: ReviewUser;
  variant: ReviewVariant;
  createdAt: string;
  replyContent?: string | null;
  replyCreatedAt?: string | null;
}

/**
 * Request payload for replying to a review
 * Used with PUT /shop/reviews/{id}/reply
 */
export interface ReplyReviewRequest {
  replyContent: string;
}

/**
 * Pagination information for review responses
 * Note: API page starts from 0, but UI displays from 1
 */
export interface PageInfo {
  page: number;
  size: number;
  pages: number;
  total: number;
}

/**
 * API response structure for reviews endpoint
 * Response from GET /shop/reviews
 */
export interface ReviewResponse {
  info: PageInfo;
  response: Review[];
}

/**
 * Filter parameters for querying reviews
 * Used to build query string for GET /shop/reviews
 */
export interface ReviewFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  filter?: string;
  // Derived filter values (used to build Spring Filter string)
  rating?: number | null;
  search?: string;
  productId?: string | null;
  variantId?: string | null;
  orderId?: string | null;
}

/**
 * Sort options for reviews
 */
export type SortOption =
  | "createdAt,desc"
  | "createdAt,asc"
  | "rating,desc"
  | "rating,asc";
