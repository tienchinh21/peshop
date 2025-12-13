import { TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
export function VoucherTableHeader() {
  return <TableHeader>
      <TableRow>
        <TableHead className="w-[250px]">Tên mã giảm giá</TableHead>
        <TableHead className="w-[150px]">Mã code</TableHead>
        <TableHead className="w-[120px]">Loại</TableHead>
        <TableHead className="w-[120px]">Giá trị</TableHead>
        {}
        <TableHead className="w-[100px]">Số lượng</TableHead>
        <TableHead className="w-[100px]">Đã dùng</TableHead>
        <TableHead className="w-[120px]">Trạng thái</TableHead>
        <TableHead className="w-[180px]">Thời gian</TableHead>
        <TableHead className="w-[100px] text-right">Thao tác</TableHead>
      </TableRow>
    </TableHeader>;
}