"use client";

import { Suspense, lazy } from "react";
import { useProductDetail } from "@/hooks/user/useProducts";
import { ProductDetailSkeleton } from "@/components/skeleton/ProductSkeleton";
import { SectionContainer } from "@/components/common";
import { BreadcrumbNavigation } from "./components/BreadcrumbNavigation";
import { ProductDetailClient } from "./ProductDetailClient";

const ProductTabs = lazy(() => import("./components/ProductTabs"));
const SimilarProducts = lazy(() => import("./components/SimilarProducts").then(m => ({ default: m.SimilarProducts })));

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage = ({ slug }: ProductDetailPageProps) => {
  const { data: product, isLoading, error } = useProductDetail(slug);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <SectionContainer>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Không tìm thấy sản phẩm
          </h1>
          <p className="mt-2 text-gray-600">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="mb-6">
        <BreadcrumbNavigation
          items={[{ name: "Sản phẩm", url: "/san-pham" }]}
          currentPage={product.productName}
        />
      </div>

      <ProductDetailClient slug={slug} />

      <div className="mt-12">
        <Suspense fallback={<div className="bg-white rounded-lg p-6 animate-pulse h-64" />}>
          <ProductTabs product={product} />
        </Suspense>
      </div>

      <div className="mt-12">
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}>
          <SimilarProducts productId={product.productId} />
        </Suspense>
      </div>
    </SectionContainer>
  );
};
