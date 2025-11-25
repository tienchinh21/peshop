/**
 * Product detail types for shop management
 */

export interface ProductImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface ProductInformation {
  id: number;
  name: string;
  value: string;
}

export interface PropertyValue {
  id: string;
  value: string;
  imgUrl: string | null;
}

export interface ProductOption {
  name: string;
  level: number;
  values: PropertyValue[];
}

export interface ProductVariantDetail {
  id: number;
  price: number;
  quantity: number;
  propertyValueIds: string[];
}

export interface ShopProductDetail {
  priceOriginal(priceOriginal: any): import("react").ReactNode;
  id: string;
  name: string;
  description: string;
  price: number | null;
  imgMain: string;
  status: number;
  categoryChildId: string;
  categoryChildName: string;
  productName: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  images: ProductImage[];
  productInformations: ProductInformation[];
  options: ProductOption[];
  variants: ProductVariantDetail[];
  quantity?: number;
}

export interface ShopProductDetailResponse {
  error: string | null;
  content: ShopProductDetail;
}

