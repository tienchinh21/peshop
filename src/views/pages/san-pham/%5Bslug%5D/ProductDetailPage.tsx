"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useProductDetail } from "@/hooks/user/useProducts";
import { ProductImageGallery } from "./components/ProductImageGallery";
import { ProductInfoSection } from "./components/ProductInfoSection";
import { ShopInfoCard } from "./components/ShopInfoCard";
import { BreadcrumbNavigation } from "./components/BreadcrumbNavigation";
import { SimilarProducts } from "./components/SimilarProducts";
import { PromotionGiftSection } from "./components/PromotionGiftSection";
import { PromotionRequirementSection } from "./components/PromotionRequirementSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sanitizeHtml } from "@/lib/utils/html.utils";
import { ProductSkeleton } from "@/components/skeleton";
import { ProductDetailSkeleton } from "@/components/skeleton/ProductSkeleton";
import { SectionContainer } from "@/components/common";

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage = ({ slug }: ProductDetailPageProps) => {
  const searchParams = useSearchParams();
  const hasPromotionParam = searchParams.get("hasPromotion") === "true";

  const { data: product, isLoading, error } = useProductDetail(slug);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const allImages = useMemo(() => {
    if (!product) return [];

    const images: string[] = [];

    if (product.imgMain) {
      images.push(product.imgMain);
    }

    if (product.imgList && product.imgList.length > 0) {
      product.imgList.forEach((img) => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }

    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant) => {
        variant.variantValues.forEach((vv) => {
          if (
            vv.propertyValue.level === 0 &&
            vv.propertyValue.imgUrl &&
            !images.includes(vv.propertyValue.imgUrl)
          ) {
            images.push(vv.propertyValue.imgUrl);
          }
        });
      });
    }

    return images.length > 0 ? images : ["/placeholder-product.png"];
  }, [product]);

  const handleVariantChange = (variantIndex: number) => {
    setSelectedVariantIndex(variantIndex);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Không tìm thấy sản phẩm
          </h1>
          <p className="mt-2 text-gray-600">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
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

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
          <ProductImageGallery
            images={allImages}
            productName={product.productName}
          />
          <PromotionGiftSection
            productId={product.productId}
            hasPromotion={hasPromotionParam}
          />
          <PromotionRequirementSection
            productId={product.productId}
            hasPromotion={hasPromotionParam}
          />
        </div>

        <div className="lg:col-span-7">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-3 flex flex-col gap-6">
              <ProductInfoSection
                product={product}
                onVariantChange={handleVariantChange}
              />
              <ShopInfoCard product={product} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
            <TabsTrigger value="reviews">
              Đánh giá ({product.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
            <TabsTrigger value="policies">Chính sách</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(product.description),
              }}
            />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="text-center text-gray-600">
              Chức năng đánh giá đang được phát triển
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="text-center text-gray-600">
              Thông số kỹ thuật đang được cập nhật
            </div>
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Chính sách đổi trả</h3>
                <p className="text-gray-600">
                  Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Chính sách bảo hành</h3>
                <p className="text-gray-600">
                  Bảo hành 12 tháng theo chính sách nhà sản xuất
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Chính sách vận chuyển</h3>
                <p className="text-gray-600">
                  Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12">
        <SimilarProducts productId={product.productId} />
    </div>
    </SectionContainer>
  );
};
