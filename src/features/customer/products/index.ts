/**
 * Products Feature Module
 *
 * This is the main barrel export for the customer products feature module.
 * It re-exports everything from subdirectories for convenient importing.
 *
 * Usage:
 * import { ProductsPageClient, useProducts, getProducts } from '@/features/customer/products';
 */

// Components
export {
  ProductsPageClient,
  ProductGrid,
  ProductsPagination,
  BreadcrumbNavigation,
  ProductImageGallery,
  ProductInfoSection,
  ShopInfoCard,
  ProductTabs,
  PromotionGiftSection,
  PromotionRequirementSection,
  SimilarProducts,
  ProductDetailClient,
  ProductDetailPage,
} from "./components";

// Hooks
export {
  productKeys,
  useProducts,
  useInfiniteProducts,
  useProduct,
  useProductDetail,
  usePrefetchProduct,
  usePrefetchProductWithDebounce,
  useInvalidateProducts,
  useProductPromotions,
  useOrderPromotions,
  useSimilarProducts,
} from "./hooks";

// Services - Client
export {
  getProducts,
  searchProducts,
  getProductBySlug,
  getProductDetail,
  getSimilarProducts,
  getPromotionsByProduct,
  checkPromotionsInOrder,
} from "./services";

// Services - Server
export {
  getProductsServer,
  getProductDetailCached,
  getProductsServerCached,
  getTopProductSlugs,
  getTopShopIds,
} from "./services";

// Types
export type {
  Product,
  PropertyValue,
  Property,
  VariantValue,
  ProductVariantDetail,
  ProductDetail,
  ProductDetailApiResponse,
  PaginatedProductsData,
  ProductsApiResponse,
  ProductFilters,
  PromotionProduct,
  PromotionGiftProduct,
  PromotionGift,
  ProductPromotion,
  ProductPromotionsResponse,
  OrderPromotion,
} from "./types";

// Utils
export {
  transformVariantsForAPI,
  validateProductData,
  isValidProduct,
  filterValidProducts,
  getProductKey,
} from "./utils";
