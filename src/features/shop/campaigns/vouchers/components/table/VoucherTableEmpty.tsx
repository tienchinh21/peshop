import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Ticket } from "lucide-react";

export function VoucherTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={9} className="h-64 text-center">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <Ticket className="mb-4 h-12 w-12 text-gray-400" />
          <p className="text-lg font-medium">Chưa có mã giảm giá nào</p>
          <p className="text-sm">Tạo mã giảm giá đầu tiên để bắt đầu</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
