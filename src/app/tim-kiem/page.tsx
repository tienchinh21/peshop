import { Metadata } from "next";
import { Suspense } from "react";
import { SearchResultsPage } from "@/features/customer/search";

export const metadata: Metadata = {
  title: "Tìm kiếm sản phẩm | PeShop",
  description:
    "Tìm kiếm sản phẩm trên PeShop - Nền tảng thương mại điện tử hàng đầu Việt Nam",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Đang tải...
        </div>
      }
    >
      <SearchResultsPage />
    </Suspense>
  );
}
