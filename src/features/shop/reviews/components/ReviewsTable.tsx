"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ReviewTableRow } from "./ReviewTableRow";
import { ReviewTableEmpty } from "./ReviewTableEmpty";
import { ReviewTableLoading } from "./ReviewTableLoading";
import { ReplyDialog } from "./ReplyDialog";
import { toast } from "sonner";
import type { Review } from "../types/review.types";

interface ReviewsTableProps {
  reviews: Review[];
  isLoading?: boolean;
  pageSize?: number;
}

/**
 * ReviewsTable component composes the table with header, body, empty, and loading states
 * Handles conditional rendering based on loading and data state
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
export function ReviewsTable({
  reviews,
  isLoading = false,
  pageSize = 10,
}: ReviewsTableProps) {
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleReply = (review: Review) => {
    if (review.replyContent) {
      toast.info("Đánh giá này đã được phản hồi");
      return;
    }
    setSelectedReview(review);
    setReplyDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Đánh giá</TableHead>
              <TableHead className="w-[180px]">Khách hàng</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead className="w-[200px]">Sản phẩm</TableHead>
              <TableHead className="w-[140px]">Thời gian</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <ReviewTableLoading rows={pageSize} />
            ) : reviews.length === 0 ? (
              <ReviewTableEmpty />
            ) : (
              reviews.map((review) => (
                <ReviewTableRow
                  key={review.id}
                  review={review}
                  onReply={handleReply}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ReplyDialog
        review={selectedReview}
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
      />
    </>
  );
}
