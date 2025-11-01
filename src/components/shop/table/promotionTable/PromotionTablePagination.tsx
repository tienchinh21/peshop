"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PromotionListPaginationInfo } from "@/types/shops/promotion.type";

interface PromotionTablePaginationProps {
  pagination: PromotionListPaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PromotionTablePagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: PromotionTablePaginationProps) {
  const page = pagination.page + 1;
  const { size, pages, total } = pagination;

  const startItem = (page - 1) * size + 1;
  const endItem = Math.min(page * size, total);

  const canGoPrevious = page > 1;
  const canGoNext = page < pages;

  const handlePageChange = (newPage: number) => {
    // Convert back to 0-based for the callback
    onPageChange(newPage - 1);
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700">
          Hiển thị <span className="font-medium">{startItem}</span> đến{" "}
          <span className="font-medium">{endItem}</span> trong tổng số{" "}
          <span className="font-medium">{total}</span> chương trình
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Hiển thị:</span>
          <Select
            value={size.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-700">
          Trang <span className="font-medium">{page}</span> /{" "}
          <span className="font-medium">{pages}</span>
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={!canGoPrevious}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Trang trước</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={!canGoNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Trang sau</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
