import { axiosJava } from "@/lib/config/axios.config";
import type { ReviewResponse, ReviewFilterParams, ReplyReviewRequest } from "../types/review.types";
import { buildReviewFilter } from "../utils";

/**
 * Query keys for React Query cache management
 */
export const shopReviewKeys = {
  all: ["shop-reviews"] as const,
  list: (filters: ReviewFilterParams) => [...shopReviewKeys.all, "list", filters] as const,
};

/**
 * Fetch reviews for the shop with optional filtering, sorting, and pagination
 *
 * @param params - Optional filter parameters
 * @returns Promise resolving to ReviewResponse
 *
 * Requirements: 1.1, 2.1, 3.1, 4.1, 5.1
 */
export const getReviews = async (
  params?: ReviewFilterParams
): Promise<ReviewResponse> => {
  const queryParams = new URLSearchParams();

  if (params) {
    // Pagination parameters
    if (params.page !== undefined) {
      queryParams.append("page", params.page.toString());
    }
    if (params.size !== undefined) {
      queryParams.append("size", params.size.toString());
    }

    // Sorting parameter
    if (params.sort) {
      queryParams.append("sort", params.sort);
    }

    // Build Spring Filter string from rating and search params
    const filterString = buildReviewFilter(params);
    if (filterString) {
      queryParams.append("filter", filterString);
    }
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/shop/reviews?${queryString}` : "/shop/reviews";

  const response = await axiosJava.get<ReviewResponse>(url);
  return response.data;
};

/**
 * Reply to a customer review
 * Each review can only have one reply from the shop
 *
 * @param reviewId - The ID of the review to reply to
 * @param replyContent - The reply content
 * @returns Promise resolving to void
 */
export const replyToReview = async (
  reviewId: number,
  replyContent: string
): Promise<void> => {
  const payload: ReplyReviewRequest = { replyContent };
  await axiosJava.put(`/shop/reviews/${reviewId}/reply`, payload);
};
