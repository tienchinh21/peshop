"use client";

import { Star } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ReviewsHeaderProps {
  totalReviews: number;
  averageRating: number;
  isLoading: boolean;
}

/**
 * ReviewsHeader component displays page title and review statistics
 * - Display page title "Đánh giá"
 * - Show total review count
 * - Show average rating with star visualization
 * - Handle loading state
 * Requirements: 6.1, 6.2
 */
export function ReviewsHeader({
  totalReviews,
  averageRating,
  isLoading,
}: ReviewsHeaderProps) {
  // Render star rating visualization
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        // Half star (using a full star with partial fill)
        stars.push(
          <div key={i} className="relative">
            <Star className="h-5 w-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />);
      }
    }

    return stars;
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá</h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý đánh giá từ khách hàng
        </p>
      </div>

      {/* Statistics */}
      <div className="flex items-center gap-6">
        {isLoading ? (
          <>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </>
        ) : (
          <>
            {/* Total reviews */}
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-gray-900">
                {totalReviews.toLocaleString("vi-VN")}
              </span>
              <span className="text-sm text-gray-500">Tổng đánh giá</span>
            </div>

            {/* Average rating */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5">
                  {renderStars(averageRating)}
                </div>
              </div>
              <span className="text-sm text-gray-500">Đánh giá trung bình</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
