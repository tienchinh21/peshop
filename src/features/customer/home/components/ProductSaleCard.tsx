"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
interface ProductSaleCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  priceDiscount: number;
  percentDecrease: number;
  quantity: number;
  usedQuantity: number;
  reviewCount: number;
  reviewPoint: number;
  slug: string;
  shopName: string;
}
export default function ProductSaleCard({
  id,
  name,
  image,
  price,
  priceDiscount,
  percentDecrease,
  quantity,
  usedQuantity,
  reviewCount,
  reviewPoint,
  slug,
  shopName
}: ProductSaleCardProps) {
  const soldPercentage = quantity > 0 ? Math.round(usedQuantity / quantity * 100) : 0;
  const remainingQuantity = quantity - usedQuantity;
  const isSoldOut = usedQuantity >= quantity;
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(value);
  };
  return <Link href={`/san-pham/${slug}`} className="block h-full">
      <div className={`relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-300 h-full flex flex-col ${isSoldOut ? "opacity-75" : ""}`}>
        {}
        <div className="relative aspect-square overflow-hidden">
          <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />

          {}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full text-white bg-red-500">
              -{percentDecrease}%
            </span>
          </div>

          {}
          {isSoldOut && <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                Hết hàng
              </span>
            </div>}
        </div>

        {}
        <div className="p-3 flex-1 flex flex-col">
          {}
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight h-10 flex items-start">
            {name}
          </h3>

          {}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(priceDiscount)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(price)}
            </span>
          </div>

          {}
          <div className="flex items-center gap-2 mb-2 h-5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-xs text-gray-600 truncate">{shopName}</span>
          </div>

          {}
          <div className="flex items-center gap-1 mb-3 h-5">
            <div className="flex">
              {[...Array(5)].map((_, i) => <svg key={i} className={`w-3 h-3 ${i < Math.round(reviewPoint) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>)}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>

          {}
          <div className="mb-3 mt-auto">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">
                Đã bán: {usedQuantity}
              </span>
              <span className="text-xs text-gray-600">{soldPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{
              width: `${soldPercentage}%`
            }}></div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                Còn lại: {remainingQuantity}
              </span>
              <span className="text-xs text-gray-500">Tổng: {quantity}</span>
            </div>
          </div>

          {}
          {!isSoldOut && <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="default" size="default" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm h-10" onClick={e => e.preventDefault()}>
                Thêm vào giỏ
              </Button>
              <Button variant="outline" size="default" className="flex-1 text-purple-600 border-purple-600 hover:bg-purple-50 text-sm h-10" onClick={e => e.preventDefault()}>
                Xem nhanh
              </Button>
            </div>}
        </div>
      </div>
    </Link>;
}