"use client";

import React, { lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProductCreation } from "@/hooks/useProductCreation";
import { Loader2 } from "lucide-react";

const ScrollBasedTabs = lazy(() =>
  import("./components/ScrollBasedTabs").then((m) => ({
    default: m.ScrollBasedTabs,
  }))
);
const BasicInfoSection = lazy(() =>
  import("./components/BasicInfoSection").then((m) => ({
    default: m.BasicInfoSection,
  }))
);
const ProductInfoSection = lazy(() =>
  import("./components/ProductInfoSection").then((m) => ({
    default: m.ProductInfoSection,
  }))
);
const OtherInfoSection = lazy(() =>
  import("./components/OtherInfoSection").then((m) => ({
    default: m.OtherInfoSection,
  }))
);
const SuggestionsPanel = lazy(() => import("./components/SuggestionsPanel"));

const tabs = [
  { id: "basic-info", label: "Thông tin cơ bản" },
  { id: "product-info", label: "Thông tin bán hàng" },
  { id: "other-info", label: "Thông tin chi tiết" },
];

const SectionSkeleton = () => (
  <Card>
    <CardContent className="p-6 space-y-4">
      <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
      <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
        <div className="h-32 bg-gray-200 animate-pulse rounded" />
      </div>
    </CardContent>
  </Card>
);

export default function CreateProductPageClient() {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedParentCategory,
    setSelectedParentCategory,
    activeTab,
    registerSection,
    scrollToSection,
    productImages,
    setProductImages,
    productName,
    setProductName,
    productDescription,
    setProductDescription,
    selectedClassifications,
    setSelectedClassifications,
    variants,
    setVariants,
    variantImages,
    setVariantImages,
    simpleProductPrice,
    setSimpleProductPrice,
    simpleProductStock,
    setSimpleProductStock,
    weight,
    setWeight,
    dimensions,
    setDimensions,
    productInformations,
    setProductInformations,
    isSubmitting,
    handleSubmitProduct,
  } = useProductCreation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-14 z-40 bg-white border-b">
        <div className="container mx-auto px-4">
          <Suspense
            fallback={<div className="h-12 bg-gray-100 animate-pulse" />}
          >
            <ScrollBasedTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={scrollToSection}
            />
          </Suspense>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8 max-w-7xl mx-auto">
          <div className="flex-1 space-y-8">
            <Suspense fallback={<SectionSkeleton />}>
              <Card
                ref={(el) => registerSection("basic-info", el)}
                className="scroll-mt-20"
              >
                <CardContent className="p-6">
                  <BasicInfoSection
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedParentCategory={selectedParentCategory}
                    setSelectedParentCategory={setSelectedParentCategory}
                    productImages={productImages}
                    setProductImages={setProductImages}
                    productName={productName}
                    setProductName={setProductName}
                    productDescription={productDescription}
                    setProductDescription={setProductDescription}
                  />
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<SectionSkeleton />}>
              <Card
                ref={(el) => registerSection("product-info", el)}
                className="scroll-mt-20"
              >
                <CardContent className="p-6">
                  <ProductInfoSection
                    selectedCategory={selectedCategory}
                    selectedClassifications={selectedClassifications}
                    setSelectedClassifications={setSelectedClassifications}
                    variants={variants}
                    setVariants={setVariants}
                    variantImages={variantImages}
                    setVariantImages={setVariantImages}
                    simpleProductPrice={simpleProductPrice}
                    setSimpleProductPrice={setSimpleProductPrice}
                    simpleProductStock={simpleProductStock}
                    setSimpleProductStock={setSimpleProductStock}
                  />
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<SectionSkeleton />}>
              <Card
                ref={(el) => registerSection("other-info", el)}
                className="scroll-mt-20"
              >
                <CardContent className="p-6">
                  <OtherInfoSection
                    selectedCategory={selectedCategory}
                    weight={weight}
                    setWeight={setWeight}
                    dimensions={dimensions}
                    setDimensions={setDimensions}
                    productInformations={productInformations}
                    setProductInformations={setProductInformations}
                  />
                </CardContent>
              </Card>
            </Suspense>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-end gap-4">
                  <Button variant="outline" disabled={isSubmitting}>
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSubmitProduct}
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu sản phẩm"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Suspense
            fallback={
              <div className="w-80 h-64 bg-gray-100 animate-pulse rounded" />
            }
          >
            <SuggestionsPanel />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
