"use client";

import { useState, useMemo } from "react";
import CategorySidebar from "./CategorySidebar";
import LaptopBanner from "./LaptopBanner";
import SpringRevivalBanner from "./SpringRevivalBanner";
import TrailRunningBanner from "./TrailRunningBanner";
import VacuumBanner from "./VacuumBanner";
import FlashSale from "./FlashSale";
import ProductList from "@/shared/components/layout/ProductList";
import { QuickViewModal } from "@/components/dynamic";
import LoadingOverlay from "@/shared/components/layout/LoadingOverlay";
import { ProductSkeleton } from "@/shared/components/skeleton";
import { useInfiniteProducts, filterValidProducts, type Product } from "@/features/customer/products";
import { useQuickViewModal } from "@/shared/hooks";
import "./home.css";
import SectionContainer from "@/shared/components/layout/SectionContainer";
import PageSection from "@/shared/components/layout/PageSection";
import { toast } from "sonner";
interface HomePageClientProps {
  initialProducts?: Product[];
}
export default function HomePageClient({
  initialProducts = []
}: HomePageClientProps) {
  const {
    selectedProduct,
    isModalOpen,
    isModalLoading,
    handleQuickView,
    handleCloseModal,
    handleModalDataLoaded
  } = useQuickViewModal();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteProducts({
    pageSize: 20
  });
  const products = useMemo(() => {
    if (data?.pages && data.pages.length > 0) {
      //@ts-ignore
      const rawProducts = data.pages.flatMap(page => page.data.data) ?? [];
      return filterValidProducts(rawProducts);
    }
    return filterValidProducts(initialProducts);
  }, [data, initialProducts]);
  return <SectionContainer>
      <div className="min-h-screen">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-auto">
            <CategorySidebar />
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full md:w-[65%]">
                <LaptopBanner />
              </div>
              <div className="w-full md:w-[35%]">
                <SpringRevivalBanner />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <TrailRunningBanner />
              <VacuumBanner />
            </div>
          </div>
        </div>

        <FlashSale />

        <div className="mt-12">
          <PageSection title="Gợi ý hôm nay" description="Khám phá sản phẩm chất lượng hàng đầu tại PeShop" />

          {isLoading && <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(20)].map((_, index) => <ProductSkeleton key={index} />)}
            </div>}

          {isError && <div className="text-center py-12">
              <p className="text-red-500">Có lỗi xảy ra khi tải sản phẩm</p>
            </div>}

          {!isLoading && !isError && <ProductList products={products} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} onLoadMore={() => fetchNextPage()} onQuickView={handleQuickView} showViewAllButton={true} />}
        </div>
      </div>

      <LoadingOverlay isVisible={isModalLoading} message="Đang tải sản phẩm..." subMessage="Vui lòng chờ trong giây lát" />

      <QuickViewModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} onDataLoaded={handleModalDataLoaded} />
    </SectionContainer>;
}