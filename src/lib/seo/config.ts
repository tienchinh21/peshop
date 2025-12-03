/**
 * Centralized SEO Configuration for PeShop
 * 
 * This file contains all SEO-related configuration including:
 * - Site defaults
 * - Organization information
 * - Metadata templates
 * - Sitemap configuration
 * - Social media settings
 */

export interface SEOConfig {
  site: {
    name: string;
    description: string;
    url: string;
    locale: string;
    defaultImage: string;
  };
  organization: {
    name: string;
    logo: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    contactPoint: {
      telephone: string;
      contactType: string;
      email: string;
    };
    socialLinks: string[];
  };
  defaults: {
    titleTemplate: string;
    descriptionLength: {
      min: number;
      max: number;
    };
    keywordsLimit: number;
    ogImageSize: {
      width: number;
      height: number;
    };
  };
  sitemap: {
    changeFrequency: {
      homepage: string;
      products: string;
      shops: string;
      categories: string;
      static: string;
    };
    priority: {
      homepage: number;
      categories: number;
      products: number;
      shops: number;
      static: number;
    };
  };
}

/**
 * Main SEO configuration object
 */
export const seoConfig: SEOConfig = {
  site: {
    name: 'PeShop',
    description: 'Nền tảng mua sắm trực tuyến hàng đầu Việt Nam. Sản phẩm chất lượng cao, giá tốt nhất thị trường, giao hàng nhanh toàn quốc. Mua sắm an toàn, tiện lợi.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://peshop.vn',
    locale: 'vi_VN',
    defaultImage: '/og-default.jpg',
  },
  organization: {
    name: 'PeShop',
    logo: '/logo.png',
    address: {
      streetAddress: 'Số 1 Võ Văn Ngân',
      addressLocality: 'Thủ Đức',
      addressRegion: 'Hồ Chí Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    contactPoint: {
      telephone: '+84-123-456-789',
      contactType: 'customer service',
      email: 'support@peshop.vn',
    },
    socialLinks: [
      'https://facebook.com/peshop',
      'https://twitter.com/peshop',
      'https://instagram.com/peshop',
    ],
  },
  defaults: {
    titleTemplate: '%s | PeShop',
    descriptionLength: {
      min: 120,
      max: 160,
    },
    keywordsLimit: 15,
    ogImageSize: {
      width: 1200,
      height: 630,
    },
  },
  sitemap: {
    changeFrequency: {
      homepage: 'daily',
      products: 'daily',
      shops: 'weekly',
      categories: 'weekly',
      static: 'monthly',
    },
    priority: {
      homepage: 1.0,
      categories: 0.8,
      products: 0.6,
      shops: 0.6,
      static: 0.4,
    },
  },
};

/**
 * Get the base URL for the site
 */
export const getBaseUrl = (): string => {
  return seoConfig.site.url;
};

/**
 * Get the default Open Graph image
 */
export const getDefaultOgImage = (): string => {
  return `${getBaseUrl()}${seoConfig.site.defaultImage}`;
};

/**
 * Format title with template
 */
export const formatTitle = (title: string): string => {
  return seoConfig.defaults.titleTemplate.replace('%s', title);
};

/**
 * Get locale for metadata
 */
export const getLocale = (): string => {
  return seoConfig.site.locale;
};
