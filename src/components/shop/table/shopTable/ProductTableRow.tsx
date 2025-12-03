"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye, Copy } from "lucide-react";
import type { ShopProduct } from "@/types/shops/product-list.type";
import {
  ProductStatus,
  ProductStatusLabels,
  ProductStatusColors,
} from "@/lib/utils/enums/eProducts";

interface ProductTableRowProps {
  product: ShopProduct;
  onEdit?: (product: ShopProduct) => void;
  onDelete?: (product: ShopProduct) => void;
  onView?: (product: ShopProduct) => void;
  onDuplicate?: (product: ShopProduct) => void;
}

/**
 * Product table row component
 * Displays a single product with actions
 */
export function ProductTableRow({
  product,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
}: ProductTableRowProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: number) => {
    const statusEnum = status as ProductStatus;
    const label = ProductStatusLabels[statusEnum] || "Không xác định";
    const colorClass = ProductStatusColors[statusEnum] || "bg-gray-500";

    return (
      <Badge variant="secondary" className={colorClass}>
        {label}
      </Badge>
    );
  };

  return (
    <TableRow>
      {/* Product Image & Name */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
            <Image
              src={product.imgMain || "/placeholder-product.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex flex-col">
            <Link
              href={`/shop/san-pham/${product.id}`}
              className="font-medium text-gray-900 hover:text-purple-600 line-clamp-1"
            >
              {product.name}
            </Link>
            <span className="text-xs text-gray-500">SKU: {product.slug}</span>
          </div>
        </div>
      </TableCell>

      {/* Category */}
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-900">{product.category.name}</span>
          <span className="text-xs text-gray-500">
            {product.categoryChild.name}
          </span>
        </div>
      </TableCell>

      {/* Price */}
      <TableCell>
        <span className="font-semibold text-gray-900">
          {formatPrice(product.price)}
        </span>
      </TableCell>

      {/* Status */}
      <TableCell>{getStatusBadge(product.status)}</TableCell>

      {/* Sold Count */}
      <TableCell>
        <span className="text-gray-700">
          {product.boughtCount !== null ? product.boughtCount : "-"}
        </span>
      </TableCell>

      {/* Rating */}
      <TableCell>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="text-gray-700">
            {product.reviewPoint !== null
              ? product.reviewPoint.toFixed(1)
              : "-"}
          </span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem
                onClick={() => onView(product)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem
                onClick={() => onEdit(product)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem
                onClick={() => onDuplicate(product)}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-4 w-4" />
                Nhân bản
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(product)}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
