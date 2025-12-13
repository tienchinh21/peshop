"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ReviewsHeader } from "./ReviewsHeader";
import { ReviewsFilter } from "./ReviewsFilter";
import { ReviewsTable } from "./ReviewsTable";
import { ReviewsPagination } from "./ReviewsPagination";
import { useShopReviews } from "../hooks/useShopReviews";
import { useReviewFilters } from "../hooks/useReviewFilters";

/**
 * ReviewsPage container component
 * Composes all sub-components (Header, Filter, Table, Pagination)
 * Connects hooks for data fetching and filter management
 * Handles loading and error states
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 4.1, 5.1, 6.1
 */
export function ReviewsPage() {
  // Filter state management with URL synchronization
  const {
    filters,
    searchInput,
    setRatingFilter,
    setSearchTerm,
    setSortOption,
    setPage,
    setPageSize,
    setProductIdFilter,
    setVariantIdFilter,
    setOrderIdFilter,
    resetFilters,
  } = useReviewFilters();

  // Fetch reviews data with current filters
  const { data, isLoading, isError, error } = useShopReviews(filters);

  // Handle errors
  if (error) {
    toast.error("Lỗi tải dữ liệu đánh giá", {
      description: error.message || "Không thể tải danh sách đánh giá",
    });
  }

  // Extract reviews and pagination info from response
  const reviews = data?.content?.response ?? [];
  const pageInfo = data?.content?.info ?? {
    page: filters.page ?? 1,
    size: filters.size ?? 10,
    pages: 0,
    total: 0,
  };

  // Calculate statistics for header
  const statistics = useMemo(() => {
    const totalReviews = pageInfo.total;

    // Calculate average rating from current page reviews
    // Note: For accurate average, this should come from API
    // Using current page as approximation
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      totalReviews,
      averageRating,
    };
  }, [reviews, pageInfo.total]);

  // Handle error state
  if (isError) {
    return (
      <div className="space-y-6">
        <ReviewsHeader totalReviews={0} averageRating={0} isLoading={false} />
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-red-500 font-medium">
                Đã xảy ra lỗi khi tải đánh giá
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {error instanceof Error
                  ? error.message
                  : "Vui lòng thử lại sau"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with statistics */}
      <ReviewsHeader
        totalReviews={statistics.totalReviews}
        averageRating={statistics.averageRating}
        isLoading={isLoading}
      />

      {/* Filter controls */}
      <Card>
        <CardContent className="pt-6">
          <ReviewsFilter
            filters={filters}
            searchInput={searchInput}
            onRatingChange={setRatingFilter}
            onSearchChange={setSearchTerm}
            onSortChange={setSortOption}
            onProductIdChange={setProductIdFilter}
            onVariantIdChange={setVariantIdFilter}
            onOrderIdChange={setOrderIdFilter}
            onReset={resetFilters}
          />
        </CardContent>
      </Card>

      {/* Reviews table */}
      <ReviewsTable
        reviews={reviews}
        isLoading={isLoading}
        pageSize={filters.size ?? 10}
      />

      {/* Pagination */}
      <ReviewsPagination
        pagination={pageInfo}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
