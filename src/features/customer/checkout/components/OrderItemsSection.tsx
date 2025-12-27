import { ProductImage } from "@/shared/components/ui/product-image";
import Link from "next/link";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Store } from "lucide-react";
import { groupBy, get, keyBy } from "lodash";
import type { CartItem } from "@/features/customer/cart";
import type {
  OrderShopItem,
  OrderProductItem,
} from "@/features/customer/orders";

interface EnrichedOrderProduct extends OrderProductItem {
  productName?: string;
  productImage?: string;
  slug?: string;
}

interface AddedProductInfo {
  name: string;
  image: string;
  slug?: string;
}

interface OrderItemsSectionProps {
  items?: CartItem[];
  orderShops?: OrderShopItem[];
  addedProductsInfo?: Record<string, AddedProductInfo>;
  formatPrice: (price: number) => string;
}
export function OrderItemsSection({
  items = [],
  orderShops = [],
  addedProductsInfo = {},
  formatPrice,
}: OrderItemsSectionProps) {
  const useOrder = orderShops && orderShops.length > 0;

  const cartItemsMap = keyBy(items, "productId");

  const groupedByShop = useOrder
    ? groupBy(orderShops, "shopId")
    : groupBy(items, "shopId");

  const enrichProduct = (prod: OrderProductItem): EnrichedOrderProduct => {
    const cartItem = cartItemsMap[prod.productId];
    const addedInfo = addedProductsInfo[prod.productId];

    return {
      ...prod,
      productName: cartItem?.productName || addedInfo?.name || prod.productId,
      productImage:
        cartItem?.productImage || addedInfo?.image || "/placeholder.png",
      slug: cartItem?.slug || addedInfo?.slug,
    };
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sản phẩm đặt hàng</h3>

        <div className="space-y-6">
          {Object.entries(groupedByShop).map(([shopId, shopItems]) => {
            const shopName = get(shopItems, "[0].shopName", "Cửa hàng");
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
                  {useOrder
                    ? (shopItems as OrderShopItem[])
                        .flatMap((shop) => shop.products)
                        .map((prod) => {
                          const enriched = enrichProduct(prod);
                          return (
                            <div
                              key={`${prod.productId}-${prod.variantId ?? "0"}`}
                              className="flex gap-3"
                            >
                              <div className="flex-shrink-0">
                                {enriched.slug ? (
                                  <Link href={`/san-pham/${enriched.slug}`}>
                                    <ProductImage
                                      src={
                                        enriched.productImage ||
                                        "/placeholder.png"
                                      }
                                      alt={enriched.productName || ""}
                                      width={60}
                                      height={60}
                                      className="rounded object-cover"
                                    />
                                  </Link>
                                ) : (
                                  <ProductImage
                                    src={
                                      enriched.productImage ||
                                      "/placeholder.png"
                                    }
                                    alt={enriched.productName || ""}
                                    width={60}
                                    height={60}
                                    className="rounded object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                {enriched.slug ? (
                                  <Link
                                    href={`/san-pham/${enriched.slug}`}
                                    className="text-sm font-medium text-gray-900 hover:text-purple-600 line-clamp-2"
                                  >
                                    {enriched.productName}
                                  </Link>
                                ) : (
                                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {enriched.productName}
                                  </p>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sm font-semibold text-purple-600">
                                    {formatPrice(prod.priceOriginal)}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    x{prod.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    : (shopItems as CartItem[]).map((item) => (
                        <div key={item.cartId} className="flex gap-3">
                          <Link
                            href={`/san-pham/${item.slug}`}
                            className="flex-shrink-0"
                          >
                            <ProductImage
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
                                      get(vv, "propertyValue.value", "")
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
