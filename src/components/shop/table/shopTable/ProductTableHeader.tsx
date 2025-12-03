"use client";

import React from "react";
import { TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

/**
 * Product table header component
 * Defines column headers for the product table
 */
export function ProductTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[300px]">Sản phẩm</TableHead>
        <TableHead className="w-[200px]">Danh mục</TableHead>
        <TableHead className="w-[150px]">Giá</TableHead>
        <TableHead className="w-[120px]">Trạng thái</TableHead>
        <TableHead className="w-[100px]">Đã bán</TableHead>
        <TableHead className="w-[100px]">Đánh giá</TableHead>
        <TableHead className="w-[80px] text-right">Thao tác</TableHead>
      </TableRow>
    </TableHeader>
  );
}

