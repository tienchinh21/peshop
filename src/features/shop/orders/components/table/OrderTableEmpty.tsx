import { TableCell, TableRow } from "@/shared/components/ui/table";
import { PackageX } from "lucide-react";

export function OrderTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
          <PackageX className="h-8 w-8" />
          <p>Không có đơn hàng nào</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
