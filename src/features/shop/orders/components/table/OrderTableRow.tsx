import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Order } from "../../types";
import { OrderStatus, OrderStatusLabel } from "@/shared/enums";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Eye, Check, X, User, Phone } from "lucide-react";
interface OrderTableRowProps {
  order: Order;
  onView?: (order: Order) => void;
  onConfirm?: (order: Order) => void;
  onReject?: (order: Order) => void;
}
export function OrderTableRow({
  order,
  onView,
  onConfirm,
  onReject,
}: OrderTableRowProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          >
            {OrderStatusLabel[status]}
          </Badge>
        );
      case OrderStatus.CONFIRMED:
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 hover:bg-green-200"
          >
            {OrderStatusLabel[status]}
          </Badge>
        );
      case OrderStatus.REJECTED:
        return <Badge variant="destructive">{OrderStatusLabel[status]}</Badge>;
      default:
        return <Badge variant="outline">{OrderStatusLabel[status]}</Badge>;
    }
  };
  return (
    <TableRow>
      <TableCell className="font-medium">
        {order.orderCode || <span>#{order.id.slice(0, 8)}</span>}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {order.orderDetails.slice(0, 2).map((detail, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded border bg-gray-100">
                <img
                  src={detail.product.imgMain}
                  alt={detail.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-sm text-gray-600 line-clamp-1"
                  title={detail.product.name}
                >
                  {detail.product.name}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {detail.propertyValueNames.length > 0 && (
                    <span>{detail.propertyValueNames.join(", ")}</span>
                  )}
                  <span>x{detail.quantity}</span>
                </div>
              </div>
            </div>
          ))}
          {order.orderDetails.length > 2 && (
            <div className="text-xs text-gray-400 pl-10">
              +{order.orderDetails.length - 2} sản phẩm khác
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1 text-sm">
          {order.recipientName ? (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 text-gray-400" />
              <span>{order.recipientName}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-xs">Chưa có</span>
          )}
          {order.recipientPhone && (
            <div className="flex items-center gap-1 text-gray-500">
              <Phone className="h-3 w-3 text-gray-400" />
              <span>{order.recipientPhone}</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>{formatCurrency(order.revenue)}</TableCell>
      <TableCell>
        {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
      </TableCell>
      <TableCell>{getStatusBadge(order.statusOrder)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {onView && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(order)}
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {order.statusOrder === OrderStatus.PENDING && (
            <>
              {onConfirm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => onConfirm(order)}
                  title="Xác nhận"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              {onReject && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onReject(order)}
                  title="Hủy"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
