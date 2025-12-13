"use client";

import React from "react";
import { Table, TableBody } from "@/shared/components/ui/table";
import { OrderTableHeader } from "./OrderTableHeader";
import { OrderTableEmpty } from "./OrderTableEmpty";
import { OrderTableLoading } from "./OrderTableLoading";
import { OrderTablePagination } from "./OrderTablePagination";
import { OrderTableRow } from "./OrderTableRow";
import { Order, PageInfo } from "../../types";
interface OrderTableProps {
  orders: Order[];
  pagination?: PageInfo;
  isLoading?: boolean;
  onView?: (order: Order) => void;
  onConfirm?: (order: Order) => void;
  onReject?: (order: Order) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}
export function OrderTable({
  orders,
  pagination,
  isLoading = false,
  onView,
  onConfirm,
  onReject,
  onPageChange,
  onPageSizeChange
}: OrderTableProps) {
  return <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <OrderTableHeader />
          <TableBody>
            {isLoading ? <OrderTableLoading rows={pagination?.size || 5} /> : orders.length === 0 ? <OrderTableEmpty /> : orders.map(order => <OrderTableRow key={order.id} order={order} onView={onView} onConfirm={onConfirm} onReject={onReject} />)}
          </TableBody>
        </Table>
      </div>

      {pagination && !isLoading && orders.length > 0 && onPageChange && onPageSizeChange && <OrderTablePagination pagination={pagination} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />}
    </div>;
}