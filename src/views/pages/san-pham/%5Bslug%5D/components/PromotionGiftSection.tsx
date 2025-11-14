"use client";

import { IconGift } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProductPromotions } from "@/hooks/user/useProducts";
import _ from "lodash";
import Image from "next/image";

interface PromotionGiftSectionProps {
  productId: string;
  hasPromotion: boolean;
}

export const PromotionGiftSection = ({
  productId,
  hasPromotion,
}: PromotionGiftSectionProps) => {
  const { data: promotions, isLoading } = useProductPromotions(
    productId,
    hasPromotion
  );

  if (isLoading || !promotions || _.isEmpty(promotions)) {
    return null;
  }

  const freeGiftPromotions = _.filter(
    promotions,
    (p) => _.isEmpty(_.get(p, "products", []))
  );

  if (_.isEmpty(freeGiftPromotions)) {
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
          <IconGift className="w-5 h-5 text-primary" />
          Quà tặng kèm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {_.map(freeGiftPromotions, (promotion) => {
          const giftProduct = _.get(promotion, "promotionGifts.product");
          const giftQuantity = _.get(
            promotion,
            "promotionGifts.giftQuantity",
            0
          );

          if (!giftProduct) return null;

          return (
            <div
              key={promotion.promotionId}
              className="border rounded-lg p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm">{promotion.promotionName}</p>
                <Badge variant="secondary" className="shrink-0">
                  Miễn phí
                </Badge>
              </div>

              <div className="flex gap-3">
                <div className="relative w-20 h-20 rounded border overflow-hidden shrink-0">
                  <Image
                    src={giftProduct.image || "/placeholder-product.svg"}
                    alt={giftProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                    {giftQuantity}x {giftProduct.name}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {formatPrice(giftProduct.price * giftQuantity)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

