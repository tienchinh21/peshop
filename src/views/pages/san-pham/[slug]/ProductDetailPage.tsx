"use client";

// import { Suspense, lazy } from "react";
import { SectionContainer } from "@/components/common";
import { BreadcrumbNavigation } from "./components/BreadcrumbNavigation";
import { ProductDetailClient } from "./ProductDetailClient";
import ProductTabs from "./components/ProductTabs";
import type { ProductDetail } from "@/types/users/product.types";

// Lazy load SimilarProducts to not block hydration
// const SimilarProducts = lazy(() =>
//   import("./components/SimilarProducts").then((mod) => ({
//     default: mod.SimilarProducts,
//   }))
// );

interface ProductDetailPageProps {
  slug: string;
  initialData: ProductDetail | null;
}

export const ProductDetailPage = ({
  slug,
  initialData,
}: ProductDetailPageProps) => {
  // If no initial data from server, show error
  if (!initialData) {
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
          currentPage={initialData.productName}
        />
      </div>

      <ProductDetailClient slug={slug} initialData={initialData} />

      {/* Defer non-critical content */}
      <div className="mt-12">
        <ProductTabs product={initialData} />
      </div>

      {/* TODO: Enable SimilarProducts later when needed */}
      {/* <div className="mt-12">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            </div>
          }
        >
          <SimilarProducts productId={initialData.productId} />
        </Suspense>
      </div> */}
    </SectionContainer>
  );
};
