"use client";

import { lazy, Suspense, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuickViewModal } from "@/hooks/useQuickViewModal";
import PageSection from "@/components/common/PageSection";
import SectionContainer from "@/components/common/SectionContainer";
import { ProductSkeleton } from "@/components/skeleton";
import { filterValidProducts } from "@/lib/utils/product.utils";
import type { Product } from "@/types/users/product.types";

const QuickViewModal = lazy(() => import("@/components/common/QuickViewModal"));
const LoadingOverlay = lazy(() => import("@/components/common/LoadingOverlay"));
const ProductsPagination = lazy(() => import("./components/ProductsPagination"));
const ProductGrid = lazy(() => import("./components/ProductGrid"));

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
    return [...Array(20)].map((_, index) => (
      <ProductSkeleton key={index} />
    ));
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
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    {renderSkeletons}
                  </div>
                }
              >
                <ProductGrid products={products} onQuickView={handleQuickView} />
              </Suspense>

              <Suspense
                fallback={
                  <div className="h-16 animate-pulse bg-gray-100 rounded" />
                }
              >
                <ProductsPagination
                  currentPage={initialPage}
                  totalPages={initialTotalPages}
                  onPageChange={handlePageChange}
                />
              </Suspense>

              <div className="text-center mt-4 text-sm text-gray-600">
                Hiển thị {products.length} sản phẩm
              </div>
            </>
          )}
        </div>
      </SectionContainer>

      <Suspense fallback={null}>
        {isModalLoading && (
          <LoadingOverlay
            isVisible={isModalLoading}
            message="Đang tải sản phẩm..."
            subMessage="Vui lòng chờ trong giây lát"
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isModalOpen && (
          <QuickViewModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onDataLoaded={handleModalDataLoaded}
          />
        )}
      </Suspense>
    </>
  );
}
