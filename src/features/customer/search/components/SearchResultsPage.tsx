"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useProducts, filterValidProducts, getProductKey, type Product } from "@/features/customer/products";
import { useQuickViewModal } from "@/shared/hooks";
import PageSection from "@/shared/components/layout/PageSection";
import SectionContainer from "@/shared/components/layout/SectionContainer";
import { ProductCard } from "@/features/customer/home";
import { QuickViewModal } from "@/components/dynamic";
import LoadingOverlay from "@/shared/components/layout/LoadingOverlay";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shared/components/ui/pagination";
import { Loader2, Camera } from "lucide-react";
import type { ImageSearchResultData } from "../types";
export default function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    selectedProduct,
    isModalOpen,
    isModalLoading,
    handleQuickView,
    handleCloseModal,
    handleModalDataLoaded
  } = useQuickViewModal();
  const keyword = searchParams.get("q") || "";
  const searchType = searchParams.get("type");
  const page = parseInt(searchParams.get("page") || "1");
  const isImageSearch = searchType === "image";
  const [imageSearchData, setImageSearchData] = useState<ImageSearchResultData | null>(null);
  useEffect(() => {
    if (isImageSearch) {
      const storedData = sessionStorage.getItem("imageSearchResults");
      if (storedData) {
        try {
          setImageSearchData(JSON.parse(storedData));
        } catch {
          setImageSearchData(null);
        }
      }
    } else {
      setImageSearchData(null);
    }
  }, [isImageSearch]);
  const {
    data,
    isLoading,
    error
  } = useProducts(!isImageSearch ? {
    keyword: keyword || undefined,
    page,
    pageSize: 20
  } : undefined);
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (isImageSearch) {
      params.set("type", "image");
    } else if (keyword) {
      params.set("q", keyword);
    }
    params.set("page", newPage.toString());
    router.push(`/tim-kiem?${params.toString()}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiData = isImageSearch ? imageSearchData : data?.data as any;
  const products = filterValidProducts(apiData?.data || apiData?.products || []);
  const totalCount = apiData?.totalCount || 0;
  const currentPage = apiData?.currentPage || 1;
  const totalPages = apiData?.totalPages || 1;
  const hasNextPage = apiData?.hasNextPage || false;
  const hasPreviousPage = apiData?.hasPreviousPage || false;
  const isPageLoading = isImageSearch ? false : isLoading;
  const getDescription = () => {
    if (isImageSearch) {
      return totalCount > 0 ? `Tìm thấy ${totalCount} sản phẩm tương tự với hình ảnh` : "Không tìm thấy sản phẩm tương tự";
    }
    return keyword ? `Tìm thấy ${totalCount} sản phẩm với từ khóa "${keyword}"` : "Nhập từ khóa để tìm kiếm sản phẩm";
  };
  return <div className="min-h-screen bg-gray-50">
      <PageSection title={isImageSearch ? "Tìm kiếm bằng hình ảnh" : "Kết quả tìm kiếm"} description={getDescription()} />

      <SectionContainer>
        <div className="py-8">
          {}
          {isPageLoading && <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Đang tải sản phẩm...</span>
            </div>}

          {}
          {error && !isImageSearch && <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">
                Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.
              </p>
            </div>}

          {}
          {!isPageLoading && !error && !keyword && !isImageSearch && <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Tìm kiếm sản phẩm
              </h3>
              <p className="text-gray-500">
                Nhập từ khóa vào ô tìm kiếm để bắt đầu
              </p>
            </div>}

          {}
          {!isPageLoading && !error && (keyword || isImageSearch) && products.length === 0 && <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  {isImageSearch ? <Camera className="mx-auto h-24 w-24" /> : <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500">
                  {isImageSearch ? "Thử tải lên hình ảnh khác để tìm kiếm sản phẩm tương tự" : "Thử thay đổi từ khóa để tìm kiếm sản phẩm khác"}
                </p>
              </div>}

          {}
          {!isPageLoading && !error && products.length > 0 && <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {products.map((product: Product, index: number) => <ProductCard key={getProductKey(product, index)} product={product} onQuickView={handleQuickView} />)}
              </div>

              {}
              {totalPages > 1 && <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      {hasPreviousPage && <PaginationItem>
                          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} className="cursor-pointer" />
                        </PaginationItem>}

                      {Array.from({
                  length: totalPages
                }, (_, i) => i + 1).map(pageNum => {
                  const showPage = pageNum === 1 || pageNum === totalPages || pageNum >= currentPage - 1 && pageNum <= currentPage + 1;
                  if (!showPage) {
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <PaginationItem key={pageNum}>
                                  <span className="px-2">...</span>
                                </PaginationItem>;
                    }
                    return null;
                  }
                  return <PaginationItem key={pageNum}>
                              <PaginationLink onClick={() => handlePageChange(pageNum)} isActive={pageNum === currentPage} className="cursor-pointer">
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>;
                })}

                      {hasNextPage && <PaginationItem>
                          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} className="cursor-pointer" />
                        </PaginationItem>}
                    </PaginationContent>
                  </Pagination>
                </div>}
            </>}
        </div>
      </SectionContainer>

      <LoadingOverlay isVisible={isModalLoading} message="Đang tải sản phẩm..." subMessage="Vui lòng chờ trong giây lát" />

      <QuickViewModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} onDataLoaded={handleModalDataLoaded} />
    </div>;
}