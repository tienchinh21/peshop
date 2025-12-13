"use client";

import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Star, MessageSquareReply } from "lucide-react";
import { format } from "date-fns";
import { formatPrice } from "@/shared/utils";
import type { Review } from "../types/review.types";

interface ReviewTableRowProps {
  review: Review;
  onReply?: (review: Review) => void;
}

/**
 * Renders star rating icons
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-orange-500 text-orange-500"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * ReviewTableRow component displays a single review in the table
 * Shows rating, customer info, content, variant info, timestamp, and reply
 * Requirements: 1.2
 */
export function ReviewTableRow({ review, onReply }: ReviewTableRowProps) {
  const formattedDate = format(new Date(review.createdAt), "dd/MM/yyyy HH:mm");

  return (
    <TableRow>
      {/* Rating */}
      <TableCell>
        <StarRating rating={review.rating} />
      </TableCell>

      {/* Customer Info */}
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
            {review.user.avatar ? (
              <img
                src={review.user.avatar}
                alt={review.user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-500">
                {review.user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm font-medium">{review.user.name}</span>
        </div>
      </TableCell>

      <TableCell className="max-w-xs">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-700 line-clamp-2">{review.content}</p>
          {review.urlImg && (
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border">
              <img
                src={review.urlImg}
                alt="Review image"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          {review.replyContent && (
            <div className="rounded bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-600">Phản hồi của shop</p>
              <p className="mt-1 text-sm text-gray-700">{review.replyContent}</p>
            </div>
          )}
        </div>
      </TableCell>

      {/* Variant Info */}
      <TableCell>
        <div className="flex items-center gap-2">
          {review.variant.image && (
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded border bg-gray-100">
              <img
                src={review.variant.image}
                alt={review.variant.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm text-gray-700 line-clamp-1">
              {review.variant.name}
            </span>
            <span className="text-xs text-gray-500">
              {formatPrice(review.variant.price)}
            </span>
            <span className="text-xs text-gray-400">
              ID: {review.variant.id}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Created At */}
      <TableCell className="text-sm text-gray-500">{formattedDate}</TableCell>

      <TableCell>
        {onReply && !review.replyContent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(review)}
            className="text-blue-600 hover:text-blue-700"
          >
            <MessageSquareReply className="h-4 w-4 mr-1" />
            Phản hồi
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
