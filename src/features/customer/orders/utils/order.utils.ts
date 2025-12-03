import _ from "lodash";
import type { OrderProductItemPayload } from "../types";

interface CartItem {
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  shopId: string;
}

export const mapCartItemsToOrderPayload = (
  items: CartItem[]
): OrderProductItemPayload[] => {
  return items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId ? _.toNumber(item.variantId) : 0,
    note: "",
    quantity: item.quantity,
    priceOriginal: item.price,
    categoryId: "",
    shopId: item.shopId,
  }));
};

export const groupItemsByShop = <T extends { shopId: string }>(items: T[]) => {
  return _.groupBy(items, "shopId");
};
