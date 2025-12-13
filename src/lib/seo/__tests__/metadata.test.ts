import { generateProductMetadata, generateShopMetadata, generateCategoryMetadata, generateHomeMetadata, generateSearchMetadata } from '../metadata';
console.log('=== Testing Product Metadata ===');
const productMetadata = generateProductMetadata({
  productId: 'prod-123',
  productName: 'iPhone 15 Pro Max 256GB',
  description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP, màn hình Super Retina XDR 6.7 inch',
  price: 29990000,
  imgMain: 'https://example.com/iphone-15-pro-max.jpg',
  imgList: ['https://example.com/iphone-15-pro-max-2.jpg'],
  shopName: 'Apple Store Vietnam',
  reviewPoint: 4.8,
  reviewCount: 1250,
  variants: [{
    price: 29990000,
    quantity: 10
  }, {
    price: 34990000,
    quantity: 5
  }],
  url: 'https://peshop.vn/san-pham/iphone-15-pro-max-256gb'
});
console.log('Product Metadata:', JSON.stringify(productMetadata, null, 2));
console.log('\n');
console.log('=== Testing Shop Metadata ===');
const shopMetadata = generateShopMetadata({
  shopId: 'shop-456',
  shopName: 'Apple Store Vietnam',
  description: 'Cửa hàng chính hãng Apple tại Việt Nam. Sản phẩm chính hãng, bảo hành toàn cầu.',
  logo: 'https://example.com/apple-logo.jpg',
  address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  phone: '+84-123-456-789',
  rating: 4.9,
  reviewCount: 5000,
  url: 'https://peshop.vn/shop-view/apple-store-vietnam'
});
console.log('Shop Metadata:', JSON.stringify(shopMetadata, null, 2));
console.log('\n');
console.log('=== Testing Category Metadata ===');
const categoryMetadata = generateCategoryMetadata({
  categoryName: 'Điện thoại',
  categorySlug: 'dien-thoai',
  productCount: 1500,
  description: 'Điện thoại thông minh từ các thương hiệu hàng đầu: Apple, Samsung, Xiaomi, OPPO',
  url: 'https://peshop.vn/san-pham?category=dien-thoai'
});
console.log('Category Metadata:', JSON.stringify(categoryMetadata, null, 2));
console.log('\n');
console.log('=== Testing Home Metadata ===');
const homeMetadata = generateHomeMetadata();
console.log('Home Metadata:', JSON.stringify(homeMetadata, null, 2));
console.log('\n');
console.log('=== Testing Search Metadata ===');
const searchMetadata = generateSearchMetadata('iPhone 15', 42);
console.log('Search Metadata:', JSON.stringify(searchMetadata, null, 2));
console.log('\n');
console.log('=== Verification Checks ===');
const hasRequiredFields = (metadata: any) => {
  return metadata.title && metadata.description;
};
console.log('✓ Product metadata has required fields:', hasRequiredFields(productMetadata));
console.log('✓ Shop metadata has required fields:', hasRequiredFields(shopMetadata));
console.log('✓ Category metadata has required fields:', hasRequiredFields(categoryMetadata));
console.log('✓ Home metadata has required fields:', hasRequiredFields(homeMetadata));
console.log('✓ Search metadata has required fields:', hasRequiredFields(searchMetadata));
const hasOpenGraph = (metadata: any) => {
  return metadata.openGraph && metadata.openGraph.title && metadata.openGraph.description && metadata.openGraph.url && metadata.openGraph.locale;
};
console.log('✓ Product metadata has Open Graph:', hasOpenGraph(productMetadata));
console.log('✓ Shop metadata has Open Graph:', hasOpenGraph(shopMetadata));
console.log('✓ Category metadata has Open Graph:', hasOpenGraph(categoryMetadata));
console.log('✓ Home metadata has Open Graph:', hasOpenGraph(homeMetadata));
const hasTwitterCard = (metadata: any) => {
  return metadata.twitter && metadata.twitter.card && metadata.twitter.title && metadata.twitter.description;
};
console.log('✓ Product metadata has Twitter Card:', hasTwitterCard(productMetadata));
console.log('✓ Shop metadata has Twitter Card:', hasTwitterCard(shopMetadata));
console.log('✓ Category metadata has Twitter Card:', hasTwitterCard(categoryMetadata));
console.log('✓ Home metadata has Twitter Card:', hasTwitterCard(homeMetadata));
const hasCanonical = (metadata: any) => {
  return metadata.alternates && metadata.alternates.canonical;
};
console.log('✓ Product metadata has canonical URL:', hasCanonical(productMetadata));
console.log('✓ Shop metadata has canonical URL:', hasCanonical(shopMetadata));
console.log('✓ Category metadata has canonical URL:', hasCanonical(categoryMetadata));
console.log('✓ Home metadata has canonical URL:', hasCanonical(homeMetadata));
const checkDescriptionLength = (metadata: any) => {
  const desc = metadata.description;
  return desc && desc.length >= 120 && desc.length <= 160;
};
console.log('✓ Product description length OK:', checkDescriptionLength(productMetadata), `(${productMetadata.description?.length} chars)`);
console.log('✓ Shop description length OK:', checkDescriptionLength(shopMetadata), `(${shopMetadata.description?.length} chars)`);
console.log('✓ Category description length OK:', checkDescriptionLength(categoryMetadata), `(${categoryMetadata.description?.length} chars)`);
console.log('✓ Home description length OK:', checkDescriptionLength(homeMetadata), `(${homeMetadata.description?.length} chars)`);
console.log('\n=== All Verification Checks Complete ===');