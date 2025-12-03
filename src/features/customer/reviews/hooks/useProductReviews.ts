import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful
} from '../services';
import type {
  ReviewFilterParams,
  CreateReviewPayload,
  UpdateReviewPayload
} from '../types';
import { toast } from 'sonner';

// Query keys for reviews
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (params: ReviewFilterParams) => [...reviewKeys.lists(), params] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
};

/**
 * Hook to fetch product reviews with filters and pagination
 */
export const useProductReviews = (params: ReviewFilterParams) => {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => getProductReviews(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!params.productId,
  });
};

/**
 * Hook to create a new review
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: (_, variables) => {
      // Invalidate all review queries for this product
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists(),
        predicate: (query) => {
          const params = query.queryKey[2] as ReviewFilterParams;
          return params?.productId === variables.productId;
        },
      });
      
      toast.success('Đánh giá của bạn đã được gửi thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
    },
  });
};

/**
 * Hook to update an existing review
 */
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateReviewPayload) => updateReview(payload),
    onSuccess: () => {
      // Invalidate all review queries
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      toast.success('Đánh giá đã được cập nhật!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật đánh giá.');
    },
  });
};

/**
 * Hook to delete a review
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      toast.success('Đánh giá đã được xóa!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể xóa đánh giá.');
    },
  });
};

/**
 * Hook to mark review as helpful
 */
export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => markReviewHelpful(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể đánh dấu hữu ích.');
    },
  });
};
