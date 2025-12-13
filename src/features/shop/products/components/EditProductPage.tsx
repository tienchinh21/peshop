"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useShopProductDetail, useUpdateProduct } from "@/features/shop/products/hooks";
import { SortableImageList } from "@/components/shop/SortableImageList";
import { uploadImage } from "@/features/shop/products/services";
import type { UpdateProductPayload } from "@/features/shop/products/types";
import { formatInputCurrency, parseInputCurrency } from "@/lib/utils";
import { toast } from "sonner";
import _ from "lodash";
interface EditProductPageProps {
  productId: string;
}
interface ImageItem {
  id: string;
  url: string;
}
export function EditProductPage({
  productId
}: EditProductPageProps) {
  const router = useRouter();
  const {
    data,
    isLoading
  } = useShopProductDetail(productId);
  const updateMutation = useUpdateProduct();
  const product = _.get(data, "content");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [productInformations, setProductInformations] = useState<Array<{
    id: number;
    name: string;
    value: string;
  }>>([]);
  const [variants, setVariants] = useState<Array<{
    id: number;
    price: number;
    quantity: number;
    status: number;
  }>>([]);
  const [propertyValues, setPropertyValues] = useState<Array<{
    propertyValueId: string;
    value: string;
    urlImage: string;
  }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setStatus(product.status);
      setWeight(product.weight);
      setHeight(product.height);
      setLength(product.length);
      setWidth(product.width);
      setImages(_.map(product.images, img => ({
        id: img.id,
        url: img.url
      })));
      setProductInformations(_.map(product.productInformations, info => ({
        id: info.id,
        name: info.name,
        value: info.value
      })));
      setVariants(_.map(product.variants, variant => ({
        id: variant.id,
        price: variant.price,
        quantity: variant.quantity,
        status: 1
      })));
      const pvs = _.flatMap(product.options, option => _.map(option.values, val => ({
        propertyValueId: val.id,
        value: val.value,
        urlImage: val.imgUrl || ""
      })));
      setPropertyValues(pvs);
    }
  }, [product]);
  const handleBack = () => {
    router.push("/shop/san-pham");
  };
  const handleImageReorder = (reorderedImages: ImageItem[]) => {
    setImages(reorderedImages);
  };
  const handleImageRemove = (id: string) => {
    setImages(_.filter(images, img => img.id !== id));
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadPromises = _.map(Array.from(files), async file => {
        const url = await uploadImage(file);
        return {
          id: `new-${Date.now()}-${Math.random()}`,
          url
        };
      });
      const newImages = await Promise.all(uploadPromises);
      setImages([...images, ...newImages]);
      toast.success("Tải ảnh thành công");
    } catch (error) {
      toast.error("Tải ảnh thất bại");
    } finally {
      setIsUploading(false);
    }
  };
  const handleVariantChange = (id: number, field: string, value: any) => {
    setVariants(_.map(variants, v => v.id === id ? {
      ...v,
      [field]: value
    } : v));
  };
  const handleInfoChange = (id: number, value: string) => {
    setProductInformations(_.map(productInformations, info => info.id === id ? {
      ...info,
      value
    } : info));
  };
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (_.isEmpty(images)) {
      toast.error("Vui lòng thêm ít nhất 1 ảnh sản phẩm");
      return;
    }
    const payload: UpdateProductPayload = {
      product: {
        name,
        description,
        status,
        weight,
        height,
        length,
        width
      },
      productInformations: _.map(productInformations, info => ({
        id: info.id,
        value: info.value
      })),
      propertyValues,
      variants: _.map(variants, v => ({
        variantId: v.id,
        price: v.price,
        quantity: v.quantity,
        status: v.status
      })),
      imagesProduct: _.map(images, img => ({
        id: img.id,
        urlImage: img.url
      }))
    };
    try {
      await updateMutation.mutateAsync({
        id: productId,
        payload
      });
      router.push("/shop/san-pham");
    } catch (error) {}
  };
  if (isLoading) {
    return <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>;
  }
  if (!product) {
    return <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy sản phẩm</p>
      </div>;
  }
  const classify = _.size(product.options);
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chỉnh sửa sản phẩm
            </h1>
            <p className="text-sm text-gray-500">{product.name}</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Lưu thay đổi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên sản phẩm <span className="text-red-500">*</span>
            </Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Nhập tên sản phẩm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả sản phẩm</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Nhập mô tả sản phẩm" rows={5} />
          </div>

          <div className="flex items-center space-x-2">
            <Switch checked={status === 1} onCheckedChange={checked => setStatus(checked ? 1 : 0)} />
            <Label>Trạng thái hoạt động</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hình ảnh sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!_.isEmpty(images) && <SortableImageList images={images} onReorder={handleImageReorder} onRemove={handleImageRemove} />}

          <div>
            <Label htmlFor="image-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isUploading ? "Đang tải..." : "Thêm ảnh"}
            </Label>
            <Input id="image-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kích thước & Trọng lượng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Trọng lượng (gram)</Label>
              <Input id="weight" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} min={0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Chiều cao (cm)</Label>
              <Input id="height" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} min={0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Chiều dài (cm)</Label>
              <Input id="length" type="number" value={length} onChange={e => setLength(Number(e.target.value))} min={0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Chiều rộng (cm)</Label>
              <Input id="width" type="number" value={width} onChange={e => setWidth(Number(e.target.value))} min={0} />
            </div>
          </div>
        </CardContent>
      </Card>

      {!_.isEmpty(productInformations) && <Card>
          <CardHeader>
            <CardTitle>Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {_.map(productInformations, info => <div key={info.id} className="space-y-2">
                <Label>{info.name}</Label>
                <Input value={info.value} onChange={e => handleInfoChange(info.id, e.target.value)} placeholder={`Nhập ${info.name}`} />
              </div>)}
          </CardContent>
        </Card>}

      {classify === 0 && !_.isEmpty(variants) && <Card>
          <CardHeader>
            <CardTitle>Giá & Kho hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Giá sản phẩm</Label>
                <div className="flex items-center gap-2">
                  <Input type="text" value={formatInputCurrency(variants[0].price)} onChange={e => {
                const rawValue = parseInputCurrency(e.target.value);
                handleVariantChange(variants[0].id, "price", rawValue);
              }} />
                  <span className="text-gray-500">₫</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kho hàng</Label>
                <Input type="number" value={variants[0].quantity} onChange={e => handleVariantChange(variants[0].id, "quantity", Number(e.target.value))} min={0} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={variants[0].status === 1} onCheckedChange={checked => handleVariantChange(variants[0].id, "status", checked ? 1 : 0)} />
              <Label>Hoạt động</Label>
            </div>
          </CardContent>
        </Card>}

      {classify > 0 && !_.isEmpty(variants) && <Card>
          <CardHeader>
            <CardTitle>Phân loại hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    {_.map(product.options, option => <th key={option.name} className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        {option.name}
                      </th>)}
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Giá
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Kho hàng
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Hoạt động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(variants, variant => {
                const variantData = _.find(product.variants, {
                  id: variant.id
                });
                const propertyValueIds = variantData?.propertyValueIds || [];
                return <tr key={variant.id} className="border-t">
                        {_.map(product.options, option => {
                    const matchingValue = _.find(option.values, val => _.includes(propertyValueIds, val.id));
                    return <td key={option.name} className="px-4 py-3">
                              {matchingValue?.value || "-"}
                            </td>;
                  })}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Input type="text" value={formatInputCurrency(variant.price)} onChange={e => {
                        const rawValue = parseInputCurrency(e.target.value);
                        handleVariantChange(variant.id, "price", rawValue);
                      }} className="w-32" />
                            <span className="text-gray-500 text-sm">₫</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Input type="number" value={variant.quantity} onChange={e => handleVariantChange(variant.id, "quantity", Number(e.target.value))} className="w-24" min={0} />
                        </td>
                        <td className="px-4 py-3">
                          <Switch checked={variant.status === 1} onCheckedChange={checked => handleVariantChange(variant.id, "status", checked ? 1 : 0)} />
                        </td>
                      </tr>;
              })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>}
    </div>;
}
export default EditProductPage;