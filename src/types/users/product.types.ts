export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  boughtCount: number;
  addressShop: string;
  slug: string;
  shopName: string;
  shopId?: string;
  reviewCount: number;
  reviewPoint: number;
  hasPromotion: boolean;
}

// Product Detail Types (for Quick View and Detail Page)
export interface PropertyValue {
  propertyName: string;
  imgUrl: string;
  level: number;
  value: string;
}

export interface Property {
  name: string;
}

export interface VariantValue {
  propertyValue: PropertyValue;
  property: Property;
}

export interface ProductVariantDetail {
  variantId: string;
  price: number;
  quantity: number;
  status: number;
  statusText?: string;
  variantValues: VariantValue[];
}

export interface ProductDetail {
  productId: string;
  productName: string;
  description: string;
  price: number;
  slug: string;
  shopName: string;
  shopId: string;
  imgMain: string;
  imgList: string[];
  boughtCount: number;
  reviewCount: number;
  reviewPoint: number;
  likeCount: number;
  viewCount: number;
  variants: ProductVariantDetail[];
}

export interface ProductDetailApiResponse {
  error: string | null;
  data: ProductDetail;
}

export interface PaginatedProductsData {
  products: Product[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface ProductsApiResponse {
  error: string | null;
  data: PaginatedProductsData;
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  keyword?: string;
  categoryId?: string;
  categoryChildId?: string;
  minPrice?: number;
  maxPrice?: number;
  reviewPoint?: number;
}

export interface PromotionProduct {
  quantity: number;
  id: string;
  name: string;
  image: string;
  reviewCount: number;
  reviewPoint: number;
  price: number;
  boughtCount: number;
  addressShop: string;
  slug: string;
  shopId: string;
  shopName: string;
  hasPromotion: boolean | null;
}

export interface PromotionGiftProduct {
  id: string;
  name: string;
  image: string;
  reviewCount: number;
  reviewPoint: number;
  price: number;
  boughtCount: number;
  addressShop: string;
  slug: string;
  shopId: string;
  shopName: string;
  hasPromotion: boolean | null;
}

export interface PromotionGift {
  id: string;
  giftQuantity: number;
  product: PromotionGiftProduct;
}

export interface ProductPromotion {
  promotionId: string;
  promotionName: string;
  products: PromotionProduct[];
  promotionGifts: PromotionGift;
}

export interface ProductPromotionsResponse {
  error: string | null;
  data: ProductPromotion[];
}

export interface OrderPromotion {
  promotionId: string;
  promotionName: string;
  products: PromotionProduct[];
  promotionGifts: PromotionGift;
  shopId: string;
}
