"use client";

import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { PromotionTableHeader } from "./PromotionTableHeader";
import { PromotionTableEmpty } from "./PromotionTableEmpty";
import { PromotionTableLoading } from "./PromotionTableLoading";
import { PromotionTablePagination } from "./PromotionTablePagination";
import { PromotionTableRow } from "./PromotionTableRow";
import type {
  Promotion,
  PromotionListPaginationInfo,
} from "@/types/shops/promotion.type";

interface PromotionTableProps {
  promotions: Promotion[];
  pagination?: PromotionListPaginationInfo;
  isLoading?: boolean;
  onView?: (promotion: Promotion) => void;
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (promotion: Promotion) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function PromotionTable({
  promotions,
  pagination,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}: PromotionTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <PromotionTableHeader />
          <TableBody>
            {isLoading ? (
              <PromotionTableLoading rows={pagination?.size || 5} />
            ) : promotions.length === 0 ? (
              <PromotionTableEmpty />
            ) : (
              promotions.map((promotion) => (
                <PromotionTableRow
                  key={promotion.id}
                  promotion={promotion}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination &&
        !isLoading &&
        promotions.length > 0 &&
        onPageChange &&
        onPageSizeChange && (
          <PromotionTablePagination
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
    </div>
  );
}

