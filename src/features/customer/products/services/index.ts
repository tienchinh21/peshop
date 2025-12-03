// Client-side services
export {
  getProducts,
  searchProducts,
  getProductBySlug,
  getProductDetail,
  getSimilarProducts,
  getPromotionsByProduct,
  checkPromotionsInOrder,
} from "./product.service";

// Server-side services
export {
  getProductsServer,
  getProductDetailCached,
  getProductsServerCached,
  getTopProductSlugs,
  getTopShopIds,
} from "./product.server";
