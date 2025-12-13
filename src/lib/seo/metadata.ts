import { Metadata } from 'next';
import { seoConfig, getBaseUrl, formatTitle, getLocale } from './config';
import type { ProductMetadataInput, ShopMetadataInput, CategoryMetadataInput, MetadataConfig } from './types';
import { stripHtml } from '@/lib/utils/html.utils';
export const truncateText = (text: string, maxLength: number = 160): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};
export const normalizeDescription = (description: string): string => {
  const {
    min,
    max
  } = seoConfig.defaults.descriptionLength;
  const cleaned = stripHtml(description).trim();
  if (cleaned.length < min) {
    return cleaned + ' Mua sắm trực tuyến tại PeShop - Giao hàng nhanh toàn quốc.';
  }
  return truncateText(cleaned, max);
};
export const generateSlug = (text: string): string => {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
};
export function generateProductMetadata(input: ProductMetadataInput): Metadata {
  const {
    productName,
    description,
    price,
    imgMain,
    imgList,
    shopName,
    url
  } = input;
  const priceText = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
  const baseDesc = normalizeDescription(description);
  const fullDesc = `${productName} - ${priceText}. ${baseDesc}`;
  const metaDescription = truncateText(fullDesc, seoConfig.defaults.descriptionLength.max);
  const keywords = [productName, shopName, 'mua online', 'giao hàng nhanh', 'PeShop', 'sản phẩm chất lượng'];
  const images = [imgMain, ...imgList].filter(Boolean);
  const ogImage = images[0] || seoConfig.site.defaultImage;
  return {
    title: formatTitle(productName),
    description: metaDescription,
    keywords: keywords.slice(0, seoConfig.defaults.keywordsLimit),
    alternates: {
      canonical: url
    },
    openGraph: {
      title: productName,
      description: metaDescription,
      url: url,
      siteName: seoConfig.site.name,
      images: [{
        url: ogImage,
        width: seoConfig.defaults.ogImageSize.width,
        height: seoConfig.defaults.ogImageSize.height,
        alt: productName
      }],
      type: 'website',
      locale: getLocale()
    },
    twitter: {
      card: 'summary_large_image',
      title: productName,
      description: metaDescription,
      images: [ogImage]
    }
  };
}
export function generateShopMetadata(input: ShopMetadataInput): Metadata {
  const {
    shopName,
    description,
    logo,
    rating,
    reviewCount,
    url
  } = input;
  const baseDesc = description ? normalizeDescription(description) : `Khám phá sản phẩm chất lượng từ ${shopName}. Mua sắm trực tuyến tại PeShop.`;
  const ratingText = rating && reviewCount ? ` Đánh giá ${rating}/5 từ ${reviewCount} khách hàng.` : '';
  const metaDescription = truncateText(baseDesc + ratingText, seoConfig.defaults.descriptionLength.max);
  const keywords = [shopName, 'cửa hàng', 'shop online', 'PeShop', 'mua sắm trực tuyến'];
  return {
    title: formatTitle(shopName),
    description: metaDescription,
    keywords: keywords.slice(0, seoConfig.defaults.keywordsLimit),
    alternates: {
      canonical: url
    },
    openGraph: {
      title: shopName,
      description: metaDescription,
      url: url,
      siteName: seoConfig.site.name,
      images: [{
        url: logo || seoConfig.site.defaultImage,
        width: seoConfig.defaults.ogImageSize.width,
        height: seoConfig.defaults.ogImageSize.height,
        alt: shopName
      }],
      type: 'website',
      locale: getLocale()
    },
    twitter: {
      card: 'summary_large_image',
      title: shopName,
      description: metaDescription,
      images: [logo || seoConfig.site.defaultImage]
    }
  };
}
export function generateCategoryMetadata(input: CategoryMetadataInput): Metadata {
  const {
    categoryName,
    productCount,
    description,
    url
  } = input;
  const baseDesc = description ? normalizeDescription(description) : `Khám phá ${productCount}+ sản phẩm ${categoryName} chất lượng cao tại PeShop. Giá tốt nhất, giao hàng nhanh toàn quốc.`;
  const metaDescription = truncateText(baseDesc, seoConfig.defaults.descriptionLength.max);
  const keywords = [categoryName, `sản phẩm ${categoryName}`, `${categoryName} chất lượng`, 'mua online', 'PeShop'];
  return {
    title: formatTitle(`${categoryName} - ${productCount}+ sản phẩm`),
    description: metaDescription,
    keywords: keywords.slice(0, seoConfig.defaults.keywordsLimit),
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${categoryName} - PeShop`,
      description: metaDescription,
      url: url,
      siteName: seoConfig.site.name,
      type: 'website',
      locale: getLocale()
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} - PeShop`,
      description: metaDescription
    }
  };
}
export function generateHomeMetadata(): Metadata {
  const description = seoConfig.site.description;
  return {
    title: seoConfig.site.name,
    description: description,
    keywords: ['mua sắm online', 'thương mại điện tử', 'PeShop', 'sản phẩm chất lượng', 'giao hàng nhanh', 'Việt Nam'],
    alternates: {
      canonical: getBaseUrl()
    },
    openGraph: {
      title: seoConfig.site.name,
      description: description,
      url: getBaseUrl(),
      siteName: seoConfig.site.name,
      type: 'website',
      locale: getLocale()
    },
    twitter: {
      card: 'summary_large_image',
      title: seoConfig.site.name,
      description: description
    }
  };
}
export function generateSearchMetadata(query: string, resultCount: number): Metadata {
  const title = `Tìm kiếm: ${query}`;
  const description = `Tìm thấy ${resultCount} kết quả cho "${query}". Khám phá sản phẩm chất lượng tại PeShop.`;
  return {
    title: formatTitle(title),
    description: truncateText(description, seoConfig.defaults.descriptionLength.max),
    robots: {
      index: false,
      follow: true
    }
  };
}
export function createMetadataConfig(config: Partial<MetadataConfig>): Metadata {
  const {
    title,
    description,
    keywords,
    canonical,
    openGraph,
    twitter,
    robots
  } = config;
  const metadata: Metadata = {};
  if (title) {
    metadata.title = formatTitle(title);
  }
  if (description) {
    metadata.description = normalizeDescription(description);
  }
  if (keywords && keywords.length > 0) {
    metadata.keywords = keywords.slice(0, seoConfig.defaults.keywordsLimit);
  }
  if (canonical) {
    metadata.alternates = {
      canonical
    };
  }
  if (openGraph) {
    metadata.openGraph = {
      ...openGraph,
      locale: openGraph.locale || getLocale(),
      siteName: openGraph.siteName || seoConfig.site.name
    };
  }
  if (twitter) {
    metadata.twitter = twitter;
  }
  if (robots) {
    metadata.robots = robots;
  }
  return metadata;
}