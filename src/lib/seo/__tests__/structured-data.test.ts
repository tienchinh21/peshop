import { generateProductSchema, generateAggregateRating, generateShopSchema, generateBreadcrumbSchema, generateOrganizationSchema, generateWebSiteSchema, serializeSchema } from '../structured-data';
import type { ProductDetail } from '@/features/customer/products';
import type { ShopData } from '@/features/customer/shop-view';
console.log('=== Testing Product Schema ===');
const mockProduct: ProductDetail = {
  productId: 'prod-123',
  productName: 'iPhone 15 Pro Max 256GB',
  description: '<p>iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP, màn hình Super Retina XDR 6.7 inch</p>',
  price: 29990000,
  slug: 'iphone-15-pro-max-256gb',
  shopName: 'Apple Store Vietnam',
  shopId: 'shop-456',
  imgMain: 'https://example.com/iphone-15-pro-max.jpg',
  imgList: ['https://example.com/iphone-15-pro-max-2.jpg', 'https://example.com/iphone-15-pro-max-3.jpg'],
  boughtCount: 500,
  reviewCount: 1250,
  reviewPoint: 4.8,
  likeCount: 3000,
  viewCount: 50000,
  variants: [{
    variantId: 'var-1',
    price: 29990000,
    quantity: 10,
    status: 1,
    variantValues: []
  }, {
    variantId: 'var-2',
    price: 34990000,
    quantity: 5,
    status: 1,
    variantValues: []
  }]
};
const productSchema = generateProductSchema(mockProduct, 'https://peshop.vn/san-pham/iphone-15-pro-max-256gb');
console.log('Product Schema:', JSON.stringify(productSchema, null, 2));
console.log('\n');
console.log('=== Testing Product Schema (Single Variant) ===');
const singleVariantProduct: ProductDetail = {
  ...mockProduct,
  variants: [{
    variantId: 'var-1',
    price: 29990000,
    quantity: 10,
    status: 1,
    variantValues: []
  }]
};
const singleVariantSchema = generateProductSchema(singleVariantProduct, 'https://peshop.vn/san-pham/iphone-15-pro-max-256gb');
console.log('Single Variant Product Schema:', JSON.stringify(singleVariantSchema, null, 2));
console.log('\n');
console.log('=== Testing Product Schema (No Reviews) ===');
const noReviewProduct: ProductDetail = {
  ...mockProduct,
  reviewCount: 0,
  reviewPoint: 0
};
const noReviewSchema = generateProductSchema(noReviewProduct, 'https://peshop.vn/san-pham/iphone-15-pro-max-256gb');
console.log('No Review Product Schema:', JSON.stringify(noReviewSchema, null, 2));
console.log('\n');
console.log('=== Testing AggregateRating ===');
const aggregateRating = generateAggregateRating(4.8, 1250);
console.log('Aggregate Rating:', JSON.stringify(aggregateRating, null, 2));
console.log('\n');
console.log('=== Testing Shop Schema ===');
const mockShop: ShopData = {
  id: 'shop-456',
  name: 'Apple Store Vietnam',
  address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  description: 'Cửa hàng chính hãng Apple tại Việt Nam. Sản phẩm chính hãng, bảo hành toàn cầu.',
  logo: '/shops/apple-logo.jpg',
  newProviceId: '79',
  productCount: 150,
  followersCount: 5000
};
const shopSchema = generateShopSchema(mockShop, 'https://peshop.vn/shop-view/apple-store-vietnam');
console.log('Shop Schema:', JSON.stringify(shopSchema, null, 2));
console.log('\n');
console.log('=== Testing Breadcrumb Schema ===');
const breadcrumbSchema = generateBreadcrumbSchema([{
  name: 'Trang chủ',
  url: '/'
}, {
  name: 'Sản phẩm',
  url: '/san-pham'
}, {
  name: 'Điện thoại',
  url: '/san-pham?category=dien-thoai'
}, {
  name: 'iPhone 15 Pro Max'
}]);
console.log('Breadcrumb Schema:', JSON.stringify(breadcrumbSchema, null, 2));
console.log('\n');
console.log('=== Testing Organization Schema ===');
const organizationSchema = generateOrganizationSchema();
console.log('Organization Schema:', JSON.stringify(organizationSchema, null, 2));
console.log('\n');
console.log('=== Testing WebSite Schema ===');
const websiteSchema = generateWebSiteSchema();
console.log('WebSite Schema:', JSON.stringify(websiteSchema, null, 2));
console.log('\n');
console.log('=== Testing serializeSchema ===');
const serialized = serializeSchema(productSchema);
console.log('Serialized Schema (first 200 chars):', serialized.substring(0, 200) + '...');
console.log('\n');
console.log('=== Verification Checks ===');
const hasProductRequiredFields = (schema: any) => {
  return schema['@context'] === 'https://schema.org' && schema['@type'] === 'Product' && schema.name && schema.image && schema.description && schema.sku && schema.brand && schema.offers;
};
console.log('✓ Product schema has required fields:', hasProductRequiredFields(productSchema));
console.log('✓ Single variant schema has required fields:', hasProductRequiredFields(singleVariantSchema));
console.log('✓ No review schema has required fields:', hasProductRequiredFields(noReviewSchema));
console.log('✓ Product with reviews has aggregateRating:', !!productSchema.aggregateRating);
console.log('✓ Product without reviews has no aggregateRating:', !noReviewSchema.aggregateRating);
console.log('✓ Multi-variant product uses AggregateOffer:', productSchema.offers['@type'] === 'AggregateOffer');
console.log('✓ Single-variant product uses Offer:', singleVariantSchema.offers['@type'] === 'Offer');
const hasShopRequiredFields = (schema: any) => {
  return schema['@context'] === 'https://schema.org' && schema['@type'] === 'LocalBusiness' && schema.name && schema.image && schema.address && schema.url;
};
console.log('✓ Shop schema has required fields:', hasShopRequiredFields(shopSchema));
const hasBreadcrumbStructure = (schema: any) => {
  return schema['@context'] === 'https://schema.org' && schema['@type'] === 'BreadcrumbList' && Array.isArray(schema.itemListElement) && schema.itemListElement.length > 0 && schema.itemListElement.every((item: any, index: number) => item['@type'] === 'ListItem' && item.position === index + 1 && item.name);
};
console.log('✓ Breadcrumb schema has correct structure:', hasBreadcrumbStructure(breadcrumbSchema));
const lastBreadcrumbItem = breadcrumbSchema.itemListElement[breadcrumbSchema.itemListElement.length - 1];
console.log('✓ Last breadcrumb item has no URL:', !lastBreadcrumbItem.item);
const hasOrganizationFields = (schema: any) => {
  return schema['@type'] === 'Organization' && schema.name && schema.logo && schema.url && schema.contactPoint && schema.address;
};
console.log('✓ Organization schema has required fields:', hasOrganizationFields(organizationSchema));
const hasSearchAction = (schema: any) => {
  return schema['@context'] === 'https://schema.org' && schema['@type'] === 'WebSite' && schema.name && schema.url && schema.potentialAction && schema.potentialAction['@type'] === 'SearchAction';
};
console.log('✓ WebSite schema has search action:', hasSearchAction(websiteSchema));
const hasStockProduct = productSchema.offers;
console.log('✓ Product with stock has InStock availability:', hasStockProduct.availability === 'https://schema.org/InStock');
const outOfStockProduct: ProductDetail = {
  ...mockProduct,
  variants: [{
    variantId: 'var-1',
    price: 29990000,
    quantity: 0,
    status: 1,
    variantValues: []
  }]
};
const outOfStockSchema = generateProductSchema(outOfStockProduct, 'https://peshop.vn/san-pham/iphone-15-pro-max-256gb');
console.log('✓ Product without stock has OutOfStock availability:', outOfStockSchema.offers.availability === 'https://schema.org/OutOfStock');
let isValidJSON = false;
try {
  JSON.parse(serialized);
  isValidJSON = true;
} catch (e) {
  isValidJSON = false;
}
console.log('✓ Serialized schema is valid JSON:', isValidJSON);
const clampedRating = generateAggregateRating(6.5, 0);
console.log('✓ Rating value is clamped to 5:', clampedRating.ratingValue === 5);
console.log('✓ Review count is minimum 1:', clampedRating.reviewCount === 1);
console.log('\n=== All Verification Checks Complete ===');