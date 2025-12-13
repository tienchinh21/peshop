"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { PageInfo } from "../types/review.types";

interface ReviewsPaginationProps {
  pagination: PageInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

/**
 * ReviewsPagination component displays pagination controls
 * - Page numbers and navigation controls
 * - Page size selection
 * Requirements: 5.1, 5.2
 */
export function ReviewsPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: ReviewsPaginationProps) {
  const { page, size, pages, total } = pagination;

  // Don't render if there's no data or only one page
  if (total === 0) {
    return null;
  }

  const handlePageSizeChange = (value: string) => {
    onPageSizeChange(parseInt(value, 10));
  };

  // Generate page numbers to display
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pageNumbers: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (pages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (page > 3) {
        pageNumbers.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(pages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (page < pages - 2) {
        pageNumbers.push("ellipsis");
      }

      // Always show last page
      if (pages > 1) {
        pageNumbers.push(pages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Calculate display range
  const startItem = (page - 1) * size + 1;
  const endItem = Math.min(page * size, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Page info and size selector */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          Hiển thị {startItem}-{endItem} trong {total} đánh giá
        </span>
        <div className="flex items-center gap-2">
          <span>Số dòng:</span>
          <Select value={size.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination controls */}
      {pages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
                className={
                  page <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Page numbers */}
            {pageNumbers.map((pageNum, index) =>
              pageNum === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={pageNum === page}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(pageNum);
                    }}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < pages) onPageChange(page + 1);
                }}
                className={
                  page >= pages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
