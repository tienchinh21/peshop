"use client";

import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search, X, Filter, Star } from "lucide-react";
import type { ReviewFilterParams, SortOption } from "../types/review.types";

interface ReviewsFilterProps {
  filters: ReviewFilterParams;
  searchInput: string;
  onRatingChange: (rating: number | null) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortOption) => void;
  onProductIdChange: (productId: string | null) => void;
  onVariantIdChange: (variantId: string | null) => void;
  onOrderIdChange: (orderId: string | null) => void;
  onReset: () => void;
}

const RATING_OPTIONS = [
  { value: "all", label: "Tất cả đánh giá" },
  { value: "5", label: "5 sao" },
  { value: "4", label: "4 sao" },
  { value: "3", label: "3 sao" },
  { value: "2", label: "2 sao" },
  { value: "1", label: "1 sao" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "createdAt,desc", label: "Mới nhất" },
  { value: "createdAt,asc", label: "Cũ nhất" },
  { value: "rating,desc", label: "Đánh giá cao nhất" },
  { value: "rating,asc", label: "Đánh giá thấp nhất" },
];

/**
 * ReviewsFilter component provides filter controls for reviews
 * - Rating filter dropdown (All, 1-5 stars)
 * - Search input with debounce
 * - Sort dropdown (newest, oldest, highest rating, lowest rating)
 * Requirements: 2.1, 3.1, 4.1, 4.2
 */
export function ReviewsFilter({
  filters,
  searchInput,
  onRatingChange,
  onSearchChange,
  onSortChange,
  onProductIdChange,
  onVariantIdChange,
  onOrderIdChange,
  onReset,
}: ReviewsFilterProps) {
  const [localSearchInput, setLocalSearchInput] = useState(searchInput);

  // Sync local search input with prop
  useEffect(() => {
    setLocalSearchInput(searchInput);
  }, [searchInput]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchInput(value);
    onSearchChange(value);
  };

  const handleClearSearch = () => {
    setLocalSearchInput("");
    onSearchChange("");
  };

  const handleRatingChange = (value: string) => {
    onRatingChange(value === "all" ? null : parseInt(value, 10));
  };

  const handleSortChange = (value: string) => {
    onSortChange(value as SortOption);
  };

  const handleProductIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onProductIdChange(value || null);
  };

  const handleVariantIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onVariantIdChange(value || null);
  };

  const handleOrderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onOrderIdChange(value || null);
  };

  const hasActiveFilters =
    filters.rating !== null ||
    (filters.search && filters.search.length > 0) ||
    filters.sort !== "createdAt,desc" ||
    filters.productId !== null ||
    filters.variantId !== null ||
    filters.orderId !== null;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo nội dung hoặc tên khách hàng..."
            value={localSearchInput}
            onChange={handleSearchInputChange}
            className="pl-10"
          />
          {localSearchInput && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <Button variant="outline" onClick={onReset} className="gap-2">
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Lọc:</span>
        </div>

        {/* Rating filter */}
        <Select
          value={filters.rating ? filters.rating.toString() : "all"}
          onValueChange={handleRatingChange}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <SelectValue placeholder="Tất cả đánh giá" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {RATING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort dropdown */}
        <Select
          value={filters.sort || "createdAt,desc"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced filters */}
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Mã sản phẩm..."
            value={filters.productId || ""}
            onChange={handleProductIdChange}
            className="w-[150px]"
          />
          <Input
            type="text"
            placeholder="Mã biến thể..."
            value={filters.variantId || ""}
            onChange={handleVariantIdChange}
            className="w-[150px]"
          />
          <Input
            type="text"
            placeholder="Mã đơn hàng..."
            value={filters.orderId || ""}
            onChange={handleOrderIdChange}
            className="w-[150px]"
          />
        </div>
      </div>
    </div>
  );
}
