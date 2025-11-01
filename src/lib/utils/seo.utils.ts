import type { ProductDetail } from '@/types/users/product.types';
import { stripHtml } from './html.utils';

/**
 * Extract keywords from product data for SEO
 */
export const extractKeywords = (product: ProductDetail): string[] => {
  const keywords = new Set<string>();
  
  // Add product name words
  product.productName.split(/\s+/).forEach(word => {
    if (word.length > 3) keywords.add(word.toLowerCase());
  });
  
  // Add shop name
  keywords.add(product.shopName.toLowerCase());
  
  // Add variant property names
  product.variants.forEach(variant => {
    variant.variantValues.forEach(vv => {
      keywords.add(vv.property.name.toLowerCase());
      keywords.add(vv.propertyValue.value.toLowerCase());
    });
  });
  
  return Array.from(keywords).slice(0, 15);
};

/**
 * Generate Product Schema.org JSON-LD for SEO
 */
export const generateProductSchema = (product: ProductDetail, url: string) => {
  const minPrice = Math.min(...product.variants.map(v => v.price));
  const maxPrice = Math.max(...product.variants.map(v => v.price));
  const hasStock = product.variants.some(v => v.quantity > 0);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.productName,
    image: [product.imgMain, ...product.imgList],
    description: stripHtml(product.description).substring(0, 200),
    sku: product.productId,
    brand: {
      '@type': 'Brand',
      name: product.shopName
    },
    offers: {
      '@type': 'AggregateOffer',
      url: url,
      priceCurrency: 'VND',
      lowPrice: minPrice,
      highPrice: maxPrice,
      availability: hasStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.shopName
      }
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.reviewPoint,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1
      }
    })
  };
};

/**
 * Generate Breadcrumb Schema.org JSON-LD for SEO
 */
export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url?: string }>
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url })
    }))
  };
};

/**
 * Generate meta description from product data
 */
export const generateMetaDescription = (product: ProductDetail): string => {
  const description = stripHtml(product.description);
  const priceText = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price);
  
  const text = `${product.productName} - ${priceText}. ${description}`;
  return text.substring(0, 160);
};

/**
 * Generate Open Graph image URL with fallback
 */
export const getOgImage = (product: ProductDetail): string => {
  return product.imgMain || product.imgList[0] || '/og-default.jpg';
};

