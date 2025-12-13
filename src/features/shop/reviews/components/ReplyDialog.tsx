"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useReplyReview } from "../hooks/useReplyReview";
import type { Review } from "../types/review.types";

interface ReplyDialogProps {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for shop owner to reply to a customer review
 * Each review can only have one reply
 */
export function ReplyDialog({ review, open, onOpenChange }: ReplyDialogProps) {
  const [content, setContent] = useState("");
  const { mutate: reply, isPending } = useReplyReview({
    onSuccess: () => {
      setContent("");
      onOpenChange(false);
    },
  });

  const handleSubmit = () => {
    if (!review || !content.trim()) return;
    reply({ reviewId: review.id, replyContent: content.trim() });
  };

  const handleClose = () => {
    if (!isPending) {
      setContent("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>Phản hồi đánh giá</DialogTitle>
        </DialogHeader>

        {review && (
          <div className="space-y-5">
            {/* Original review preview */}
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">
                {review.user.name}
              </p>
              <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                {review.content}
              </p>
            </div>

            {/* Reply input */}
            <Textarea
              placeholder="Nhập nội dung phản hồi..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="min-h-[120px]"
              disabled={isPending}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isPending}
          >
            {isPending ? "Đang gửi..." : "Gửi phản hồi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
