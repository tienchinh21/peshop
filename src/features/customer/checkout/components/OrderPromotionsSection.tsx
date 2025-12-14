"use client";

import { Gift, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { useOrderPromotions } from "@/features/customer/products";
import { isEmpty, filter, get, map, last } from "lodash";
import Image from "next/image";
interface OrderPromotionsSectionProps {
  orderId: string | null;
}
export const OrderPromotionsSection = ({
  orderId
}: OrderPromotionsSectionProps) => {
  const {
    data: promotions,
    isLoading
  } = useOrderPromotions(orderId);
  if (isLoading || !promotions || isEmpty(promotions)) {
    return null;
  }
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };
  const freeGiftPromotions = filter(promotions, p => isEmpty(get(p, "products", [])));
  const requirementPromotions = filter(promotions, p => !isEmpty(get(p, "products", [])));
  return <div className="space-y-4">
      {!isEmpty(freeGiftPromotions) && <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Quà tặng kèm đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {map(freeGiftPromotions, (promotion) => {
              const gifts = get(promotion, "promotionGiftsList", []);
              if (isEmpty(gifts)) return null;
              return (
                <div key={promotion.promotionId} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm">{promotion.promotionName}</p>
                    <Badge variant="secondary" className="shrink-0">Miễn phí</Badge>
                  </div>

                  <div className="space-y-3">
                    {map(gifts, (gift) => (
                      <div key={gift.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded border overflow-hidden shrink-0">
                          <Image src={gift.product.image || "/placeholder-product.svg"} alt={gift.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                            {gift.giftQuantity}x {gift.product.name}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            {formatPrice(gift.product.price * gift.giftQuantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>}

      {!isEmpty(requirementPromotions) && <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Khuyến mãi combo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {map(requirementPromotions, (promotion) => {
              const requiredProducts = get(promotion, "products", []);
              const gifts = get(promotion, "promotionGiftsList", []);
              if (isEmpty(gifts)) return null;
              return (
                <div key={promotion.promotionId} className="space-y-3">
                  <p className="font-semibold text-sm">{promotion.promotionName}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Sản phẩm trong combo:</span>
                    </div>
                    {map(requiredProducts, (product) => (
                      <div key={product.id} className="flex items-center gap-2 pl-6">
                        <div className="relative w-12 h-12 rounded border overflow-hidden shrink-0">
                          <Image src={product.image || "/placeholder-product.svg"} alt={product.name} fill className="object-cover" />
                        </div>
                        <p className="text-sm flex-1 min-w-0 line-clamp-2">
                          <span className="font-semibold">{product.quantity}x</span> {product.name}
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
                    <div className="space-y-3 pl-6">
                      {map(gifts, (gift) => (
                        <div key={gift.id} className="flex gap-3">
                          <div className="relative w-16 h-16 rounded border overflow-hidden shrink-0">
                            <Image src={gift.product.image || "/placeholder-product.svg"} alt={gift.product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm line-clamp-2 mb-1">
                              {gift.giftQuantity}x {gift.product.name}
                            </p>
                            <p className="text-sm font-semibold text-primary">
                              {formatPrice(gift.product.price * gift.giftQuantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {promotion !== last(requirementPromotions) && <Separator className="mt-4" />}
                </div>
              );
            })}
          </CardContent>
        </Card>}
    </div>;
};
