"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/user/useProducts";
import { useQuickViewModal } from "@/hooks/useQuickViewModal";
import PageSection from "@/components/common/PageSection";
import SectionContainer from "@/components/common/SectionContainer";
import ProductCard from "@/views/pages/home/components/ProductCard";
import { QuickViewModal } from "@/components/dynamic";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, SlidersHorizontal } from "lucide-react";
import SearchFilters from "./components/SearchFilters";
import { Product } from "@/types/users/product.types";
import { toast } from "sonner";
import { filterValidProducts, getProductKey } from "@/lib/utils/product.utils";

export default function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // QuickView modal hook
  const {
    selectedProduct,
    isModalOpen,
    isModalLoading,
    handleQuickView,
    handleCloseModal,
    handleModalDataLoaded,
  } = useQuickViewModal();

  // Get search keyword from URL
  const keyword = searchParams.get("q") || "";

  // Filter states - keyword should ALWAYS be included if present in URL
  const [filters, setFilters] = useState({
    keyword: keyword || undefined,
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

  // Fetch products with filters
  const { data, isLoading, error } = useProducts(filters);

  // Update filters when URL changes
  useEffect(() => {
    setFilters({
      keyword: keyword || undefined,
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
  }, [keyword, searchParams]);

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/tim-kiem?${params.toString()}`);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams();

    // ALWAYS keep the keyword in URL if it exists
    if (keyword) {
      params.set("q", keyword);
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

    // Add other filters
    if (newFilters.categoryId) params.set("categoryId", newFilters.categoryId);
    if (newFilters.categoryChildId)
      params.set("categoryChildId", newFilters.categoryChildId);
    if (newFilters.minPrice)
      params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice)
      params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.reviewPoint)
      params.set("reviewPoint", newFilters.reviewPoint.toString());

    router.push(`/tim-kiem?${params.toString()}`);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    router.push(`/tim-kiem?q=${encodeURIComponent(keyword)}`);
  };

  // Filter and validate products from API response
  const products = filterValidProducts(data?.data?.products || []);
  const totalCount = data?.data?.totalCount || 0;
  const currentPage = data?.data?.currentPage || 1;
  const totalPages = data?.data?.totalPages || 1;
  const hasNextPage = data?.data?.hasNextPage || false;
  const hasPreviousPage = data?.data?.hasPreviousPage || false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <PageSection
        title="Kết quả tìm kiếm"
        description={
          keyword
            ? `Tìm thấy ${totalCount} sản phẩm với từ khóa "${keyword}"`
            : "Nhập từ khóa để tìm kiếm sản phẩm"
        }
      />

      <SectionContainer>
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Bộ lọc</h2>
                </div>

                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <main className="lg:col-span-3">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-gray-600">
                    Đang tải sản phẩm...
                  </span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600">
                    Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.
                  </p>
                </div>
              )}

              {/* Empty State */}
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="text-gray-500">
                    Thử thay đổi từ khóa hoặc bộ lọc để tìm kiếm sản phẩm khác
                  </p>
                </div>
              )}

              {/* Products Grid */}
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <Pagination>
                        <PaginationContent>
                          {/* Previous Button */}
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

                          {/* Page Numbers */}
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => {
                            // Show first page, last page, current page, and pages around current
                            const showPage =
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1);

                            if (!showPage) {
                              // Show ellipsis
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

                          {/* Next Button */}
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
    </div>
  );
}
