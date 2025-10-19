"use client";

import { useState } from "react";
import CategorySidebar from "./components/CategorySidebar";
import LaptopBanner from "./components/LaptopBanner";
import SpringRevivalBanner from "./components/SpringRevivalBanner";
import TrailRunningBanner from "./components/TrailRunningBanner";
import VacuumBanner from "./components/VacuumBanner";
import FlashSale from "./components/FlashSale";
import ProductList from "@/components/common/ProductList";
import QuickViewModal from "@/components/common/QuickViewModal";
import { ProductSkeleton } from "@/components/skeleton";
import { useInfiniteProducts } from "@/hooks/user/useProducts";
import type { Product } from "@/types/users/product.types";
import "./components/home.css";
import SectionContainer from "@/components/common/SectionContainer";
import PageSection from "@/components/common/PageSection";
import { toast } from "sonner";

export default function HomePageClient() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProducts({ pageSize: 20 });

  const products = data?.pages.flatMap((page) => page.data.products) ?? [];

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    // Delay clearing product to allow modal close animation
    setTimeout(() => setQuickViewProduct(null), 300);
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
    console.log("Add to cart:", product);
  };

  return (
    <SectionContainer>
      <div className="min-h-screen">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar */}
          <div className="w-full lg:w-auto">
            <CategorySidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Row - Large Banners */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full md:w-[65%]">
                <LaptopBanner />
              </div>
              <div className="w-full md:w-[35%]">
                <SpringRevivalBanner />
              </div>
            </div>

            {/* Bottom Row - Smaller Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <TrailRunningBanner />
              <VacuumBanner />
            </div>
          </div>
        </div>

        {/* Flash Sale */}
        <FlashSale />

        {/* All Products Section */}
        <div className="mt-12">
          <PageSection
            title="Gợi ý hôm nay"
            description="Khám phá sản phẩm chất lượng hàng đầu tại PeShop"
          />

          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(20)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <p className="text-red-500">Có lỗi xảy ra khi tải sản phẩm</p>
            </div>
          )}

          {!isLoading && !isError && (
            <ProductList
              products={products}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={() => fetchNextPage()}
              onQuickView={handleQuickView}
              onAddToCart={handleAddToCart}
              showViewAllButton={true}
            />
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        onAddToCart={handleAddToCart}
      />
    </SectionContainer>
  );
}
