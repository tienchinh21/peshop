"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { PromotionListFilters } from "@/types/shops/promotion.type";

interface PromotionListFilterProps {
  filters: PromotionListFilters;
  onFiltersChange: (filters: PromotionListFilters) => void;
  onReset: () => void;
}

export function PromotionListFilter({
  filters,
  onFiltersChange,
  onReset,
}: PromotionListFilterProps) {
  const [searchInput, setSearchInput] = React.useState(filters.search || "");

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    const status = value === "all" ? undefined : Number(value);
    onFiltersChange({ ...filters, status, page: 1 });
  };

  const handleReset = () => {
    setSearchInput("");
    onReset();
  };

  const hasActiveFilters = filters.search || filters.status !== undefined;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên chương trình..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={
            filters.status === undefined ? "all" : filters.status.toString()
          }
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="1">Hoạt động</SelectItem>
            <SelectItem value="0">Tạm dừng</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" variant="default">
          <Search className="h-4 w-4 mr-2" />
          Tìm kiếm
        </Button>

        {hasActiveFilters && (
          <Button type="button" variant="outline" onClick={handleReset}>
            <X className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}
      </form>
    </div>
  );
}

