import { Metadata } from "next";
import { Suspense } from "react";
import { FlashSalePage } from "@/features/shop/flash-sale";
export const metadata: Metadata = {
  title: "Flash Sale - Quản lý Shop | PeShop",
  description: "Quản lý các chương trình Flash Sale của shop",
  keywords: ["flash sale", "khuyến mãi", "quản lý shop", "PeShop"]
};
export default function ShopFlashSalePage() {
  return <Suspense fallback={<div className="space-y-6">
          <div className="h-16 animate-pulse bg-gray-100 rounded" />
          <div className="h-12 animate-pulse bg-gray-100 rounded max-w-md" />
          <div className="h-24 animate-pulse bg-gray-100 rounded" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({
        length: 6
      }).map((_, index) => <div key={index} className="h-40 animate-pulse bg-gray-100 rounded" />)}
          </div>
        </div>}>
      <FlashSalePage />
    </Suspense>;
}