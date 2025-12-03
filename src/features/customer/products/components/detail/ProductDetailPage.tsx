"use client";

import { SectionContainer } from "@/shared/components/layout";
import { BreadcrumbNavigation } from "./BreadcrumbNavigation";
import { ProductDetailClient } from "./ProductDetailClient";
import ProductTabs from "./ProductTabs";
import type { ProductDetail } from "../../types";

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
    </SectionContainer>
  );
};
