"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";

const IMPORT_STEPS = [
  {
    step: 1,
    title: "Export sản phẩm",
    description:
      "Xuất danh sách sản phẩm ra file Excel để có file mẫu đúng format",
  },
  {
    step: 2,
    title: "Chỉnh sửa file",
    description: "Chỉnh sửa Name, Price, Quantity trong file Excel",
  },
  {
    step: 3,
    title: "Giữ nguyên ID",
    description: "KHÔNG sửa Product ID, Variant ID, Phân loại hàng",
  },
  {
    step: 4,
    title: "Import file",
    description: "Import file đã chỉnh sửa để cập nhật sản phẩm",
  },
];

const COLUMN_INFO = [
  {
    name: "Product ID",
    editable: false,
    description: "UUID của sản phẩm - không được thay đổi",
  },
  {
    name: "Name",
    editable: true,
    description: "Tên sản phẩm - có thể chỉnh sửa",
  },
  {
    name: "Phân loại hàng",
    editable: false,
    description:
      "Thuộc tính variant (màu sắc, kích thước) - không được thay đổi",
  },
  {
    name: "Price",
    editable: true,
    description: "Giá variant - phải >= 0",
  },
  {
    name: "Quantity",
    editable: true,
    description: "Số lượng tồn kho - phải >= 0",
  },
  {
    name: "Variant ID",
    editable: false,
    description: "ID của variant - không được thay đổi",
  },
];

export function ImportInstructions() {
  return (
    <div className="space-y-6">
      {/* Hướng dẫn 4 bước */}
      <div>
        <h4 className="font-medium mb-3">Hướng dẫn import sản phẩm</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {IMPORT_STEPS.map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {item.step}
              </div>
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bảng giải thích columns */}
      <div>
        <h4 className="font-medium mb-3">
          Giải thích các cột trong file Excel
        </h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Tên cột</TableHead>
              <TableHead className="w-[100px]">Có thể sửa</TableHead>
              <TableHead>Mô tả</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COLUMN_INFO.map((column) => (
              <TableRow key={column.name}>
                <TableCell className="font-medium">{column.name}</TableCell>
                <TableCell>
                  {column.editable ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Có
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Không
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {column.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Lưu ý quan trọng */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lưu ý quan trọng</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
            <li>
              <strong>Price</strong> và <strong>Quantity</strong> phải là số
              nguyên {">="} 0
            </li>
            <li>Chỉ có thể cập nhật sản phẩm của shop mình</li>
            <li>
              Không thay đổi <strong>Product ID</strong>,{" "}
              <strong>Variant ID</strong> và <strong>Phân loại hàng</strong>
            </li>
            <li>Giá sản phẩm sẽ tự động cập nhật theo giá variant thấp nhất</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
