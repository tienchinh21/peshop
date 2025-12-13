"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyToReview, shopReviewKeys } from "../services/review.service";
import { toast } from "sonner";

interface UseReplyReviewOptions {
  onSuccess?: () => void;
}

/**
 * Hook for replying to a customer review
 * Invalidates review list cache on success
 */
export function useReplyReview(options?: UseReplyReviewOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, replyContent }: { reviewId: number; replyContent: string }) =>
      replyToReview(reviewId, replyContent),
    onSuccess: () => {
      toast.success("Đã gửi phản hồi thành công");
      queryClient.invalidateQueries({ queryKey: shopReviewKeys.all });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Không thể gửi phản hồi";
      toast.error(message);
    },
  });
}
