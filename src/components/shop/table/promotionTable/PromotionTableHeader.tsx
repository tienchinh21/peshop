import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PromotionTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[300px]">Tên chương trình</TableHead>
        <TableHead className="w-[120px]">Trạng thái</TableHead>
        <TableHead className="w-[150px]">Thời gian bắt đầu</TableHead>
        <TableHead className="w-[150px]">Thời gian kết thúc</TableHead>
        <TableHead className="w-[120px]">Giới hạn sử dụng</TableHead>
        <TableHead className="w-[100px] text-right">Thao tác</TableHead>
      </TableRow>
    </TableHeader>
  );
}

