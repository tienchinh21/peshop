"use client";

import React from "react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Package } from "lucide-react";

interface ProductTableEmptyProps {
  colSpan?: number;
  message?: string;
}

export function ProductTableEmpty({
  colSpan = 7,
  message = "Không tìm thấy sản phẩm nào",
}: ProductTableEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-64 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-gray-100 p-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">{message}</p>
            <p className="text-sm text-gray-500">
              Thử thay đổi bộ lọc hoặc thêm sản phẩm mới
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
