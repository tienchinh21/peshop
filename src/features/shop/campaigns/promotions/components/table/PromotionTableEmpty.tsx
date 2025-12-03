import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Gift } from "lucide-react";

export function PromotionTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="h-64 text-center">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <Gift className="h-12 w-12 mb-4 text-gray-400" />
          <p className="text-lg font-medium">Chưa có chương trình khuyến mãi</p>
          <p className="text-sm mt-1">
            Tạo chương trình mua X tặng Y để thu hút khách hàng
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}
