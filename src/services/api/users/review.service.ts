import { axiosDotnet } from '@/lib/config/axios.config';
import type {
  ReviewsResponse,
  CreateReviewPayload,
  UpdateReviewPayload,
  ReviewFilterParams,
  Review
} from '@/types/users/review.types';

/**
 * Fetch product reviews with filters and pagination
 */
export const getProductReviews = async (
  params: ReviewFilterParams
): Promise<ReviewsResponse> => {
  const searchParams = new URLSearchParams();
  
  searchParams.append('productId', params.productId);
  if (params.filter && params.filter !== 'all') {
    searchParams.append('filter', params.filter);
  }
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  
  const response = await axiosDotnet.get<ReviewsResponse>(
    `/Reviews?${searchParams.toString()}`
  );
  return response.data;
};

/**
 * Create a new product review
 */
export const createReview = async (
  payload: CreateReviewPayload
): Promise<Review> => {
  const formData = new FormData();
  
  formData.append('productId', payload.productId);
  formData.append('rating', payload.rating.toString());
  formData.append('comment', payload.comment);
  
  if (payload.variantId) {
    formData.append('variantId', payload.variantId);
  }
  
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
  }
  
  const response = await axiosDotnet.post<Review>('/Reviews', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Update an existing review
 */
export const updateReview = async (
  payload: UpdateReviewPayload
): Promise<Review> => {
  const formData = new FormData();
  
  if (payload.rating) {
    formData.append('rating', payload.rating.toString());
  }
  if (payload.comment) {
    formData.append('comment', payload.comment);
  }
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
  }
  
  const response = await axiosDotnet.put<Review>(
    `/Reviews/${payload.reviewId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  await axiosDotnet.delete(`/Reviews/${reviewId}`);
};

/**
 * Mark review as helpful
 */
export const markReviewHelpful = async (reviewId: string): Promise<void> => {
  await axiosDotnet.post(`/Reviews/${reviewId}/helpful`);
};

