import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
import Link from "next/link";
import type { ShopProductDetailResponse } from "@/features/shop/products/types";
interface ProductDetailPageServerProps {
  productId: string;
  initialData: ShopProductDetailResponse;
}
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
export function ProductDetailPageServer({
  productId,
  initialData,
}: ProductDetailPageServerProps) {
  const product = _.get(initialData, "content");
  if (!product) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy thông tin sản phẩm</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/shop/san-pham">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.productName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              ID: {productId} • {getStatusBadge(product.status)}
            </p>
          </div>
        </div>
        <Link href={`/shop/san-pham/sua/${productId}`}>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Hình ảnh sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((image: any, index: number) => (
                <div
                  key={index}
                  className="aspect-square relative rounded-lg overflow-hidden border"
                >
                  <Image
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Chưa có hình ảnh
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Danh mục
            </label>
            <p className="mt-1 text-gray-900">
              {product.categoryChildName || "Chưa có danh mục"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <p className="mt-1">{getStatusBadge(product.status)}</p>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Mô tả</label>
            {product.description ? (
              <div
                className="mt-1 text-gray-900 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="mt-1 text-gray-500">Chưa có mô tả</p>
            )}
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Thông tin bán hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.variants && product.variants.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Sản phẩm có {product.variants.length} biến thể
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Biến thể
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Giá
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Tồn kho
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.variants.map((variant: any) => (
                      <tr key={variant.id}>
                        <td className="px-4 py-2 text-sm">
                          {variant.variantValues
                            ?.map((vv: any) => vv.propertyValue.value)
                            .join(" - ") || "Mặc định"}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium">
                          {formatPrice(variant.price)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {variant.quantity || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Giá bán
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tồn kho
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.quantity || 0}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Thông tin bổ sung
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Khối lượng
            </label>
            <p className="mt-1 text-gray-900">
              {product.weight ? `${product.weight}g` : "Chưa có thông tin"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Kích thước
            </label>
            <p className="mt-1 text-gray-900">
              {product.length && product.width && product.height
                ? `${product.length} x ${product.width} x ${product.height} cm`
                : "Chưa có thông tin"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default ProductDetailPageServer;
