import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import type { Promotion } from "@/types/shops/promotion.type";
import {
  PromotionStatus,
  PromotionStatusLabels,
  PromotionStatusColors,
} from "@/types/shops/promotion.type";

interface PromotionTableRowProps {
  promotion: Promotion;
  onView?: (promotion: Promotion) => void;
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (promotion: Promotion) => void;
}

export function PromotionTableRow({
  promotion,
  onView,
  onEdit,
  onDelete,
}: PromotionTableRowProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{promotion.name}</TableCell>
      <TableCell>
        <Badge
          className={PromotionStatusColors[promotion.status as PromotionStatus]}
        >
          {PromotionStatusLabels[promotion.status as PromotionStatus]}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(promotion.startTime)}</TableCell>
      <TableCell>{formatDate(promotion.endTime)}</TableCell>
      <TableCell>{promotion.totalUsageLimit}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => onView(promotion)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(promotion)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(promotion)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
