import type { ProductDetail } from '@/features/customer/products';
import type { ShopData } from '@/features/customer/shop-view';
import type { ProductSchema, LocalBusinessSchema, BreadcrumbSchema, OrganizationSchema, WebSiteSchema, AggregateRatingSchema, BreadcrumbItem, AggregateOfferSchema, OfferSchema } from './types';
import { seoConfig, getBaseUrl } from './config';
import { stripHtml } from '@/lib/utils/html.utils';

/**
 * Generate Product structured data (Schema.org Product)
 * 
 * Creates comprehensive product schema including:
 * - Basic product information
 * - Price and availability
 * - Aggregate ratings (if available)
 * - Brand information
 * - Multiple variants support
 * 
 * @param product - Product detail data
 * @param url - Absolute URL of the product page
 * @returns ProductSchema object
 * 
 * @example
 * const schema = generateProductSchema(productData, 'https://peshop.vn/san-pham/product-slug');
 */
export function generateProductSchema(product: ProductDetail, url: string): ProductSchema {
  const images = [product.imgMain, ...product.imgList].filter(Boolean);
  const hasStock = product.variants.some(v => v.quantity > 0);
  const availability = hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const hasMultipleVariants = product.variants.length > 1;
  let offers: OfferSchema | AggregateOfferSchema;
  if (hasMultipleVariants) {
    const prices = product.variants.map(v => v.price);
    const lowPrice = Math.min(...prices);
    const highPrice = Math.max(...prices);
    offers = {
      '@type': 'AggregateOffer',
      url,
      priceCurrency: 'VND',
      lowPrice,
      highPrice,
      availability,
      seller: {
        '@type': 'Organization',
        name: product.shopName
      }
    };
  } else {
    offers = {
      '@type': 'Offer',
      url,
      priceCurrency: 'VND',
      price: product.price,
      availability,
      seller: {
        '@type': 'Organization',
        name: product.shopName
      }
    };
  }
  const schema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.productName,
    image: images,
    description: product.description ? stripHtml(product.description) : `Mua ${product.productName} chính hãng tại ${product.shopName}. Giá tốt, giao hàng nhanh.`,
    sku: product.productId,
    brand: {
      '@type': 'Brand',
      name: product.shopName
    },
    offers
  };
  if (product.reviewCount > 0 && product.reviewPoint > 0) {
    schema.aggregateRating = generateAggregateRating(product.reviewPoint, product.reviewCount);
  }
  return schema;
}

/**
 * Generate AggregateRating structured data
 * 
 * @param ratingValue - Average rating value (0-5)
 * @param reviewCount - Total number of reviews
 * @returns AggregateRatingSchema object
 */
export function generateAggregateRating(ratingValue: number, reviewCount: number): AggregateRatingSchema {
  return {
    '@type': 'AggregateRating',
    ratingValue: Math.max(0, Math.min(5, ratingValue)),
    reviewCount: Math.max(1, reviewCount),
    bestRating: 5,
    worstRating: 1
  };
}

/**
 * Generate LocalBusiness structured data for shop pages
 * 
 * Creates shop/store schema including:
 * - Business information
 * - Address
 * - Contact details
 * - Ratings (if available)
 * 
 * @param shop - Shop data
 * @param url - Absolute URL of the shop page
 * @returns LocalBusinessSchema object
 * 
 * @example
 * const schema = generateShopSchema(shopData, 'https://peshop.vn/shop-view/shop-id');
 */
export function generateShopSchema(shop: ShopData, url: string): LocalBusinessSchema {
  const baseUrl = getBaseUrl();
  const addressParts = shop.address?.split(',').map(s => s.trim()) || [];
  const streetAddress = addressParts[0] || shop.address || 'Việt Nam';
  const addressLocality = addressParts[1] || 'Hồ Chí Minh';
  const addressRegion = addressParts[2] || 'Hồ Chí Minh';
  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: shop.name || 'Cửa hàng PeShop',
    image: shop.logo ? `${baseUrl}${shop.logo}` : `${baseUrl}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode: '700000',
      addressCountry: 'VN'
    },
    url
  };
  if (shop.productCount && shop.productCount > 0) {
    schema.priceRange = '$$';
  }
  return schema;
}

/**
 * Generate BreadcrumbList structured data
 * 
 * Creates breadcrumb navigation schema for improved site structure
 * in search results.
 * 
 * @param items - Array of breadcrumb items with name and optional URL
 * @returns BreadcrumbSchema object
 * 
 * @example
 * const schema = generateBreadcrumbSchema([
 *   { name: 'Trang chủ', url: '/' },
 *   { name: 'Sản phẩm', url: '/san-pham' },
 *   { name: 'Laptop', url: '/san-pham?category=laptop' },
 *   { name: 'MacBook Pro' }
 * ]);
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbSchema {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        ...(!isLast && item.url && {
          item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
        })
      };
    })
  };
}

/**
 * Generate Organization structured data for root layout
 * 
 * Creates organization schema representing PeShop as a business entity.
 * This should be included on all pages.
 * 
 * @returns OrganizationSchema object
 * 
 * @example
 * const schema = generateOrganizationSchema();
 */
export function generateOrganizationSchema(): OrganizationSchema {
  const baseUrl = getBaseUrl();
  const {
    organization
  } = seoConfig;
  return {
    '@type': 'Organization',
    name: organization.name,
    logo: `${baseUrl}${organization.logo}`,
    url: baseUrl,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: organization.contactPoint.telephone,
      contactType: organization.contactPoint.contactType,
      email: organization.contactPoint.email
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: organization.address.streetAddress,
      addressLocality: organization.address.addressLocality,
      addressRegion: organization.address.addressRegion,
      postalCode: organization.address.postalCode,
      addressCountry: organization.address.addressCountry
    },
    sameAs: organization.socialLinks
  };
}

/**
 * Generate WebSite structured data for root layout
 * 
 * Creates website schema with search action for site-wide search functionality.
 * This should be included on the homepage.
 * 
 * @returns WebSiteSchema object
 * 
 * @example
 * const schema = generateWebSiteSchema();
 */
export function generateWebSiteSchema(): WebSiteSchema {
  const baseUrl = getBaseUrl();
  const {
    site
  } = seoConfig;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/tim-kiem?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Helper function to serialize structured data to JSON-LD string
 * 
 * @param schema - Any Schema.org structured data object
 * @returns JSON-LD string ready for injection into script tag
 * 
 * @example
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
 * />
 */
export function serializeSchema(schema: object): string {
  return JSON.stringify(schema);
}