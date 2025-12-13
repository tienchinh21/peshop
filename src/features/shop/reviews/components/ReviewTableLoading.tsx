"use client";

import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ReviewTableLoadingProps {
  rows?: number;
}

/**
 * ReviewTableLoading component displays skeleton rows during loading
 * Accepts configurable row count
 * Requirements: 1.4
 */
export function ReviewTableLoading({ rows = 5 }: ReviewTableLoadingProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {/* Rating skeleton */}
          <TableCell>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-4" />
              ))}
            </div>
          </TableCell>

          {/* Customer info skeleton */}
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </TableCell>

          {/* Content skeleton */}
          <TableCell>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </TableCell>

          {/* Variant skeleton */}
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </TableCell>

          {/* Date skeleton */}
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
