"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { X, Star, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  useUserCategories,
  useUserCategoryChildren,
} from "@/features/customer/categories";

interface SearchFiltersProps {
  filters: {
    categoryId?: string;
    categoryChildId?: string;
    minPrice?: number;
    maxPrice?: number;
    reviewPoint?: number;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

const REVIEW_POINTS = [
  { value: 5, label: "5 sao" },
  { value: 4, label: "Từ 4 sao" },
  { value: 3, label: "Từ 3 sao" },
];

export default function SearchFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: SearchFiltersProps) {
  const [localMinPrice, setLocalMinPrice] = useState(
    filters.minPrice?.toString() || ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    filters.maxPrice?.toString() || ""
  );

  const { data: categories = [], isLoading: isLoadingCategories } =
    useUserCategories();

  const { data: childCategories = [], isLoading: isLoadingChildren } =
    useUserCategoryChildren(filters.categoryId || null);

  useEffect(() => {
    setLocalMinPrice(filters.minPrice?.toString() || "");
    setLocalMaxPrice(filters.maxPrice?.toString() || "");
  }, [filters.minPrice, filters.maxPrice]);

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      categoryId: categoryId === filters.categoryId ? undefined : categoryId,
      categoryChildId: undefined,
    });
  };

  const handleChildCategoryChange = (childId: string) => {
    onFilterChange({
      ...filters,
      categoryChildId:
        childId === filters.categoryChildId ? undefined : childId,
    });
  };

  const handleReviewPointChange = (point: number) => {
    onFilterChange({
      ...filters,
      reviewPoint: point === filters.reviewPoint ? undefined : point,
    });
  };

  const handleApplyPriceFilter = () => {
    const minPrice = localMinPrice ? parseFloat(localMinPrice) : undefined;
    const maxPrice = localMaxPrice ? parseFloat(localMaxPrice) : undefined;

    onFilterChange({
      ...filters,
      minPrice,
      maxPrice,
    });
  };

  const handleClearPriceFilter = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onFilterChange({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const hasActiveFilters =
    filters.categoryId ||
    filters.categoryChildId ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.reviewPoint;

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full text-red-600 border-red-300 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-2" />
          Xóa tất cả bộ lọc
        </Button>
      )}

      <div>
        <Label className="text-sm font-semibold mb-3 block">Danh mục</Label>
        {isLoadingCategories ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filters.categoryId === category.id
                    ? "bg-primary text-white font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-2">Không có danh mục</p>
        )}
      </div>

      {filters.categoryId && (
        <div>
          <Label className="text-sm font-semibold mb-3 block">
            Danh mục con
          </Label>
          {isLoadingChildren ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : childCategories.length > 0 ? (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {childCategories.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleChildCategoryChange(child.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filters.categoryChildId === child.id
                      ? "bg-primary text-white font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-2">Không có danh mục con</p>
          )}
        </div>
      )}

      <div>
        <Label className="text-sm font-semibold mb-3 block">Khoảng giá</Label>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600 mb-1 block">
              Giá tối thiểu
            </Label>
            <Input
              type="number"
              placeholder="0"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600 mb-1 block">
              Giá tối đa
            </Label>
            <Input
              type="number"
              placeholder="10000000"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleApplyPriceFilter}
              className="flex-1"
            >
              Áp dụng
            </Button>
            {(filters.minPrice || filters.maxPrice) && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearPriceFilter}
              >
                Xóa
              </Button>
            )}
          </div>
          {(filters.minPrice || filters.maxPrice) && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              {filters.minPrice && formatCurrency(filters.minPrice)} -{" "}
              {filters.maxPrice && formatCurrency(filters.maxPrice)}
            </div>
          )}
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-3 block">Đánh giá</Label>
        <div className="space-y-2">
          {REVIEW_POINTS.map((point) => (
            <button
              key={point.value}
              onClick={() => handleReviewPointChange(point.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                filters.reviewPoint === point.value
                  ? "bg-primary text-white font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < point.value
                        ? filters.reviewPoint === point.value
                          ? "fill-white text-white"
                          : "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span>{point.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
