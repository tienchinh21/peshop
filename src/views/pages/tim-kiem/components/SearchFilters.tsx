"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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

// Mock data for categories - Replace with real API data later
const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Điện thoại & Phụ kiện" },
  { id: "cat-2", name: "Laptop & Máy tính" },
  { id: "cat-3", name: "Thời trang nam" },
  { id: "cat-4", name: "Thời trang nữ" },
  { id: "cat-5", name: "Sách & Văn phòng phẩm" },
  { id: "cat-6", name: "Đồ gia dụng" },
  { id: "cat-7", name: "Mỹ phẩm & Làm đẹp" },
  { id: "cat-8", name: "Thể thao & Du lịch" },
];

const MOCK_CHILD_CATEGORIES = [
  { id: "child-1", parentId: "cat-1", name: "iPhone" },
  { id: "child-2", parentId: "cat-1", name: "Samsung" },
  { id: "child-3", parentId: "cat-1", name: "Xiaomi" },
  { id: "child-4", parentId: "cat-2", name: "Laptop Gaming" },
  { id: "child-5", parentId: "cat-2", name: "Laptop Văn phòng" },
];

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

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      categoryId: categoryId === filters.categoryId ? undefined : categoryId,
      categoryChildId: undefined, // Reset child category when parent changes
    });
  };

  // Handle child category selection
  const handleChildCategoryChange = (childId: string) => {
    onFilterChange({
      ...filters,
      categoryChildId:
        childId === filters.categoryChildId ? undefined : childId,
    });
  };

  // Handle review point selection
  const handleReviewPointChange = (point: number) => {
    onFilterChange({
      ...filters,
      reviewPoint: point === filters.reviewPoint ? undefined : point,
    });
  };

  // Handle price filter apply
  const handleApplyPriceFilter = () => {
    const minPrice = localMinPrice ? parseFloat(localMinPrice) : undefined;
    const maxPrice = localMaxPrice ? parseFloat(localMaxPrice) : undefined;

    onFilterChange({
      ...filters,
      minPrice,
      maxPrice,
    });
  };

  // Handle clear price filter
  const handleClearPriceFilter = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onFilterChange({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.categoryId ||
    filters.categoryChildId ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.reviewPoint;

  // Get child categories for selected parent
  const childCategories = filters.categoryId
    ? MOCK_CHILD_CATEGORIES.filter(
        (child) => child.parentId === filters.categoryId
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Clear All Filters */}
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

      {/* Category Filter */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Danh mục</Label>
        <div className="space-y-2">
          {MOCK_CATEGORIES.map((category) => (
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
      </div>

      {/* Child Category Filter */}
      {childCategories.length > 0 && (
        <div>
          <Label className="text-sm font-semibold mb-3 block">
            Danh mục con
          </Label>
          <div className="space-y-2">
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
        </div>
      )}

      {/* Price Range Filter */}
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

      {/* Review Point Filter */}
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
