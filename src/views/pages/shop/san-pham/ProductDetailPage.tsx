"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useShopProductDetail } from "@/hooks/shop/useShopProductDetail";
import {
  ProductStatus,
  ProductStatusLabels,
  ProductStatusColors,
} from "@/lib/utils/enums/eProducts";
import {
  ArrowLeft,
  Package,
  Image as ImageIcon,
  Info,
  Layers,
  Edit,
} from "lucide-react";
import Image from "next/image";
import _ from "lodash";

interface ProductDetailPageProps {
  productId: string;
}

export default function ProductDetailPageView({
  productId,
}: ProductDetailPageProps) {
  const router = useRouter();
  const { data, isLoading, error } = useShopProductDetail(productId);

  const product = _.get(data, "content");

  const handleBack = () => {
    router.push("/shop/san-pham");
  };

  const handleEdit = () => {
    router.push(`/shop/san-pham/sua/${productId}`);
  };

  const formatPrice = (price: number | null) => {
    if (_.isNil(price)) return "Chưa có giá";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: number) => {
    const statusEnum = status as ProductStatus;
    const label = ProductStatusLabels[statusEnum] || "Không xác định";
    const colorClass = ProductStatusColors[statusEnum] || "bg-gray-500";

    return (
      <Badge variant="secondary" className={colorClass}>
        {label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Không tìm thấy sản phẩm hoặc có lỗi xảy ra
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chi tiết sản phẩm
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Xem thông tin chi tiết sản phẩm
            </p>
          </div>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Chỉnh sửa
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Tên sản phẩm
              </label>
              <p className="mt-1 text-gray-900">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Trạng thái
              </label>
              <div className="mt-1">{getStatusBadge(product.status)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Danh mục
              </label>
              <p className="mt-1 text-gray-900">{product.categoryChildName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Giá cơ bản
              </label>
              <p className="mt-1 font-semibold text-gray-900">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Mô tả</label>
            <div
              className="prose mt-1 max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Hình ảnh ({_.size(product.images)})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
            {_.map(product.images, (image) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-md border border-gray-200"
              >
                <Image
                  src={image.url}
                  alt={`Product image ${image.sortOrder}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, (max-width: 1024px) 15vw, 12vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-center text-[10px] text-white font-medium">
                  #{image.sortOrder + 1}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Information */}
      {!_.isEmpty(product.productInformations) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Thông tin chi tiết
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {_.map(product.productInformations, (info) => (
                <div key={info.id}>
                  <label className="text-sm font-medium text-gray-700">
                    {info.name}
                  </label>
                  <p className="mt-1 text-gray-900">{info.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Kích thước & Trọng lượng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Chiều dài (cm)
              </label>
              <p className="mt-1 text-gray-900">{product.length}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Chiều rộng (cm)
              </label>
              <p className="mt-1 text-gray-900">{product.width}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Chiều cao (cm)
              </label>
              <p className="mt-1 text-gray-900">{product.height}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Trọng lượng (g)
              </label>
              <p className="mt-1 text-gray-900">{product.weight}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      {!_.isEmpty(product.variants) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Phân loại hàng ({_.size(product.variants)} biến thể)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Options */}
            {_.map(product.options, (option) => (
              <div key={option.name}>
                <label className="text-sm font-medium text-gray-700">
                  {option.name} (Level {option.level})
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {_.map(option.values, (value) => (
                    <div
                      key={value.id}
                      className="flex items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1.5"
                    >
                      {value.imgUrl && (
                        <div className="relative h-6 w-6 overflow-hidden rounded border border-gray-200">
                          <Image
                            src={value.imgUrl}
                            alt={value.value}
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        </div>
                      )}
                      <span className="text-xs">{value.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-2 text-left text-sm font-medium">STT</th>
                    <th className="p-2 text-left text-sm font-medium">
                      Phân loại
                    </th>
                    <th className="p-2 text-right text-sm font-medium">Giá</th>
                    <th className="p-2 text-right text-sm font-medium">
                      Số lượng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(product.variants, (variant, index) => (
                    <tr key={variant.id} className="border-b">
                      <td className="p-2 text-sm">{index + 1}</td>
                      <td className="p-2 text-sm">
                        {_.map(variant.propertyValueIds, (valueId) => {
                          const option = _.find(product.options, (opt) =>
                            _.some(opt.values, { id: valueId })
                          );
                          const value = _.find(option?.values, { id: valueId });
                          return value?.value;
                        }).join(" - ")}
                      </td>
                      <td className="p-2 text-right text-sm font-semibold">
                        {formatPrice(variant.price)}
                      </td>
                      <td className="p-2 text-right text-sm">
                        {variant.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
