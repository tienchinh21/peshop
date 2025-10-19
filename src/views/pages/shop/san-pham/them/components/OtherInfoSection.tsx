"use client";

import React, { useState } from "react";
import { SearchableDropdown } from "@/components/common/SearchableDropdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategoryTemplate } from "@/hooks/useCategories";
import {
  CategoryChild,
  CategoryTemplate,
  TemplateCategory,
  TemplateCategoryChild,
} from "@/types/shops/category.type";
import { ProductInformation } from "@/types/shops/product.type";

interface OtherInfoSectionProps {
  selectedCategory: CategoryChild | null;
  productInformations: ProductInformation[];
  setProductInformations: (infos: ProductInformation[]) => void;
  weight: number;
  setWeight: (weight: number) => void;
  dimensions: { length: number; width: number; height: number };
  setDimensions: (dimensions: {
    length: number;
    width: number;
    height: number;
  }) => void;
}

export function OtherInfoSection({
  selectedCategory,
  productInformations,
  setProductInformations,
  weight,
  setWeight,
  dimensions,
  setDimensions,
}: OtherInfoSectionProps) {
  // Use React Query hook for category template
  const {
    data: templateResponse,
    isLoading: loading,
    error,
  } = useCategoryTemplate(selectedCategory?.id || null);

  const categoryTemplate = templateResponse?.content || null;

  // Initialize product informations when template changes
  React.useEffect(() => {
    if (categoryTemplate) {
      const initialInfos: ProductInformation[] = [];
      categoryTemplate.templateCategories.forEach((template) => {
        initialInfos.push({
          name: template.name,
          value: "",
        });
      });
      categoryTemplate.templateCategoryChildren.forEach((template) => {
        initialInfos.push({
          name: template.name,
          value: "",
        });
      });
      setProductInformations(initialInfos);
    } else {
      setProductInformations([]);
    }
  }, [categoryTemplate, setProductInformations]);

  const updateProductInformation = (name: string, value: string) => {
    setProductInformations(
      productInformations.map((info) =>
        info.name === name ? { ...info, value } : info
      )
    );
  };

  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Thông tin bán hàng
          </h1>
        </div>

        {/* No category selected message */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-gray-500 text-sm">
            <p className="font-medium text-gray-700 mb-2">Thông tin bán hàng</p>
            <p>Có thể điều chỉnh sau khi chọn ngành hàng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Thông tin bán hàng
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Danh mục: <span className="font-medium">{selectedCategory.name}</span>
        </p>
      </div>

      {/* Weight and Dimensions Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Vận chuyển
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weight */}
          <div className="space-y-2">
            <Label
              htmlFor="weight"
              className="text-sm font-medium text-gray-700"
            >
              Cân nặng <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.01"
                value={weight || ""}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                placeholder="Nhập cân nặng"
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                kg
              </span>
            </div>
          </div>

          {/* Length */}
          <div className="space-y-2">
            <Label
              htmlFor="length"
              className="text-sm font-medium text-gray-700"
            >
              Chiều dài <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="length"
                type="number"
                min="0"
                step="0.1"
                value={dimensions.length || ""}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    length: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Nhập chiều dài"
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                cm
              </span>
            </div>
          </div>

          {/* Width */}
          <div className="space-y-2">
            <Label
              htmlFor="width"
              className="text-sm font-medium text-gray-700"
            >
              Chiều rộng <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="width"
                type="number"
                min="0"
                step="0.1"
                value={dimensions.width || ""}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    width: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Nhập chiều rộng"
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                cm
              </span>
            </div>
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label
              htmlFor="height"
              className="text-sm font-medium text-gray-700"
            >
              Chiều cao <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="height"
                type="number"
                min="0"
                step="0.1"
                value={dimensions.height || ""}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    height: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Nhập chiều cao"
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                cm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Template Attributes */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : categoryTemplate ? (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Thông tin chi tiết
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ...categoryTemplate.templateCategories,
              ...categoryTemplate.templateCategoryChildren,
            ].map((template) => (
              <AttributeField
                key={`template-${template.id}`}
                template={template}
                value={
                  productInformations.find(
                    (info) => info.name === template.name
                  )?.value || ""
                }
                onValueChange={(value) =>
                  updateProductInformation(template.name, value)
                }
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Không có thông tin template cho danh mục này
        </div>
      )}
    </div>
  );
}

interface AttributeFieldProps {
  template: TemplateCategory | TemplateCategoryChild;
  value: string;
  onValueChange: (value: string) => void;
}

function AttributeField({
  template,
  value,
  onValueChange,
}: AttributeFieldProps) {
  const suggestedOptions =
    template.attributeTemplates?.map((attr) => attr.name) || [];

  return (
    <SearchableDropdown
      value={value}
      onChange={onValueChange}
      options={suggestedOptions}
      label={template.name}
      placeholder="Vui lòng chọn"
      required={true}
    />
  );
}
