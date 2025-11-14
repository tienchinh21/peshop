"use client";

import { Gift, ShoppingCart, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProductPromotions } from "@/hooks/user/useProducts";
import _ from "lodash";
import Image from "next/image";

interface PromotionSectionProps {
  productId: string;
  hasPromotion: boolean;
}

export const PromotionSection = ({
  productId,
  hasPromotion,
}: PromotionSectionProps) => {
  const { data: promotions, isLoading } = useProductPromotions(
    productId,
    hasPromotion
  );

  if (isLoading) {
    return null;
  }

  if (!promotions || _.isEmpty(promotions)) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-5 h-5 text-red-600" />
        <h3 className="font-semibold text-gray-900">Khuyến mãi đặc biệt</h3>
      </div>

      <div className="space-y-4">
        {_.map(promotions, (promotion) => {
          const giftProduct = _.get(promotion, "promotionGifts.product");
          const giftQuantity = _.get(
            promotion,
            "promotionGifts.giftQuantity",
            0
          );
          const requiredProducts = _.get(promotion, "products", []);
          const hasRequirements = !_.isEmpty(requiredProducts);

          return (
            <div
              key={promotion.promotionId}
              className="bg-white rounded-lg p-4 border border-red-200 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {promotion.promotionName}
                  </h4>
                  {!hasRequirements && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Tặng kèm miễn phí
                    </Badge>
                  )}
                </div>
              </div>

              {hasRequirements && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Điều kiện:
                    </span>
                  </div>
                  <div className="space-y-2">
                    {_.map(requiredProducts, (product, index) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-10 h-10 relative rounded border border-gray-200 overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image || "/placeholder-product.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-700 line-clamp-1">
                            Mua <span className="font-semibold text-blue-600">{product.quantity}x</span>{" "}
                            {product.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {giftProduct && (
                <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-900">
                      Quà tặng:
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-lg border-2 border-orange-300 overflow-hidden flex-shrink-0">
                      <Image
                        src={giftProduct.image || "/placeholder-product.svg"}
                        alt={giftProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {giftQuantity}x {giftProduct.name}
                      </p>
                      <p className="text-xs text-orange-600 font-semibold">
                        Trị giá: {formatPrice(giftProduct.price * giftQuantity)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

