"use client";

import { TableCell, TableRow } from "@/shared/components/ui/table";
import { MessageSquareOff } from "lucide-react";

/**
 * ReviewTableEmpty component displays an empty state when no reviews exist
 * Requirements: 1.3
 */
export function ReviewTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
          <MessageSquareOff className="h-8 w-8" />
          <p>Chưa có đánh giá nào</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
