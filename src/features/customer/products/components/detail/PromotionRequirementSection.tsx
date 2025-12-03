"use client";

import { Gift, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { useProductPromotions } from "../../hooks";
import { isEmpty, filter, get, map, last } from "lodash";
import Image from "next/image";

interface PromotionRequirementSectionProps {
  productId: string;
  hasPromotion: boolean;
}

export const PromotionRequirementSection = ({
  productId,
  hasPromotion,
}: PromotionRequirementSectionProps) => {
  const { data: promotions, isLoading } = useProductPromotions(
    productId,
    hasPromotion
  );

  if (isLoading || !promotions || isEmpty(promotions)) {
    return null;
  }

  const requirementPromotions = filter(
    promotions,
    (p) => !isEmpty(get(p, "products", []))
  );

  if (isEmpty(requirementPromotions)) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Khuyến mãi combo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {map(requirementPromotions, (promotion) => {
          const giftProduct = get(promotion, "promotionGifts.product");
          const giftQuantity = get(promotion, "promotionGifts.giftQuantity", 0);
          const requiredProducts = get(promotion, "products", []);

          if (!giftProduct) return null;

          return (
            <div key={promotion.promotionId} className="space-y-3">
              <p className="font-semibold text-sm">{promotion.promotionName}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Mua kèm:</span>
                </div>
                {map(requiredProducts, (product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-2 pl-6"
                  >
                    <div className="relative w-12 h-12 rounded border overflow-hidden shrink-0">
                      <Image
                        src={product.image || "/placeholder-product.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm flex-1 min-w-0 line-clamp-2">
                      <span className="font-semibold">{product.quantity}x</span>{" "}
                      {product.name}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gift className="w-4 h-4" />
                  <span>Nhận quà:</span>
                </div>
                <div className="flex gap-3 pl-6">
                  <div className="relative w-16 h-16 rounded border overflow-hidden shrink-0">
                    <Image
                      src={giftProduct.image || "/placeholder-product.svg"}
                      alt={giftProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2 mb-1">
                      {giftQuantity}x {giftProduct.name}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(giftProduct.price * giftQuantity)}
                    </p>
                  </div>
                </div>
              </div>

              {promotion !== last(requirementPromotions) && (
                <Separator className="mt-4" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
