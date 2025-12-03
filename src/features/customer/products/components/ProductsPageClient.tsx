"use client";

import { useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuickViewModal } from "@/shared/hooks";
import PageSection from "@/shared/components/layout/PageSection";
import SectionContainer from "@/shared/components/layout/SectionContainer";
import { ProductSkeleton } from "@/shared/components/skeleton";
import { filterValidProducts } from "../utils";
import type { Product } from "../types";
import { QuickViewModal } from "@/components/dynamic";
import LoadingOverlay from "@/shared/components/layout/LoadingOverlay";
import ProductsPagination from "./ProductsPagination";
import ProductGrid from "./ProductGrid";

interface ProductsPageClientProps {
  initialProducts: Product[];
  initialPage: number;
  initialTotalPages: number;
}

export default function ProductsPageClient({
  initialProducts,
  initialPage,
  initialTotalPages,
}: ProductsPageClientProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    selectedProduct,
    isModalOpen,
    isModalLoading,
    handleQuickView,
    handleCloseModal,
    handleModalDataLoaded,
  } = useQuickViewModal();

  const products = useMemo(
    () => filterValidProducts(initialProducts),
    [initialProducts]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setIsNavigating(true);
      router.push(`/san-pham?page=${page}`, { scroll: true });
    },
    [router]
  );

  const renderSkeletons = useMemo(() => {
    return [...Array(20)].map((_, index) => <ProductSkeleton key={index} />);
  }, []);

  return (
    <>
      <PageSection
        title="Gợi ý hôm nay"
        description="Khám phá sản phẩm chất lượng hàng đầu tại PeShop"
      />

      <SectionContainer>
        <div className="py-8">
          {isNavigating && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {renderSkeletons}
            </div>
          )}

          {!isNavigating && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
            </div>
          )}

          {!isNavigating && products.length > 0 && (
            <>
              <ProductGrid products={products} onQuickView={handleQuickView} />

              <ProductsPagination
                currentPage={initialPage}
                totalPages={initialTotalPages}
                onPageChange={handlePageChange}
              />

              <div className="text-center mt-4 text-sm text-gray-600">
                Hiển thị {products.length} sản phẩm
              </div>
            </>
          )}
        </div>
      </SectionContainer>

      {isModalLoading && (
        <LoadingOverlay
          isVisible={isModalLoading}
          message="Đang tải sản phẩm..."
          subMessage="Vui lòng chờ trong giây lát"
        />
      )}

      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDataLoaded={handleModalDataLoaded}
      />
    </>
  );
}
