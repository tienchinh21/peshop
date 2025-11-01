"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import {
  ProductStatus,
  ProductStatusLabels,
  ProductSortField,
  SortOrder,
} from "@/lib/utils/enums/eProducts";
import type { ProductListFilters } from "@/types/shops/product-list.type";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api/shops/category.service";
import _ from "lodash";

interface ProductListFilterProps {
  filters: ProductListFilters;
  onFiltersChange: (filters: ProductListFilters) => void;
  onReset: () => void;
}

/**
 * Product list filter component
 * Provides search, category filter, status filter, and sorting
 */
export function ProductListFilter({
  filters,
  onFiltersChange,
  onReset,
}: ProductListFilterProps) {
  const [searchInput, setSearchInput] = useState(_.get(filters, "search", ""));

  // Fetch categories for filter
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const categories = _.get(categoriesData, "content", []);

  // Debounced search using lodash
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!_.isEqual(searchInput, _.get(filters, "search"))) {
        onFiltersChange(
          _.assign({}, filters, { search: searchInput, page: 1 })
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange(
      _.assign({}, filters, {
        categoryId: categoryId === "all" ? undefined : categoryId,
        page: 1,
      })
    );
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange(
      _.assign({}, filters, {
        status: status === "all" ? undefined : _.toNumber(status),
        page: 1,
      })
    );
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange(
      _.assign({}, filters, {
        sortBy: sortBy === "none" ? undefined : (sortBy as any),
        page: 1,
      })
    );
  };

  const handleSortOrderChange = (sortOrder: string) => {
    onFiltersChange(
      _.assign({}, filters, {
        sortOrder: sortOrder as "asc" | "desc",
        page: 1,
      })
    );
  };

  const handleReset = () => {
    setSearchInput("");
    onReset();
  };

  const hasActiveFilters = _.some([
    _.get(filters, "search"),
    _.get(filters, "categoryId"),
    !_.isUndefined(_.get(filters, "status")),
    _.get(filters, "sortBy"),
  ]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={searchInput}
            onChange={(e) => setSearchInput(_.get(e, "target.value", ""))}
            className="pl-10"
          />
          {!_.isEmpty(searchInput) && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Lọc:</span>
        </div>

        {/* Category Filter */}
        <Select
          value={_.get(filters, "categoryId", "all")}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {_.map(categories, (category: any) => (
              <SelectItem
                key={_.get(category, "id")}
                value={_.get(category, "id")}
              >
                {_.get(category, "name")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={
            !_.isUndefined(_.get(filters, "status"))
              ? _.toString(_.get(filters, "status"))
              : "all"
          }
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value={ProductStatus.ACTIVE.toString()}>
              {ProductStatusLabels[ProductStatus.ACTIVE]}
            </SelectItem>
            <SelectItem value={ProductStatus.HIDDEN.toString()}>
              {ProductStatusLabels[ProductStatus.HIDDEN]}
            </SelectItem>
            <SelectItem value={ProductStatus.LOCKED.toString()}>
              {ProductStatusLabels[ProductStatus.LOCKED]}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select
          value={_.get(filters, "sortBy", "none")}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Không sắp xếp</SelectItem>
            <SelectItem value={ProductSortField.NAME}>Tên</SelectItem>
            <SelectItem value={ProductSortField.PRICE}>Giá</SelectItem>
            <SelectItem value={ProductSortField.BOUGHT_COUNT}>
              Đã bán
            </SelectItem>
            <SelectItem value={ProductSortField.CREATED_AT}>
              Ngày tạo
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        {!_.isNil(_.get(filters, "sortBy")) && (
          <Select
            value={_.get(filters, "sortOrder", SortOrder.ASC)}
            onValueChange={handleSortOrderChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortOrder.ASC}>Tăng dần</SelectItem>
              <SelectItem value={SortOrder.DESC}>Giảm dần</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="ml-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
