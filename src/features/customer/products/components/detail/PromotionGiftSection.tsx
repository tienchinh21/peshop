"use client";

import { Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useProductPromotions } from "../../hooks";
import { isEmpty, filter, get, map } from "lodash";
import Image from "next/image";
interface PromotionGiftSectionProps {
  productId: string;
}
export const PromotionGiftSection = ({
  productId
}: PromotionGiftSectionProps) => {
  const {
    data: promotions,
    isLoading
  } = useProductPromotions(productId);
  if (isLoading || !promotions || isEmpty(promotions)) {
    return null;
  }
  const freeGiftPromotions = filter(promotions, p => isEmpty(get(p, "products", [])));
  if (isEmpty(freeGiftPromotions)) {
    return null;
  }
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };
  return <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Quà tặng kèm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {map(freeGiftPromotions, promotion => {
        const gifts = get(promotion, "promotionGiftsList", []);
        const fallbackGiftProduct = get(promotion, "promotionGifts.product");
        const fallbackGiftQuantity = get(promotion, "promotionGifts.giftQuantity", 0);
        const renderGifts = gifts && gifts.length > 0 ? gifts : (fallbackGiftProduct ? [{ id: get(promotion, "promotionGifts.id"), giftQuantity: fallbackGiftQuantity, product: fallbackGiftProduct }] : []);
        if (renderGifts.length === 0) return null;
        return <div key={promotion.promotionId} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm">{promotion.promotionName}</p>
                <Badge variant="secondary" className="shrink-0">
                  Miễn phí
                </Badge>
              </div>

              <div className="space-y-3">
                {map(renderGifts, (gift) => (
                  <div key={gift.id} className="flex gap-3">
                    <div className="relative w-20 h-20 rounded border overflow-hidden shrink-0">
                      <Image src={get(gift, "product.image", "/placeholder-product.svg")} alt={get(gift, "product.name", "Quà tặng")} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                        {get(gift, "giftQuantity", 0)}x {get(gift, "product.name", "")}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice((get(gift, "product.price", 0) || 0) * (get(gift, "giftQuantity", 0) || 0))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>;
      })}
      </CardContent>
    </Card>;
};
