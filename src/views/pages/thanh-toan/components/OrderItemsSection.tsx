import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Store } from "lucide-react";
import _ from "lodash";
import type { CartItem } from "@/types/users/cart.types";

interface OrderItemsSectionProps {
  items: CartItem[];
  formatPrice: (price: number) => string;
}

export function OrderItemsSection({
  items,
  formatPrice,
}: OrderItemsSectionProps) {
  const groupedByShop = _.groupBy(items, "shopId");

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sản phẩm đặt hàng</h3>

        <div className="space-y-6">
          {Object.entries(groupedByShop).map(([shopId, shopItems]) => {
            const shopName = _.get(shopItems, "[0].shopName", "Cửa hàng");

            return (
              <div key={shopId} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Store className="w-4 h-4 text-purple-600" />
                  <Link
                    href={`/shop/${shopId}`}
                    className="font-medium text-gray-900 hover:text-purple-600"
                  >
                    {shopName}
                  </Link>
                </div>

                <div className="space-y-3">
                  {shopItems.map((item) => (
                    <div key={item.cartId} className="flex gap-3">
                      <Link
                        href={`/san-pham/${item.slug}`}
                        className="flex-shrink-0"
                      >
                        <Image
                          src={item.productImage || "/placeholder.png"}
                          alt={item.productName}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/san-pham/${item.slug}`}
                          className="text-sm font-medium text-gray-900 hover:text-purple-600 line-clamp-2"
                        >
                          {item.productName}
                        </Link>

                        {item.variantValues &&
                          item.variantValues.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.variantValues
                                .map((vv) =>
                                  _.get(vv, "propertyValue.value", "")
                                )
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold text-purple-600">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-sm text-gray-600">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

