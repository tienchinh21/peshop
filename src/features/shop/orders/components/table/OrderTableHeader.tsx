import { TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

export function OrderTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Mã đơn hàng</TableHead>
        <TableHead>Sản phẩm</TableHead>
        <TableHead>Tổng tiền</TableHead>
        <TableHead>Ngày tạo</TableHead>
        <TableHead>Trạng thái</TableHead>
        <TableHead className="text-right">Thao tác</TableHead>
      </TableRow>
    </TableHeader>
  );
}
