"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfoSection } from "./ProductInfoSection";
import { ShopInfoCard } from "./ShopInfoCard";
import { PromotionGiftSection } from "./PromotionGiftSection";
import { PromotionRequirementSection } from "./PromotionRequirementSection";
import type { ProductDetail } from "../../types";
interface ProductDetailClientProps {
  slug: string;
  initialData: ProductDetail;
}
const extractProductImages = (product: any): string[] => {
  const imageSet = new Set<string>();
  if (product.imgMain) imageSet.add(product.imgMain);
  product.imgList?.forEach((img: string) => img && imageSet.add(img));
  product.variants?.forEach((variant: any) => {
    variant.variantValues.filter((vv: any) => vv.propertyValue.level === 0 && vv.propertyValue.imgUrl).forEach((vv: any) => imageSet.add(vv.propertyValue.imgUrl));
  });
  const images = Array.from(imageSet);
  return images.length > 0 ? images : ["/placeholder-product.png"];
};
export const ProductDetailClient = ({
  slug,
  initialData
}: ProductDetailClientProps) => {
  const searchParams = useSearchParams();
  const hasPromotionParam = searchParams.get("hasPromotion") === "true";
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const product = initialData;
  const allImages = useMemo(() => {
    return extractProductImages(product);
  }, [product]);
  const handleVariantChange = (variantIndex: number) => {
    setSelectedVariantIndex(variantIndex);
  };
  return <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5 space-y-6">
        <ProductImageGallery images={allImages} productName={product.productName} />
        <PromotionGiftSection productId={product.productId} hasPromotion={hasPromotionParam} />
        <PromotionRequirementSection productId={product.productId} hasPromotion={hasPromotionParam} />
      </div>

      <div className="lg:col-span-7">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <ProductInfoSection product={product} onVariantChange={handleVariantChange} />
            <ShopInfoCard product={product} />
          </div>
        </div>
      </div>
    </div>;
};