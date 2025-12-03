import { Table, TableBody } from "@/shared/components/ui/table";
import { VoucherTableHeader } from "./VoucherTableHeader";
import { VoucherTableRow } from "./VoucherTableRow";
import { VoucherTableLoading } from "./VoucherTableLoading";
import { VoucherTableEmpty } from "./VoucherTableEmpty";
import { VoucherTablePagination } from "./VoucherTablePagination";
import type { ShopVoucher, VoucherListPaginationInfo } from "../../types";

interface VoucherTableProps {
  vouchers: ShopVoucher[];
  pagination?: VoucherListPaginationInfo;
  isLoading?: boolean;
  onView?: (voucher: ShopVoucher) => void;
  onEdit?: (voucher: ShopVoucher) => void;
  onDelete?: (voucher: ShopVoucher) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function VoucherTable({
  vouchers,
  pagination,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}: VoucherTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <VoucherTableHeader />
          <TableBody>
            {isLoading ? (
              <VoucherTableLoading />
            ) : vouchers.length === 0 ? (
              <VoucherTableEmpty />
            ) : (
              vouchers.map((voucher) => (
                <VoucherTableRow
                  key={voucher.id}
                  voucher={voucher}
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
        vouchers.length > 0 &&
        onPageChange &&
        onPageSizeChange && (
          <VoucherTablePagination
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
    </div>
  );
}
