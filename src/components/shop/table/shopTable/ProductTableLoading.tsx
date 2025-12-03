"use client";

import React from "react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ProductTableLoadingProps {
  rows?: number;
}

/**
 * Loading skeleton component for product table
 * Displays skeleton rows while data is loading
 */
export function ProductTableLoading({ rows = 5 }: ProductTableLoadingProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          {/* Product Image & Name */}
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
          </TableCell>

          {/* Category */}
          <TableCell>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </TableCell>

          {/* Price */}
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>

          {/* Status */}
          <TableCell>
            <Skeleton className="h-6 w-[80px] rounded-full" />
          </TableCell>

          {/* Sold Count */}
          <TableCell>
            <Skeleton className="h-4 w-[40px]" />
          </TableCell>

          {/* Rating */}
          <TableCell>
            <Skeleton className="h-4 w-[60px]" />
          </TableCell>

          {/* Actions */}
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

