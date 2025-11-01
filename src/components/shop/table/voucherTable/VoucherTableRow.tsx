import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import type { ShopVoucher } from "@/types/shops/voucher.type";
import {
  VoucherStatus,
  VoucherStatusLabels,
  VoucherStatusColors,
  VoucherType,
  VoucherTypeLabels,
} from "@/lib/utils/enums/eVouchers";
import _ from "lodash";

interface VoucherTableRowProps {
  voucher: ShopVoucher;
  onView?: (voucher: ShopVoucher) => void;
  onEdit?: (voucher: ShopVoucher) => void;
  onDelete?: (voucher: ShopVoucher) => void;
}

export function VoucherTableRow({
  voucher,
  onView,
  onEdit,
  onDelete,
}: VoucherTableRowProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: number) => {
    const statusEnum = status as VoucherStatus;
    const label = VoucherStatusLabels[statusEnum] || "Không xác định";
    const colorClass = VoucherStatusColors[statusEnum] || "bg-gray-500";

    return (
      <Badge variant="secondary" className={colorClass}>
        {label}
      </Badge>
    );
  };

  const getTypeBadge = (type: number) => {
    const typeEnum = type as VoucherType;
    const label = VoucherTypeLabels[typeEnum] || "Không xác định";

    return (
      <Badge variant="outline" className="font-normal">
        {label}
      </Badge>
    );
  };

  const getDiscountDisplay = (type: number, value: number) => {
    if (type === VoucherType.PERCENTAGE) {
      return `${value}%`;
    }
    return formatPrice(value);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{voucher.name}</div>
      </TableCell>
      <TableCell>
        <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono">
          {voucher.code}
        </code>
      </TableCell>
      <TableCell>{getTypeBadge(voucher.type)}</TableCell>
      <TableCell className="font-semibold">
        {getDiscountDisplay(voucher.type, voucher.discountValue)}
      </TableCell>
      <TableCell>{formatPrice(voucher.minimumOrderValue)}</TableCell>
      <TableCell>
        <div className="text-center">
          <span className="font-medium">{voucher.quantity}</span>
          {!_.isNil(voucher.usedCount) && (
            <span className="text-xs text-gray-500 ml-1">
              (Đã dùng: {voucher.usedCount})
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(voucher.status)}</TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="text-gray-600">
            Từ: {formatDate(voucher.startTime)}
          </div>
          <div className="text-gray-600">
            Đến: {formatDate(voucher.endTime)}
          </div>
        </div>
      </TableCell>
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
              <DropdownMenuItem onClick={() => onView(voucher)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(voucher)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(voucher)}
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
