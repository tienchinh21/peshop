"use client";

import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useWishlist, useRemoveFromWishlist } from "../hooks";
import type { WishlistProduct } from "../types";
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(price);
};
const WishlistItem = ({
  item,
  onRemove,
  isRemoving
}: {
  item: WishlistProduct;
  onRemove: (productId: string) => void;
  isRemoving: boolean;
}) => {
  return <Card className="overflow-hidden">
      <Link href={`/san-pham/${item.slug}`}>
        <div className="relative aspect-square">
          <Image src={item.image || "/placeholder-product.svg"} alt={item.name} fill className="object-cover" />
          {item.discount && item.discount > 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{item.discount}%
            </span>}
          {!item.inStock && <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">Hết hàng</span>
            </div>}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/san-pham/${item.slug}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary">
            {item.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mt-1">{item.shopName}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-primary font-semibold">
            {formatPrice(item.price)}
          </span>
          {item.originalPrice && item.originalPrice > item.price && <span className="text-gray-400 text-sm line-through">
              {formatPrice(item.originalPrice)}
            </span>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" disabled={!item.inStock}>
          <ShoppingCart className="h-4 w-4 mr-1" />
          Thêm vào giỏ
        </Button>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onRemove(item.productId)} disabled={isRemoving}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>;
};
const WishlistSkeleton = () => {
  return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({
      length: 10
    }).map((_, i) => <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square" />
          <CardContent className="p-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-1/2 mb-2" />
            <Skeleton className="h-5 w-2/3" />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>)}
    </div>;
};
const EmptyWishlist = () => {
  return <div className="flex flex-col items-center justify-center py-16">
      <Heart className="h-16 w-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Danh sách yêu thích trống
      </h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy khám phá và thêm
        những sản phẩm bạn yêu thích!
      </p>
      <Link href="/san-pham">
        <Button>Khám phá sản phẩm</Button>
      </Link>
    </div>;
};
export const WishlistPage = () => {
  const {
    data,
    isLoading,
    error
  } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const handleRemove = (productId: string) => {
    removeFromWishlist.mutate({
      productId
    });
  };
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Sản phẩm yêu thích</h1>
        <WishlistSkeleton />
      </div>;
  }
  if (error) {
    return <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Sản phẩm yêu thích</h1>
        <div className="text-center py-16">
          <p className="text-red-500">
            Đã xảy ra lỗi khi tải danh sách yêu thích
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>;
  }
  const items = data?.items || [];
  return <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sản phẩm yêu thích</h1>
        {items.length > 0 && <span className="text-gray-500">{data?.total} sản phẩm</span>}
      </div>

      {items.length === 0 ? <EmptyWishlist /> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map(item => <WishlistItem key={item.id} item={item} onRemove={handleRemove} isRemoving={removeFromWishlist.isPending} />)}
        </div>}
    </div>;
};