"use client";

import { Gift, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { useProductPromotions } from "../../hooks";
import { isEmpty, filter, get, map, last } from "lodash";
import Image from "next/image";
interface PromotionRequirementSectionProps {
  productId: string;
}
export const PromotionRequirementSection = ({
  productId
}: PromotionRequirementSectionProps) => {
  const {
    data: promotions,
    isLoading
  } = useProductPromotions(productId);
  if (isLoading || !promotions || isEmpty(promotions)) {
    return null;
  }
  const requirementPromotions = filter(promotions, p => !isEmpty(get(p, "products", [])));
  if (isEmpty(requirementPromotions)) {
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
          Khuyến mãi combo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {map(requirementPromotions, promotion => {
        const gifts = get(promotion, "promotionGiftsList", []);
        const fallbackGiftProduct = get(promotion, "promotionGifts.product");
        const fallbackGiftQuantity = get(promotion, "promotionGifts.giftQuantity", 0);
        const renderGifts = gifts && gifts.length > 0 ? gifts : (fallbackGiftProduct ? [{ id: get(promotion, "promotionGifts.id"), giftQuantity: fallbackGiftQuantity, product: fallbackGiftProduct }] : []);
        const requiredProducts = get(promotion, "products", []);
        if (renderGifts.length === 0) return null;
        return <div key={promotion.promotionId} className="space-y-3">
              <p className="font-semibold text-sm">{promotion.promotionName}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Mua kèm:</span>
                </div>
                {map(requiredProducts, product => <div key={product.id} className="flex items-center gap-2 pl-6">
                    <div className="relative w-12 h-12 rounded border overflow-hidden shrink-0">
                      <Image src={product.image || "/placeholder-product.svg"} alt={product.name} fill className="object-cover" />
                    </div>
                    <p className="text-sm flex-1 min-w-0 line-clamp-2">
                      <span className="font-semibold">{product.quantity}x</span>{" "}
                      {product.name}
                    </p>
                  </div>)}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gift className="w-4 h-4" />
                  <span>Nhận quà:</span>
                </div>
                <div className="space-y-3 pl-6">
                  {map(renderGifts, (gift) => (
                    <div key={gift.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded border overflow-hidden shrink-0">
                        <Image src={get(gift, "product.image", "/placeholder-product.svg")} alt={get(gift, "product.name", "Quà tặng")} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2 mb-1">
                          {get(gift, "giftQuantity", 0)}x {get(gift, "product.name", "")}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice((get(gift, "product.price", 0) || 0) * (get(gift, "giftQuantity", 0) || 0))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {promotion !== last(requirementPromotions) && <Separator className="mt-4" />}
            </div>;
      })}
      </CardContent>
    </Card>;
};
