"use client";

import Link from "next/link";
import { Store, MessageCircle, UserPlus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductDetail } from "@/types/users/product.types";

interface ShopInfoCardProps {
  product: ProductDetail;
}

export const ShopInfoCard = ({ product }: ShopInfoCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Shop Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{product.shopName}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                <span>4.8</span>
                <span className="text-gray-400">•</span>
                <span>Online 2 giờ trước</span>
              </div>
            </div>
          </div>

          {/* Shop Stats */}
          <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {product.reviewCount}
              </div>
              <div className="text-xs text-gray-600">Đánh giá</div>
            </div>
            <div className="text-center border-x">
              <div className="text-lg font-semibold text-gray-900">
                {product.reviewPoint.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Điểm</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {product.boughtCount}
              </div>
              <div className="text-xs text-gray-600">Sản phẩm</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              asChild
            >
              <Link href={`/shop/${product.shopId}`}>
                <Store className="mr-2 h-4 w-4" />
                Xem shop
              </Link>
            </Button>
            <Button
              variant="outline"
              className="flex-1"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Theo dõi
            </Button>
          </div>

          <Button className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat ngay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

