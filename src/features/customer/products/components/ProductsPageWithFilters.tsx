"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "../hooks";
import { filterValidProducts, getProductKey } from "../utils";
import type { Product } from "../types";
import { useQuickViewModal } from "@/shared/hooks";
import PageSection from "@/shared/components/layout/PageSection";
import SectionContainer from "@/shared/components/layout/SectionContainer";
import { ProductCard } from "@/features/customer/home";
import { QuickViewModal } from "@/components/dynamic";
import LoadingOverlay from "@/shared/components/layout/LoadingOverlay";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import ProductFiltersComponent from "./ProductFilters";
interface ProductFiltersState {
  page: number;
  pageSize: number;
  categoryId?: string;
  categoryChildId?: string;
  minPrice?: number;
  maxPrice?: number;
  reviewPoint?: number;
}
export default function ProductsPageWithFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    selectedProduct,
    isModalOpen,
    isModalLoading,
    handleQuickView,
    handleCloseModal,
    handleModalDataLoaded,
  } = useQuickViewModal();
  const [filters, setFilters] = useState<ProductFiltersState>({
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: 20,
    categoryId: searchParams.get("categoryId") || undefined,
    categoryChildId: searchParams.get("categoryChildId") || undefined,
    minPrice: searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined,
    reviewPoint: searchParams.get("reviewPoint")
      ? parseFloat(searchParams.get("reviewPoint")!)
      : undefined,
  });
  const { data, isLoading, error } = useProducts(filters);
  useEffect(() => {
    setFilters({
      page: parseInt(searchParams.get("page") || "1"),
      pageSize: 20,
      categoryId: searchParams.get("categoryId") || undefined,
      categoryChildId: searchParams.get("categoryChildId") || undefined,
      minPrice: searchParams.get("minPrice")
        ? parseFloat(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice")!)
        : undefined,
      reviewPoint: searchParams.get("reviewPoint")
        ? parseFloat(searchParams.get("reviewPoint")!)
        : undefined,
    });
  }, [searchParams]);
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/san-pham?${params.toString()}`);
  };
  const handleFilterChange = (newFilters: Partial<ProductFiltersState>) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    const merged = {
      ...filters,
      ...newFilters,
    };
    if (merged.categoryId) params.set("categoryId", merged.categoryId);
    if (merged.categoryChildId)
      params.set("categoryChildId", merged.categoryChildId);
    if (merged.minPrice) params.set("minPrice", merged.minPrice.toString());
    if (merged.maxPrice) params.set("maxPrice", merged.maxPrice.toString());
    if (merged.reviewPoint)
      params.set("reviewPoint", merged.reviewPoint.toString());
    router.push(`/san-pham?${params.toString()}`);
  };
  const handleClearFilters = () => {
    router.push("/san-pham");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiData = data?.data as any;
  const products = filterValidProducts(
    apiData?.data || apiData?.products || []
  );
  const totalCount = apiData?.totalCount || 0;
  const currentPage = apiData?.currentPage || 1;
  const totalPages = apiData?.totalPages || 1;
  const hasNextPage = apiData?.hasNextPage || false;
  const hasPreviousPage = apiData?.hasPreviousPage || false;
  const hasActiveFilters =
    filters.categoryId ||
    filters.categoryChildId ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.reviewPoint;

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <PageSection
        title="Tất cả sản phẩm"
        description={
          hasActiveFilters
            ? `Tìm thấy ${totalCount} sản phẩm`
            : "Khám phá hàng nghìn sản phẩm chất lượng cao"
        }
      />

      <SectionContainer>
        <div className="py-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full min-h-[44px] flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  <span>Bộ lọc</span>
                  {hasActiveFilters && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                      Đang lọc
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[85%] sm:w-[350px] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    Bộ lọc
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                  <ProductFiltersComponent
                    filters={filters}
                    onFilterChange={(newFilters) => {
                      handleFilterChange(newFilters);
                      setIsFilterOpen(false);
                    }}
                    onClearFilters={() => {
                      handleClearFilters();
                      setIsFilterOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Desktop Filter Sidebar - Hidden on mobile */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Bộ lọc</h2>
                </div>

                <ProductFiltersComponent
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <main className="lg:col-span-3">
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-gray-600">
                    Đang tải sản phẩm...
                  </span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600">
                    Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.
                  </p>
                </div>
              )}

              {!isLoading && !error && products.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-24 w-24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="text-gray-500">
                    Thử thay đổi bộ lọc để tìm sản phẩm khác
                  </p>
                </div>
              )}

              {!isLoading && !error && products.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {products.map((product: Product, index: number) => (
                      <ProductCard
                        key={getProductKey(product, index)}
                        product={product}
                        onQuickView={handleQuickView}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <Pagination>
                        <PaginationContent>
                          {hasPreviousPage && (
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                                className="cursor-pointer"
                              />
                            </PaginationItem>
                          )}

                          {Array.from(
                            {
                              length: totalPages,
                            },
                            (_, i) => i + 1
                          ).map((page) => {
                            const showPage =
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1);
                            if (!showPage) {
                              if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <span className="px-2">...</span>
                                  </PaginationItem>
                                );
                              }
                              return null;
                            }
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                  isActive={page === currentPage}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                          {hasNextPage && (
                            <PaginationItem>
                              <PaginationNext
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                                className="cursor-pointer"
                              />
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </SectionContainer>

      <LoadingOverlay
        isVisible={isModalLoading}
        message="Đang tải sản phẩm..."
        subMessage="Vui lòng chờ trong giây lát"
      />

      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDataLoaded={handleModalDataLoaded}
      />
    </div>
  );
}
