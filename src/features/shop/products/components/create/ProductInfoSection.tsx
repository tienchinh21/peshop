"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Plus, X, Camera, Search } from "lucide-react";
import { formatInputCurrency, parseInputCurrency } from "@/lib/utils";
import { useProductProperties } from "@/shared/hooks";
import { ProductClassification, CategoryChild } from "@/features/shop/products/types";
import { uploadImage } from "@/features/shop/products/services";
import { toast } from "sonner";
import type { VariantImageWithUrl } from "@/shared/hooks";
interface ProductInfoSectionProps {
  selectedCategory: CategoryChild | null;
  selectedClassifications: ProductClassification[];
  setSelectedClassifications: (classifications: ProductClassification[]) => void;
  variants: any[];
  setVariants: (variants: any[]) => void;
  variantImages: {
    [key: string]: VariantImageWithUrl;
  };
  setVariantImages: (images: {
    [key: string]: VariantImageWithUrl;
  }) => void;
  simpleProductPrice: number;
  setSimpleProductPrice: (price: number) => void;
  simpleProductStock: number;
  setSimpleProductStock: (stock: number) => void;
}
export function ProductInfoSection({
  selectedCategory,
  selectedClassifications,
  setSelectedClassifications,
  variants,
  setVariants,
  variantImages,
  setVariantImages,
  simpleProductPrice,
  setSimpleProductPrice,
  simpleProductStock,
  setSimpleProductStock
}: ProductInfoSectionProps) {
  const {
    data: properties = [],
    isLoading: propertiesLoading
  } = useProductProperties();
  const [globalPrice, setGlobalPrice] = useState<string>("");
  const [globalStock, setGlobalStock] = useState<string>("");
  const [globalSku, setGlobalSku] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeColumn, setActiveColumn] = useState<string>("");
  const addClassification = (propertyId: string, propertyName: string) => {
    if (selectedClassifications.length >= 2) {
      alert("Tối đa chỉ được chọn 2 phân loại");
      return;
    }
    if (selectedClassifications.some(c => c.propertyId === propertyId)) {
      alert("Không được chọn trùng phân loại");
      return;
    }
    const newClassification: ProductClassification = {
      id: Date.now().toString(),
      propertyId,
      propertyName,
      values: []
    };
    setSelectedClassifications([...selectedClassifications, newClassification]);
  };
  const removeClassification = (classificationId: string) => {
    setSelectedClassifications(selectedClassifications.filter(c => c.id !== classificationId));
    generateVariants();
  };
  const addValueToClassification = (classificationId: string, value: string) => {
    if (!value.trim()) return;
    setSelectedClassifications(selectedClassifications.map(c => c.id === classificationId ? {
      ...c,
      values: [...c.values, value.trim()]
    } : c));
  };
  const removeValueFromClassification = (classificationId: string, valueIndex: number) => {
    setSelectedClassifications(selectedClassifications.map(c => c.id === classificationId ? {
      ...c,
      values: c.values.filter((_, i) => i !== valueIndex)
    } : c));
    generateVariants();
  };
  const generateVariants = () => {
    if (selectedClassifications.length === 0) {
      setVariants([]);
      return;
    }
    const combinations: any[] = [];
    if (selectedClassifications.length === 1) {
      const classification = selectedClassifications[0];
      classification.values.forEach(value => {
        combinations.push([{
          propertyId: classification.propertyId,
          value
        }]);
      });
    } else if (selectedClassifications.length === 2) {
      const [mainClassification, subClassification] = selectedClassifications;
      mainClassification.values.forEach(mainValue => {
        subClassification.values.forEach(subValue => {
          combinations.push([{
            propertyId: mainClassification.propertyId,
            value: mainValue
          }, {
            propertyId: subClassification.propertyId,
            value: subValue
          }]);
        });
      });
    }
    const newVariants = combinations.map((combination, index) => ({
      id: `variant-${index}`,
      values: combination,
      price: 0,
      stock: 0,
      sku: "",
      gtin: "",
      image: null,
      status: 1
    }));
    setVariants(newVariants);
  };
  const updateVariant = (variantId: string, field: string, value: any) => {
    setVariants(variants.map(v => v.id === variantId ? {
      ...v,
      [field]: value
    } : v));
  };
  const applyToAllVariants = () => {
    setVariants(variants.map(v => ({
      ...v,
      price: globalPrice ? Number(globalPrice) : v.price,
      stock: globalStock ? Number(globalStock) : v.stock,
      sku: globalSku || v.sku
    })));
  };
  const handleVariantImageUpload = async (colorGroup: string, files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    setVariantImages({
      ...variantImages,
      [colorGroup]: {
        file,
        url: null
      }
    });
    try {
      const uploadedUrl = await uploadImage(file);
      setVariantImages({
        ...variantImages,
        [colorGroup]: {
          file,
          url: uploadedUrl
        }
      });
      toast.success(`Đã tải ảnh cho "${colorGroup}"`);
    } catch (error) {
      console.error("Error uploading variant image:", error);
      toast.error("Tải ảnh thất bại. Vui lòng thử lại.");
    }
  };
  const getVariantImage = (colorGroup: string) => {
    return variantImages[colorGroup] || null;
  };
  useEffect(() => {
    generateVariants();
  }, [selectedClassifications]);
  if (!selectedCategory) {
    return <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thông tin chi tiết
          </h2>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-gray-500 text-sm">
            <p className="font-medium text-gray-700 mb-2">Thông tin chi tiết</p>
            <p>Có thể điều chỉnh sau khi chọn ngành hàng</p>
          </div>
        </div>
      </div>;
  }
  if (propertiesLoading) {
    return <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thông tin chi tiết
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Đang tải...</p>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Thông tin chi tiết
        </h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          <Label className="text-sm font-medium text-gray-700">
            Phân loại hàng
          </Label>
        </div>

        {selectedClassifications.map((classification, index) => <div key={classification.id} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">
                  Phân loại {index + 1}
                </span>
                <Input value={classification.propertyName} className="w-48" maxLength={14} />
                <span className="text-xs text-gray-500">
                  {classification.propertyName.length}/14
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeClassification(classification.id)} className="text-gray-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Tùy chọn
              </Label>
              <div className="space-y-2">
                {classification.values.map((value, valueIndex) => <div key={valueIndex} className="flex items-center space-x-2">
                    <Input value={value} className="flex-1" maxLength={20} />
                    <span className="text-xs text-gray-500">
                      {value.length}/20
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => removeValueFromClassification(classification.id, valueIndex)} className="p-2 text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>)}
                <div className="flex items-center space-x-2">
                  <Input placeholder="Type or Select" className="flex-1" maxLength={20} onKeyPress={e => {
                if (e.key === "Enter") {
                  const input = e.target as HTMLInputElement;
                  addValueToClassification(classification.id, input.value);
                  input.value = "";
                }
              }} />
                  <span className="text-xs text-gray-500">0/20</span>
                </div>
              </div>
            </div>
          </div>)}

        {selectedClassifications.length < 2 && <Select onValueChange={value => {
        const property = properties.find((p: any) => p.id === value);
        if (property) {
          addClassification(property.id, property.name);
        }
      }}>
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder="Chọn phân loại" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Vui lòng nhập tối thiểu 1 ký tự" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
              </div>

              {properties.filter((p: any) => !selectedClassifications.some(c => c.propertyId === p.id) && p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((property: any) => <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>)}
            </SelectContent>
          </Select>}
      </div>

      {selectedClassifications.length === 0 && <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin bán hàng
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Sản phẩm không có phân loại. Vui lòng nhập giá và số lượng.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                <span className="text-red-500">* </span>
                Giá sản phẩm
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-sm">₫</span>
                <Input type="text" placeholder="Nhập giá sản phẩm" value={simpleProductPrice ? formatInputCurrency(simpleProductPrice) : ""} onChange={e => {
              const rawValue = parseInputCurrency(e.target.value);
              setSimpleProductPrice(rawValue);
            }} className="flex-1" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                <span className="text-red-500">* </span>
                Số lượng
              </Label>
              <Input type="number" placeholder="Nhập số lượng" value={simpleProductStock || ""} onChange={e => setSimpleProductStock(Number(e.target.value))} min={0} className="flex-1" />
            </div>
          </div>
        </div>}

      {variants.length > 0 && <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Danh sách phân loại hàng
              </h3>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-sm">₫</span>
                <Input type="text" placeholder="Giá" value={globalPrice ? formatInputCurrency(globalPrice) : ""} onChange={e => {
              const rawValue = parseInputCurrency(e.target.value);
              setGlobalPrice(rawValue.toString());
            }} onFocus={() => setActiveColumn("price")} onBlur={() => setActiveColumn("")} className="w-32" />
              </div>
              <Input type="number" placeholder="Kho hàng" value={globalStock} onChange={e => setGlobalStock(e.target.value)} onFocus={() => setActiveColumn("stock")} onBlur={() => setActiveColumn("")} className="w-32" />
              <Input placeholder="SKU phân loại" value={globalSku} onChange={e => setGlobalSku(e.target.value)} onFocus={() => setActiveColumn("sku")} onBlur={() => setActiveColumn("")} className="w-40" />
              <Button onClick={applyToAllVariants} className="bg-orange-500 hover:bg-orange-600 text-white">
                Áp dụng cho tất cả phân loại
              </Button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {selectedClassifications.length > 0 && <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>{selectedClassifications[0].propertyName}</span>
                      </div>
                    </th>}

                  {selectedClassifications.length === 2 && <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>{selectedClassifications[1].propertyName}</span>
                      </div>
                    </th>}
                  <th className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${activeColumn === "price" ? "bg-red-50 border-l-2 border-r-2 border-t-2 border-red-500" : ""}`}>
                    <div className="flex items-center space-x-1">
                      <span className="text-red-500">*</span>
                      <span>Giá</span>
                    </div>
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${activeColumn === "stock" ? "bg-red-50 border-l-2 border-r-2 border-t-2 border-red-500" : ""}`}>
                    <div className="flex items-center space-x-1">
                      <span className="text-red-500">*</span>
                      <span>Kho hàng</span>
                    </div>
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${activeColumn === "sku" ? "bg-red-50 border-l-2 border-r-2 border-t-2 border-red-500" : ""}`}>
                    SKU phân loại
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Hoạt động
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
              const groupedVariants: {
                [key: string]: any[];
              } = {};
              variants.forEach(variant => {
                const firstValue = variant.values[0]?.value || "default";
                if (!groupedVariants[firstValue]) {
                  groupedVariants[firstValue] = [];
                }
                groupedVariants[firstValue].push(variant);
              });
              return Object.entries(groupedVariants).map(([colorGroup, colorVariants]) => colorVariants.map((variant, variantIndex) => <tr key={variant.id} className="hover:bg-gray-50">
                          {selectedClassifications.length === 2 ? variantIndex === 0 && <td rowSpan={colorVariants.length} className="px-4 py-3 border-r bg-gray-50">
                                <div className="flex items-center space-x-3 flex-col gap-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    {colorGroup}
                                  </span>
                                  <div className="relative">
                                    {getVariantImage(colorGroup) ? <div className="w-12 h-12 rounded border overflow-hidden relative bg-white">
                                        <img src={getVariantImage(colorGroup)!.url || URL.createObjectURL(getVariantImage(colorGroup)!.file)} alt={colorGroup} className="w-full h-full object-cover block" />
                                        <input type="file" accept="image/*" onChange={e => handleVariantImageUpload(colorGroup, e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                      </div> : <div className="w-12 h-12 bg-gray-100 border-2 border-dashed border-orange-300 rounded flex items-center justify-center cursor-pointer hover:border-orange-400 relative">
                                        <Camera className="w-4 h-4 text-orange-500" />
                                        <Plus className="w-3 h-3 text-orange-500 absolute top-0 right-0" />
                                        <input type="file" accept="image/*" onChange={e => handleVariantImageUpload(colorGroup, e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                      </div>}
                                  </div>
                                </div>
                              </td> : <td className="px-4 py-3 border-r bg-gray-50">
                              <div className="flex items-center space-x-3 flex-col gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {variant.values[0]?.value}
                                </span>
                                <div className="relative">
                                  {getVariantImage(variant.values[0]?.value) ? <div className="w-12 h-12 rounded border overflow-hidden relative bg-white">
                                      <img src={getVariantImage(variant.values[0]?.value)!.url || URL.createObjectURL(getVariantImage(variant.values[0]?.value)!.file)} alt={variant.values[0]?.value} className="w-full h-full object-cover block" />
                                      <input type="file" accept="image/*" onChange={e => handleVariantImageUpload(variant.values[0]?.value, e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    </div> : <div className="w-12 h-12 bg-gray-100 border-2 border-dashed border-orange-300 rounded flex items-center justify-center cursor-pointer hover:border-orange-400 relative">
                                      <Camera className="w-4 h-4 text-orange-500" />
                                      <Plus className="w-3 h-3 text-orange-500 absolute top-0 right-0" />
                                      <input type="file" accept="image/*" onChange={e => handleVariantImageUpload(variant.values[0]?.value, e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    </div>}
                                </div>
                              </div>
                            </td>}

                          {selectedClassifications.length === 2 && <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">
                                {variant.values[1]?.value}
                              </span>
                            </td>}

                          <td className={`px-4 py-3 ${activeColumn === "price" ? "bg-red-50 border-l-2 border-r-2 border-red-500" : ""}`}>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500 text-sm">₫</span>
                              <Input type="text" placeholder="Nhập vào" value={variant.price ? formatInputCurrency(variant.price) : ""} onChange={e => {
                      const rawValue = parseInputCurrency(e.target.value);
                      updateVariant(variant.id, "price", rawValue);
                    }} className="w-32" />
                            </div>
                          </td>

                          <td className={`px-4 py-3 ${activeColumn === "stock" ? "bg-red-50 border-l-2 border-r-2 border-red-500" : ""}`}>
                            <Input type="number" placeholder="0" value={variant.stock || ""} onChange={e => updateVariant(variant.id, "stock", Number(e.target.value))} className="w-24" />
                          </td>

                          <td className={`px-4 py-3 ${activeColumn === "sku" ? "bg-red-50 border-l-2 border-r-2 border-red-500" : ""}`}>
                            <Input placeholder="Nhập vào" value={variant.sku || ""} onChange={e => updateVariant(variant.id, "sku", e.target.value)} className="w-32" />
                          </td>

                          <td className="px-4 py-3">
                            <Switch checked={variant.status === 1} onCheckedChange={checked => updateVariant(variant.id, "status", checked ? 1 : 0)} />
                          </td>
                        </tr>));
            })()}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
}
export default ProductInfoSection;