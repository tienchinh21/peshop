import { axiosDotnet } from "@/lib/config/axios.config";
import _ from "lodash";
import type { GetShopResponse, ShopData } from "../types";
import type { Product, ProductsApiResponse } from "@/features/customer/products";


export const getShop = async (shopId: string): Promise<ShopData | null> => {
  const response = await axiosDotnet.get<GetShopResponse>(`/Shop/get-shop-detail?shopId=${shopId}`);
  return _.get(response, "data.data", null);
};

export const getProductByShopId = async (shopId: string): Promise<Product[] | null> => {
  const response = await axiosDotnet.get<ProductsApiResponse>(`/Product/get-products-by-shop?ShopId=${shopId}`);
  return _.get(response, "data.data.data", null);
};
