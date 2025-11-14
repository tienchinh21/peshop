"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollBasedTabs } from "./components/ScrollBasedTabs";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { ProductInfoSection } from "./components/ProductInfoSection";
import { OtherInfoSection } from "./components/OtherInfoSection";
import { useProductCreation } from "@/hooks/useProductCreation";
import { Loader2 } from "lucide-react";
import SuggestionsPanel from "./components/SuggestionsPanel";

const tabs = [
  { id: "basic-info", label: "Thông tin cơ bản" },
  { id: "product-info", label: "Thông tin bán hàng" },
  { id: "other-info", label: "Thông tin chi tiết" },
];

export default function CreateProductPage() {
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
      {/* Sticky Tabs Header */}
      <div className="sticky top-14 z-40 bg-white border-b">
        <div className="container mx-auto px-4">
          <ScrollBasedTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={scrollToSection}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Basic Info Section */}
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

            {/* Product Info Section */}
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

            {/* Other Info Section */}
            <Card
              ref={(el) => registerSection("other-info", el)}
              className="scroll-mt-20"
            >
              <CardContent className="p-6">
                <OtherInfoSection
                  selectedCategory={selectedCategory}
                  productInformations={productInformations}
                  setProductInformations={setProductInformations}
                  weight={weight}
                  setWeight={setWeight}
                  dimensions={dimensions}
                  setDimensions={setDimensions}
                />
              </CardContent>
            </Card>
          </div>

          {/* Suggestions Panel */}
          <SuggestionsPanel />
        </div>

        {/* Submit Button Section */}
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={isSubmitting}
                onClick={() => window.history.back()}
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={isSubmitting}
                onClick={handleSubmitProduct}
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo sản phẩm...
                  </>
                ) : (
                  "Tạo sản phẩm"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
