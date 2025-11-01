"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/user/useProducts";
import { useQuickViewModal } from "@/hooks/useQuickViewModal";
import PageSection from "@/components/common/PageSection";
import SectionContainer from "@/components/common/SectionContainer";
import ProductCard from "@/views/pages/home/components/ProductCard";
import QuickViewModal from "@/components/common/QuickViewModal";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { ProductSkeleton } from "@/components/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Product } from "@/types/users/product.types";
import { filterValidProducts, getProductKey } from "@/lib/utils/product.utils";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 20;

  const {
    selectedProduct,
    isModalOpen,
    isModalLoading,
    handleQuickView,
    handleCloseModal,
    handleModalDataLoaded,
  } = useQuickViewModal();

  const { data, isLoading, isError } = useProducts({
    page: currentPage,
    pageSize,
  });

  //@ts-ignore
  const products = filterValidProducts(data?.data.data ?? []);
  const totalPages = data?.data.totalPages ?? 1;
  const totalCount = data?.data.totalCount ?? 0;

  const handlePageChange = (page: number) => {
    router.push(`/san-pham?page=${page}`, { scroll: true });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`/san-pham?page=${i}`}
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={`/san-pham?page=1`}
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`/san-pham?page=${i}`}
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={`/san-pham?page=${totalPages}`}
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <>
      <PageSection
        title="Gợi ý hôm nay"
        description={`Khám phá sản phẩm chất lượng hàng đầu tại PeShop`}
      />

      <SectionContainer>
        <div className="py-8">
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
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

          {!isLoading && !isError && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
            </div>
          )}

          {!isLoading && !isError && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {products.map((product, index) => (
                  <ProductCard
                    key={getProductKey(product, index)}
                    product={product}
                    onQuickView={handleQuickView}
                    priority={index < 10}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationPrevious
                      href={`/san-pham?page=${currentPage - 1}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />

                    {renderPaginationItems()}

                    <PaginationNext
                      href={`/san-pham?page=${currentPage + 1}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationContent>
                </Pagination>
              )}

              {/* Page Info */}
              <div className="text-center mt-4 text-sm text-gray-600">
                Trang {currentPage} / {totalPages} - Hiển thị {products.length}{" "}
                sản phẩm
              </div>
            </>
          )}
        </div>
      </SectionContainer>

      {/* Full Screen Loading Overlay */}
      <LoadingOverlay
        isVisible={isModalLoading}
        message="Đang tải sản phẩm..."
        subMessage="Vui lòng chờ trong giây lát"
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDataLoaded={handleModalDataLoaded}
      />
    </>
  );
}
